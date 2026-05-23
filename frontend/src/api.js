import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const askQuestion = async (question) => {
  const response = await axios.post(`${API_BASE_URL}/ask`, {
    question,
  });
  return response.data;
};