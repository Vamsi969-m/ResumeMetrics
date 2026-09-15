import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
