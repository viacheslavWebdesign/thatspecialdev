export default defineEventHandler(async (event) => {
  const { wpKey } = useRuntimeConfig().private;

  let uri = `https://back.thatspecial.dev/wp-json/wp/v2/pages`;

  try {
    const data = await $fetch(uri, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${wpKey}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Error access API:", error);
    return { error: "Error access data" };
  }
});
