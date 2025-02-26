<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
      Sign up for an Account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 shadow-sm ring-1 ring-gray-200 dark:bg-neutral-900 sm:rounded-lg sm:px-12">
      <form class="space-y-6">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400">Email address</label>
          <div class="mt-2">
            <input
              @keydown.enter.prevent="validateForm"
              v-model="formData.email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required=""
              class="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-800 dark:text-white sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400">Password</label
          ><span v-if="passwordsMatch" class="text-xs font-thin text-green-500"
            ><icon name="heroicons:check-circle" /> Passwords Match</span
          >
          <div class="mt-2">
            <input
              @keydown.enter.prevent="validateForm"
              v-model="formData.password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required=""
              class="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-800 dark:text-white sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400"
            >Confirm Password</label
          ><span v-if="passwordsMatch" class="text-xs font-thin text-green-500"
            ><icon name="heroicons:check-circle" /> Passwords Match</span
          >
          <div class="mt-2">
            <input
              @keydown.enter.prevent="validateForm"
              v-model="formData.confirmPassword"
              type="password"
              name="confirm-password"
              id="password"
              autocomplete="confirm-password"
              required=""
              class="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-800 dark:text-white sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            @click="validateForm"
            class="shadow-xs flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign up
          </button>
        </div>
      </form>

      <div v-if="providers">
        <div class="relative mt-10">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-200" />
          </div>
          <div class="relative flex justify-center text-sm/6 font-medium">
            <span class="bg-white px-6 text-gray-900 dark:bg-neutral-900 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4">
          <a
            v-for="provider in providers"
            :key="provider.name"
            href="#"
            :class="[
              `flex w-full items-center justify-center gap-3 rounded-md  px-3 py-1.5 text-white focus:outline-none focus:ring-2  focus:ring-offset-2 dark:bg-neutral-800 dark:text-white sm:text-sm/6`,
            ]"
            :style="`background-color:${provider.color}`"
            @click="login(provider.name)"
          >
            <icon :name="`fa6-brands:${provider.name}`" class="h-6 w-6" />
            <span class="text-sm font-semibold leading-6">{{ provider.text }}</span>
          </a>
        </div>
      </div>
    </div>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already a member?
      {{ ' ' }}
      <NuxtLink to="/auth/login" class="font-semibold text-blue-600 hover:text-blue-500">Login instead</NuxtLink>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  providers: {
    type: Array,
    required: true,
  },
});

const { session, isTokenValid } = useAuthentication();

const formData = ref({
  email: 'mattenderle488@gmail.com',
  password: 'password',
  confirmPassword: 'password',
});

const validateForm = async () => {
  if (
    formData.value.email.length > 5 &&
    formData.value.password.length > 0 &&
    formData.value.confirmPassword.length > 0
  ) {
    if (formData.value.password === formData.value.confirmPassword) {
      const { data, error } = await useAuthentication().signUpWithEmail(formData.value.email, formData.value.password);

      if (error) {
        if (error.code === 'user_already_exists') {
          alert.value = {
            type: 'error',
            title: 'Failed to register',
            message: 'Email already in use',
            show: true,
          };
          return useNuxtApp().$toast.error('Email already in use');
        }
        alert.value = {
          type: 'error',
          title: 'Failed to register',
          message: error.message,
          show: true,
        };
        return useNuxtApp().$toast.error(error.message || 'Failed to register');
      }

      useNuxtApp().$toast.success('You have successfully registered. Redirecting you to the dashboard');
      return navigateTo('/auth/confirm');
    } else {
      alert.value = {
        type: 'error',
        title: 'Failed to register',
        message: 'Passwords do not match',
        show: true,
      };
      useNuxtApp().$toast.error('Passwords do not match');
    }
  } else {
    alert.value = {
      type: 'error',
      title: 'Failed to register',
      message: 'Please fill in all fields',
      show: true,
    };
    useNuxtApp().$toast.error('Please fill in all fields');
  }
};

const passwordsMatch = computed(() => {
  return formData.value.password === formData.value.confirmPassword && formData.value.password.length > 0;
});
</script>
