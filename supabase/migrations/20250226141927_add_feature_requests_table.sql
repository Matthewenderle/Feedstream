CREATE TYPE feature_request_status AS ENUM (
    'In Progress',
    'In Review',
    'Completed',
    'Pending',
    'Rejected'
);

CREATE TABLE feature_requests (
    id TEXT PRIMARY KEY DEFAULT generate_custom_id('fr_', 'feature_requests'),
    created_by UUID NOT NULL,
    request_title TEXT NOT NULL,
    request_description TEXT NOT NULL,
    status feature_request_status DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on feature_requests
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- Create a foreign key constraint to auth.users
ALTER TABLE feature_requests
ADD CONSTRAINT fk_feature_requests_created_by
FOREIGN KEY (created_by)
REFERENCES auth.users(id) ON DELETE CASCADE;

-- Allow users to SELECT their own requests and admins to select all
CREATE POLICY "Enable select for users and admins on feature_requests"
ON feature_requests
FOR SELECT
USING (
    created_by = auth.uid() OR
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1 OR
    CURRENT_USER = 'supabase_auth_admin'
);

-- Allow full CRUD operations for admins
CREATE POLICY "Enable full CRUD for Admins on feature_requests"
ON feature_requests
FOR ALL
USING (
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1
)
WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1
);

-- Allow users to INSERT their own requests
CREATE POLICY "Allow insert for authenticated users on feature_requests"
ON feature_requests
FOR INSERT
WITH CHECK (
    created_by = auth.uid()
);

-- Allow users to UPDATE only their own requests
CREATE POLICY "Allow update for users on their own feature_requests"
ON feature_requests
FOR UPDATE
USING (
    created_by = auth.uid()
)
WITH CHECK (
    created_by = auth.uid()
);

-- Grant permissions to the public role
GRANT SELECT ON feature_requests TO anon;


CREATE FUNCTION set_fr_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feature_requests_updated_at
BEFORE UPDATE ON feature_requests
FOR EACH ROW EXECUTE FUNCTION set_fr_updated_at_timestamp();
