<template>
  <Combobox as="div" v-model="selectedStatus" @update:modelValue="query = ''" class="w-full">
    <div class="relative">
      <ComboboxInput
        class="field"
        @change="query = $event.target.value"
        @blur="query = ''"
        placeholder="Status"
        :display-value="(status) => status"
      />
      <ComboboxButton class="focus:outline-hidden absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
        <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions v-if="filteredStatuses.length > 0" class="field-select-options">
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
              active ? 'bg-gray-400 text-white outline-hidden' : 'text-gray-200',
            ]"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ status }}
            </span>

            <span
              v-if="selected"
              :class="[
                'absolute inset-y-0 right-0 flex items-center pr-4',
                active ? 'text-white' : 'text-gray-400 font-bold',
              ]"
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
