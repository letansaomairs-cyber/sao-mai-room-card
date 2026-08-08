import { json, adminOK } from '../_common.js';

const CARD_FEE = 200000;

async function getItem(env, code) {
  return await env.DB
    .prepare('SELECT * FROM room_card_requests WHERE code=?')
    .bind(code)
    .first();
}

async function addLog(env, code, action, detail, now) {
  await env.DB
    .prepare(`
      INSERT INTO room_card_logs
      (request_code, action, detail, created_at)
      VALUES (?, ?, ?, ?)
    `)
    .bind(code, action, detail, now)
    .run();
}

export async function onRequestPatch({ request, params, env }) {
  if (!adminOK(request, env)) {
    return json({ error: 'Sai mã PIN quản trị' }, 401);
  }

  try {
    const body = await request.json();

    const item = await getItem(env, params.code);

    if (!item) {
      return json({ error: 'Không tìm thấy phiếu' }, 404);
    }

    const now = new Date().toISOString();

    const cardCount = Number(item.card_count) || 1;

    let returnedCount = Number(item.returned_count) || 0;
    let lostCount = Number(item.lost_count) || 0;
    let paidCount = Math.max(
      0,
      Math.min(
        lostCount,
        Number(item.paid_count) || 0
      )
    );

    let compensationAmount =
      Number(item.compensation_amount) || (lostCount * CARD_FEE);

    let status = item.status;

    const remaining = () =>
      Math.max(
        0,
        cardCount - returnedCount - lostCount
      );

    /* =========================
       TRẢ THẺ
    ========================= */
    if (body.action === 'return_cards') {
      const available = remaining();

      if (available <= 0) {
        return json(
          { error: 'Không còn thẻ nào cần hoàn trả' },
          400
        );
      }

      const qty = Math.max(
        1,
        Math.min(
          available,
          Number(body.returned_count) || 1
        )
      );

      returnedCount += qty;

      const left = Math.max(
        0,
        cardCount - returnedCount - lostCount
      );

      if (left > 0) {
        status = 'active';
      } else if (lostCount > 0) {
        status =
          paidCount >= lostCount
            ? 'paid'
            : 'lost';
      } else {
        status = 'returned';
      }

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET
            returned_count=?,
            status=?,
            updated_at=?
          WHERE code=?
        `)
        .bind(
          returnedCount,
          status,
          now,
          params.code
        )
        .run();

      await addLog(
        env,
        params.code,
        'cards_returned',
        `Trả ${qty} thẻ. Đã trả ${returnedCount}, mất ${lostCount}, còn ${left}`,
        now
      );

      return json(await getItem(env, params.code));
    }

    /* =========================
       BÁO MẤT THẺ
    ========================= */
    if (
      body.action === 'lose_cards' ||
      body.status === 'lost'
    ) {
      const available = remaining();

      if (available <= 0) {
        return json(
          { error: 'Không còn thẻ nào để báo mất' },
          400
        );
      }

      const qty = Math.max(
        1,
        Math.min(
          available,
          Number(body.lost_count) || 1
        )
      );

      lostCount += qty;
      compensationAmount = lostCount * CARD_FEE;

      const left = Math.max(
        0,
        cardCount - returnedCount - lostCount
      );

      // Có thẻ còn đang giữ thì DB có thể để active.
      // Nếu hết thẻ còn giữ, trạng thái phụ thuộc phí đã thu đủ hay chưa.
      if (left > 0) {
        status = 'active';
      } else {
        status =
          paidCount >= lostCount
            ? 'paid'
            : 'lost';
      }

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET
            status=?,
            lost_count=?,
            compensation_amount=?,
            updated_at=?
          WHERE code=?
        `)
        .bind(
          status,
          lostCount,
          compensationAmount,
          now,
          params.code
        )
        .run();

      await addLog(
        env,
        params.code,
        'cards_lost',
        `Báo mất ${qty} thẻ. Tổng mất ${lostCount}. Phí phát sinh ${qty * CARD_FEE} VND`,
        now
      );

      return json(await getItem(env, params.code));
    }

    /* =========================
       THU PHÍ TỪNG PHẦN
    ========================= */
    if (
      body.action === 'pay_cards' ||
      body.status === 'paid'
    ) {
      if (lostCount <= 0) {
        return json(
          { error: 'Phiếu này không có thẻ mất để thu phí' },
          400
        );
      }

      const unpaidCount = Math.max(
        0,
        lostCount - paidCount
      );

      if (unpaidCount <= 0) {
        return json(
          { error: 'Phiếu này đã thu đủ phí bồi thường' },
          400
        );
      }

      const qty = Math.max(
        1,
        Math.min(
          unpaidCount,
          Number(body.paid_count) || unpaidCount
        )
      );

      paidCount += qty;

      const left = remaining();

      if (left > 0) {
        status = 'active';
      } else {
        status =
          paidCount >= lostCount
            ? 'paid'
            : 'lost';
      }

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET
            paid_count=?,
            status=?,
            updated_at=?
          WHERE code=?
        `)
        .bind(
          paidCount,
          status,
          now,
          params.code
        )
        .run();

      await addLog(
        env,
        params.code,
        'compensation_paid',
        `Thu phí ${qty} thẻ = ${qty * CARD_FEE} VND. Đã thu ${paidCount}/${lostCount} thẻ mất`,
        now
      );

      return json(await getItem(env, params.code));
    }

    /* =========================
       HỦY PHIẾU
    ========================= */
    if (body.status === 'cancelled') {
      if (
        returnedCount > 0 ||
        lostCount > 0 ||
        paidCount > 0
      ) {
        return json(
          { error: 'Phiếu đã phát sinh trả/mất/thu phí nên không thể hủy' },
          400
        );
      }

      status = 'cancelled';

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET status=?, updated_at=?
          WHERE code=?
        `)
        .bind(
          status,
          now,
          params.code
        )
        .run();

      await addLog(
        env,
        params.code,
        'cancelled',
        'Phiếu đã được hủy',
        now
      );

      return json(await getItem(env, params.code));
    }

    return json(
      { error: 'Thao tác không hợp lệ' },
      400
    );

  } catch (error) {
    return json({
      error: error.message || 'Không thể cập nhật'
    }, 500);
  }
}

export async function onRequestDelete({
  request,
  params,
  env
}) {
  if (!adminOK(request, env)) {
    return json(
      { error: 'Sai mã PIN quản trị' },
      401
    );
  }

  try {
    const item = await env.DB
      .prepare(`
        SELECT code
        FROM room_card_requests
        WHERE code=?
      `)
      .bind(params.code)
      .first();

    if (!item) {
      return json(
        { error: 'Không tìm thấy phiếu' },
        404
      );
    }

    await env.DB
      .prepare(`
        DELETE FROM room_card_logs
        WHERE request_code=?
      `)
      .bind(params.code)
      .run();

    await env.DB
      .prepare(`
        DELETE FROM room_card_requests
        WHERE code=?
      `)
      .bind(params.code)
      .run();

    return json({
      ok: true,
      deleted_code: params.code
    });

  } catch (error) {
    return json({
      error: error.message || 'Không thể xóa phiếu'
    }, 500);
  }
}
