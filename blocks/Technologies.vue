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

<script setup lang="ts">
import type { Technologies } from "@/helpers/interfaces";
import { getBlockData } from "@/helpers/getBlockData";
const props = defineProps({
  pageSlug: {
    type: String,
    required: true,
  },
});
const technologies = ref<Technologies>({
  title: "",
  technology: [],
});
const fetchBlockData = async () => {
  const blockAttrs = await getBlockData(
    props.pageSlug,
    "create-block/technologies"
  );

  if (blockAttrs) {
    technologies.value.title = blockAttrs.title || "";
    technologies.value.technology = blockAttrs.technologies.map(
      (tech: any) => tech.image?.url || ""
    );
  }
};
onMounted(() => {
  fetchBlockData();
});
</script>

<style scoped>
h2 :deep(em) {
  @apply text-red-600/80;
}
</style>
