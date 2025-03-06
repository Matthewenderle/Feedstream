<template>
  <div class="feature-item">
    <div class="header">
      <!-- Top half content -->
      <div class="flex-1">
        <NuxtLink :to="`/features/${feature.id}`">
          <h3 class="title">{{ feature.request_title }}</h3>
        </NuxtLink>
        <p class="description">
          {{ feature.request_description }}
        </p>
      </div>
      <div class="aside">
        <icon name="heroicons:chevron-up" class="text-2xl font-extrabold text-gray-500 dark:text-red-400" />
        <p class="votes">
          {{ feature.total_votes }}
        </p>
      </div>
    </div>

    <hr class="divider" />

    <div class="footer">
      <div class="flex">
        <span class="author"> {{ feature.creator.first_name }} {{ feature.creator.last_name }} </span>
        <span class="date">
          {{ formatDate(feature.created_at) }}
        </span>
        <div class="comments">
          <icon name="heroicons:chat-bubble-bottom-center-text-solid" class="icon" />
          <span class="count">{{ feature.total_comments || 0 }}</span>
        </div>
      </div>
      <div class="status">
        <div class="flex-1">
          {{ feature.status }}
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

<style scoped></style>
