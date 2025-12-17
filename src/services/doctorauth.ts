import api from "@/lib/axios";

//Search Doc id
export const searchDoctorProfile = async (payload: {
  doctor_id: string;
}) => {
  const response = await api.post(
    "/doctors/search_doctor_profile",
    payload
  );
  return response.data;
};

//Password for Doc
export const createDoctorAuthEMR = async (payload: {
  doctor_id: string;
  password: string;
}) => {
  const response = await api.post(
    "/doctors/create_doctor_auth_EMR",
    payload
  );
  return response.data;
};

//Login Doc
export const loginDoctor = async (payload: {
  doctor_id: string;
  password: string;
}) => {
  const response = await api.post(
    "/doctors/login_doctor",
    payload
  );
  return response.data;
};
