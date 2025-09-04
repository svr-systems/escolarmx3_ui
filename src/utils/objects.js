/**
 * Objeto base para formularios de usuario.
 * @returns {Object} Estructura inicial de usuario.
 */
export const getUserObj = () => ({
  id: null,
  is_active: 1,
  role_id: null,
  name: null,
  surname_p: null,
  surname_m: null,
  curp: null,
  curp_path: null,
  curp_doc: null,
  curp_dlt: false,
  marital_status_id: null,
  phone: null,
  avatar_path: null,
  avatar_doc: null,
  avatar_dlt: false,
  email: null,
  user_campuses: [
    {
      id: null,
      is_active: 1,
      campus_id: null,
    },
  ],
});
