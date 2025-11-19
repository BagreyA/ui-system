import axios from "./axios";

// Запуск выбранного теста
export const runTestRequest = async (testKey) => {
  const response = await axios.post("/tests/run", { test: testKey });
  return response.data;
};

// Получение списка тестов (если backend будет отдавать)
export const getTestsList = async () => {
  const response = await axios.get("/tests/list");
  return response.data;
};
