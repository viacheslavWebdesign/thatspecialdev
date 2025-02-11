<script setup lang="ts">
import type { Service } from "@/helpers/interfaces";
const props = defineProps<{ service: Service }>();
const boundingRef = ref<DOMRect | null>(null);

const cardEnter = (ev: MouseEvent) => {
  boundingRef.value = (ev.currentTarget as HTMLElement).getBoundingClientRect();
};

const cardAnimation = (ev: MouseEvent) => {
  if (!boundingRef.value) return;
  const x = ev.clientX - boundingRef.value.left;
  const y = ev.clientY - boundingRef.value.top;
  const xPercentage = x / boundingRef.value.width;
  const yPercentage = y / boundingRef.value.height;

  ev.currentTarget.style.setProperty("--x", `${xPercentage * 100}%`);
  ev.currentTarget.style.setProperty("--y", `${yPercentage * 100}%`);
};

const cardLeave = (ev: MouseEvent) => {
  boundingRef.value = null;
};
</script>

<template>
  <div
    @mouseenter="cardEnter"
    @mousemove="cardAnimation"
    @mouseleave="cardLeave"
    class="md:flex gap-12 px-8 py-10 md:px-14 md:py-16 bg-white/5 rounded-2xl shadow-xl border border-slate-100/10 relative group overflow-hidden w-full md:w-1/2 flex-none"
  >
    <NuxtImg
      loading="lazy"
      :src="service.texture"
      width="224"
      height="224"
      class="size-48 md:size-56 flex-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 z-[1] group-hover:translate-x-[15%] group-hover:translate-y-[15%] transition-transform ease-in-out duration-300"
    ></NuxtImg>
    <div class="relative z-[1]">
      <h3 class="font-machina font-bold text-2xl md:text-4xl mb-2 md:mb-4">
        {{ service.title }}
      </h3>
      <p v-if="service.subtitle" class="mb-2 md:mb-4 text-red-600/80">
        {{ service.subtitle }}
      </p>
      <p class="font-machina text-slate-100/70 max-w-96">
        {{ service.text }}
      </p>
    </div>
    <div
      class="absolute inset-0 group-hover:bg-[radial-gradient(at_var(--x)_var(--y),rgba(220,38,38,0.2)_20%,transparent_80%)] pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>
  </div>
</template>
