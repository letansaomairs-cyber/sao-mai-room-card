# Sao Mai Room Card Manager V2

Bản hoàn chỉnh: tạo phiếu, in A4, 4 ngôn ngữ, quản lý bằng PIN, D1, trạng thái thẻ, bồi thường 200.000 VND/thẻ, xóa từng phiếu và xóa nhiều phiếu.

## Cloudflare
1. Build command: để trống
2. Build output directory: public
3. Tạo D1: sao-mai-room-card-db
4. Chạy schema.sql trong D1 Console
5. Pages Settings > Bindings > Add D1 binding: DB -> sao-mai-room-card-db
6. Settings > Variables and Secrets > ADMIN_PIN -> PIN bạn chọn
7. Redeploy

Logo mẫu: public/assets/sao-mai-logo.svg. Có thể thay bằng logo thật.
Redeploy production
