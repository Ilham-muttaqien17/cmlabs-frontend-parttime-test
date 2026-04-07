<script setup lang="ts">
import type { DetailMeal } from '~/types/food';

const route = useRoute();
const foodStore = useFood();

const mealId = computed(() => route.params.id as string);
const ingredientName = computed(() => route.query.ingredientName as string);
const ingredientTitle = computed(() => route.query.ingredientTitle as string);
const mealTitle = computed(() => route.query.mealTitle as string);

const loading = ref(true);
const detailMeal = ref<DetailMeal>();

useHead({
  title: 'Detail of '.concat(mealTitle.value)
});

const fetchDetail = async () => {
  try {
    loading.value = true;

    const response = await foodStore.fetchDetailMealById(mealId.value);

    detailMeal.value = response;
  } catch (error) {
    // todo
  } finally {
    loading.value = false;
  }
};

const breadcrumbs = ref<{ label: string; path: string | null }[]>([
  { label: 'Home', path: '/' },
  { label: 'Foods', path: '#' },
  {
    label: ingredientTitle.value,
    path: `/meals??ingredientName=${ingredientName.value}&ingredientTitle=${ingredientTitle.value}`
  },
  {
    label: mealTitle.value,
    path: null
  }
]);

const getYoutubeEmbed = (url: string | undefined) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const id = parsed.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : '';
  } catch {
    return '';
  }
};

watch(() => mealId.value, fetchDetail, { immediate: true });
</script>
<template>
  <div class="flex flex-col gap-8 w-[90%] mx-auto py-6">
    <UiBreadcrumb>
      <UiBreadcrumbList>
        <template v-for="(breadcrumb, k) in breadcrumbs" :key="`breadcrumb-${k}`">
          <template v-if="k !== breadcrumbs.length - 1">
            <UiBreadcrumbItem>
              <UiBreadcrumbLink :href="breadcrumb.path">{{ breadcrumb.label }} </UiBreadcrumbLink>
            </UiBreadcrumbItem>
            <UiBreadcrumbSeparator />
          </template>
          <UiBreadcrumbPage v-else class="text-gray-400">{{ breadcrumb.label }}</UiBreadcrumbPage>
        </template>
      </UiBreadcrumbList>
    </UiBreadcrumb>

    <h1 class="text-3xl sm:text-4xl">{{ mealTitle }}</h1>

    <hr class="w-full text-gray-200" />

    <!-- Skeleton -->
    <div v-if="loading" class="flex flex-col gap-6 w-full">
      <UiSkeleton class="w-24 h-4 bg-gray-300" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <UiSkeleton class="rounded-xl w-full h-80 bg-gray-300" />
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4">
            <h2 class="text-2xl font-semibold">Instructions</h2>
            <!-- <UiSkeleton class="rounded-xl w-24 h-4 bg-gray-300" /> -->
            <UiSkeleton class="rounded-xl w-full h-4 bg-gray-300" />
            <UiSkeleton class="rounded-xl w-full h-4 bg-gray-300" />
            <UiSkeleton class="rounded-xl w-full h-4 bg-gray-300" />
            <UiSkeleton class="rounded-xl w-full h-4 bg-gray-300" />
          </div>
          <div class="flex flex-col gap-4">
            <h2 class="text-2xl font-semibold">Receipts</h2>
            <!-- <UiSkeleton class="rounded-xl w-24 h-4 bg-gray-300" /> -->
            <ul class="list-disc ml-4">
              <li v-for="(_, k) in 5" :key="`receipt-${k}`">
                <UiSkeleton class="rounded-xl w-28 h-4 bg-gray-300" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center gap-4 mt-6">
        <h2 class="text-2xl font-semibold">Tutorials</h2>
        <UiSkeleton class="rounded-xl w-full h-50 sm:h-100 bg-gray-300" />
      </div>
    </div>

    <!-- Content -->
    <div v-else class="flex flex-col gap-6 w-full">
      <span class="text-red-400 font-semibold">{{ detailMeal?.area }} Culinary</span>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <NuxtImg
          :src="detailMeal?.thumbnail"
          quality="80"
          class="rounded-xl w-full h-50 sm:h-100 object-cover"
        />
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4">
            <h2 class="text-2xl font-semibold">Instructions</h2>
            <p class="whitespace-pre-wrap">{{ detailMeal?.instructions }}</p>
          </div>
          <div class="flex flex-col gap-4">
            <h2 class="text-2xl font-semibold">Receipts</h2>
            <ul class="list-disc ml-4">
              <li v-for="(receipt, k) in detailMeal?.receipts" :key="`receipt-${k}`">{{ receipt }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center gap-4 mt-6">
        <h2 class="text-2xl font-semibold">Tutorials</h2>
        <iframe :src="getYoutubeEmbed(detailMeal?.youtubeSrc)" class="w-full h-50 sm:h-100" allowfullscreen />
      </div>
    </div>
  </div>
</template>
