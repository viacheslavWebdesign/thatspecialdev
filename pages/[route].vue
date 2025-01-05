<script setup lang="ts">
const router = useRouter();
const { path } = useRoute();
const { locale } = useI18n();
const config = useRuntimeConfig();
const defaultLocale = config.public.i18n.defaultLocale;

const redirectIfPagePathIsInvalid = () => {
  const isPathValid = (path) => false;
  if (!isPathValid(path)) {
    const errorPath =
      locale.value !== defaultLocale ? `/${locale.value}/error` : "/error";
    router.push({ path: errorPath });
  }
};

redirectIfPagePathIsInvalid();
</script>
