<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 shadow-sm ring-1 ring-gray-200 dark:bg-neutral-900 sm:rounded-lg sm:px-12">
      <TailwindStaticAlert :alert="alert" />
      <form class="space-y-6">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400">Email address</label>
          <div class="mt-2">
            <input
              @keypress.enter="validateForm"
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
          <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400">Password</label>
          <div class="mt-2">
            <input
              @keypress.enter="validateForm"
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

        <div class="flex items-center justify-between">
          <div class="flex gap-3">
            <div class="flex h-6 shrink-0 items-center">
              <div class="size-4 group grid grid-cols-1">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="forced-colors:appearance-auto col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100"
                />
                <svg
                  class="size-3.5 group-has-disabled:stroke-gray-950/25 pointer-events-none col-start-1 row-start-1 self-center justify-self-center stroke-white"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    class="group-has-checked:opacity-100 opacity-0"
                    d="M3 8L6 11L11 3.5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    class="group-has-indeterminate:opacity-100 opacity-0"
                    d="M3 7H11"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <label for="remember-me" class="block text-sm/6 text-gray-900 dark:text-gray-400">Remember me</label>
          </div>

          <div class="text-sm/6">
            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>
        </div>

        <div>
          <button
            type="button"
            @click.prevent="validateForm"
            class="shadow-xs flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign in
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
      Not a member?
      {{ ' ' }}
      <NuxtLink to="/auth/signup" class="font-semibold text-blue-600 hover:text-blue-500">Create an Account</NuxtLink>
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

const { session } = useAuthentication();

const alert = ref({ type: 'debug', title: 'Login Attempt', message: 'Testing', show: false });

const formData = ref({
  email: 'mattenderle488@gmail.com',
  password: 'password',
});

const validateForm = async () => {
  if (formData.value.email.length > 5 && formData.value.password.length > 0) {
    try {
      await useAuthStore().signInWithEmail(formData.value.email, formData.value.password);

      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     navigateTo('/auth/confirm');
      //     resolve(true);
      //   }, 2000);
      // });
    } catch (error) {
      alert.value = {
        type: 'error',
        title: 'Failed to login',
        message: error.message,
        show: true,
      };
      useNuxtApp().$toast.error(error.message);
    }
  } else {
    alert.value = {
      type: 'error',
      title: 'Failed to login',
      message: 'Please fill in both Email and Password fields',
      show: true,
    };
    useNuxtApp().$toast.error(error.message);
  }
};
</script>
