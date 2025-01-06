<script setup lang="ts">
import { getPageMeta } from "@/helpers/getPageMeta";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const { locale } = useI18n();

const languageSwitcherRef = ref<HTMLElement | null>(null);
const showIntro = ref<boolean>(true);
const showContent = ref<boolean>(true);
const headContainerRef = ref<HTMLElement | null>(null);
const spotRef = ref<HTMLElement | null>(null);
const technologiesRef = ref<HTMLElement | null>(null);
const contactsRef = ref<HTMLElement | null>(null);
const slug: string = "main";

const { data: meta } = useAsyncData("pageMeta", async () => {
  return await getPageMeta(slug, locale.value);
});

if (meta.value) {
  useHead({
    title: meta.value.title,
    meta: [
      { name: "description", content: meta.value.description },
      {
        name: "robots",
        content: `${meta.value.robots.index}, ${meta.value.robots.follow}`,
      },
      { property: "og:title", content: meta.value.og_title },
      { property: "og:description", content: meta.value.og_description },
      { property: "og:url", content: meta.value.og_url },
      { property: "og:type", content: meta.value.og_type },
      { property: "og:locale", content: meta.value.og_locale },
      { name: "twitter:card", content: meta.value.twitter_card },
    ],
  });
}

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
  const languageSwitcher = languageSwitcherRef.value;
  const headContainer = headContainerRef.value;

  if (!languageSwitcher || !headContainer) return;

  const tl = gsap.timeline();
  tl.to(languageSwitcher, {
    opacity: 0,
    y: "-50%",
    duration: 0.3,
    stagger: 0.1,
    ease: "power2.in",
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
};

const checkAndSetElements = () => {
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
  const languageSwitcher = languageSwitcherRef.value;
  if (!languageSwitcher) return;
  gsap.to(languageSwitcher, {
    opacity: 1,
    delay: 6,
    duration: 1,
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

<template>
  <div class="bg-gradient-to-tr from-black to-zinc-900 fixed inset-0"></div>
  <div
    ref="spotRef"
    class="fixed top-1/2 left-1/2 size-[300px] md:size-[80%] pointer-events-none"
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
      <Intro v-if="showIntro" :pageSlug="slug" @startAnimation="handleStart" />
    </div>
    <div class="relative">
      <div><Services :pageSlug="slug" /></div>
      <div><Experience :pageSlug="slug" /></div>
      <div ref="technologiesRef"><Technologies :pageSlug="slug" /></div>
      <div><Projects :pageSlug="slug" /></div>
      <div ref="contactsRef"><Contacts :pageSlug="slug" /></div>
    </div>
  </main>
</template>
