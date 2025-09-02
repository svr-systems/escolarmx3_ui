// utils/access.js
import router from "@/router";
import { useStore } from "@/store";

export const canAccessRoute = (routeName) => {
  const r = router.getRoutes().find((x) => x.name === routeName);
  if (!r) return false;

  const store = useStore();
  const mw = r.meta?.middleware;

  // Sin middleware → visible
  if (!mw) return true;

  // Objeto { allow } → respeta predicado
  if (typeof mw?.allow === "function") return !!mw.allow(store);

  // Función legacy → visible por defecto en UI
  if (typeof mw === "function") return true;

  // Forma no reconocida → visible por defecto
  return true;
};

export const filterMenuItemsByAccess = (items = []) =>
  items.filter((i) => canAccessRoute(i.link));
