export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== "/" && !to.path.endsWith("/")) {
    const languageCode = to.path.split("/")[1];
    if (languageCode === "ru" || languageCode === "ua") {
      const { path, query, hash } = to;
      const nextPath = `${path}/`;
      const nextRoute = { path: nextPath, query, hash };
      return navigateTo(nextRoute, { redirectCode: 301 });
    }
  }
});
