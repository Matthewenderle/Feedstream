<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-7xl">
    <div class="card-border">
      <h1 class="card-title">Feature Requests</h1>
      <span class="card-subtitle">View and Interact with Feature Requests</span>
      <div class="flex justify-between py-4">
        <div class="flex gap-x-4">
          <input
            type="searchInput"
            name="searchInput"
            id="searchInput"
            aria-label="Search"
            v-model="searchInput"
            class="field"
            placeholder="Search"
          />
          <FeatureStatusComboSelect @select-option="statusSelectEmit" />
          <FeatureOrderComboSelect @select-option="orderSelectEmit" />
        </div>
        <div class="flex justify-end">
          <button
            @click="createRequest"
            type="button"
            class="shadow-xs inline-flex items-center gap-x-1.5 rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <icon name="heroicons:plus" class="size-5 -ml-0.5" aria-hidden="true" />
            New Request
          </button>
        </div>
      </div>
      <FeatureCardContainer v-for="feature in filteredFeatures" :key="feature.id" :feature="feature" />
      <button
        v-if="!Array.isArray(filteredFeatures)"
        type="button"
        class="focus:outline-hidden relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400"
      >
        <span class="mt-2 block text-sm font-semibold text-gray-900 dark:text-neutral-200"
          >There are no Feature Requests found</span
        >
      </button>
    </div>
    {{ statusSelect }}
    {{ orderSelect }}
    <pre>filteredFeatures: {{ filteredFeatures }}</pre>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

const { features } = defineProps({
  features: {
    type: Array,
    required: true,
  },
});

const searchInput = ref('');
const statusSelect = ref('');
const orderSelect = ref('');

const statusSelectEmit = (selectedOption: string) => {
  console.log('Selected status:', selectedOption);
  statusSelect.value = selectedOption; // Update ref value
};

const orderSelectEmit = (selectedOption: string) => {
  console.log('Selected order:', selectedOption);
  orderSelect.value = selectedOption;
};
const filteredFeatures = computed(() => {
  const filtered = features.filter((feature) => {
    const matchesTitle = feature.request_title.toLowerCase().includes(searchInput.value.toLowerCase());
    const matchesDescription = feature.request_description.toLowerCase().includes(searchInput.value.toLowerCase());

    // Ensure case-insensitive status matching
    const matchesStatus =
      statusSelect.value !== '' ? feature.status.toLowerCase() === statusSelect.value.toLowerCase() : true;

    console.log(`Feature Status: ${feature.status}, Selected Status: ${statusSelect.value}, Match: ${matchesStatus}`);

    // Ensure the status filter is always applied
    return (matchesTitle || matchesDescription) && matchesStatus;
  });

  // Sort the filtered features based on the selected order
  if (orderSelect.value === 'Newest' || orderSelect.value === '') {
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (orderSelect.value === 'Oldest') {
    return filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (orderSelect.value === 'Most Votes') {
    return filtered.sort((a, b) => b.total_votes - a.total_votes);
  } else if (orderSelect.value === 'Least Votes') {
    return filtered.sort((a, b) => a.total_votes - b.total_votes);
  }
});

const createRequest = () => {
  useAuthStore().redirectUrl = '/feature/create';
  return useRouter().push(useAuthStore().isTokenValid ? '/feature/create' : '/auth/login');
};
</script>

<style lang="scss" scoped></style>
