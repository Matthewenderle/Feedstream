<template>
  <span>Checking login</span>
  <div class="text-white">
    <DevOnly>
      <pre>listenerInitialized: {{ listenerInitialized }}</pre>
      <button @click="signOut()">Sign out</button>
      <pre>user.onboarded: {{ user.onboarded || false }}</pre>
      <pre>user: {{ user }}</pre>
      <pre>isTokenValid: {{ isTokenValid }}</pre>
      <pre>session: {{ session }}</pre>
    </DevOnly>
  </div>
</template>

<script setup>
const { session, user, isTokenValid, listenerInitialized, signOut, isNotOnboarded } = useAuthStore();

onMounted(() => {
  if (!isTokenValid) {
    return navigateTo('/auth/login');
  }

  if (session) {
    user.onboarded = true;
  }

  console.debug(isNotOnboarded());
  console.debug(user.value);

  return navigateTo(useAuthStore().redirectUrl ? useAuthStore().redirectUrl : '/');
});
</script>
