-- Custom ID generation function
CREATE OR REPLACE FUNCTION public.generate_custom_id(prefix TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    candidate_id TEXT;
    full_prefix TEXT;
    existing_id TEXT;
BEGIN
    full_prefix := CASE 
                        WHEN right(prefix, 1) = '_' THEN prefix 
                        ELSE prefix || '_' 
                    END;
    LOOP
        candidate_id := full_prefix || substring(md5(random()::text) FROM 1 FOR 7);
        EXECUTE format('SELECT id FROM %I WHERE id = $1 LIMIT 1', table_name)
        INTO existing_id
        USING candidate_id;
        IF existing_id IS NULL THEN
            RETURN candidate_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_profile_id()
RETURNS TEXT AS $$
DECLARE
    random_suffix TEXT;
    new_profile_id TEXT;
BEGIN
    LOOP
        -- Generate a random 7-character alphanumeric string
        random_suffix := substr(md5(random()::text), 1, 7);
        new_profile_id := 'pro_' || random_suffix;

        -- Ensure the ID is unique
        IF NOT EXISTS (SELECT 1 FROM public.all_profile_ids WHERE profile_id = new_profile_id) THEN
            RETURN new_profile_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create the user_profiles table in the public schema
CREATE TABLE public.user_profiles (
    user_id UUID PRIMARY KEY,
    profile_id TEXT UNIQUE DEFAULT generate_profile_id(),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    onboarded BOOLEAN DEFAULT FALSE
);

-- View of all profile_ids
CREATE VIEW public.all_profile_ids AS
SELECT profile_id FROM public.user_profiles;

GRANT SELECT ON public.all_profile_ids TO supabase_auth_admin;

-- Enable Row Level Security on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a foreign key constraint to auth.users
ALTER TABLE public.user_profiles
ADD CONSTRAINT fk_user_profiles_user_id
FOREIGN KEY (user_id)
REFERENCES auth.users(id) ON DELETE CASCADE;

-- RLS Policies
DO $$
DECLARE
    admin_condition TEXT := '((current_setting(''request.jwt.claims'', true)::jsonb -> ''app_metadata'' ->> ''user_level'')::integer = 1)';
    user_condition TEXT := '(user_id = auth.uid())';
BEGIN
    EXECUTE format('
        CREATE POLICY "Enable select for users based on user_id for user_profiles" 
        ON public.user_profiles 
        FOR SELECT 
        USING (((user_id = auth.uid()) OR (CURRENT_USER = ''supabase_auth_admin''::name)) OR %s);
    ', admin_condition);

    EXECUTE format('
        CREATE POLICY "Enable full CRUD for Admins on user_profiles" 
        ON public.user_profiles 
        FOR ALL 
        USING (%s)
        WITH CHECK (%s);
    ', admin_condition, admin_condition);

    EXECUTE '
        CREATE POLICY "Allow insert for supabase_auth_admin on user_profiles" 
        ON public.user_profiles 
        FOR INSERT 
        WITH CHECK (CURRENT_USER = ''supabase_auth_admin''::name);
    ';

    EXECUTE format('
        CREATE POLICY "Allow update for users on user_profiles" 
        ON public.user_profiles 
        FOR UPDATE 
        USING (%s);
    ', user_condition);

    EXECUTE 'GRANT INSERT, UPDATE ON public.user_profiles TO "supabase_auth_admin";';
END $$;

-- Function to automatically update timestamps on updates
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profile_timestamp
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Function to insert user profile on auth.users insert
CREATE OR REPLACE FUNCTION public.create_new_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    full_name TEXT;
    first_name TEXT;
    last_name TEXT;
BEGIN
    full_name := (NEW.raw_user_meta_data->>'full_name')::TEXT;

    IF full_name IS NOT NULL AND full_name <> '' THEN
        first_name := split_part(full_name, ' ', 1);
        last_name := NULLIF(split_part(full_name, ' ', 2), '');
    ELSE
        first_name := NULL;
        last_name := NULL;
    END IF;

    INSERT INTO public.user_profiles (
        user_id, 
        email, 
        first_name, 
        last_name, 
        onboarded
    )
    VALUES (
        NEW.id, 
        NEW.email, 
        first_name, 
        last_name, 
        FALSE
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create user_profile automatically upon user creation in auth.users
CREATE TRIGGER create_user_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_new_user_profile();
