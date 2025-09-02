// 1) Imports
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

// 2) Historial (URLs limpias)
const base = import.meta.env.BASE_URL || "/";
const history = createWebHistory(base);

// 3) Router
const router = createRouter({ history, routes });

// 4) Guard global: soporta función legacy o objeto { guard }
router.beforeEach((to, from, next) => {
  const mw = to.meta?.middleware;

  // a) Middleware como función (legacy)
  if (typeof mw === "function") return mw(to, from, next);

  // b) Middleware como objeto { guard }
  if (mw && typeof mw.guard === "function") return mw.guard(to, from, next);

  // c) Sin middleware
  return next();
});

// 5) Título dinámico
router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || "App";
  const title = to.meta?.title ? `${appName} | ${to.meta.title}` : appName;
  document.title = title;
});

export default router;
