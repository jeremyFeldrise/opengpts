CREATE TABLE IF NOT EXISTS "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

INSERT INTO "user" (user_id, email)
SELECT DISTINCT user_id::uuid, user_id
FROM assistant
WHERE user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO "user" (user_id, email)
SELECT DISTINCT user_id::uuid, user_id
FROM thread
WHERE user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE assistant
    ALTER COLUMN user_id TYPE UUID USING (user_id::UUID),
    ADD CONSTRAINT fk_assistant_user_id FOREIGN KEY (user_id) REFERENCES "user"(user_id);

ALTER TABLE thread
    ALTER COLUMN user_id TYPE UUID USING (user_id::UUID),
    ADD CONSTRAINT fk_thread_user_id FOREIGN KEY (user_id) REFERENCES "user"(user_id);