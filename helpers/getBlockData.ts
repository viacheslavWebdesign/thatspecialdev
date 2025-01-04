import { getPageData } from "@/helpers/getPageData";

/**
 * Get block data by page slug and block name
 * @param {string} pageSlug - page slug
 * @param {string} blockName - block name
 * @returns {Object|null} - block data
 */
export const getBlockData = async (pageSlug: string, blockName: string) => {
  try {
    const pageData = await getPageData(pageSlug);
    if (!Array.isArray(pageData) || pageData.length === 0) {
      console.warn("No page data found");
      return null;
    }

    const gutenbergBlocks = pageData[0]?.gutenberg_blocks;
    if (!Array.isArray(gutenbergBlocks)) {
      console.warn("Block does not exist");
      return null;
    }

    const contentBlock = gutenbergBlocks.find(
      (block) => block.blockName === blockName
    );
    return contentBlock?.attrs || null;
  } catch (error) {
    console.error("Error data fetching", error);
    return null;
  }
};
