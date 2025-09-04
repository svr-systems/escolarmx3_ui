// Importación de middlewares
import Public from "./middleware/Public";
import Auth from "./middleware/Auth";
import { Roles } from "./middleware/Roles";

const routes = [
  //teachers
  {
    path: "/institucion/docentes",
    name: "teachers",
    component: () => import("@/views/teachers/List.vue"),
    meta: {
      title: "Docentes",
      icon: "mdi-human-male-board",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/docentes/agregar",
    name: "teachers/store",
    component: () => import("@/views/teachers/Form.vue"),
    meta: {
      title: "Docente | Agregar",
      icon: "mdi-human-male-board",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/docentes/:id",
    name: "teachers/show",
    component: () => import("@/views/teachers/Show.vue"),
    props: true,
    meta: {
      title: "Docente",
      icon: "mdi-human-male-board",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/docentes/:id/editar",
    name: "teachers/update",
    component: () => import("@/views/teachers/Form.vue"),
    props: true,
    meta: {
      title: "Docente | Editar",
      icon: "mdi-human-male-board",
      middleware: [Auth, Roles([2])],
    },
  },
  //courses
  {
    path: "/institucion/carreras/:program_id/courses",
    name: "courses",
    component: () => import("@/views/courses/List.vue"),
    meta: {
      title: "Asignaturas",
      icon: "mdi-book-open-variant",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/carreras/:program_id/courses/agregar",
    name: "courses/store",
    component: () => import("@/views/courses/Form.vue"),
    meta: {
      title: "Asignatura | Agregar",
      icon: "mdi-book-open-variant",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/carreras/:program_id/courses/:id",
    name: "courses/show",
    component: () => import("@/views/courses/Show.vue"),
    props: true,
    meta: {
      title: "Asignatura",
      icon: "mdi-book-open-variant",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/carreras/:program_id/courses/:id/editar",
    name: "courses/update",
    component: () => import("@/views/courses/Form.vue"),
    props: true,
    meta: {
      title: "Asignatura | Editar",
      icon: "mdi-book-open-variant",
      middleware: [Auth, Roles([2])],
    },
  },
  //programs
  {
    path: "/institucion/carreras",
    name: "programs",
    component: () => import("@/views/programs/List.vue"),
    meta: {
      title: "Carreras",
      icon: "mdi-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/carreras/agregar",
    name: "programs/store",
    component: () => import("@/views/programs/Form.vue"),
    meta: {
      title: "Carrera | Agregar",
      icon: "mdi-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/carreras/:id",
    name: "programs/show",
    component: () => import("@/views/programs/Show.vue"),
    props: true,
    meta: {
      title: "Carrera",
      icon: "mdi-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/institucion/carreras/:id/editar",
    name: "programs/update",
    component: () => import("@/views/programs/Form.vue"),
    props: true,
    meta: {
      title: "Carrera | Editar",
      icon: "mdi-school",
      middleware: [Auth, Roles([2])],
    },
  },
  //campuses
  {
    path: "/instituciones/:institution_id/campus",
    name: "campuses",
    component: () => import("@/views/campuses/List.vue"),
    meta: {
      title: "Campus",
      icon: "mdi-city-variant",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/instituciones/:institution_id/campus/agregar",
    name: "campuses/store",
    component: () => import("@/views/campuses/Form.vue"),
    meta: {
      title: "Campus | Agregar",
      icon: "mdi-city-variant",
      middleware: [Auth, Roles([1])],
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
      middleware: [Auth, Roles([1])],
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
      middleware: [Auth, Roles([1])],
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
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/instituciones/agregar",
    name: "institutions/store",
    component: () => import("@/views/institutions/Form.vue"),
    meta: {
      title: "Institución | Agregar",
      icon: "mdi-office-building",
      middleware: [Auth, Roles([1])],
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
      middleware: [Auth, Roles([1])],
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
      middleware: [Auth, Roles([1])],
    },
  },
  //general
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: [Auth],
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: [Auth],
    },
  },
  //public
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar Sesión",
      middleware: [Public],
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/public/Main.vue"),
    meta: {
      title: "EscolarMX",
      middleware: [Public],
    },
  },
  {
    path: "/recuperar_contrasena",
    name: "user_password_recover",
    component: () => import("@/views/public/UserPasswordRecover.vue"),
    meta: {
      title: "Recuperar contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/restablecer_contrasena/:id",
    name: "user_password_reset",
    component: () => import("@/views/public/UserPasswordReset.vue"),
    meta: {
      title: "Restablecer contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/confirmar_cuenta/:id",
    name: "user_account_confirm",
    component: () => import("@/views/public/UserAccountConfirm.vue"),
    meta: {
      title: "Confirmar cuenta",
      icon: "mdi-account",
      middleware: [Public],
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
