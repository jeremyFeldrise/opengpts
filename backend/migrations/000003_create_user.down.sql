ALTER TABLE assistant
    DROP CONSTRAINT fk_assistant_project_id,
    ALTER COLUMN project_id TYPE VARCHAR USING (project_id::text);

ALTER TABLE thread
    DROP CONSTRAINT fk_thread_project_id,
    ALTER COLUMN project_id TYPE VARCHAR USING (project_id::text);

DROP TABLE IF EXISTS "user";