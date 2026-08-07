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
    const cardCount = Number(item.card_count) || 1;

    let returnedCount = Number(item.returned_count) || 0;
    let lostCount = Number(item.lost_count) || 0;
    let compensationAmount = Number(item.compensation_amount) || 0;
    let status = item.status;

    const remaining = () => Math.max(
      0,
      cardCount - returnedCount - lostCount
    );

    if (body.action === 'return_cards') {
      const available = remaining();

      if (available <= 0) {
        return json({ error: 'Không còn thẻ nào cần hoàn trả' }, 400);
      }

      const qty = Math.max(
        1,
        Math.min(
          available,
          Number(body.returned_count) || 1
        )
      );

      returnedCount += qty;
      const left = Math.max(0, cardCount - returnedCount - lostCount);

      if (left === 0) {
        if (lostCount > 0) {
          status = item.status === 'paid' ? 'paid' : 'lost';
        } else {
          status = 'returned';
        }
      } else {
        if (item.status === 'lost' || item.status === 'paid') {
          status = item.status;
        } else {
          status = 'active';
        }
      }

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET returned_count=?, status=?, updated_at=?
          WHERE code=?
        `)
        .bind(returnedCount, status, now, params.code)
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
          `Trả ${qty} thẻ. Đã trả ${returnedCount}, mất ${lostCount}, còn ${left}`,
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

    if (body.status === 'lost') {
      const available = remaining();

      if (available <= 0) {
        return json({ error: 'Không còn thẻ nào để báo mất' }, 400);
      }

      const qty = Math.max(
        1,
        Math.min(
          available,
          Number(body.lost_count) || 1
        )
      );

      lostCount += qty;
      compensationAmount = lostCount * 200000;
      status = 'lost';

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET status=?, lost_count=?, compensation_amount=?, updated_at=?
          WHERE code=?
        `)
        .bind(status, lostCount, compensationAmount, now, params.code)
        .run();

      await env.DB
        .prepare(`
          INSERT INTO room_card_logs
          (request_code, action, detail, created_at)
          VALUES (?, ?, ?, ?)
        `)
        .bind(
          params.code,
          'cards_lost',
          `Báo mất thêm ${qty} thẻ. Tổng mất ${lostCount}`,
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

    if (body.status === 'paid') {
      if (lostCount <= 0) {
        return json({ error: 'Phiếu này không có thẻ mất để thu phí' }, 400);
      }

      status = 'paid';

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET status=?, updated_at=?
          WHERE code=?
        `)
        .bind(status, now, params.code)
        .run();

      await env.DB
        .prepare(`
          INSERT INTO room_card_logs
          (request_code, action, detail, created_at)
          VALUES (?, ?, ?, ?)
        `)
        .bind(
          params.code,
          'compensation_paid',
          `Đã thu ${compensationAmount} VND`,
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

    if (body.status === 'cancelled') {
      status = 'cancelled';

      await env.DB
        .prepare(`
          UPDATE room_card_requests
          SET status=?, updated_at=?
          WHERE code=?
        `)
        .bind(status, now, params.code)
        .run();

      await env.DB
        .prepare(`
          INSERT INTO room_card_logs
          (request_code, action, detail, created_at)
          VALUES (?, ?, ?, ?)
        `)
        .bind(
          params.code,
          'cancelled',
          'Phiếu đã được hủy',
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

    return json({ error: 'Thao tác không hợp lệ' }, 400);

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
