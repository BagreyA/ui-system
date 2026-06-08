import { useState, useEffect } from "react";

export default function useSimulationData(useLiveMode = false) {
  const [graphData, setGraphData] = useState({});
  const [gridData, setGridData] = useState({ ttiSlots: [], grid: [] });

  useEffect(() => {
    // =========================
    // MOCK MODE (JSON FILES)
    // =========================
    if (!useLiveMode) {
      const loadMockData = async () => {
        try {
          const [statsRes, detailedRes] = await Promise.all([
            fetch("/data/sim_stats.json"),
            fetch("/data/sim_stats_detailed.json"),
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

    // =========================
    // LIVE MODE (WEBSOCKET)
    // =========================
    const ws = new WebSocket("ws://localhost:8000/api/v1/ws/json_stream");

    ws.onopen = () => {
      console.log("WebSocket connected (JSON)");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type !== "data") return;

      const stats = msg.sim_stats;
      const detailed = msg.sim_stats_detailed;

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
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => ws.close();
  }, [useLiveMode]);

  return { graphData, gridData };
}