CREATE TABLE bug_report_comments (
    id TEXT PRIMARY KEY DEFAULT generate_custom_id('brc_', 'bug_report_comments'),
    bug_report_id TEXT NOT NULL,
    created_by UUID NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (bug_report_id) REFERENCES bug_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE bug_report_comments ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT comments for bug reports they own, or admins to select all
CREATE POLICY "Select comments for bug report owners and admins"
ON bug_report_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM bug_reports br
        WHERE br.id = bug_report_comments.bug_report_id
          AND (br.created_by = auth.uid() OR
               (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1 OR
               CURRENT_USER = 'supabase_auth_admin')
    )
);

-- Allow admins full CRUD
CREATE POLICY "Admins full CRUD on comments"
ON bug_report_comments
FOR ALL
USING ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1)
WITH CHECK ((current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1);

-- Allow authenticated users to INSERT comments
CREATE POLICY "Allow insert comments for authenticated users"
ON bug_report_comments
FOR INSERT
WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM bug_reports br
        WHERE br.id = bug_report_comments.bug_report_id
    )
);

-- Allow comment creators to UPDATE their comments
CREATE POLICY "Allow users to update their own comments"
ON bug_report_comments
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Grant permissions
GRANT SELECT ON bug_report_comments TO anon;
GRANT SELECT, INSERT, UPDATE ON bug_report_comments TO authenticated;

-- Trigger for updating updated_at column
CREATE TRIGGER update_bug_report_comments_updated_at
BEFORE UPDATE ON bug_report_comments
FOR EACH ROW EXECUTE FUNCTION set_br_updated_at_timestamp();
