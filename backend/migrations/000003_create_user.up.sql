CREATE TABLE IF NOT EXISTS "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    stripe_client_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    thread_counter INT DEFAULT 0,
    max_thread_counter INT DEFAULT 100,
    provider VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "project" (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "user"(user_id),
    name VARCHAR(255) ,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

CREATE TABLE IF NOT EXISTS "assistant_token_price" (
    assistant_token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(255),
    price FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

INSERT INTO "assistant_token_price" (assistant_token_id, agent_type, price)
VALUES  (uuid_generate_v4(), 'GPT 4o', 1.0),
        (uuid_generate_v4(), 'GPT 4o Mini', 1.0),
        (uuid_generate_v4(), 'Claude 3.5 (Haiku)', 2.0),
        (uuid_generate_v4(), 'Claude 3.5 (Sonnet)', 1.0),
        (uuid_generate_v4(), 'Claude 3 (Opus)', 1.0),
        (uuid_generate_v4(), 'Mixtral', 1.0),
        (uuid_generate_v4(), 'Ollama', 1.0),
        (uuid_generate_v4(), 'GROQ (llama3-70b-8192)', 1.0),
        (uuid_generate_v4(), 'GROQ (llama3.1-70b-8192) Versatile', 1.0),
        (uuid_generate_v4(), 'GROQ (llama3.2-90b-text-preview) Text Preview', 1.0),
        (uuid_generate_v4(), 'GROQ (llama3-8b-8192)', 1.0),
        (uuid_generate_v4(), 'GEMINI', 1.0);

INSERT INTO "project" (project_id, name)
SELECT DISTINCT project_id::uuid, project_id
FROM assistant
WHERE project_id IS NOT NULL
ON CONFLICT (project_id) DO NOTHING;

INSERT INTO "project" (project_id, name)
SELECT DISTINCT project_id::uuid, project_id
FROM thread
WHERE project_id IS NOT NULL
ON CONFLICT (project_id) DO NOTHING;

ALTER TABLE assistant
    ALTER COLUMN project_id TYPE UUID USING (project_id::UUID),
    ADD CONSTRAINT fk_assistant_project_id FOREIGN KEY (project_id) REFERENCES "project"(project_id);

ALTER TABLE thread
    ALTER COLUMN project_id TYPE UUID USING (project_id::UUID),
    ADD CONSTRAINT fk_thread_project_id FOREIGN KEY (project_id) REFERENCES "project"(project_id);