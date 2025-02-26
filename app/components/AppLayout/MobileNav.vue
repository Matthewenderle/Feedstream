<template>
  <TransitionRoot as="template" :show="sidebarOpen">
    <Dialog class="relative z-50 lg:hidden" @close="emits('toggleSidebar')">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-100 dark:bg-neutral-950" />
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" class="-m-2.5 p-2.5" @click="emits('toggleSidebar')">
                  <span class="sr-only">Close sidebar</span>
                  <icon name="heroicons:x-mark" class="size-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>

            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div
              class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-white/10 dark:bg-neutral-950"
            >
              <NuxtLink to="/" class="flex h-16 shrink-0 items-center">
                <img class="h-8 w-auto" :src="useBranding().logoSrc.value" :alt="useBranding().appName" />
              </NuxtLink>
              <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" class="-mx-2 space-y-1">
                      <li v-for="item in navigation" :key="item.name">
                        <a
                          :href="item.href"
                          :class="[
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          ]"
                        >
                          <icon :name="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                          {{ item.name }}
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li class="mt-auto">
                    <div
                      class="hover:bg-gray-900/35 group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-200 hover:text-white"
                      @click="changeColor"
                    >
                      <button
                        aria-label="Color Mode"
                        class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold leading-none text-gray-400 hover:text-white lg:mt-0"
                      >
                        <Icon
                          v-if="colorMode.value === 'dark'"
                          name="heroicons-outline:moon"
                          class="text-xl font-semibold"
                        />
                        <Icon v-else name="heroicons-outline:sun" class="text-xl font-semibold" />
                        Dark Mode
                      </button>
                    </div>
                    <NuxtLink
                      to="/admin/settings"
                      class="hover:bg-gray-900/35 group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-200 hover:text-white"
                    >
                      <icon name="heroicons:cog-6-tooth" class="size-6 shrink-0" aria-hidden="true" />
                      Settings
                    </NuxtLink>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
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
  sidebarOpen: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(['toggleSidebar']);

const colorMode = useColorMode();
const changeColor = () => (colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light');
</script>
