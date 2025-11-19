// кнопка «обзор»
export async function fetchOverviewSimulation() {
  await new Promise((res) => setTimeout(res, 700));

  return {
    status: "ok",
    simulationId: "test-sim-123",
    description: "Это демонстрационный запуск симуляции",
    placeholderData: {
      throughput: 0,
      fairness: 0,
      efficiency: 0
    }
  };
}
