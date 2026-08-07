import { json, adminOK } from '../_common.js';

export async function onRequestPatch({ request, params, env }) {
  if (!adminOK(request, env)) {
    return json({ error: 'Sai mã PIN quản trị' }, 401);
  }

  try {
    const body = await request.json();

    const item = await env.DB
      .prepare('SELECT * FROM room_card_requests WHERE code=?')
      .bind(params.code)
      .first();

    if (!item) {
      return json({ error: 'Không tìm thấy phiếu' }, 404);
    }

    const now = new Date().toISOString();

    let status = item.status;
    let lostCount = Number(item.lost_count) || 0;
    let returnedCount = Number(item.returned_count) || 0;
    let compensationAmount = Number(item.compensation_amount) || 0;

    const cardCount = Number(item.card_count) || 1;

    /* =========================
       TRẢ THẺ TỪNG PHẦN
    ========================= */

    if (body.action === 'return_cards') {
      const qty = Math.max(
        1,
        Math.min(
          cardCount - returnedCount,
          Number(body.returned_count) || 1
        )
      );

      returnedCount += qty;

      if (returnedCount >= cardCount) {
        returnedCount = cardCount;
        status = 'returned';
      } else {
        status = 'active';
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

      await env.DB
        .prepare(`
          INSERT INTO room_card_logs
          (request_code, action, detail, created_at)
          VALUES (?, ?, ?, ?)
        `)
        .bind(
          params.code,
          'cards_returned',
          `Returned ${qty} card(s). Total returned: ${returnedCount}/${cardCount}`,
          now
        )
        .run();

      return json(
        await env.DB
          .prepare('SELECT * FROM room_card_requests WHERE code=?')
          .bind(params.code)
          .first()
      );
    }

    /* =========================
       CÁC TRẠNG THÁI CŨ
    ========================= */

    const allowed = [
      'active',
      'returned',
      'lost',
      'paid',
      'cancelled'
    ];

    if (!allowed.includes(body.status)) {
      return json({ error: 'Trạng thái không hợp lệ' }, 400);
    }

    status = body.status;

    if (status === 'lost') {
      lostCount = Math.max(
        1,
        Math.min(
          cardCount - returnedCount,
          Number(body.lost_count) || (cardCount - returnedCount)
        )
      );

      compensationAmount =
        lostCount * 200000;
    }

    if (status === 'returned') {
      returnedCount = cardCount;
      lostCount = 0;
      compensationAmount = 0;
    }

    if (status === 'active') {
      lostCount = 0;
      compensationAmount = 0;
    }

    await env.DB
      .prepare(`
        UPDATE room_card_requests
        SET
          status=?,
          lost_count=?,
          returned_count=?,
          compensation_amount=?,
          updated_at=?
        WHERE code=?
      `)
      .bind(
        status,
        lostCount,
        returnedCount,
        compensationAmount,
        now,
        params.code
      )
      .run();

    await env.DB
      .prepare(`
        INSERT INTO room_card_logs
        (request_code, action, detail, created_at)
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        params.code,
        'status_changed',
        `${item.status} -> ${status}`,
        now
      )
      .run();

    return json(
      await env.DB
        .prepare('SELECT * FROM room_card_requests WHERE code=?')
        .bind(params.code)
        .first()
    );

  } catch (error) {
    return json({
      error: error.message || 'Không thể cập nhật'
    }, 500);
  }
}


export async function onRequestDelete({ request, params, env }) {
  if (!adminOK(request, env)) {
    return json({ error: 'Sai mã PIN quản trị' }, 401);
  }

  try {
    const item = await env.DB
      .prepare('SELECT code FROM room_card_requests WHERE code=?')
      .bind(params.code)
      .first();

    if (!item) {
      return json({ error: 'Không tìm thấy phiếu' }, 404);
    }

    await env.DB
      .prepare('DELETE FROM room_card_logs WHERE request_code=?')
      .bind(params.code)
      .run();

    await env.DB
      .prepare('DELETE FROM room_card_requests WHERE code=?')
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
