import axios from "axios";

const API = axios.create({
  baseURL: "https://resumemetrics-a31f.onrender.com",
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
