import { createClient } from '@supabase/supabase-js';

const { public: publicConfig } = useRuntimeConfig();
const supabaseUrl = publicConfig.supabase.url;
const supabaseKey = publicConfig.supabase.key;

const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  if (!email || !password) {
    return {
      statusCode: 400,
      body: { error: 'Email and password are required' },
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        statusCode: 401,
        body: { error: error.message },
      };
    }

    return {
      statusCode: 200,
      body: { token: data.session.access_token },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: { error: 'Server error occurred' },
    };
  }
});
