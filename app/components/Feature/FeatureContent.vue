<template>
  <div>
    <FeatureList :features="features" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const features = ref([]);

const refreshData = async () => {
  console.log('Fetching features...');
  const response = await useFeatures().getFeatures();

  if (response && response.success && response.data) {
    console.log('Features fetched successfully:', response.data);
    features.value = response.data;
  } else {
    console.error('Error fetching features:', response?.error || 'Unknown error');
  }
};

// **Ensures data is fetched before rendering**
await refreshData();
</script>
