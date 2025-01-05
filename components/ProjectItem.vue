<script setup lang="ts">
import type { Project } from "@/helpers/interfaces";
const props = defineProps<{ project: Project }>();
</script>

<template>
  <div
    class="relative overflow-hidden project-item"
    @mouseover="project.isHovered = true"
    @mouseleave="project.isHovered = false"
  >
    <img
      :src="project.isHovered ? project.gif : project.image"
      class="relative w-full"
    />
    <div
      class="absolute top-2 left-2 md:top-4 md:left-4 bg-zinc-950 rounded-2xl flex items-center px-2 py-1 translate-y-0 xl:translate-y-[-150%] transition-transform ease-in-out duration-300"
      :class="{ 'xl:!translate-y-0': project.isHovered }"
    >
      <div
        class="size-3 md:size-4 rounded-full"
        :class="project.isLive ? 'bg-green-400' : 'bg-gray-400'"
      ></div>
      <p class="text-slate-100/70 text-sm md:text-base ml-2">
        {{ project.isLive ? "live" : "backup" }}
      </p>
    </div>
    <div
      class="w-full flex justify-between xl:justify-center gap-4 p-2 md:p-4 absolute left-0 bottom-0 translate-y-0 xl:translate-y-full transition-transform ease-in-out duration-300"
      :class="{ 'xl:!translate-y-0': project.isHovered }"
    >
      <a
        v-if="project.preview"
        class="size-16 flex justify-center items-center rounded-full bg-zinc-950 hover:bg-red-600 transition-colors ease-in-out duration-300 shadow-xl"
        :href="project.preview"
        target="_blank"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="-3.5 0 32 32"
        >
          <path
            fill="#fff"
            d="M12.406 13.844c1.188 0 2.156.969 2.156 2.156s-.969 2.125-2.156 2.125-2.125-.938-2.125-2.125.938-2.156 2.125-2.156zm0-5.313c7.063 0 12.156 6.625 12.156 6.625.344.438.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625S.25 16.812.25 16.812c-.344-.438-.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zm0 12.813c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344S7.062 13.062 7.062 16s2.406 5.344 5.344 5.344z"
          />
        </svg>
      </a>
      <a
        v-if="project.repo"
        class="size-16 flex justify-center items-center rounded-full bg-zinc-950 hover:bg-red-600 transition-colors ease-in-out duration-300 shadow-xl"
        :href="project.repo"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 1920 1920"
        >
          <path
            fill="#fff"
            fill-rule="evenodd"
            d="M1821.63 637.76c0-130.027-43.627-236.373-116.054-319.68 11.627-30.187 50.347-151.36-11.2-315.307 0 0-94.72-32-310.4 122.134-90.133-26.454-186.773-39.68-282.773-40.107-96 .427-192.64 13.653-282.667 40.107C602.749-29.227 507.923 2.773 507.923 2.773c-61.547 163.947-22.72 285.12-11.094 315.307-72.32 83.307-116.266 189.653-116.266 319.68 0 456.533 263.68 558.72 514.453 588.8 0 0-180.267 111.68-180.267 299.413-64.32 30.507-336.533 123.947-437.333-58.133 0 0-59.627-114.347-173.013-122.773 0 0-110.294-1.494-7.787 72.426 0 0 74.027 36.694 125.44 174.294 0 0 57.173 289.92 489.067 159.68 4.373 2.24 1.6 140.266 1.6 168.533h777.173s1.28-277.013 1.28-365.12c0-216.64-144.64-292.48-185.28-329.28 251.627-29.44 515.733-130.133 515.733-587.84"
          />
        </svg>
      </a>
    </div>
  </div>
</template>
