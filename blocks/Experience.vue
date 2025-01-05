<script setup lang="ts">
import type { Experience, Job, ExperienceProject } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";
const { locale } = useI18n();
const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const { data: experienceData } = await useAsyncData("experienceData", () =>
  getBlockData(props.pageSlug, locale.value, "create-block/experience")
);

const experience = ref<Experience>({
  title: experienceData.value.title,
  job: experienceData.value.jobs.map((job: Job) => ({
    title: job.title,
    date: job.date,
    texture: job.image?.url,
    responsibilities: job.text,
    projects: job.projects.map((project: ExperienceProject) => ({
      image: project.image?.url,
      link: project.link,
    })),
  })),
});
</script>

<template>
  <section class="pt-20 md:pt-40 relative">
    <div class="w-full max-w-screen-xl px-5 mx-auto relative">
      <h2
        class="text-4xl md:text-8xl font-bold mb-10 md:mb-32"
        v-html="experience.title"
      ></h2>
      <div class="flex flex-col gap-12 md:gap-24">
        <ExperienceItem
          v-for="(job, index) in experience.job"
          :job="job"
          :key="index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
h2 :deep(em) {
  @apply text-red-600/80;
}
.experience-content :deep(ul) {
  list-style: disc;
  margin-left: 20px;
}
</style>
