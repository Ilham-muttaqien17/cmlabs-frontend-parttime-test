<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { Ingredient } from '~/types/food';

const foodStore = useFood();
const loading = ref(true);
const ingredients = ref<Ingredient[]>([]);
const allIngredients = ref<Ingredient[]>([]);

async function fetchMeals() {
  try {
    loading.value = true;
    await useTimeout(150);

    const result = await foodStore.fetchAllIngredients();

    ingredients.value = result;
    allIngredients.value = result;
  } catch (error) {
    // todo
  } finally {
    loading.value = false;
  }
}

const debouncedSearch = useDebounceFn((keyword: any) => {
  ingredients.value = allIngredients.value.filter((val) =>
    val.title.toLowerCase().includes(keyword.toLowerCase())
  );
}, 350);

onMounted(fetchMeals);
</script>
<template>
  <div class="flex flex-col gap-6">
    <!-- Hero section -->
    <div class="flex flex-col justify-center items-center gap-6 w-full bg-gray-100 h-72">
      <div class="flex items-center gap-2 text-orange-600">
        <NuxtIcon name="tabler:soup-filled" />
        <NuxtIcon name="bxs:bowl-rice" />
        <NuxtIcon name="bxs:cookie" />
      </div>
      <span class="font-semibold text-slate-700 text-center">mealapp API website</span>
      <h1 class="text-3xl sm:text-4xl font-semibold text-slate-700 text-center">
        See All The Delicious Foods
      </h1>
    </div>

    <div class="w-[90%] mx-auto flex flex-col gap-6">
      <div class="relative w-full items-center">
        <UiInput
          id="search"
          type="text"
          placeholder="Search ingredient..."
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
          <CardSkeleton v-for="(_, k) in 9" :key="`skeleton-${k}`" />
        </template>
        <template v-else-if="!loading && ingredients.length === 0">
          <span>No ingredient found.</span>
        </template>
        <template v-else>
          <CardItem
            v-for="(ingredient, k) in ingredients"
            :key="`ingredient-${k}`"
            :title="ingredient.title"
            :path="`/meals?ingredientName=${ingredient.name}&ingredientTitle=${ingredient.title}`"
            :thumbnail="ingredient.thumbnail"
          />
        </template>
      </div>
    </div>
  </div>
</template>
