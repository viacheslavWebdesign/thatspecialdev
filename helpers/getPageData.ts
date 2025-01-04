import { useI18n } from "vue-i18n";
/**
 * Get page data by slug
 * @param {string} slug - page slug
 * @returns {Object|null} - page data
 */
export const getPageData = async (slug: string) => {
  const { locale } = useI18n();
  try {
    const response = await $fetch(
      `https://thatspecial.dev/api/wp?slug=${slug}&lang=${locale.value}`
    );
    return response;
  } catch (error) {
    console.error("API call error:", error);
    return null;
  }
};
