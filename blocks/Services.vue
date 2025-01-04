<template>
  <section
    class="pt-20 md:pt-40 relative overflow-hidden"
    ref="servicesSectionRef"
  >
    <div class="w-full max-w-screen-xl px-5 mx-auto" ref="servicesContainerRef">
      <h2
        class="text-4xl md:text-8xl font-bold mb-10 md:mb-32"
        v-html="services.title"
      ></h2>
      <div class="flex gap-6 md:gap-10" ref="servicesRef">
        <ServiceItem
          v-for="(service, index) in services.service"
          :service="service"
          :key="index"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Services, Service } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";

const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const services = ref<Services>({
  title: "",
  service: [] as Service[],
});

const fetchBlockData = async () => {
  const blockAttrs = await getBlockData(
    props.pageSlug,
    "create-block/services"
  );
  if (blockAttrs) {
    services.value.title = blockAttrs.title || "";
    services.value.service = blockAttrs.services.map((service: any) => ({
      title: service.title || "",
      subtitle: service.subtitle || "",
      text: service.text || "",
      texture: service.image?.url || "",
    }));
  }
};

const servicesSectionRef = ref<HTMLElement | null>(null);
const servicesContainerRef = ref<HTMLElement | null>(null);
const servicesRef = ref<HTMLElement | null>(null);

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

onMounted(async () => {
  await fetchBlockData();
  nextTick(() => {
    const servicesSection = servicesSectionRef.value;
    const servicesContainer = servicesContainerRef.value;
    const servicesElement = servicesRef.value;

    if (!servicesSection || !servicesContainer || !servicesElement) return;

    const getScrollAmount = (): number => {
      const servicesWidth: number = servicesElement.scrollWidth;
      const containerStyle = window.getComputedStyle(servicesContainer);
      let containerWidth: number =
        servicesContainer.offsetWidth -
        parseFloat(containerStyle.paddingLeft) -
        parseFloat(containerStyle.paddingRight);
      return -(servicesWidth - containerWidth);
    };

    const tween = gsap.to(servicesElement, {
      x: () => getScrollAmount(),
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: servicesSection,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      invalidateOnRefresh: true,
      scrub: 1,
    });
  });
});
</script>

<style scoped>
h2 :deep(em) {
  @apply text-red-600/80;
}
</style>
