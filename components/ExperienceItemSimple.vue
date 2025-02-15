<script setup lang="ts">
import type { Job } from "@/helpers/interfaces";
const props = defineProps<{ job: Job }>();
const { t } = useI18n;
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const experienceItemRef = ref<HTMLElement | null>(null);
let scrollTriggerInstance: ScrollTrigger | null = null;

onMounted(() => {
  const experienceItem = experienceItemRef.value;
  if (experienceItem) {
    gsap.set(experienceItem, { y: "20%", opacity: 0, scale: 0.9 });

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: experienceItem,
      start: "top bottom",
      end: "top center",
      scrub: true,
      animation: gsap.to(experienceItem, { y: "0%", opacity: 1, scale: 1 }),
    });
  }
});

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
});
</script>

<template>
  <div
    class="flex flex-col md:flex-row gap-6 md:gap-10"
    ref="experienceItemRef"
  >
    <div class="w-full md:w-2/3 mx-auto">
      <div class="flex font-bold gap-2 mb-2 md:mb-6">
        <h3 class="text-2xl md:text-4xl">{{ job.title }}</h3>
        <p class="text-slate-100/70 font-machina text-base md:text-lg">
          {{ job.date }}
        </p>
      </div>
      <h5 class="font-medium md:text-lg mb-1 md:mb-2">
        {{ $t("responsibilities") }}
      </h5>
      <div
        v-html="job.responsibilities"
        class="mb-2 md:mb-4 text-sm md:text-base experience-content text-slate-100/70 max-w-[900px]"
      ></div>
      <h5 class="font-medium md:text-lg mb-1 md:mb-2">{{ $t("projects") }}</h5>
      <div class="flex flex-wrap gap-x-4 max-w-[700px]">
        <a
          v-for="(project, index) in job.projects"
          :key="index"
          :href="project.link"
          `
          target="_blank"
          class="h-8 w-24 relative transition-opacity hover:opacity-30"
          ><NuxtImg
            width="96"
            haight="32"
            loading="lazy"
            :src="project.image"
            class="top-0 left-0 w-full h-full absolute object-contain object-center"
        /></a>
      </div>
    </div>
  </div>
</template>
