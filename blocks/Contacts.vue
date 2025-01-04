<template>
  <section class="relative overflow-hidden" ref="contactsSectionRef">
    <div class="flex" ref="contactsRef">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="h-svh w-screen flex items-center flex-none"
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
      <div class="h-svh w-screen flex items-center flex-none relative">
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
            >{{ requisite.type }}</UiLink
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Slide, Details, Requisites } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";
import * as THREE from "three";

const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const slides = ref<Slide[]>([]);

const details = ref<Details>({
  texture: "",
  requisites: [] as Requisites[],
});

const fetchBlockData = async () => {
  const blockAttrs = await getBlockData(
    props.pageSlug,
    "create-block/contacts"
  );

  if (blockAttrs) {
    slides.value = blockAttrs.slides.map((slide: any) => ({
      text: slide.text,
      highlighted: slide.highlighted || false,
    }));

    details.value.texture = blockAttrs.details.image.url || "";
    details.value.requisites = blockAttrs.details.requisites.map(
      (req: any) => ({
        type: req.type,
        link: req.link,
      })
    );
  }
};

const contactsSectionRef = ref<HTMLElement | null>(null);
const contactsRef = ref<HTMLElement | null>(null);

const groupRotationRef = ref(new THREE.Euler(0, 0, 0));
let groupRotation = groupRotationRef.value;
const handleGroupRotation = (rotation: THREE.Euler) => {
  groupRotation = rotation;
};

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

onMounted(async () => {
  await fetchBlockData();
  const contactsSection = contactsSectionRef.value;
  const contacts = contactsRef.value;

  if (!contacts || !contactsSection) return;

  const getScrollAmount = (): number => {
    const contactsWidth: number = contacts.scrollWidth;
    const sectionWidth: number = contactsSection.clientWidth;
    return contactsWidth - sectionWidth;
  };

  const tween = gsap.to(contacts, {
    x: () => -getScrollAmount(),
    ease: "none",
  });

  ScrollTrigger.create({
    trigger: contactsSection,
    start: "top top",
    end: () => `+=${getScrollAmount()}`,
    pin: true,
    animation: tween,
    invalidateOnRefresh: true,
    scrub: 1,
    onUpdate: (self) => {
      const lastSlideIndex = slides.length - 1;
      if (self.progress >= lastSlideIndex / slides.length) {
        const rotationAmount = self.progress * 720;
        const radians = THREE.MathUtils.degToRad(rotationAmount);
        groupRotation.set(0, radians, 0);
      }
    },
  });
});
</script>
