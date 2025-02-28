<template>
  <div class="bg-white shadow-sm ring-1 ring-gray-200 dark:bg-neutral-900 sm:rounded-lg">
    <div class="flex flex-row px-4 py-4 sm:px-6">
      <!-- Top half content -->
      <div class="flex-1">
        <h3 class="text-lg font-bold">{{ feature.request_title }}</h3>
        <p class="text-sm text-gray-900 dark:text-gray-400">
          {{ feature.request_description }}
        </p>
      </div>
      <div class="flex items-center justify-end">
        <div class="flex-1">
          <icon name="heroicons:chevron-up" class="text-lg font-bold" />
          <p class="text-sm font-bold text-gray-900 dark:text-gray-400">
            {{ feature.total_votes }}
          </p>
        </div>
      </div>
    </div>
    <hr class="divider" />
    <div class="bottom-half">
      <!-- Bottom half content -->
      <div class="flex flex-row px-4 py-4 sm:px-6">
        <!-- Top half content -->
        <div class="flex-1">
          <span class="flex text-sm"
            >{{ feature.creator.first_name }} {{ feature.creator.last_name }}
            <span class="flex pl-2 text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(feature.created_at) }}
            </span></span
          >
        </div>
        <div class="flex items-center justify-end">
          <div class="flex-1">
            {{ feature.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { feature } = defineProps({
  feature: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.divider {
  border: none;
  border-top: 1px solid #e5e7eb; /* Light gray color */
  margin: 0;
}
</style>
