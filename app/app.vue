<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? title + ' | MEALAPP' : 'MEALAPP')
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
