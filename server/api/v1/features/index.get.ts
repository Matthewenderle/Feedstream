import { serverSupabaseClient } from '#supabase/server';
const config = useRuntimeConfig();

interface UserData {
  id: string;
  email: string;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);

  try {
    const { data, error: dbError }: SupabaseResponse<UserData[]> = await supabase
      .from('feature_requests_view')
      .select('*');
    if (dbError) {
      console.error('Error while fetching from database:', dbError);
      return {
        statusCode: 500,
        success: false,
        error: 'Failed to fetch from the database',
        data: null,
      };
    }

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        success: false,
        error: 'No data found in the database',
        data: null,
      };
    }

    return {
      statusCode: 200,
      success: true,
      error: null,
      data,
    };
  } catch (err) {
    console.error('Unexpected error occurred:', err);
    return {
      statusCode: 500,
      success: false,
      error: err instanceof Error ? err.message : 'Internal Server Error',
      data: null,
    };
  }
});
