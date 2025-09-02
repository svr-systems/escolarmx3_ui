import { useStore } from "@/store";

// 1) Predicado de acceso (menú/visibilidad)
const allow = (store) => {
  const auth = store.getAuth ?? store.auth;
  const roleId = Number(auth?.user?.role_id);
  return !!auth?.token && roleId === 2;
};

// 2) Guard para router
const guard = (to, from, next) => {
  const store = useStore();
  if (allow(store)) return next();
  return next({ name: "unauthorized", replace: true });
};

export default { allow, guard };
