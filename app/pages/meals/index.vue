<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { Meal } from '~/types/food';

const route = useRoute();
const foodStore = useFood();

const loading = ref(true);
const ingredientName = computed(() => route.query.ingredientName as string);
const ingredientTitle = computed(() => route.query.ingredientTitle as string);
const meals = ref<Meal[]>([]);
const allMeals = ref<Meal[]>([]);

useHead({
  title: 'List foods of '.concat(ingredientName.value)
});

async function fetchMealByName(name: string) {
  try {
    loading.value = true;
    await useTimeout(150);

    const result = await foodStore.fetchMealsByIngredienName(name);

    meals.value = result;
    allMeals.value = result;
  } catch (error) {
    // todo
  } finally {
    loading.value = false;
  }
}

const breadcrumbs = ref<{ label: string; path: string | null }[]>([
  { label: 'Home', path: '/' },
  { label: 'Foods', path: '#' },
  { label: ingredientTitle.value, path: null }
]);

const debouncedSearch = useDebounceFn((keyword: any) => {
  meals.value = allMeals.value.filter((val) => val.title.toLowerCase().includes(keyword.toLowerCase()));
}, 350);

watch(
  () => ingredientName.value,
  (val) => fetchMealByName(val),
  { immediate: true }
);
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

    <h1 class="text-4xl">{{ ingredientTitle }}</h1>

    <hr class="w-full text-gray-200" />
    <div class="relative w-full items-center">
      <UiInput
        id="search"
        type="text"
        placeholder="Search meal..."
        class="pl-10 rounded-full border-gray-200 focus:ring-gray-300"
        @update:model-value="debouncedSearch"
      />
      <span class="absolute inset-s-0 inset-y-0 flex items-center justify-center px-2">
        <NuxtIcon name="tabler:search" class="size-6 text-gray-400" />
      </span>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <template v-if="loading">
        <div v-for="(_, k) in 9" :key="`skeleton-${k}`" class="relative flex">
          <UiSkeleton class="w-full h-50 rounded-2xl bg-gray-300 flex justify-center" />
          <span
            class="absolute inset-0 text-2xl flex justify-center items-center text-white font-semibold z-20"
          >
            Loading...
          </span>
        </div>
      </template>
      <template v-else-if="!loading && meals.length === 0">
        <span>No meal found.</span>
      </template>
      <template v-else>
        <div
          v-for="(meal, k) in meals"
          :key="`meal-${k}`"
          class="relative flex justify-center cursor-pointer transition-all duration-200 hover:scale-105"
          @click="
            navigateTo(
              `/meals/${meal.id}?ingredientName=${ingredientName}&ingredientTitle=${ingredientTitle}&mealTitle=${meal.title}`
            )
          "
        >
          <!-- Overlay -->
          <div
            class="absolute inset-0 z-10 bg-black opacity-50 rounded-2xl flex justify-center items-center"
          ></div>

          <!-- Title -->
          <span
            class="absolute inset-0 text-2xl flex justify-center items-center text-white font-semibold z-20 text-center"
          >
            {{ meal.title }}
          </span>

          <!-- Thumbnail -->
          <NuxtImg
            :src="meal.thumbnail"
            :quality="80"
            height="200"
            width="200"
            class="self-center"
            v-slot="{ isLoaded, src, imgAttrs }"
          >
            <img v-if="isLoaded" v-bind="imgAttrs" :src="src" />
            <img v-else src="https://placehold.co/200x200" alt="placeholder" />
          </NuxtImg>
        </div>
      </template>
    </div>
  </div>
</template>
