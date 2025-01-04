<template>
  <section
    class="relative overflow-hidden bg-gradient-to-tr from-black to-zinc-900"
  >
    <div
      class="size-[300px] md:size-2/3 blur-2xl absolute top-0 left-0 lg:bottom-0 lg:top-auto lg:left-auto lg:right-[5%] -translate-x-1/3 lg:translate-x-1/3 -translate-y-1/3 lg:translate-y-1/3 opacity-60 pointer-events-none"
    >
      <Spot />
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
            @mouseenter="stopAnimation"
            @mouseleave="resumeAnimation"
            @click="handleStart"
            ref="buttonRef"
            class="text-lg md:text-2xl uppercase font-machina tracking-widest border-solid border-b-[1px] border-slate-200/30 transition-colors absolute overflow-hidden group hover:text-black hover:border-red-600/80 pt-1 opacity-0 whitespace-nowrap pointer-events-none"
          >
            <div
              ref="buttonBackgroundRef"
              class="absolute bottom-0 left-0 size-full bg-red-600/80 translate-y-full transition-transform group-hover:translate-y-0"
            ></div>
            <span
              v-for="(char, index) in head.button"
              :key="index"
              class="letter relative z-[1]"
            >
              {{ char }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import type { Head } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";

const props = defineProps({
  isAnimationStopped: {
    type: Boolean,
  },
  pageSlug: {
    type: String,
    required: true,
  },
});

const isAnimationStopped = computed(() => props.isAnimationStopped);

const faceRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const buttonBackgroundRef = ref<HTMLElement | null>(null);
const buttonContainerRef = ref<HTMLElement | null>(null);
const buttonHeightRef = ref<number>(0);
const titleRef = ref<HTMLElement | null>(null);
const titleContainerRef = ref<HTMLElement | null>(null);
const titleHeightRef = ref<number>(0);
const textRef = ref<HTMLElement | null>(null);

const head = ref<Head>({
  title: "",
  text: "",
  button: "",
});

const fetchBlockData = async () => {
  const blockAttrs = await getBlockData(props.pageSlug, "create-block/intro");
  if (blockAttrs) {
    head.value = {
      title: blockAttrs.title || "",
      text: blockAttrs.text || "",
      button: blockAttrs.buttonText || "",
    };
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

const animateLetters = (letters: NodeListOf<HTMLElement>) => {
  if (isAnimationStopped.value) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  tl.fromTo(
    letters,
    { opacity: 1 },
    {
      opacity: 0.4,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.inOut",
    }
  ).to(
    letters,
    {
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.inOut",
    },
    "-=1.4"
  );
};

const updateHeight = () => {
  if (titleRef.value) {
    titleHeightRef.value = titleRef.value.offsetHeight;
  }
  if (buttonRef.value) {
    buttonHeightRef.value = buttonRef.value.offsetHeight;
  }
};

const stopAnimation = (ev: MouseEvent) => {
  if (!buttonRef.value) return;
  const letters = buttonRef.value.querySelectorAll<HTMLElement>(".letter");
  gsap.killTweensOf(letters);
  gsap.to(letters, {
    opacity: 1,
  });
};

const resumeAnimation = (ev: MouseEvent) => {
  if (!buttonRef.value) return;
  const letters = buttonRef.value.querySelectorAll<HTMLElement>(".letter");
  if (!isAnimationStopped.value) {
    animateLetters(letters);
  }
};

onMounted(async () => {
  await fetchBlockData();
  updateHeight();
  window.addEventListener("resize", updateHeight);

  const title = titleRef.value;
  const text = textRef.value;
  const button = buttonRef.value;
  const face = faceRef.value;

  if (!title || !text || !button || !face) return;

  const letters = button.querySelectorAll<HTMLElement>(".letter");
  animateLetters(letters);

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
      },
      {
        opacity: 1,
        y: 0,
        ease: "power4.out",
        delay: 4,
        duration: 1.5,
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

onUpdated(() => {
  updateHeight();
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

defineExpose({
  titleRef,
  textRef,
  faceRef,
  buttonRef,
  buttonBackgroundRef,
});

onBeforeUnmount(() => {
  stopAllAnimations();
});
</script>

<style scoped>
h1 :deep(em) {
  @apply text-red-600/80;
}
p :deep(strong) {
  @apply font-sans text-slate-100 font-semibold;
}
</style>
