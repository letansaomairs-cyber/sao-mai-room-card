CREATE TABLE IF NOT EXISTS room_card_requests (id INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT NOT NULL UNIQUE,guest_name TEXT NOT NULL,room_number TEXT NOT NULL,card_count INTEGER NOT NULL DEFAULT 1,status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','returned','lost','paid','cancelled')),lost_count INTEGER NOT NULL DEFAULT 0,compensation_amount INTEGER NOT NULL DEFAULT 0,issued_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_room_card_status ON room_card_requests(status);
CREATE INDEX IF NOT EXISTS idx_room_card_room ON room_card_requests(room_number);
CREATE INDEX IF NOT EXISTS idx_room_card_issued ON room_card_requests(issued_at);
CREATE TABLE IF NOT EXISTS room_card_logs (id INTEGER PRIMARY KEY AUTOINCREMENT,request_code TEXT NOT NULL,action TEXT NOT NULL,detail TEXT,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_room_card_logs_code ON room_card_logs(request_code);