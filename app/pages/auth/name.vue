<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
      Complete your Account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 shadow-sm ring-1 ring-gray-200 dark:bg-neutral-900 sm:rounded-lg sm:px-12">
      <TailwindStaticAlert :alert="alert" />
      <form class="space-y-6">
        <div>
          <label for="first_name" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400"
            >First Name</label
          >
          <div class="mt-2">
            <input
              @keypress.enter="validateForm"
              v-model="formData.first_name"
              type="text"
              name="first_name"
              id="first_name"
              autocomplete="first_name"
              required=""
              class="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-800 dark:text-white sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="last_name" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-400">Last Name</label>
          <div class="mt-2">
            <input
              @keypress.enter="validateForm"
              v-model="formData.last_name"
              type="text"
              name="last_name"
              id="last_name"
              autocomplete="last_name"
              required=""
              class="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-800 dark:text-white sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            @click.prevent="validateForm"
            class="shadow-xs flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  providers: {
    type: Array,
    required: true,
  },
});

const alert = ref({ type: 'debug', title: 'Login Attempt', message: 'Testing', show: false });

const formData = ref({
  first_name: '',
  last_name: '',
});

const validateForm = async () => {
  if (formData.value.first_name.length > 0 && formData.value.last_name.length > 0) {
    try {
      const payload = {
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
      };

      const data = await useAuthStore().updateProfile(payload);

      alert.value = {
        type: 'success',
        title: 'Profile Updated',
        message: 'You have successfully updated your profile',
        show: true,
      };
      useNuxtApp().$toast.success('You have successfully updated your profile. Redirecting you to the dashboard');
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo('/auth/confirm');
          resolve(true);
        }, 2000);
      });
    } catch (error) {
      alert.value = {
        type: 'error',
        title: 'Failed to update profile',
        message: error.message,
        show: true,
      };
      useNuxtApp().$toast.error(error.message);
    }
  } else {
    alert.value = {
      type: 'error',
      title: 'Failed to update profile',
      message: 'Please fill in both First and Last Name',
      show: true,
    };
    useNuxtApp().$toast.error(alert.value.message);
  }
};
</script>
