export default defineNuxtRouteMiddleware((to) => {
  const { session, isAdmin } = useAuthentication();
  const { user, isTokenValid } = useAuthStore();

  if (to.path.startsWith('/auth/') && isTokenValid.value && to.path !== '/auth/name') {
    return navigateTo('/');
  } else {
    to.meta.layout = 'default';
  }

  if (to.path === '/') return;

  if (to.path === '/auth/name' && !isTokenValid) {
    return navigateTo('/auth/login');
  }

  if (!isTokenValid && !to.path.startsWith('/auth/')) {
    return navigateTo('/auth/login');
  }
});
