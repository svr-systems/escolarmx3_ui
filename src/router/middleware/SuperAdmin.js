import { useStore } from "@/store";

const allow = (store) => {
  const auth = store.getAuth ?? store.auth;
  const roleId = Number(auth?.user?.role_id);
  return !!auth?.token && roleId === 1;
};

const guard = (to, from, next) => {
  const store = useStore();
  if (allow(store)) return next();
  return next({ name: "unauthorized", replace: true });
};

export default { allow, guard };
