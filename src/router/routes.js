// Importación de middlewares
import Public from "./middleware/Public";
import Auth from "./middleware/Auth";
import SuperAdmin from "./middleware/SuperAdmin";
import Institution from "./middleware/Institution";

const routes = [
  //campuses
  {
    path: "/instituciones/:institution_id/campus",
    name: "campuses",
    component: () => import("@/views/campuses/List.vue"),
    meta: {
      title: "Campus",
      icon: "mdi-city-variant",
      middleware: SuperAdmin,
    },
  },
  {
    path: "/instituciones/:institution_id/campus/agregar",
    name: "campuses/store",
    component: () => import("@/views/campuses/Form.vue"),
    meta: {
      title: "Campus | Agregar",
      icon: "mdi-city-variant",
      middleware: SuperAdmin,
    },
  },
  {
    path: "/instituciones/:institution_id/campus/:id",
    name: "campuses/show",
    component: () => import("@/views/campuses/Show.vue"),
    props: true,
    meta: {
      title: "Campus",
      icon: "mdi-city-variant",
      middleware: SuperAdmin,
    },
  },
  {
    path: "/instituciones/:institution_id/campus/:id/editar",
    name: "campuses/update",
    component: () => import("@/views/campuses/Form.vue"),
    props: true,
    meta: {
      title: "Campus | Editar",
      icon: "mdi-city-variant",
      middleware: SuperAdmin,
    },
  },
  //institutions
  {
    path: "/instituciones",
    name: "institutions",
    component: () => import("@/views/institutions/List.vue"),
    meta: {
      title: "Instituciones",
      icon: "mdi-office-building",
      middleware: SuperAdmin,
    },
  },
  {
    path: "/instituciones/agregar",
    name: "institutions/store",
    component: () => import("@/views/institutions/Form.vue"),
    meta: {
      title: "Institución | Agregar",
      icon: "mdi-office-building",
      middleware: SuperAdmin,
    },
  },
  {
    path: "/instituciones/:id",
    name: "institutions/show",
    component: () => import("@/views/institutions/Show.vue"),
    props: true,
    meta: {
      title: "Institución",
      icon: "mdi-office-building",
      middleware: SuperAdmin,
    },
  },
  {
    path: "/instituciones/:id/editar",
    name: "institutions/update",
    component: () => import("@/views/institutions/Form.vue"),
    props: true,
    meta: {
      title: "Institución | Editar",
      icon: "mdi-office-building",
      middleware: SuperAdmin,
    },
  },
  //general
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: Auth,
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: Auth,
    },
  },
  //public
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar Sesión",
      middleware: Public,
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/public/Main.vue"),
    meta: {
      title: "EscolarMX",
      middleware: Public,
    },
  },
  {
    path: "/recuperar_contrasena",
    name: "user_password_recover",
    component: () => import("@/views/public/UserPasswordRecover.vue"),
    meta: {
      title: "Recuperar contraseña",
      icon: "mdi-account",
      middleware: Public,
    },
  },
  {
    path: "/restablecer_contrasena/:id",
    name: "user_password_reset",
    component: () => import("@/views/public/UserPasswordReset.vue"),
    meta: {
      title: "Restablecer contraseña",
      icon: "mdi-account",
      middleware: Public,
    },
  },
  {
    path: "/confirmar_cuenta/:id",
    name: "user_account_confirm",
    component: () => import("@/views/public/UserAccountConfirm.vue"),
    meta: {
      title: "Confirmar cuenta",
      icon: "mdi-account",
      middleware: Public,
    },
  },
  //not found
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/public/NotFound.vue"),
  },
];

export default routes;
