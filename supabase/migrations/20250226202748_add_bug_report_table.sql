CREATE TYPE bug_report_status AS ENUM (
    'Open',
    'In Progress',
    'Resolved',
    'Closed',
    'Rejected'
);

CREATE TABLE bug_reports (
    id TEXT PRIMARY KEY DEFAULT generate_custom_id('br_', 'bug_reports'),
    created_by UUID NOT NULL,
    bug_title TEXT NOT NULL,
    bug_description TEXT NOT NULL,
    status bug_report_status DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on bug_reports
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- Create a foreign key constraint to auth.users
ALTER TABLE bug_reports
ADD CONSTRAINT fk_bug_reports_created_by
FOREIGN KEY (created_by)
REFERENCES auth.users(id) ON DELETE CASCADE;

-- Allow users to SELECT their own bug reports and admins to select all
CREATE POLICY "Enable select for users and admins on bug_reports"
ON bug_reports
FOR SELECT
USING (
    created_by = auth.uid() OR
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1 OR
    CURRENT_USER = 'supabase_auth_admin'
);

-- Allow full CRUD operations for admins
CREATE POLICY "Enable full CRUD for Admins on bug_reports"
ON bug_reports
FOR ALL
USING (
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1
)
WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_level')::integer = 1
);

-- Allow users to INSERT their own bug reports
CREATE POLICY "Allow insert for authenticated users on bug_reports"
ON bug_reports
FOR INSERT
WITH CHECK (
    created_by = auth.uid()
);

-- Allow users to UPDATE only their own bug reports
CREATE POLICY "Allow update for users on their own bug_reports"
ON bug_reports
FOR UPDATE
USING (
    created_by = auth.uid()
)
WITH CHECK (
    created_by = auth.uid()
);

-- Grant permissions to the public role
GRANT SELECT ON bug_reports TO anon;

CREATE FUNCTION set_br_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bug_reports_updated_at
BEFORE UPDATE ON bug_reports
FOR EACH ROW EXECUTE FUNCTION set_br_updated_at_timestamp();
