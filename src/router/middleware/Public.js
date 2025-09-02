import { useStore } from "@/store";

const allow = () => true;

const guard = (to, from, next) => {
  const store = useStore();
  const auth = store.getAuth ?? store.auth;
  if (auth?.token) return next({ name: "home", replace: true });
  return next();
};

export default { allow, guard };
