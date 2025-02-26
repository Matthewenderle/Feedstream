<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <AppLayoutMobileNav :navigation="navigation" :sidebarOpen="sidebarOpen" @toggleSidebar="toggleSidebarEmit" />
    <AppLayoutDesktopNav :navigation="navigation" @toggleSidebar="toggleSidebarEmit" />

    <div class="lg:pl-72">
      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const navigation = ref([
  { name: 'Feature Requests', href: '#', icon: 'heroicons:light-bulb', current: false },
  { name: 'Roadmap', href: '#', icon: 'heroicons:map', current: false, badge: 'Soon' },
  { name: 'Changelog', href: '#', icon: 'heroicons:wrench', current: false, badge: 'Soon' },
]);

const sidebarOpen = ref(false);

const toggleSidebarEmit = () => (sidebarOpen.value = !sidebarOpen.value);

const setActive = () => {
  navigation.value.forEach((item) => {
    const isActiveRoute =
      useRoute().path === item.href || (item.href !== '/admin' && useRoute().path.startsWith(item.href));
    item.current = isActiveRoute;
  });
};

onMounted(() => {
  setActive();
});
</script>
