export default defineNuxtRouteMiddleware((to) => {
  // Check the route and assign layout dynamically
  if (to.path.startsWith('/auth/')) {
    to.meta.layout = 'auth';
  } else if (['/'].includes(to.path)) {
    to.meta.layout = 'default';
  } else {
    to.meta.layout = 'default';
  }
});
