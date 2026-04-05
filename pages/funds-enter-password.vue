<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white"
      >
        Enter Password to Access Funds
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-white"
            >Password</label
          >
          <div class="mt-2 text-black">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="block w-full rounded-md border-0 px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div v-if="error" class="text-center text-sm text-red-500">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Access Funds
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const password = ref('');
const error = ref('');
const pw = useRuntimeConfig().public.adminPassword;
const handleSubmit = () => {
  if (password.value == pw) {
    localStorage.setItem('password', password.value);
    navigateTo('/funds/list');
  } else {
    error.value = 'Invalid password';
  }
};
</script>
