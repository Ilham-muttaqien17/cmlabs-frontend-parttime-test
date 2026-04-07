<script setup lang="ts">
type Menu = { lable: string; path: string };

const menus: Menu[] = [
  { lable: 'Home', path: '/' },
  { lable: 'Foods', path: '/' },
  { lable: 'Ingredients', path: '/' }
];
</script>
<template>
  <nav class="fixed inset-x-0 top-0 py-3 shadow-xs flex justify-center z-50 bg-white">
    <div class="w-[90%] flex items-center gap-x-4 justify-between">
      <NuxtLink to="/" class="font-semibold text-2xl">mealapp</NuxtLink>
      <div class="flex items-center gap-x-4 text-xs sm:text-sm font-semibold">
        <NuxtLink v-for="(menu, k) in menus" :key="`menu-${k}`" :to="menu.path">{{ menu.lable }}</NuxtLink>
      </div>
    </div>
  </nav>
</template>
