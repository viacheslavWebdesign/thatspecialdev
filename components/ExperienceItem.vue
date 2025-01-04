<template>
  <div class="flex flex-col md:flex-row gap-6 md:gap-10">
    <div class="w-full md:w-1/2">
      <Flag :texture="job.texture" />
    </div>
    <div class="w-full md:w-1/2">
      <div class="flex font-bold gap-2 mb-2 md:mb-6">
        <h3 class="text-2xl md:text-4xl">{{ job.title }}</h3>
        <p class="text-slate-100/70 font-machina text-base md:text-lg">
          {{ job.date }}
        </p>
      </div>
      <h5 class="font-medium md:text-lg mb-1 md:mb-2">Responsibilities</h5>
      <div
        v-html="job.responsibilities"
        class="mb-2 md:mb-4 text-sm md:text-base experience-content text-slate-100/70 max-w-[600px]"
      ></div>
      <h5 class="font-medium md:text-lg mb-1 md:mb-2">Projects</h5>
      <div class="flex flex-wrap gap-x-4 max-w-[500px]">
        <a
          v-for="(project, index) in job.projects"
          :key="index"
          :href="project.link"
          target="_blank"
          class="h-8 w-24 relative"
          ><img
            :src="project.image"
            class="top-0 left-0 w-full h-full absolute object-contain object-center"
        /></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job } from "@/helpers/interfaces";
const props = defineProps<{ job: Job }>();
</script>
