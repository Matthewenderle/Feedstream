CREATE TABLE bug_report_votes (
    id TEXT PRIMARY KEY DEFAULT generate_custom_id('brv_', 'bug_report_votes'),
    bug_report_id TEXT NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (bug_report_id) REFERENCES bug_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE (bug_report_id, created_by)
);

-- Enable Row Level Security
ALTER TABLE bug_report_votes ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT votes on bug reports they created, and allow admins to SELECT all
CREATE POLICY "Select votes for bug report owners and admins"
ON bug_report_votes
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM bug_reports br
        WHERE br.id = bug_report_votes.bug_report_id
          AND (br.created_by = auth.uid() OR
               (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1 OR
               CURRENT_USER = 'supabase_auth_admin')
    )
);

-- Allow admins full CRUD
CREATE POLICY "Admins full CRUD on votes"
ON bug_report_votes
FOR ALL
USING ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1)
WITH CHECK ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1);

-- Allow authenticated users to INSERT votes (but only once per bug report)
CREATE POLICY "Allow insert votes for authenticated users"
ON bug_report_votes
FOR INSERT
WITH CHECK (
    created_by = auth.uid() AND
    NOT EXISTS (
        SELECT 1 FROM bug_report_votes
        WHERE bug_report_id = bug_report_votes.bug_report_id
          AND created_by = auth.uid()
    )
);

-- Allow users to DELETE their own votes
CREATE POLICY "Allow users to delete their own votes"
ON bug_report_votes
FOR DELETE
USING (created_by = auth.uid());

-- Grant permissions
GRANT SELECT ON bug_report_votes TO anon;
GRANT SELECT, INSERT, DELETE ON bug_report_votes TO authenticated;
