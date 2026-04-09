<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="$router.push('/funds/list')"
          class="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <div>
          <div
            v-if="loading && !fund"
            class="mb-2 h-8 w-48 animate-pulse rounded bg-white/10"
          ></div>
          <h1
            v-else
            class="line-clamp-1 text-3xl font-bold tracking-tight text-gray-800 dark:text-white"
          >
            {{ fund?.name }}
          </h1>
          <div
            v-if="loading && !fund"
            class="h-4 w-64 animate-pulse rounded bg-white/10"
          ></div>
          <p v-else class="mt-1 line-clamp-1 text-sm text-gray-400">
            {{ fund?.description }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-8">
        <div class="text-right">
          <p
            class="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Total Amount
          </p>
          <p class="text-2xl font-bold text-indigo-400">
            ${{ toVndDot(totalAmount || 0) }}
          </p>
        </div>
        <button
          @click="handleDeleteFund"
          class="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition-all hover:bg-red-500 hover:text-white"
          title="Delete this Fund"
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
      </div>
    </div>

    <!-- New Fund Form -->
    <div
      class="mb-10 rounded-xl border border-black/10 bg-white/5 p-6 backdrop-blur-sm dark:border dark:border-white/10"
    >
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Add New Entry
      </h2>
      <form
        @submit.prevent="addFundEntry"
        class="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-400"
            >Date</label
          >
          <input
            v-model="newEntry.date"
            type="date"
            required
            :disabled="actionLoading"
            class="block w-full rounded-md border border-gray-100 bg-white/10 px-2 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:opacity-50 dark:border-0 dark:text-white sm:text-sm"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-400"
            >Amount ({{ toVndDot(newEntry.amount) }} VND)</label
          >
          <input
            v-model.number="newEntry.amount"
            type="number"
            step="1000"
            required
            :disabled="actionLoading"
            placeholder="0.00"
            class="block w-full rounded-md border border-gray-100 bg-white/10 px-2 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:opacity-50 dark:border-0 dark:text-white sm:text-sm"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-400"
            >Reason</label
          >
          <div class="flex gap-2">
            <input
              v-model="newEntry.reason"
              type="text"
              required
              :disabled="actionLoading"
              placeholder="Lunch, Rent, etc."
              class="block w-full rounded-md border border-gray-100 bg-white/10 px-2 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:opacity-50 dark:border-0 dark:text-white sm:text-sm"
            />
            <button
              type="submit"
              :disabled="actionLoading"
              class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
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
              Add
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Funds Table -->
    <div
      class="custom-scrollbar overflow-x-auto rounded-xl border border-gray-300 bg-white/5 backdrop-blur-sm dark:border-white/10"
    >
      <table
        class="min-w-full divide-y divide-black/10 text-left dark:divide-white/10"
      >
        <thead class="bg-gray-100 dark:bg-white/5">
          <tr>
            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Reason
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Amount
            </th>
            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
            ></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <!-- Loading Skeleton Rows -->
          <template v-if="loading && fundEntries.length === 0">
            <tr v-for="i in 5" :key="i">
              <td class="px-6 py-4">
                <div class="h-4 w-24 animate-pulse rounded bg-white/10"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 w-48 animate-pulse rounded bg-white/10"></div>
              </td>
              <td class="px-6 py-4 text-right">
                <div
                  class="ml-auto h-4 w-16 animate-pulse rounded bg-white/10"
                ></div>
              </td>
              <td class="px-6 py-4"></td>
            </tr>
          </template>

          <tr
            v-for="entry in fundEntries"
            :key="entry.id"
            class="transition hover:bg-white/[0.02]"
          >
            <td
              class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
            >
              {{ entry.date }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
              {{ entry.reason }}
            </td>
            <td
              class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-white"
            >
              ${{ toVndDot(entry.amount || 0) }}
            </td>
            <td class="px-6 py-4 text-right">
              <button
                @click="deleteEntry(entry.id)"
                :disabled="actionLoading"
                class="rounded-md p-1.5 text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
                title="Delete Entry"
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
            </td>
          </tr>
          <tr v-if="!loading && fundEntries.length === 0">
            <td
              colspan="4"
              class="px-6 py-10 text-center text-sm italic text-gray-500"
            >
              No entries found for this fund.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { IFunds, IFund } from '~/@types';

const { $firestore } = useNuxtApp();
const route = useRoute();
const fundId = route.params.id as string;

const fund = ref<IFunds>();
const fundEntries = ref<IFund[]>([]);
const loading = ref(false);
const actionLoading = ref(false);

const newEntry = reactive({
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  reason: '',
});

const totalAmount = computed(() => {
  return fundEntries.value.reduce((acc, curr) => acc + curr.amount, 0);
});

const loadFundData = async () => {
  loading.value = true;
  try {
    // Get parent fund details
    const res = await $firestore.getByDoc<IFunds>('funds', fundId);
    fund.value = res;

    // Get all data subDocs
    const entries = await $firestore.getSubDocs<IFund>('funds', fundId, 'data');
    fundEntries.value = entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error('Error loading fund data:', error);
  } finally {
    loading.value = false;
  }
};

const addFundEntry = async () => {
  if (typeof newEntry.amount !== 'number' || !newEntry.reason) return;

  actionLoading.value = true;
  try {
    await $firestore.addSubDoc('funds', fundId, 'data', { ...newEntry });
    // Reset form
    newEntry.amount = 0;
    newEntry.reason = '';
    // Reload entries
    await loadFundData();
  } catch (error) {
    console.error('Error adding fund entry:', error);
  } finally {
    actionLoading.value = false;
  }
};

const deleteEntry = async (entryId: string | undefined) => {
  if (!entryId) return;
  if (!confirm('Are you sure you want to delete this entry?')) return;

  actionLoading.value = true;
  try {
    await $firestore.deleteSubDoc('funds', fundId, 'data', entryId);
    await loadFundData();
  } catch (error) {
    console.error('Error deleting fund entry:', error);
  } finally {
    actionLoading.value = false;
  }
};

const handleDeleteFund = async () => {
  if (
    !confirm(
      'Are you sure you want to delete this fund? This will not delete the sub-collections, but this entry will disappear from your main list.',
    )
  )
    return;

  actionLoading.value = true;
  try {
    await $firestore.delete('funds', fundId);
    useRouter().push('/funds/list');
  } catch (error) {
    console.error('Error deleting fund:', error);
  } finally {
    actionLoading.value = false;
  }
};

onMounted(() => {
  loadFundData();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}
</style>
