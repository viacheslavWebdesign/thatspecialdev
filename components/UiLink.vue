<script setup lang="ts">
const props = defineProps<{
  href: string;
}>();
</script>

<template>
  <a
    :href="href"
    class="block text-lg md:text-2xl uppercase font-machina tracking-widest border-solid border-b-[1px] border-slate-200/30 transition-colors relative overflow-hidden group hover:text-black hover:border-red-600/80 pt-1"
  >
    <span><slot /></span>
  </a>
</template>

<style scoped>
a::before {
  @apply bg-red-600/80;
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(100%);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
a:hover::before {
  transform: translateY(0%);
}
a span {
  position: relative;
  z-index: 1;
}
</style>
