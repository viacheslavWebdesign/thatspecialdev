<script setup lang="ts">
const showDropdown = ref(false);
const dropdownContainer = ref<HTMLElement | null>(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleClickOutside(event: MouseEvent) {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target as Node)
  ) {
    showDropdown.value = false;
  }
}

const switchLocalePath = useSwitchLocalePath();
const switchLocalePathWithSlash = (locale: string) => {
  const path = switchLocalePath(locale);
  return path?.endsWith("/") ? path : `${path}/`;
};

const { locales, locale, setLocale } = useI18n();
const availableLocales = computed(() => {
  return locales.value.filter((i) => i !== locale.value);
});

const switchLocaleAndReload = (newLocale: string) => {
  setLocale(newLocale);
  const newPath = switchLocalePathWithSlash(newLocale);

  window.location.href = newPath;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative" ref="dropdownContainer">
    <button
      @click="toggleDropdown"
      class="bg-white/10 rounded-lg shadow-xl font-machina py-2 px-6 border border-slate-100/10 transition-colors hover:bg-white/20"
    >
      {{ locale.toUpperCase() }}
    </button>
    <transition name="fade-slide">
      <ul
        v-if="showDropdown"
        class="absolute -bottom-2 right-0 text-center translate-y-full min-w-full bg-white/10 rounded-lg shadow-xl font-machina py-2 px-6 border border-slate-100/10"
      >
        <li v-for="item in availableLocales" :key="item">
          <button
            @click="switchLocaleAndReload(item)"
            class="transition-colors hover:text-white/50 py-1 block w-full text-left"
          >
            {{ item.toUpperCase() }}
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(100%);
}
.fade-slide-enter-active {
  transition: opacity 0.1s ease-out 0.1s, transform 0.2s ease-out;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: scale(1) translateY(100%);
}
.fade-slide-leave-active {
  transition: opacity 0.2s ease-in, transform 0.1s ease-in 0.1s;
}
</style>
