<template>
  <Suspense>
    <template #default>
      <FeatureContent />
    </template>
    <template #fallback>
      <FeatureLoadingSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts"></script>
