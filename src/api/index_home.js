import axios from "./axios";

// --- Получение списка конфигураций с сервера ---
export const getConfigsList = async () => {
  try {
    const response = await axios.get("/");
    // backend возвращает { schedules: [...] }
    return response.data.schedules || [];
  } catch (err) {
    console.error("Ошибка получения списка конфигураций:", err);
    return [];
  }
};

// --- Сохранение конфигурации на сервер ---
export const saveConfig = async (configName, params) => {
  try {
    const payload = {
      title: configName,
      description: JSON.stringify(params),
      start_time: new Date().toISOString()
    };
    const response = await axios.post("/", payload);
    return response.data;
  } catch (err) {
    console.error(`Ошибка сохранения конфигурации ${configName}:`, err);
    return null;
  }
};

// --- Получение параметров конкретной конфигурации ---
export const getConfigParams = async (configName) => {
  try {
    const response = await axios.get(`/${configName}`);
    return JSON.parse(response.data.description || "{}");
  } catch (err) {
    console.warn(`Конфигурация ${configName} не найдена, используем дефолтную`);
    return null;
  }
};

// --- Получение предвычисленных данных для графиков ---
export const getPrecomputedData = async (configName) => {
  try {
    const response = await axios.get(`/${configName}/precomputed`);
    return response.data || {};
  } catch (err) {
    console.warn(`Нет precomputed данных для ${configName}`);
    return {};
  }
};

// --- Получение полной конфигурации для визуализации ---
export const fetchOverviewSimulation = async (configName) => {
  try {
    const params = await getConfigParams(configName);
    if (!params) {
      return {
        status: "error",
        simulationId: "unknown",
        description: "Нет данных для этой конфигурации"
      };
    }
    return {
      status: "ok",
      simulationId: `sim-${configName.replace(/\s+/g, "-")}`,
      description: params.description || "",
      ...params,
      placeholderData: { throughput: 0, fairness: 0, efficiency: 0 }
    };
  } catch (err) {
    console.error(`Ошибка получения данных для симуляции ${configName}:`, err);
    return null;
  }
};
