import { json, adminOK } from '../../_common.js';

export async function onRequestGet({ request, params, env }) {
  if (!adminOK(request, env)) {
    return json({ error: 'Sai mã PIN quản trị' }, 401);
  }

  try {
    const code = params.code;

    const card = await env.DB
      .prepare(`
        SELECT code
        FROM room_card_requests
        WHERE code=?
      `)
      .bind(code)
      .first();

    if (!card) {
      return json({ error: 'Không tìm thấy phiếu' }, 404);
    }

    const { results } = await env.DB
      .prepare(`
        SELECT id, request_code, action, detail, created_at
        FROM room_card_logs
        WHERE request_code=?
        ORDER BY created_at ASC, id ASC
      `)
      .bind(code)
      .all();

    return json(results || []);

  } catch (error) {
    return json({
      error: error.message || 'Không thể tải lịch sử'
    }, 500);
  }
}
