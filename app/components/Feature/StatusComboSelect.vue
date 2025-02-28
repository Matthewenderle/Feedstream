<template>
  <Combobox
    as="div"
    v-model="selectedStatus"
    @update:modelValue="query = ''"
    class="w-full text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:bg-white focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 sm:text-sm/6"
  >
    <div class="relative">
      <ComboboxInput
        class="block w-full rounded-md bg-gray-100 py-1.5 pl-3 pr-12 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:bg-white focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 sm:text-sm/6"
        @change="query = $event.target.value"
        @blur="query = ''"
        placeholder="Status"
        :display-value="(status) => status"
      />
      <ComboboxButton class="focus:outline-hidden absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
        <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredStatuses.length > 0"
        class="focus:outline-hidden absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm"
      >
        <ComboboxOption
          v-for="status in filteredStatuses"
          :key="status"
          :value="status"
          as="template"
          v-slot="{ active, selected }"
        >
          <li
            :class="[
              'relative cursor-default py-2 pr-9 pl-3 select-none',
              active ? 'bg-gray-400 text-white outline-hidden' : 'text-gray-900',
            ]"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ status }}
            </span>

            <span
              v-if="selected"
              :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-gray-400']"
            >
              <CheckIcon class="size-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue';

import type { feature_request_status } from '~/types/supabase';

const statuses: feature_request_status[] = ['In Progress', 'In Review', 'Completed', 'Pending', 'Rejected'];

const emits = defineEmits(['select-option']);

const query = ref('');
const selectedStatus = ref<feature_request_status | null>(null);
const filteredStatuses = computed(() =>
  query.value === ''
    ? statuses
    : statuses.filter((status) => {
        return status.toLowerCase().includes(query.value.toLowerCase());
      }),
);

watch(selectedStatus, (newStatus) => {
  if (newStatus) {
    emits('select-option', newStatus);
  }
});
</script>
