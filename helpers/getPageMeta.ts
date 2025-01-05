export const getPageMeta = async (slug, locale) => {
  try {
    const response = await $fetch("/api/wp");
    const pagesData = response?.data || response;

    const page = pagesData.find((page) => page.slug === slug);
    if (!page) {
      throw new Error(`Page with slug "${slug}" not found`);
    }

    const translation = page.translations[locale];
    if (!translation) {
      throw new Error(`Translation for locale "${locale}" not found`);
    }

    const postId = translation.post_id;
    const localizedPage = pagesData.find((page) => page.id === postId);
    if (!localizedPage) {
      throw new Error(`Localized page with ID "${postId}" not found`);
    }

    return localizedPage.yoast_head_json;
  } catch (error) {
    console.error("API call error:", error.message);
    return null;
  }
};
