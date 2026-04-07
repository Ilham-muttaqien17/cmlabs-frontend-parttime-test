<script setup lang="ts"></script>
<template>
  <div class="relative block w-full">
    <AppNavbar />
    <main class="mt-8 relative flex justify-center py-6">
      <div class="relative w-full">
        <slot />
      </div>
    </main>
  </div>
</template>
