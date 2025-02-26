<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900">
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
</script>
