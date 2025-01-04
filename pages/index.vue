<template>
  <div class="bg-gradient-to-tr from-black to-zinc-900 fixed inset-0"></div>
  <div
    ref="spotRef"
    class="fixed top-1/2 left-1/2 size-[300px] md:size-3/4 pointer-events-none"
  >
    <Spot />
  </div>
  <div
    ref="languageSwitcherRef"
    class="opacity-0 fixed top-5 lg:top-20 right-5 lg:right-20 z-30"
  >
    <LanguageSwitcher />
  </div>
  <main class="relative z-10 overflow-hidden">
    <div ref="headContainerRef" class="fixed left-0 top-0 w-full z-20">
      <!-- <Intro
        v-if="showIntro"
        ref="headRef"
        @startAnimation="handleStart"
        :isAnimationStopped="isAnimationStopped"
        :pageSlug="slug"
      /> -->
    </div>
    <div class="relative">
      <!-- <div><Services :pageSlug="slug" /></div>
      <div><Experience :pageSlug="slug" /></div>
      <div ref="technologiesRef"><Technologies :pageSlug="slug" /></div>
      <div><Projects :pageSlug="slug" /></div>
      <div ref="contactsRef"><Contacts :pageSlug="slug" /></div> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Intro from "@/blocks/Intro.vue";
import { getPageData } from "@/helpers/getPageData";

const slug: string = "main";

const { data: seoData, error } = await useAsyncData("seoData", () =>
  getPageData(slug)
);

if (seoData.value) {
  const seo = seoData.value[0].yoast_head_json;
  useHead({
    title: seo.title,
    meta: [
      { name: "description", content: seo.description },
      { name: "robots", content: `${seo.robots.index}, ${seo.robots.follow}` },
      { property: "og:title", content: seo.og_title },
      { property: "og:description", content: seo.og_description },
      { property: "og:url", content: seo.og_url },
      { property: "og:type", content: seo.og_type },
      { property: "og:locale", content: seo.og_locale },
      { name: "twitter:card", content: seo.twitter_card },
    ],
  });
}

const headRef = ref<InstanceType<typeof Intro> | null>(null);
const headContainerRef = ref<HTMLElement | null>(null);
const languageSwitcherRef = ref<HTMLElement | null>(null);
const showContent = ref<boolean>(true);
const showIntro = ref<boolean>(true);
const isAnimationStopped = ref<boolean>(false);
const technologiesRef = ref<HTMLElement | null>(null);
const contactsRef = ref<HTMLElement | null>(null);
const spotRef = ref<HTMLElement | null>(null);

const createTimeline = (el: HTMLElement, steps: any[]) => {
  const tl = gsap.timeline({ paused: true });
  steps.forEach((step) => tl.to(el, step));
  return tl;
};

const timelines = {
  technologiesLeave: (el: HTMLElement) =>
    createTimeline(el, [
      { x: "-50%", y: "-50%", opacity: 0, duration: 0.5, ease: "power2.inOut" },
      { x: "-50%", y: "100%", opacity: 0, duration: 0.25 },
    ]),
  technologiesEnterBack: (el: HTMLElement) =>
    createTimeline(el, [
      { x: "-50%", y: "-50%", opacity: 0, duration: 0.25 },
      {
        x: "-50%",
        y: "-50%",
        opacity: 0.4,
        duration: 0.5,
        ease: "power2.inOut",
      },
    ]),
  contactsEnter: (el: HTMLElement) =>
    createTimeline(el, [
      {
        x: "-50%",
        y: "100%",
        filter: "blur(0px)",
        opacity: 0.4,
        duration: 0.25,
      },
      {
        x: "-50%",
        y: "-50%",
        filter: "blur(0px)",
        opacity: 0.4,
        duration: 2,
        ease: "power2.out",
      },
    ]),
  contactsLeaveBack: (el: HTMLElement) =>
    createTimeline(el, [
      {
        x: "-50%",
        y: "-50%",
        filter: "blur(0px)",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      {
        x: "-50%",
        y: "100%",
        filter: "blur(40px)",
        opacity: 0,
        duration: 0.25,
      },
    ]),
};

const animateOut = (): void => {
  const head = headRef.value;
  if (!head) return;

  const {
    titleRef: title,
    textRef: text,
    faceRef: face,
    buttonRef: button,
    buttonBackgroundRef: buttonBackground,
  } = head;
  const buttonLetters = button?.querySelectorAll(".letter");
  const languageSwitcher = languageSwitcherRef.value;
  const headContainer = headContainerRef.value;

  if (
    [
      title,
      text,
      face,
      button,
      buttonBackground,
      buttonLetters,
      languageSwitcher,
      headContainer,
    ].includes(null)
  )
    return;

  button.classList.remove("border-slate-200/30");
  button.classList.add("text-black", "border-red-600/80");
  buttonBackground.classList.remove("translate-y-full");

  gsap.killTweensOf(buttonLetters);
  gsap.to(buttonLetters, { opacity: 1 });

  const tl = gsap.timeline();
  tl.to([title, text, face, languageSwitcher], {
    opacity: 0,
    y: "-50%",
    duration: 0.3,
    stagger: 0.1,
    ease: "power2.in",
  })
    .to(button, {
      y: "-50%",
      x: "-50%",
      top: "50%",
      left: "50%",
      ease: "power2.inOut",
      scale: 1.2,
      duration: 1,
    })
    .to(headContainer, { y: "-100%", duration: 2, ease: "power3.inOut" })
    .to(languageSwitcher, {
      opacity: 1,
      y: "0%",
      duration: 0.3,
      ease: "power2.in",
    })
    .set("body", { overflow: "auto" }, "-=1")
    .add(() => {
      showIntro.value = false;
    });

  isAnimationStopped.value = true;
};

const checkAndSetElements = () => {
  if (
    !headRef.value ||
    !languageSwitcherRef.value ||
    !technologiesRef.value ||
    !contactsRef.value ||
    !spotRef.value
  )
    return false;
  gsap.set(spotRef.value, {
    x: "-50%",
    y: "-50%",
    filter: "blur(40px)",
    opacity: 0.4,
  });
  return true;
};

onMounted(() => {
  gsap.set("body", { overflow: "hidden" });

  if (!checkAndSetElements()) return;

  const button = headRef.value?.buttonRef;
  const languageSwitcher = languageSwitcherRef.value;

  gsap.to(languageSwitcher, {
    opacity: 1,
    delay: 6,
    duration: 1,
    onComplete: () => button?.classList.remove("pointer-events-none"),
  });
});

const handleStart = (): void => {
  showContent.value = false;

  const technologies = technologiesRef.value;
  const contacts = contactsRef.value;
  const spot = spotRef.value;

  ScrollTrigger.create({
    trigger: technologies,
    invalidateOnRefresh: true,
    start: "top center",
    end: "bottom bottom",
    onLeave: () => timelines.technologiesLeave(spot).restart(),
    onEnterBack: () => timelines.technologiesEnterBack(spot).restart(),
  });

  ScrollTrigger.create({
    trigger: contacts,
    invalidateOnRefresh: true,
    start: "top center",
    end: "bottom bottom",
    onEnter: () => timelines.contactsEnter(spot).restart(),
    onLeaveBack: () => timelines.contactsLeaveBack(spot).restart(),
  });
};

watch(showContent, (newVal) => {
  if (!newVal) animateOut();
});
</script>
