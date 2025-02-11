<script setup lang="ts">
import type { Projects, Project } from "@/helpers/interfaces";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlockData } from "@/helpers/getBlockData";
const { locale } = useI18n();
gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const { data: projectsData } = await useAsyncData("projectsData", () =>
  getBlockData(props.pageSlug, locale.value, "create-block/projects")
);

const projects = reactive<Projects>({
  title: projectsData.value.title,
  project: projectsData.value.projects.map((project: Project) => ({
    preview: project.link || "",
    repo: project.repo || "",
    image: project.image?.url || "",
    gif: project.gif?.url || "",
    isLive: project.isLive || false,
  })),
});

const isMobile: Ref<boolean> = ref(false);

const updateWindowSize = () => {
  isMobile.value = window.innerWidth <= 1024;
  if (isMobile.value) {
    createScrollTrigger();
  } else {
    destroyScrollTrigger();
  }
};

const createScrollTrigger = (): void => {
  projects.project.forEach((project, index) => {
    if (!project.scrollTrigger) {
      project.scrollTrigger = ScrollTrigger.create({
        invalidateOnRefresh: true,
        trigger: `.project-item:nth-child(${index + 1})`,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => (project.isHovered = true),
        onLeave: () => (project.isHovered = false),
        onEnterBack: () => (project.isHovered = true),
        onLeaveBack: () => (project.isHovered = false),
      });
    }
  });
};

const destroyScrollTrigger = (): void => {
  projects.project.forEach((project) => {
    if (project.scrollTrigger) {
      project.scrollTrigger.kill();
      project.scrollTrigger = undefined;
    }
  });
};

onMounted(() => {
  nextTick(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
  });
});
</script>

<template>
  <section class="pt-20 md:pt-40 relative">
    <div class="w-full max-w-screen-xl px-5 mx-auto relative">
      <h2
        class="text-4xl md:text-8xl font-bold mb-10 md:mb-32 text-center"
        v-html="projects.title"
      ></h2>
    </div>
    <div class="w-full px-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <ProjectItem
        v-for="(project, index) in projects.project"
        :project="project"
        :key="index"
      />
    </div>
  </section>
</template>

<style scoped>
h2 :deep(em) {
  color: rgb(220 38 38 / 0.8);
}
</style>
