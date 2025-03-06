<template>
  <header class="sticky inset-x-0 top-0 border-b bg-white dark:border-neutral-700 dark:bg-neutral-800">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink to="/" class="">
          <span class="sr-only">{{ useBranding().appName }}</span>
          <img class="h-12 w-auto pt-2" :src="useBranding().logoSrc.value" :alt="useBranding().appName" />
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
          @click="emits('toggleSidebar')"
        >
          <span class="sr-only">Open main menu</span>
          <icon name="heroicons:bars-3" class="size-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <div v-for="item in navigation" :key="item.name" class="flex items-center gap-x-2">
          <icon :name="item.icon" class="size-6 shrink-0 dark:text-gray-100" aria-hidden="true" />
          <NuxtLink :to="item.href" class="text-sm/6 font-semibold text-gray-900 dark:text-gray-100">{{
            item.name
          }}</NuxtLink>
        </div>
      </div>
      <div class="hidden gap-x-10 lg:flex lg:flex-1 lg:justify-end">
        <NuxtLink
          v-if="!useAuthStore().isTokenValid"
          to="/auth/login/"
          class="text-sm/6 font-semibold text-gray-900 dark:text-gray-400"
          >Log in <span aria-hidden="true">&rarr;</span></NuxtLink
        >
        <a
          v-if="useAuthStore().isTokenValid"
          href="#"
          class="text-sm/6 font-semibold text-gray-900 dark:text-gray-400"
          @click="useAuthStore().signOut()"
        >
          Log out <span aria-hidden="true">&rarr;</span></a
        >
        <div class="hidden justify-center rounded-md text-gray-700 dark:text-gray-400 lg:inline-flex">
          <UiColorModeToggle />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';

const props = defineProps({
  navigation: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['toggleSidebar']);
</script>
