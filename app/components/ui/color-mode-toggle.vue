<script setup>
const colorMode = useColorMode();
const changeColor = () => (colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light');
</script>

<template>
  <div>
    <button aria-label="Color Mode" class="inline-block text-sm leading-none text-white lg:mt-0" @click="changeColor">
      <div placeholder="...">
        <Icon v-if="colorMode.value === 'dark'" name="heroicons-outline:moon" class="text-xl text-white" />
        <Icon v-else name="heroicons-outline:sun" class="text-xl text-black" />
      </div>
    </button>
  </div>
</template>
