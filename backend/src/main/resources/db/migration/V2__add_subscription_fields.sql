ALTER TABLE subscriptions
    ADD COLUMN paused_until DATE DEFAULT NULL AFTER is_active,
    ADD COLUMN start_date DATE DEFAULT NULL AFTER paused_until,
    ADD COLUMN end_date DATE DEFAULT NULL AFTER start_date,
    ADD COLUMN payment_method VARCHAR(100) DEFAULT NULL AFTER end_date;
