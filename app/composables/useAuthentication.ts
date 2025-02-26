import type { Session } from '@supabase/supabase-js';

export const useAuthentication = () => {
  const supabase = useSupabaseClient();
  // const session = ref<Session | null>(null);
  const session = useState<Session | null>('useUser-session', () => null);
  const config = useRuntimeConfig();

  const isTokenValid = computed(() => {
    if (!session.value?.expires_at) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return session.value?.expires_at > currentTime;
  });

  const user = computed(() => {
    console.log(session.value);
    const displayName = session.value?.user?.user_metadata?.full_name || session.value?.user?.email;
    const onboarded = undefined;
    return { ...session.value?.user, displayName, onboarded };
  });

  const redirectTo = '';

  /**
   * Retrieves the current user session and stores it in the session ref.
   */
  const fetchUserSession = async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data?.session || null;
  };

  /**
   * Checks if the current user has admin privileges.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the user is an admin (user_level 2), otherwise `false`.
   */
  const isAdmin = (): boolean => {
    return session.value?.user?.app_metadata?.user_level === 2 || false;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    return data;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${config.public.siteURL}/auth/confirm`,
      },
    });
    if (error) return { error };
    return { data };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    session.value = null;
    navigateTo('/');
  };

  const updateProfile = async (profile: Partial<Profile>, profileId: string | null) => {
    try {
      const accessToken = useAuthStore().getAccessToken;
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const effectiveProfileId = profileId || useAuthStore().profile.profile_id;

      console.log(effectiveProfileId);

      const { data, statusCode } = await $fetch(`/api/v1/profile/${effectiveProfileId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ profile }),
      });

      if (statusCode === 200) {
        return { data, statusCode };
      } else if (statusCode === 401) {
        useNuxtApp().$toast.error('You do not have permission to impersonate this user');
      } else {
        useNuxtApp().$toast.error(`Unexpected status code: ${statusCode}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      if ((error as any).response?.status === 500) {
        useNuxtApp().$toast.error('Server error occurred while impersonating user');
        console.error('Server error:', error);
      } else if ((error as any).response?.status === 404) {
        useNuxtApp().$toast.error('User not found');
      } else {
        useNuxtApp().$toast.error('An error occurred while impersonating user');
      }
    }
  };

  return {
    session,
    user,
    isAdmin,
    isTokenValid,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
  };
};
