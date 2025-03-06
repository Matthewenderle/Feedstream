<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <UiEnvironmentBanner class="fixed top-0" :Banner="environmentBanner" />
    <NuxtLayout />
  </div>
</template>

<script setup lang="ts">
const { public: config } = useRuntimeConfig();
type Environment = 'development' | 'staging' | 'production';

const banners: Record<Environment, { show: boolean; text: string; color: string }> = {
  development: { show: true, text: 'Development', color: 'orange' },
  staging: { show: true, text: 'Staging', color: '#2563eb' },
  production: { show: false, text: 'Production', color: 'green' },
};

const environmentBanner = banners[config.environment as Environment];

let lastRefreshedAt = ref<number>(0);
const REFRESH_INTERVAL = 1000 * 10; // 10 seconds interval

onMounted(() => {
  // useAuthStore().initializeAuthListener();
  const supabase = useSupabaseClient();
  const authStore = useAuthStore();

  const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.debug('created listener');
    switch (event) {
      case 'SIGNED_IN':
        useAuthStore().session = session;
        console.debug('User signed in:', session);
        await refreshData();
        break;

      case 'SIGNED_OUT':
        useAuthStore().session = null;
        console.debug('User signed out');
        useRouter().push('/auth/login');
        break;

      case 'TOKEN_REFRESHED':
        useAuthStore().session = session || null;
        console.debug('Session token refreshed:', useAuthStore().session);
        await refreshData();
        break;

      case 'PASSWORD_RECOVERY':
        console.debug('Password recovery event triggered');
        break;

      case 'INITIAL_SESSION':
        useAuthStore().session = session || null;
        console.debug('Initial session received:', useAuthStore().session);
        break;

      default:
        console.debug('Unhandled auth event:', event);
        break;
    }
  });

  onUnmounted(() => {
    subscription.subscription.unsubscribe();
    console.debug('Auth listener unsubscribed');
  });
});

const refreshData = async () => {
  const now = Date.now();

  if (now - lastRefreshedAt.value < REFRESH_INTERVAL) {
    console.debug('Refresh skipped to avoid redundancy');
    return;
  }

  lastRefreshedAt.value = now;

  const userId = useSupabaseUser().user?.id;
  await useAuthStore().getProfile();

  console.debug('Profile:', useAuthStore().profile);

  const notOnboarded = useAuthStore().isNotOnboarded();

  console.debug('Not onboarded:', notOnboarded);

  if (notOnboarded) {
    switch (notOnboarded.code) {
      case 'no_profile_id':
        console.error('Profile not found');
        break;
      case 'email_mismatch':
        console.error('Email mismatch');
        break;
      case 'name_not_set':
        console.error('Name not set');
        useRouter().push('/auth/name');
        break;
      case 'organization_not_set':
        console.error('Organization not set');
        useRouter().push('/auth/organization');
        break;
      case 'onboarding_status_not_set':
        console.error('Onboarding status not set');
        break;
    }
  } else {
    console.debug('Profile is set up');
    useNuxtApp().$toast.success('You have successfully logged in. Redirecting you to the dashboard');
    return new Promise((resolve) => {
      setTimeout(() => {
        navigateTo('/auth/confirm');
        resolve(true);
      }, 2000);
    });
  }
};
</script>
