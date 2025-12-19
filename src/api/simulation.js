import axios from "./axios";

// --- Предустановленные базовые сценарии с обязательным планировщиком ---
const defaultConfigs = {
  "single user static": {
    userCount: 1,
    selectedMovement: "randomWaypoint",
    movementParams: { x_min: 0, x_max: 100, y_min: 0, y_max: 100, pause_time: 2 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 100 },
    selectedScheduler: "Round Robin", // обязательный
    userIds: ["UE1"]
  },
  "multi ue randomwaypoint": {
    userCount: 5,
    selectedMovement: "randomWaypoint",
    movementParams: { x_min: 0, x_max: 100, y_min: 0, y_max: 100, pause_time: 2 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 200 },
    selectedScheduler: "Round Robin",
    userIds: ["UE1","UE2","UE3","UE4","UE5"]
  },
  "pedestrian mobility stress": {
    userCount: 10,
    selectedMovement: "randomWalk",
    movementParams: { x_min: 0, x_max: 50, y_min: 0, y_max: 50 },
    selectedTraffic: "onOff",
    trafficParams: {
      averageActivePhaseDuration: 5,
      averageInactivePhaseDuration: 3,
      trafficIntensityActivePhase: 50
    },
    selectedScheduler: "Round Robin",
    userIds: Array.from({ length: 10 }, (_, i) => `UE${i+1}`)
  },
  "vehicular mobility pf": {
    userCount: 5,
    selectedMovement: "randomWaypoint",
    movementParams: { x_min: 0, x_max: 500, y_min: 0, y_max: 500, pause_time: 1 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 300 },
    selectedScheduler: "Proportional Fair",
    userIds: Array.from({ length: 5 }, (_, i) => `UE${i+1}`)
  },
  "dense network bestcqi": {
    userCount: 20,
    selectedMovement: "randomWalk",
    movementParams: { x_min: 0, x_max: 200, y_min: 0, y_max: 200 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 150 },
    selectedScheduler: "Best CQI",
    userIds: Array.from({ length: 20 }, (_, i) => `UE${i+1}`)
  }
};

// --- Получение списка сохранённых конфигураций с сервера ---
export const getConfigsList = async () => {
  try {
    const response = await axios.get("/configs/list");
    return response.data;
  } catch (err) {
    console.error("Ошибка получения списка конфигураций:", err);
    return [];
  }
};

// --- Получение параметров конкретной конфигурации ---
export const getConfigParams = async (configName) => {
  try {
    if (defaultConfigs[configName]) {
      return { ...defaultConfigs[configName] };
    }

    const response = await axios.get(`/configs/${configName}`);
    // Проверяем, есть ли выбранный планировщик
    if (!response.data.selectedScheduler) {
      console.warn(`Конфигурация ${configName} не имеет планировщика, назначен "Round Robin" по умолчанию`);
      response.data.selectedScheduler = "Round Robin";
    }

    return response.data;
  } catch (err) {
    console.error(`Ошибка получения параметров конфигурации ${configName}:`, err);
    return null;
  }
};

// --- Сохранение конфигурации на сервер ---
export const saveConfig = async (configName, params) => {
  try {
    // Проверка: если планировщик не выбран, ставим "Round Robin"
    if (!params.selectedScheduler) {
      params.selectedScheduler = "Round Robin";
    }

    const response = await axios.post("/configs/save", { name: configName, params });
    return response.data;
  } catch (err) {
    console.error(`Ошибка сохранения конфигурации ${configName}:`, err);
    return null;
  }
};

// --- Получение предвычисленных данных для графиков ---
export const getPrecomputedData = async (configName) => {
  try {
    const response = await axios.get(`/configs/${configName}/precomputed`);
    return response.data;
  } catch (err) {
    console.error(`Ошибка получения precomputed данных для ${configName}:`, err);
    return null;
  }
};

// --- Получение полной конфигурации для визуализации ---
export const fetchOverviewSimulation = async (configName) => {
  if (defaultConfigs[configName]) {
    await new Promise((res) => setTimeout(res, 300));
    return {
      status: "ok",
      simulationId: `sim-${configName.replace(/\s+/g, "-")}`,
      description: `Предустановленный сценарий: ${configName}`,
      ...defaultConfigs[configName],
      placeholderData: { throughput: 0, fairness: 0, efficiency: 0 }
    };
  }

  try {
    const response = await axios.get(`/configs/${configName}`);
    const data = { ...response.data };
    if (!data.selectedScheduler) data.selectedScheduler = "Round Robin"; // обязательный
    return {
      status: "ok",
      simulationId: data.simulationId || `sim-${configName}`,
      description: data.description || "",
      ...data,
      placeholderData: data.placeholderData || { throughput: 0, fairness: 0, efficiency: 0 }
    };
  } catch (err) {
    console.error(`Ошибка получения данных для симуляции ${configName}:`, err);
    return null;
  }
};
