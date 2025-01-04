<template>
  <div class="bg-gradient-to-tr from-black to-zinc-900 fixed inset-0"></div>
  <section
    class="py-20 md:py-40 relative min-h-svh flex items-center z-10 overflow-hidden"
    @mousemove="updateCursorPosition"
  >
    <div
      ref="cursorRef"
      class="size-[300px] md:size-2/3 blur-3xl absolute opacity-60 pointer-events-none"
    >
      <Spot />
    </div>
    <div class="w-full max-w-screen-xl px-5 mx-auto relative z-10">
      <h2
        class="text-4xl md:text-8xl font-bold mb-5 md:mb-20 text-center"
        v-html="er.title"
      ></h2>
      <div class="flex justify-center">
        <NuxtLink
          :to="localPath('/')"
          class="block text-lg md:text-2xl uppercase font-machina tracking-widest border-solid border-b-[1px] border-slate-200/30 transition-colors relative overflow-hidden group hover:text-black hover:border-red-600/80 pt-1"
          ><span v-html="er.button"></span
        ></NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ErrorPage } from "@/helpers/interfaces";
import { gsap } from "gsap";
import { getBlockData } from "@/helpers/getBlockData";
import { getPageData } from "@/helpers/getPageData";
const cursorRef = ref<HTMLElement | null>(null);
const slug: string = "404";
const localPath = useLocalePath();

const er = ref<ErrorPage>({
  title: "",
  button: "",
});

const fetchBlockData = async () => {
  const blockAttrs = await getBlockData(slug, "create-block/errorpage");
  if (blockAttrs) {
    er.value = {
      title: blockAttrs.title || "",
      button: blockAttrs.buttonText || "",
    };
  }
};

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

const cursorSize = reactive({
  width: 0,
  height: 0,
});

const updateCursorPosition = (event: MouseEvent): void => {
  const cursor = cursorRef.value;
  if (!cursor) return;

  const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power1" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power1" });

  xTo(event.clientX - cursorSize.width / 2);
  yTo(event.clientY - cursorSize.height / 2);
};

onMounted(() => {
  fetchBlockData();
  const cursor = cursorRef.value;
  if (!cursor) return;

  cursorSize.width = cursor.offsetWidth;
  cursorSize.height = cursor.offsetHeight;

  const resizeObserver = new ResizeObserver(() => {
    if (cursor) {
      cursorSize.width = cursor.offsetWidth;
      cursorSize.height = cursor.offsetHeight;
    }
  });

  if (cursor) {
    resizeObserver.observe(cursor);
  }
  onBeforeUnmount(() => {
    if (cursor) {
      resizeObserver.unobserve(cursor);
    }
  });
});
</script>

<style scoped>
h2 :deep(em) {
  @apply text-red-600/80;
}
a::before {
  @apply bg-red-600/80;
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(100%);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
a:hover::before {
  transform: translateY(0%);
}
a span {
  position: relative;
  z-index: 1;
}
</style>
