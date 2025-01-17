CREATE TABLE IF NOT EXISTS "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    provider VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

CREATE TABLE IF NOT EXISTS "project" (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "user"(user_id),
    name VARCHAR(255) ,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

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