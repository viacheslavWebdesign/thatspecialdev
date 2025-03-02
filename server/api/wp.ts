export default defineEventHandler(async (event) => {
  try {
    const data = await $fetch(
      `https://back.thatspecial.dev/wp-json/wp/v2/pages`
    );

    return data;
  } catch (error) {
    console.error("Error access API:", error);
    return { error: "Error access data" };
  }
});
