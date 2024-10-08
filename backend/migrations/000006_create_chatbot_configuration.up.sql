CREATE TABLE IF NOT EXISTS "chatbot_configuration"   (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "user"(user_id) UNIQUE,
    openai_api_key VARCHAR(255) ,
    anthropic_api_key VARCHAR(255) ,
    ydc_api_key VARCHAR(255) ,
    tavili_api_key VARCHAR(255) ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);  