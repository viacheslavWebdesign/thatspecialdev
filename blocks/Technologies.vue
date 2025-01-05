<script setup lang="ts">
import type { Technologies } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";
const { locale } = useI18n();
const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});

const { data: technologiesData } = await useAsyncData("technologiesData", () =>
  getBlockData(props.pageSlug, locale.value, "create-block/technologies")
);

const technologies = ref<Technologies>({
  title: technologiesData.value.title,
  technology: technologiesData.value.technologies.map(
    (tech: any) => tech.image?.url
  ),
});
</script>

<template>
  <section class="pt-20 md:pt-40 relative">
    <div class="w-full max-w-screen-xl px-5 mx-auto relative">
      <h2
        class="text-4xl md:text-8xl font-bold mb-10 md:mb-32"
        v-html="technologies.title"
      ></h2>
    </div>
    <Cylinder
      v-if="technologies.technology.length > 0"
      :textures="technologies.technology"
    />
  </section>
</template>

<style scoped>
h2 :deep(em) {
  color: rgb(220 38 38 / 0.8);
}
</style>
