<template>
  <section class="pt-20 md:pt-40 relative">
    <div class="w-full max-w-screen-xl px-5 mx-auto relative">
      <h2
        class="text-4xl md:text-8xl font-bold mb-10 md:mb-32"
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

<script setup lang="ts">
import type { Projects, Project } from "@/helpers/interfaces";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlockData } from "@/helpers/getBlockData";
gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const projects = reactive<Projects>({
  title: "",
  project: [] as Project[],
});

const fetchBlockData = async () => {
  const blockAttrs = await getBlockData(
    props.pageSlug,
    "create-block/projects"
  );
  if (blockAttrs) {
    projects.title = blockAttrs.title || "";
    projects.project = blockAttrs.projects.map((project: any) => ({
      preview: project.link || "",
      repo: project.repo || "",
      image: project.image?.url || "",
      gif: project.gif?.url || "",
      isLive: project.isLive || false,
    }));
  }
};

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

onMounted(async () => {
  await fetchBlockData();
  updateWindowSize();
  window.addEventListener("resize", updateWindowSize);
});
</script>

<style scoped>
h2 :deep(em) {
  @apply text-red-600/80;
}
</style>
