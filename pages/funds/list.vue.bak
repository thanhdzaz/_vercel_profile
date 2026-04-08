<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
    <div class="mb-10 flex items-center justify-between">
      <h1 class="text-4xl font-bold tracking-tight text-white">Funds</h1>
      <div v-if="loading" class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="h-4 w-4 animate-spin text-indigo-500" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Refreshing...
      </div>
    </div>

    <!-- Create Fund Form -->
    <div
      class="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md"
    >
      <h2 class="mb-6 text-xl font-semibold text-white">Create New Fund</h2>
      <form
        @submit.prevent="createFund"
        class="flex flex-col gap-6 sm:flex-row sm:items-end"
      >
        <div class="flex-1">
          <label class="mb-2 block text-sm font-medium text-gray-400"
            >Fund Name</label
          >
          <input
            v-model="newFund.name"
            type="text"
            required
            :disabled="actionLoading"
            placeholder="Savings, Travel, etc."
            class="block w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
          />
        </div>
        <div class="flex-[1.5]">
          <label class="mb-2 block text-sm font-medium text-gray-400"
            >Description</label
          >
          <input
            v-model="newFund.description"
            type="text"
            :disabled="actionLoading"
            placeholder="What is this fund for?"
            class="block w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          :disabled="actionLoading"
          class="inline-flex h-[42px] items-center justify-center rounded-lg bg-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            v-if="actionLoading"
            class="mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ actionLoading ? 'Creating...' : 'Create' }}
        </button>
      </form>
    </div>

    <!-- Funds List -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div
        v-for="fund in funds"
        :key="fund.id"
        class="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl"
        @click="$router.push(`/funds/${fund.id}`)"
      >
        <button
          @click.stop="deleteFund(fund.id)"
          class="absolute right-4 top-4 z-10 translate-x-2 translate-y-[-2px] rounded-md p-2 text-gray-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          title="Delete Fund"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
            ></path>
          </svg>
        </button>

        <div class="flex min-w-0 flex-col">
          <p
            class="text-xl font-bold leading-7 text-white transition-colors group-hover:text-indigo-400"
          >
            {{ fund.name }}
          </p>
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
            {{ fund.description || 'No description provided' }}
          </p>
        </div>
        <div
          class="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-indigo-400 transition-transform group-hover:translate-x-1"
        >
          View details
          <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && funds.length === 0"
      class="mt-10 text-center italic text-gray-500"
    >
      No funds created yet.
    </div>

    <!-- Initial Loading Skeleton -->
    <div
      v-if="loading && funds.length === 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="mx-auto h-40 w-full animate-pulse rounded-2xl border border-white/5 bg-white/5"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import type { IFunds } from '~/@types';

// Access the Firebase app
const { $firestore } = useNuxtApp();

const funds = ref<IFunds[]>([]);
const loading = ref(false);
const actionLoading = ref(false);

const newFund = reactive({
  name: '',
  description: '',
});

const loadFunds = async () => {
  loading.value = true;
  try {
    const res = await $firestore.get<IFunds>('funds');
    funds.value = res;
  } catch (error) {
    console.error('Error fetching funds:', error);
  } finally {
    loading.value = false;
  }
};

const createFund = async () => {
  if (!newFund.name) return;

  actionLoading.value = true;
  try {
    await $firestore.add('funds', { ...newFund });
    newFund.name = '';
    newFund.description = '';
    await loadFunds();
  } catch (error) {
    console.error('Error creating fund:', error);
  } finally {
    actionLoading.value = false;
  }
};

const deleteFund = async (id: string) => {
  if (
    !confirm(
      'Are you sure you want to delete this fund? All its data entries will still remain in the database (sub-collections are not auto-deleted in Firestore client SDK).',
    )
  )
    return;

  actionLoading.value = true;
  try {
    await $firestore.delete('funds', id);
    await loadFunds();
  } catch (error) {
    console.error('Error deleting fund:', error);
  } finally {
    actionLoading.value = false;
  }
};

onMounted(() => {
  loadFunds();
});

definePageMeta({
  middleware: 'funds',
});
</script>
