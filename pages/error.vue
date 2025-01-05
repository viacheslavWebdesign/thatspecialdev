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
import { getPageMeta } from "@/helpers/getPageMeta";
const cursorRef = ref<HTMLElement | null>(null);
const slug: string = "errorpage";
const localPath = useLocalePath();
const { locale } = useI18n();

const { data: errorData } = await useAsyncData("errorData", () =>
  getBlockData(slug, locale.value, "create-block/errorpage")
);

const er = ref<ErrorPage>({
  title: errorData.value.title,
  button: errorData.value.buttonText,
});

const { data: meta } = useAsyncData("pageMeta", async () => {
  return await getPageMeta(slug, locale.value);
});

if (meta.value) {
  useHead({
    status: 404,
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
  color: rgb(220 38 38 / 0.8);
}
a::before {
  background-color: rgb(220 38 38 / 0.8);
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
