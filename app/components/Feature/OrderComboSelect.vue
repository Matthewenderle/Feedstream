<template>
  <Combobox as="div" v-model="selectedOption" @update:modelValue="query = ''" class="w-full">
    <div class="relative">
      <ComboboxInput
        class="field"
        @change="query = $event.target.value"
        @blur="query = ''"
        placeholder="Newest"
        :display-value="(status) => status"
      />
      <ComboboxButton class="focus:outline-hidden absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
        <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions v-if="filteredOptions.length > 0" class="field-select-options">
        <ComboboxOption
          v-for="status in filteredOptions"
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

const options = ['Newest', 'Oldest', 'Most Upvoted', 'Most Commented'];

const emits = defineEmits(['select-option']);

const query = ref('');
const selectedOption = ref('Newest');
const filteredOptions = computed(() =>
  query.value === ''
    ? options
    : options.filter((x) => {
        return x.toLowerCase().includes(query.value.toLowerCase());
      }),
);

watch(selectedOption, (newOption) => {
  if (newOption) {
    emits('select-option', newOption);
  }
});
</script>
