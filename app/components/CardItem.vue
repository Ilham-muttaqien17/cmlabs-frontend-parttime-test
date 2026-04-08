<script setup lang="ts">
interface Props {
  title: string;
  path: string;
  thumbnail: string;
}

const props = defineProps<Props>();
</script>
<template>
  <div
    class="relative flex justify-center cursor-pointer transition-all duration-200 hover:scale-105"
    @click="navigateTo(props.path)"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 z-10 bg-black opacity-50 rounded-2xl flex justify-center items-center"></div>

    <!-- Title -->
    <span
      class="absolute inset-0 text-2xl flex justify-center items-center text-white font-semibold z-20 text-center"
    >
      {{ props.title }}
    </span>

    <!-- Thumbnail -->
    <NuxtImg
      :src="props.thumbnail"
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
