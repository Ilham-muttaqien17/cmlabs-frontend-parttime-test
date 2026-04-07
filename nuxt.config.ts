// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  modules: ['shadcn-nuxt', '@nuxt/eslint', '@nuxt/icon', '@nuxt/image'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    build: { sourcemap: true },
    optimizeDeps: {
      include: ['@vueuse/core', 'clsx', 'tailwind-merge', 'radix-vue', 'lucide-vue-next']
    }
  },
  shadcn: {
    prefix: 'ui',
    componentDir: './app/components/ui'
  },
  icon: {
    mode: 'css',
    cssLayer: 'base',
    componentName: 'NuxtIcon',
    size: '16',
    serverBundle: {
      collections: ['tabler', 'bxs']
    }
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  }
});
