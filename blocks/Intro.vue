<script setup lang="ts">
import type { Head } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";
import { gsap } from "gsap";

const { locale } = useI18n();

const faceRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const buttonContainerRef = ref<HTMLElement | null>(null);
const buttonBackgroundRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const titleContainerRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const buttonHeightRef = ref<number>(0);
const titleHeightRef = ref<number>(0);

const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const { data: introData } = await useAsyncData("introData", () =>
  getBlockData(props.pageSlug, locale.value, "create-block/intro")
);

const head = ref<Head>({
  title: introData.value.title,
  text: introData.value.text,
  button: introData.value.buttonText,
});

const updateHeight = () => {
  if (titleRef.value) {
    titleHeightRef.value = titleRef.value.offsetHeight;
  }
  if (buttonRef.value) {
    buttonHeightRef.value = buttonRef.value.offsetHeight;
  }
};

const stopAllAnimations = (): void => {
  gsap.killTweensOf([
    titleRef.value,
    textRef.value,
    faceRef.value,
    buttonRef.value,
    buttonBackgroundRef.value,
  ]);
};

onMounted(() => {
  updateHeight();
  window.addEventListener("resize", updateHeight);
  const title = titleRef.value;
  const text = textRef.value;
  const button = buttonRef.value;
  const face = faceRef.value;

  if (!title || !text || !button || !face) return;

  const tl = gsap.timeline();

  tl.fromTo(
    title,
    {
      y: "-50%",
      x: "-50%",
      top: "50%",
      left: "50%",
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    }
  )
    .to(
      title,
      {
        y: "-0%",
        x: "-0%",
        top: "auto",
        left: "auto",
        duration: 2,
        ease: "power2.inOut",
      },
      "+=1"
    )
    .fromTo(
      text,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        ease: "power4.out",
        delay: 3.5,
        duration: 1.5,
      },
      0
    )
    .fromTo(
      button,
      {
        opacity: 0,
        y: 100,
        pointerEvents: "none",
      },
      {
        opacity: 1,
        y: 0,
        ease: "power4.out",
        delay: 4,
        duration: 1.5,
        onComplete: () => {
          gsap.set(button, {
            pointerEvents: "auto",
          });
        },
      },
      0
    )
    .fromTo(
      face,
      { y: "-100vh" },
      {
        y: "10vh",
        duration: 1.75,
        ease: "power1.inOut",
        delay: 4,
      },
      0
    )
    .to(face, {
      y: "0",
      duration: 1,
      ease: "power3.Out",
    });
});

watch(titleHeightRef, (newHeight) => {
  if (titleContainerRef.value) {
    titleContainerRef.value.style.height = `${newHeight}px`;
  }
});

watch(buttonHeightRef, (newHeight) => {
  if (buttonContainerRef.value) {
    buttonContainerRef.value.style.height = `${newHeight}px`;
  }
});

const emit = defineEmits<{
  (event: "startAnimation"): void;
}>();

const handleStart = () => {
  emit("startAnimation");
};

onBeforeUnmount(() => {
  stopAllAnimations();
});
</script>

<template>
  <section
    class="relative overflow-hidden bg-gradient-to-tr from-black to-zinc-900"
  >
    <div
      class="size-[300px] md:size-[80%] blur-2xl absolute top-0 left-0 lg:bottom-0 lg:top-auto lg:left-auto lg:right-[5%] -translate-x-1/3 lg:translate-x-1/3 -translate-y-1/3 lg:translate-y-1/3 opacity-60 pointer-events-none"
    >
      <!-- <Spot /> -->
    </div>
    <div
      class="size-[200px] md:size-[400px] lg:size-[700px] absolute top-[20%] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 lg:left-3/4"
    >
      <div class="size-full" ref="faceRef"><Face /></div>
    </div>
    <div
      class="w-full max-w-screen-xl px-5 mx-auto min-h-svh flex items-end lg:items-center pb-16 md:pb-32 lg:pb-0 relative z-[1]"
    >
      <div class="md:max-w-3xl">
        <div class="mb-4 md:mb-10" ref="titleContainerRef">
          <h1
            ref="titleRef"
            class="text-5xl md:text-9xl font-bold absolute opacity-0"
            v-html="head.title"
          ></h1>
        </div>
        <p
          ref="textRef"
          class="text-lg md:text-2xl text-slate-100/70 font-light font-machina mb-16 md:mb-20 lg:mb-28 opacity-0"
          v-html="head.text"
        ></p>
        <div ref="buttonContainerRef">
          <button
            @click="handleStart"
            ref="buttonRef"
            class="text-lg md:text-2xl uppercase font-machina tracking-widest border-solid border-b-[1px] border-slate-200/30 transition-colors absolute overflow-hidden group hover:text-black hover:border-red-600/80 pt-1 opacity-0 whitespace-nowrap"
          >
            <div
              ref="buttonBackgroundRef"
              class="absolute bottom-0 left-0 size-full bg-red-600/80 translate-y-full transition-transform group-hover:translate-y-0"
            ></div>
            <span class="relative z-[1]" v-html="head.button"></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
h1 :deep(em) {
  color: rgb(220 38 38 / 0.8);
}
p :deep(strong) {
  font-family: TT Interfaces, sans-serif;
  --tw-text-opacity: 1;
  color: rgb(241 245 249 / var(--tw-text-opacity, 1));
  font-weight: 600;
}
</style>
