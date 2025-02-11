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
const slug: string = "main";

const meta = useState("pageMeta", () => null);

const { data } = await useAsyncData("pageMeta", async () => {
  return await getPageMeta(slug, locale.value);
});

if (process.server) {
  meta.value = data.value;
}

const pageTitle = computed(() => meta.value?.title || "That Special Developer");

useHead({
  title: pageTitle,
  meta: computed(() => [
    {
      name: "description",
      content: meta.value?.description || "Default description",
    },
    {
      name: "robots",
      content: meta.value
        ? `${meta.value.robots.index}, ${meta.value.robots.follow}`
        : "noindex, nofollow",
    },
    {
      property: "og:title",
      content: meta.value?.og_title || "That Special Developer",
    },
    {
      property: "og:description",
      content: meta.value?.og_description || "Default OG description",
    },
    { property: "og:url", content: meta.value?.og_url || "/" },
    { property: "og:type", content: meta.value?.og_type || "website" },
    { property: "og:locale", content: meta.value?.og_locale || "en_US" },
    {
      name: "twitter:card",
      content: meta.value?.twitter_card || "summary_large_image",
    },
  ]),
});

const animateOut = (): void => {
  const languageSwitcher = languageSwitcherRef.value;
  const headContainer = headContainerRef.value;

  if (!languageSwitcher || !headContainer) return;

  const tl = gsap.timeline();
  tl.to(languageSwitcher, {
    opacity: 0,
    y: "-50%",
    duration: 0.3,
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
};

watch(showContent, (newVal) => {
  if (!newVal) animateOut();
});
</script>

<template>
  <div class="bg-gradient-to-tr from-black to-zinc-900 fixed inset-0"></div>
  <div
    class="fixed top-1/3 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] blur-3xl md:size-[40%] pointer-events-none opacity-15 bg-red-600/80 rounded-full"
  ></div>
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
      <div><Technologies :pageSlug="slug" /></div>
      <div><Projects :pageSlug="slug" /></div>
      <div><Contacts :pageSlug="slug" /></div>
    </div>
  </main>
</template>
