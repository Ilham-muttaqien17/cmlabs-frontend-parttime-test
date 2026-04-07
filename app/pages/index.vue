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
      <h1 class="text-4xl font-semibold text-slate-700 text-center">See All The Delicious Foods</h1>
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
          <div v-for="(_, k) in 9" :key="`skeleton-${k}`" class="relative flex">
            <UiSkeleton class="w-full h-50 rounded-2xl bg-gray-300 flex justify-center" />
            <span
              class="absolute inset-0 text-2xl flex justify-center items-center text-white font-semibold z-20"
            >
              Loading...
            </span>
          </div>
        </template>
        <template v-else-if="!loading && ingredients.length === 0">
          <span>No ingredient found.</span>
        </template>
        <template v-else>
          <div
            v-for="(ingredient, k) in ingredients"
            :key="`meal-${k}`"
            class="relative flex justify-center cursor-pointer transition-all duration-200 hover:scale-105"
            @click="
              navigateTo(`/meals?ingredientName=${ingredient.name}&ingredientTitle=${ingredient.title}`)
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
              {{ ingredient.title }}
            </span>

            <!-- Thumbnail -->
            <NuxtImg
              :src="ingredient.thumbnail"
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
  </div>
</template>
