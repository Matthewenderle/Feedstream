import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { profileId } = event.context.params || {};

  if (!profileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        error: 'missing_parameters',
        message: 'profileId is required.',
      },
    });
  }

  if (!body || !body.profile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        error: 'invalid_body',
        message: 'Profile data is required in the request body.',
      },
    });
  }

  const { first_name, last_name } = body.profile;

  // Validate required fields
  if (!first_name || !last_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        error: 'missing_fields',
        message: 'Both first_name and last_name are required.',
      },
    });
  }

  try {
    // Update the profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ first_name, last_name, onboarded: true })
      .eq('profile_id', profileId)
      .select(); // Retrieve the updated rows

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        data: {
          error: 'database_error',
          message: `Error updating profile: ${error.message}`,
        },
      });
    }

    if (data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        data: {
          error: 'not_found',
          message: `No profile found with profileId ${profileId}.`,
        },
      });
    }

    // Return the updated resource
    return {
      statusCode: 200,
      data: {
        message: 'Profile updated successfully.',
        profile: data[0],
      },
    };
  } catch (err) {
    // General error handling
    if (err instanceof Error) {
      throw createError({
        statusCode: (err as any).statusCode || 500,
        statusMessage: (err as any).statusMessage || 'Internal Server Error',
        data: (err as any).data || {
          error: 'unexpected_error',
          message: 'An unexpected error occurred.',
        },
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        data: {
          error: 'unexpected_error',
          message: 'An unexpected error occurred.',
        },
      });
    }
  }
});
