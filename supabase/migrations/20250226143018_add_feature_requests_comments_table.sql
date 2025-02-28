CREATE TABLE feature_request_comments (
    id TEXT PRIMARY KEY DEFAULT generate_custom_id('frc_', 'feature_request_comments'),
    feature_request_id TEXT NOT NULL,
    created_by UUID NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (feature_request_id) REFERENCES feature_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE feature_request_comments ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT comments for feature requests they own, or admins to select all
CREATE POLICY "Select comments for feature request owners and admins"
ON feature_request_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM feature_requests fr
        WHERE fr.id = feature_request_comments.feature_request_id
          AND (fr.created_by = auth.uid() OR
               (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1 OR
               CURRENT_USER = 'supabase_auth_admin')
    )
);

-- Allow admins full CRUD
CREATE POLICY "Admins full CRUD on comments"
ON feature_request_comments
FOR ALL
USING ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1)
WITH CHECK ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1);

-- Allow authenticated users to INSERT comments
CREATE POLICY "Allow insert comments for authenticated users"
ON feature_request_comments
FOR INSERT
WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM feature_requests fr
        WHERE fr.id = feature_request_comments.feature_request_id
    )
);

-- Allow comment creators to UPDATE their comments
CREATE POLICY "Allow users to update their own comments"
ON feature_request_comments
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Grant permissions
GRANT SELECT ON feature_request_comments TO anon;
GRANT SELECT, INSERT, UPDATE ON feature_request_comments TO authenticated;

-- Trigger for updating updated_at column
CREATE TRIGGER update_feature_request_comments_updated_at
BEFORE UPDATE ON feature_request_comments
FOR EACH ROW EXECUTE FUNCTION set_fr_updated_at_timestamp();
