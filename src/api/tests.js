import axios from "./axios";

const TEST_ENDPOINTS = {
  schedulerBuffer: "/tests/scheduler_with_buffer",
  visualizeTimeline: "/tests/lte_time_line",
  schedulerGrid: "/tests/scheduler_grid",
  schedulerMetrics: "/tests/scheduler_metrics",
  schedulerEfficiency: "/tests/scheduler_efficiency",
};

export const runTestRequest = async (testKey) => {
  const endpoint = TEST_ENDPOINTS[testKey];

  if (!endpoint) {
    throw new Error("Неизвестный тест");
  }

  const response = await axios.post(endpoint);
  return response.data;
};
