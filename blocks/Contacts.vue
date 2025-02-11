<script setup lang="ts">
import type { Slide, Details, Requisites } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";
import * as THREE from "three";
const { locale } = useI18n();

const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const { data: contactsData } = await useAsyncData("contactsData", () =>
  getBlockData(props.pageSlug, locale.value, "create-block/contacts")
);

const slides = contactsData.value.slides.map((slide: Slide) => ({
  text: slide.text,
  highlighted: slide.highlighted || false,
}));

const details = ref<Details>({
  texture: contactsData.value.details.image.url,
  requisites: contactsData.value.details.requisites.map((req: Requisites) => ({
    type: req.type,
    link: req.link,
  })),
});

const slidesSectionRef = ref<HTMLElement | null>(null);
const slidesRef = ref<HTMLElement | null>(null);
const detailsRef = ref<HTMLElement | null>(null);

const groupRotationRef = ref(new THREE.Euler(0, 0, 0));
let groupRotation = groupRotationRef.value;
const handleGroupRotation = (rotation: THREE.Euler) => {
  groupRotation = rotation;
};

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  nextTick(() => {
    const slidesSection = slidesSectionRef.value;
    const slides = slidesRef.value;
    const details = detailsRef.value;

    if (!slides || !slidesSection || !details) return;

    const getScrollAmount = (): number => {
      const slidesWidth: number = slides.scrollWidth;
      const sectionWidth: number = slidesSection.clientWidth;
      return slidesWidth - sectionWidth;
    };

    const tween = gsap.to(slides, {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: slidesSection,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      animation: tween,
      invalidateOnRefresh: true,
      scrub: 1,
    });
    ScrollTrigger.create({
      trigger: details,
      start: "top bottom",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      scrub: 1,
      onUpdate: (self) => {
        const rotationAmount = self.progress * 360;
        const radians = THREE.MathUtils.degToRad(rotationAmount);
        groupRotation.set(radians, 0, 0);
      },
    });
  });
});
</script>

<template>
  <section class="relative overflow-hidden" ref="slidesSectionRef">
    <div class="flex" ref="slidesRef">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="h-[100vh] h-svh w-screen flex items-center flex-none"
      >
        <div class="w-full max-w-screen-xl px-5 mx-auto relative">
          <h2
            class="text-6xl md:text-[12rem] font-bold text-center"
            :class="{ 'text-red-600/80': slide.highlighted }"
          >
            {{ slide.text }}
          </h2>
        </div>
      </div>
    </div>
  </section>
  <section class="relative overflow-hidden" ref="detailsRef">
    <div class="h-[100vh] h-svh w-screen flex items-center flex-none relative">
      <div
        class="w-full max-w-screen-xl px-5 mx-auto relative -translate-y-1/4 md:translate-y-0"
      >
        <Card
          v-if="details.texture"
          :texture="details.texture"
          @groupRotation="handleGroupRotation"
        />
      </div>
      <div
        class="flex flex-col md:flex-row w-full items-center justify-center gap-4 md:gap-16 absolute left-0 bottom-[10%] md:bottom-[15%] z-[1]"
      >
        <UiLink
          target="_blank"
          v-for="(requisite, index) in details.requisites"
          :href="requisite.link"
          :key="index"
          >{{ requisite.type }}</UiLink
        >
      </div>
    </div>
  </section>
</template>
