CREATE TABLE feature_request_votes (
    id TEXT PRIMARY KEY DEFAULT generate_custom_id('frv_', 'feature_request_votes'),
    feature_request_id TEXT NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (feature_request_id) REFERENCES feature_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE (feature_request_id, created_by)
);

-- Enable Row Level Security
ALTER TABLE feature_request_votes ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT votes on feature requests they created, and allow admins to SELECT all
CREATE POLICY "Select votes for feature request owners and admins"
ON feature_request_votes
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM feature_requests fr
        WHERE fr.id = feature_request_votes.feature_request_id
          AND (fr.created_by = auth.uid() OR
               (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1 OR
               CURRENT_USER = 'supabase_auth_admin')
    )
);

-- Allow admins full CRUD
CREATE POLICY "Admins full CRUD on votes"
ON feature_request_votes
FOR ALL
USING ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1)
WITH CHECK ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1);

-- Allow authenticated users to INSERT votes (but only once per feature request)
CREATE POLICY "Allow insert votes for authenticated users"
ON feature_request_votes
FOR INSERT
WITH CHECK (
    created_by = auth.uid() AND
    NOT EXISTS (
        SELECT 1 FROM feature_request_votes
        WHERE feature_request_id = feature_request_votes.feature_request_id
          AND created_by = auth.uid()
    )
);

-- Allow users to DELETE their own votes
CREATE POLICY "Allow users to delete their own votes"
ON feature_request_votes
FOR DELETE
USING (created_by = auth.uid());

-- Grant permissions
GRANT SELECT ON feature_request_votes TO anon;
GRANT SELECT, INSERT, DELETE ON feature_request_votes TO authenticated;
