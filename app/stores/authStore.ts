import { defineStore } from 'pinia';
import type { Session } from '@supabase/supabase-js';

interface Profile {
  profile_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  onboarded: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null as Session | null,
    profile: { profile_id: '', email: '', first_name: null, last_name: null, onboarded: false } as Profile,
    listenerInitialized: false as boolean,
    redirectUrl: null as string | null,
  }),
  persist: true,
  getters: {
    isTokenValid: (state) => {
      if (!state.session?.expires_at) return false;
      const currentTime = Math.floor(Date.now() / 1000);
      return state.session?.expires_at > currentTime;
    },
    user: (state) => {
      const displayName = state.session?.user?.user_metadata?.full_name || state.session?.user?.email;
      const onboarded = undefined;
      return { ...state.session?.user, displayName, onboarded, profile: state.profile };
    },
    isAdmin: (state) => {
      return state.session?.user?.app_metadata?.user_level === 1 || false;
    },
    getProfileId: (state) => {
      return state.profile.profile_id;
    },
    getAccessToken: (state) => {
      return state.session?.access_token;
    },
  },
  actions: {
    async signUpWithEmail(email: string, password: string) {
      const config = useRuntimeConfig();
      const supabase = useSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${config.public.siteURL}/auth/confirm`,
        },
      });
      if (error) {
        throw error;
      }
      this.session = data.session || null;
      return data;
    },
    async signInWithEmail(email: string, password: string) {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      this.session = data.session || null;
      // this.getProfile();
      return data;
    },
    async signOut() {
      console.debug('Signing out user');
      const supabase = useSupabaseClient();
      supabase.auth.signOut();
      this.session = null;
      return navigateTo('/auth/login');
      // return useRouter().push('/auth/login');
    },
    async getProfile() {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase.from('user_profiles').select('*').eq('user_id', this.session?.user?.id);
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      this.profile = (data && data[0]) || this.profile;
    },
    async updateProfile(payload: Profile) {
      const supabase = useSupabaseClient();
      console.debug('Updating profile:', payload, this.session?.user?.id);

      const profile: Partial<Profile> = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        onboarded: payload.onboarded,
      };
      console.debug('this.getProfileId:', this.getProfileId);
      const { data, statusCode } = await $fetch(`/api/v1/profile/${this.getProfileId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.getAccessToken}`,
        },
        body: JSON.stringify({ profile }),
      });

      console.debug('Profile updated:', data);
      this.profile = data[0] || this.profile;
      return data[0];
    },
    isNotOnboarded() {
      console.debug(this.profile);
      if (!this.session?.user) return false;
      if (!this.profile.profile_id) return { error: 'Profile not found', code: 'no_profile_id' };
      if (this.profile.email !== this.session.user.email) return { error: 'Email mismatch', code: 'email_mismatch' };
      if (!this.profile.first_name || !this.profile.last_name) return { error: 'Name not set', code: 'name_not_set' };
      if (this.profile.onboarded === undefined)
        return { error: 'Onboarding status not set', code: 'onboarding_status_not_set' };
      return;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
