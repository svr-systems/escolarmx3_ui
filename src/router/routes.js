// Importación de middlewares
import Public from "./middleware/Public";
import Auth from "./middleware/Auth";
import { Roles } from "./middleware/Roles";

const routes = [
  //student_programs
  {
    path: "/alumnos/:student_id/carreras",
    name: "student_programs",
    component: () => import("@/views/student_programs/List.vue"),
    meta: {
      title: "Alumno | Carreras",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/carreras/agregar",
    name: "student_programs/store",
    component: () => import("@/views/student_programs/Form.vue"),
    meta: {
      title: "Alumno | Carrera | Agregar",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/carreras/:id",
    name: "student_programs/show",
    component: () => import("@/views/student_programs/Show.vue"),
    props: true,
    meta: {
      title: "Alumno | Carrera",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/carreras/:id/editar",
    name: "student_programs/update",
    component: () => import("@/views/student_programs/Form.vue"),
    props: true,
    meta: {
      title: "Alumno | Carrera | Editar",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  //student_documents
  {
    path: "/alumnos/:student_id/documentos",
    name: "student_documents",
    component: () => import("@/views/student_documents/List.vue"),
    meta: {
      title: "Alumno | Documentos",
      icon: "mdi-folder",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/documentos/agregar",
    name: "student_documents/store",
    component: () => import("@/views/student_documents/Form.vue"),
    meta: {
      title: "Alumno | Documento | Agregar",
      icon: "mdi-folder",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/documentos/:id",
    name: "student_documents/show",
    component: () => import("@/views/student_documents/Show.vue"),
    props: true,
    meta: {
      title: "Alumno | Documento",
      icon: "mdi-folder",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/documentos/:id/editar",
    name: "student_documents/update",
    component: () => import("@/views/student_documents/Form.vue"),
    props: true,
    meta: {
      title: "Alumno | Documento | Editar",
      icon: "mdi-folder",
      middleware: [Auth, Roles([2])],
    },
  },
  //student_degrees
  {
    path: "/alumnos/:student_id/estudios_previos",
    name: "student_degrees",
    component: () => import("@/views/student_degrees/List.vue"),
    meta: {
      title: "Alumno | Estudios previos",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/estudios_previos/agregar",
    name: "student_degrees/store",
    component: () => import("@/views/student_degrees/Form.vue"),
    meta: {
      title: "Alumno | Estudio previos | Agregar",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/estudios_previos/:id",
    name: "student_degrees/show",
    component: () => import("@/views/student_degrees/Show.vue"),
    props: true,
    meta: {
      title: "Alumno | Estudio previos",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:student_id/estudios_previos/:id/editar",
    name: "student_degrees/update",
    component: () => import("@/views/student_degrees/Form.vue"),
    props: true,
    meta: {
      title: "Alumno | Estudio previos | Editar",
      icon: "mdi-history",
      middleware: [Auth, Roles([2])],
    },
  },
  //students
  {
    path: "/alumnos",
    name: "students",
    component: () => import("@/views/students/List.vue"),
    meta: {
      title: "Alumnos",
      icon: "mdi-account-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/agregar",
    name: "students/store",
    component: () => import("@/views/students/Form.vue"),
    meta: {
      title: "Alumno | Agregar",
      icon: "mdi-account-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:id",
    name: "students/show",
    component: () => import("@/views/students/Show.vue"),
    props: true,
    meta: {
      title: "Alumno",
      icon: "mdi-account-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/alumnos/:id/editar",
    name: "students/update",
    component: () => import("@/views/students/Form.vue"),
    props: true,
    meta: {
      title: "Alumno | Editar",
      icon: "mdi-account-school",
      middleware: [Auth, Roles([2])],
    },
  },
  //cycles
  {
    path: "/ciclos",
    name: "cycles",
    component: () => import("@/views/cycles/List.vue"),
    meta: {
      title: "Ciclos",
      icon: "mdi-calendar-blank",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/ciclos/agregar",
    name: "cycles/store",
    component: () => import("@/views/cycles/Form.vue"),
    meta: {
      title: "Ciclo | Agregar",
      icon: "mdi-calendar-blank",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/ciclos/:id",
    name: "cycles/show",
    component: () => import("@/views/cycles/Show.vue"),
    props: true,
    meta: {
      title: "Ciclo",
      icon: "mdi-calendar-blank",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/ciclos/:id/editar",
    name: "cycles/update",
    component: () => import("@/views/cycles/Form.vue"),
    props: true,
    meta: {
      title: "Ciclo | Editar",
      icon: "mdi-calendar-blank",
      middleware: [Auth, Roles([2])],
    },
  },
  //teachers
  {
    path: "/docentes",
    name: "teachers",
    component: () => import("@/views/teachers/List.vue"),
    meta: {
      title: "Docentes",
      icon: "mdi-human-male-board",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/docentes/agregar",
    name: "teachers/store",
    component: () => import("@/views/teachers/Form.vue"),
    meta: {
      title: "Docente | Agregar",
      icon: "mdi-human-male-board",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/docentes/:id",
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
    path: "/docentes/:id/editar",
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
    path: "/carreras/:program_id/courses",
    name: "courses",
    component: () => import("@/views/courses/List.vue"),
    meta: {
      title: "Asignaturas",
      icon: "mdi-book-open-variant",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/carreras/:program_id/courses/agregar",
    name: "courses/store",
    component: () => import("@/views/courses/Form.vue"),
    meta: {
      title: "Asignatura | Agregar",
      icon: "mdi-book-open-variant",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/carreras/:program_id/courses/:id",
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
    path: "/carreras/:program_id/courses/:id/editar",
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
    path: "/carreras",
    name: "programs",
    component: () => import("@/views/programs/List.vue"),
    meta: {
      title: "Carreras",
      icon: "mdi-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/carreras/agregar",
    name: "programs/store",
    component: () => import("@/views/programs/Form.vue"),
    meta: {
      title: "Carrera | Agregar",
      icon: "mdi-school",
      middleware: [Auth, Roles([2])],
    },
  },
  {
    path: "/carreras/:id",
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
    path: "/carreras/:id/editar",
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
