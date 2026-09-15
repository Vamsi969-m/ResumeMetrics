import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await API.post(
    "/resume/analyze",
    formData
  );

  return response.data;
};
