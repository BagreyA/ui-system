import axios from "./axios";

// --- Предустановленные базовые сценарии ---
const defaultConfigs = {
  "single user static": {
    userCount: 1,
    selectedMovement: "RandomWaypoin",
    movementParams: { x_min: 0, x_max: 100, y_min: 0, y_max: 100, pause_time: 2 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 100 },
    selectedScheduler: "Round Robin",
    userIds: ["UE1"]
  },
  "multi ue randomwaypoint": {
    userCount: 5,
    selectedMovement: "RandomWaypoin",
    movementParams: { x_min: 0, x_max: 100, y_min: 0, y_max: 100, pause_time: 2 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 200 },
    selectedScheduler: "Round Robin",
    userIds: ["UE1","UE2","UE3","UE4","UE5"]
  },
  "pedestrian mobility stress": {
    userCount: 10,
    selectedMovement: "RandomWalk",
    movementParams: { x_min: 0, x_max: 50, y_min: 0, y_max: 50 },
    selectedTraffic: "onOff",
    trafficParams: { averageActivePhaseDuration: 5, averageInactivePhaseDuration: 3, trafficIntensityActivePhase: 50 },
    selectedScheduler: "Round Robin",
    userIds: Array.from({ length: 10 }, (_, i) => `UE${i+1}`)
  },
  "vehicular mobility pf": {
    userCount: 5,
    selectedMovement: "RandomWaypoin",
    movementParams: { x_min: 0, x_max: 500, y_min: 0, y_max: 500, pause_time: 1 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 300 },
    selectedScheduler: "Proportional Fair",
    userIds: Array.from({ length: 5 }, (_, i) => `UE${i+1}`)
  },
  "dense network bestcqi": {
    userCount: 20,
    selectedMovement: "RandomWalk",
    movementParams: { x_min: 0, x_max: 200, y_min: 0, y_max: 200 },
    selectedTraffic: "poisson",
    trafficParams: { packet_rate: 150 },
    selectedScheduler: "Best CQI",
    userIds: Array.from({ length: 20 }, (_, i) => `UE${i+1}`)
  }
};

// --- Получение списка конфигураций ---
export const getConfigsList = async () => {
  try {
    const response = await axios.get("/configs/list");
    return response.data || [];
  } catch (err) {
    console.warn("Backend недоступен, возвращаем дефолтные конфиги.");
    return Object.keys(defaultConfigs);
  }
};

// --- Получение параметров конкретной конфигурации ---
export const getConfigParams = async (configName) => {
  try {
    // Сначала проверяем дефолтные конфиги
    if (defaultConfigs[configName]) return { ...defaultConfigs[configName] };

    // Иначе пробуем получить с сервера
    const response = await axios.get(`/configs/${configName}`);
    const data = response.data;
    if (!data.selectedScheduler) data.selectedScheduler = "Round Robin";
    return data;
  } catch (err) {
    console.error(`Ошибка получения конфигурации ${configName}:`, err);
    return defaultConfigs[configName] || null;
  }
};

// --- Сохранение конфигурации на сервер ---
export const saveConfig = async (configName, params) => {
  try {
    if (!params.selectedScheduler) params.selectedScheduler = "Round Robin";
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
    console.warn(`Нет precomputed данных для ${configName}`);
    return null;
  }
};

// --- Получение полной конфигурации для визуализации ---
export const fetchOverviewSimulation = async (configName) => {
  // Если дефолтный сценарий
  if (defaultConfigs[configName]) {
    await new Promise(res => setTimeout(res, 300)); // эмуляция задержки
    return {
      status: "ok",
      simulationId: `sim-${configName.replace(/\s+/g, "-")}`,
      description: `Предустановленный сценарий: ${configName}`,
      ...defaultConfigs[configName],
      placeholderData: { throughput: 0, fairness: 0, efficiency: 0 }
    };
  }

  // Если серверный сценарий
  try {
    const response = await axios.get(`/configs/${configName}`);
    const data = response.data;
    if (!data.selectedScheduler) data.selectedScheduler = "Round Robin";
    return {
      status: "ok",
      simulationId: data.simulationId || `sim-${configName}`,
      description: data.description || "",
      ...data,
      placeholderData: data.placeholderData || { throughput: 0, fairness: 0, efficiency: 0 }
    };
  } catch (err) {
    console.error(`Ошибка получения overview для ${configName}:`, err);
    return null;
  }
};
