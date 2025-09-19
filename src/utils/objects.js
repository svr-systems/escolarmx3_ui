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
  email: null,
  phone: null,
  marital_status_id: null,
  avatar_path: null,
  avatar_doc: null,
  avatar_dlt: false,
  curp_path: null,
  curp_doc: null,
  curp_dlt: false,
  birth_certificate_path: null,
  birth_certificate_doc: null,
  birth_certificate_dlt: false,
  ine_path: null,
  ine_doc: null,
  ine_dlt: false,
  contact_kinship_id: null,
  contact_name: null,
  contact_phone: null,
});
