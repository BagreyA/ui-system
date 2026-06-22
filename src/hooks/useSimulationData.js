import { useState, useEffect } from "react";

export default function useSimulationData(useLiveMode = true, config = null) {
  const [graphData, setGraphData] = useState({});
  const [gridData, setGridData] = useState({ ttiSlots: [], grid: [] });
  const [statsBuffer, setStatsBuffer] = useState([]);

  useEffect(() => {
    // =========================
    // MOCK MODE (JSON FILES)
    // =========================
    if (!useLiveMode) {
      const loadMockData = async () => {
        try {
          const [statsRes, detailedRes, positionsRes] = await Promise.all([
            fetch("/data/sim_stats.json"),
            fetch("/data/sim_stats_detailed.json"),
            fetch("/data/sim_1000_tti_positions.json"),
          ]);

          const stats = await statsRes.json();
          const detailed = await detailedRes.json();

          console.log("FIRST ROW:", stats[0]);
          console.log("ALL KEYS:", Object.keys(stats[0]));
          console.log("HAS JAIN:", "dl_fairness_jain_index" in stats[0]);

          if (!stats || !stats.length) return;

          const graphResult = {};
          const x = stats.map((row) => row.tti);

          Object.keys(stats[0])
            .filter((k) => k !== "tti")
            .forEach((key) => {
              graphResult[key] = {
                label: key,
                x,
                data: stats.map((row) => row[key] ?? null),
              };
            });

          setGraphData(graphResult);

          const ttiKeys = Object.keys(detailed)
            .map(Number)
            .sort((a, b) => a - b);

          const maxRB = Math.max(
            ...ttiKeys.map((tti) =>
              Object.values(detailed[tti]).reduce(
                (sum, ue) => sum + (ue.rb_allocated || 0),
                0
              )
            )
          );

          const grid = Array.from({ length: maxRB }, () =>
            Array(ttiKeys.length).fill(null)
          );

          ttiKeys.forEach((tti, colIdx) => {
            const ueList = Object.entries(detailed[tti]);

            let rbIndex = 0;

            ueList.forEach(([ueId, ue]) => {
              const rbCount = ue.rb_allocated || 0;

              for (let i = 0; i < rbCount; i++) {
                if (rbIndex < maxRB) {
                  grid[rbIndex][colIdx] = parseInt(ueId);
                  rbIndex++;
                }
              }
            });
          });

          setGridData({ ttiSlots: ttiKeys, grid });
        } catch (err) {
          console.error("Failed to load mock data:", err);
        }
      };

      loadMockData();
      return;
    }

  let ws;

  const start = async () => {
    try {
      // =========================
      // ШАГ 1 — ЗАПУСК СИМУЛЯЦИИ
      // =========================
      const res = await fetch("http://localhost:8000/api/v1/sim/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config), // 👈 твой config должен быть здесь
      });

      const data = await res.json();
      const runId = data.data.run_id;

      // =========================
      // ШАГ 2 — WEBSOCKET
      // =========================
      ws = new WebSocket(
        `ws://localhost:8000/api/v1/ws/simulation/${runId}/stats`
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "completed") return;
        if (msg.type !== "tti") return;

        const snap = msg.data;

        setStatsBuffer(prev => {
          const updated = [...prev, snap];

          const x = updated.map(d => d.tti);

          const graphResult = {};
          const keys = Object.keys(updated[0]?.cell || {});

          keys.forEach(key => {
            graphResult[key] = {
              label: key,
              x,
              data: updated.map(d => d.cell[key] ?? null),
            };
          });

          setGraphData(graphResult);

          const maxRB = Math.max(
            ...updated.map(d => d.resource_grid.length)
          );

          const grid = Array.from({ length: maxRB }, () =>
            Array(updated.length).fill(null)
          );

          updated.forEach((s, colIdx) => {
            let rbIndex = 0;

            s.resource_grid.forEach(cell => {
              if (rbIndex < maxRB) {
                grid[rbIndex][colIdx] = cell.ue_id;
                rbIndex++;
              }
            });
          });

          setGridData({
            ttiSlots: updated.map(d => d.tti),
            grid,
          });

          return updated;
        });
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

    } catch (err) {
      console.error("Failed to start simulation:", err);
    }
  };

  start();

  return () => {
    if (ws) ws.close();
  };
}, [useLiveMode]);

  return { graphData, gridData };
}