<template>
  <div class="flex min-h-screen flex-1 flex-col justify-center bg-gray-50 py-12 dark:bg-neutral-900 sm:px-6 lg:px-8">
    <div class="fixed right-4 top-2"><UiColorModeToggle /></div>
    <img class="mx-auto h-28 w-auto" :src="logoSrc" alt="Your Company" />
    <NuxtPage :providers="providers" />
  </div>
</template>

<script setup>
const logoSrc = useBranding().logoSrc;

// const providers = [
//   {
//     name: 'google',
//     text: 'Google',
//     color: '#4285f4',
//   },
//   {
//     name: 'github',
//     text: 'Github',
//     color: '#24292F',
//   },
//   {
//     name: 'discord',
//     text: 'Discord',
//     color: '#5865f2',
//   },
//   // {
//   //   name: 'facebook',
//   //   text: 'Facebook',
//   //   color: '#5cabee',
//   // },
//   // {
//   //   name: 'spotify',
//   //   text: 'Spotify',
//   //   color: '#00d700',
//   // },
//   // {
//   //   name: 'linkedin',
//   //   text: 'LinkedIn',
//   //   color: '#0288d1',
//   // },
// ];
</script>
