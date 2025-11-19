import axios from "./axios";

// Получение списка сохранённых конфигураций с сервера
export const getConfigsList = async () => {
  try {
    const response = await axios.get("/configs/list");
    return response.data; // предполагаем, что бек возвращает массив конфигов
  } catch (err) {
    console.error("Ошибка получения списка конфигураций:", err);
    return [];
  }
};

// Получение параметров конкретной конфигурации
export const getConfigParams = async (configName) => {
  try {
    const response = await axios.get(`/configs/${configName}`);
    return response.data; // { movement, traffic, scheduler, userCount, ... }
  } catch (err) {
    console.error(`Ошибка получения параметров конфигурации ${configName}:`, err);
    return null;
  }
};

// Сохранение конфигурации на сервер
export const saveConfig = async (configName, params) => {
  try {
    const response = await axios.post("/configs/save", { name: configName, params });
    return response.data; // { status: "ok" } или что отдаст бек
  } catch (err) {
    console.error(`Ошибка сохранения конфигурации ${configName}:`, err);
    return null;
  }
};

// Получение предвычисленных данных для графиков
export const getPrecomputedData = async (configName) => {
  try {
    const response = await axios.get(`/configs/${configName}/precomputed`);
    return response.data; // { throughput, fairness, efficiency, ... }
  } catch (err) {
    console.error(`Ошибка получения precomputed данных для ${configName}:`, err);
    return null;
  }
};

// пока для демонстрации
export const fetchOverviewSimulation = async () => {
  await new Promise((res) => setTimeout(res, 700));
  return {
    status: "ok",
    simulationId: "test-sim-123",
    description: "Демонстрационная конфигурация",
    movement: { x_min: 0, x_max: 100, y_min: 0, y_max: 100 },
    traffic: { packet_rate: 10 },
    scheduler: {},
    userCount: 5,
    selectedMovement: "randomWalk",
    selectedTraffic: "poisson",
    selectedScheduler: "Round Robin",
    placeholderData: {
      throughput: 0,
      fairness: 0,
      efficiency: 0
    }
  };
};
