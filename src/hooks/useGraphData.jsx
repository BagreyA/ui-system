import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function useGraphData() {
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/csv_stream");

    let csvText = "";

    ws.onopen = () => {
      console.log("WebSocket connected for CSV streaming");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "headers":
          console.log("CSV headers received:", msg.data);
          break;

        case "row":
          // собираем строки CSV
          csvText += msg.data.join(";") + "\n";
          break;

        case "completed":
          console.log("CSV streaming completed, total rows:", msg.total_rows);

          // парсим CSV через PapaParse
          Papa.parse(csvText, {
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results) => {
              const data = results.data;
              if (!data || !data.length) return;

              const keys = Object.keys(data[0]).filter((k) => k !== "tti");
              const result = {};

              keys.forEach((key) => {
                const x = data.map((row) => parseFloat(row.tti?.replace(",", ".") || 0));
                let y = data.map((row) => {
                  const val = row[key];
                  return val === undefined || val === "" ? null : parseFloat(val.replace(",", "."));
                });

                // Heatmap
                if (key === "dl_rb_utilization_pct_per_rb") {
                  y = data
                    .map((row) =>
                      Object.keys(row)
                        .filter((k) => k.startsWith("RB"))
                        .map((rbKey) => parseFloat(row[rbKey]?.replace(",", ".") || 0))
                    )
                    .filter((rowArr) => rowArr.length > 0);
                }

                // Boxplot для UE
                const ueColumns = Object.keys(data[0]).filter((k) => k.startsWith("UE"));
                if (ueColumns.length > 0) {
                  result["dl_throughput_kbps_per_ue"] = {
                    label: "Throughput per UE",
                    data: data.map((row) =>
                      ueColumns.map((col) => parseFloat(row[col]?.replace(",", ".") || 0))
                    ),
                  };
                }

                result[key] = { label: key, data: y, x, yLabels: x };
              });

              // SINR отдельные ключи
              const sinrKeys = ["dl_sinr_avg", "dl_sinr_min", "dl_sinr_max", "dl_sinr_std", "dl_sinr_cv_pct"];
              sinrKeys.forEach((key) => {
                if (data[0][key] !== undefined) {
                  const x = data.map((row) => parseFloat(row.tti?.replace(",", ".") || 0));
                  const y = data.map((row) => parseFloat(row[key]?.replace(",", ".") || 0));
                  result[key] = { label: key, data: y, x };
                }
              });

              // UE SINR
              const ueSinrColumns = Object.keys(data[0]).filter((k) => k.startsWith("UE") && k.endsWith("_SINR"));
              if (ueSinrColumns.length > 0) {
                result["UE_SINR"] = {
                  label: "UE SINR",
                  x: data.map((row) => parseFloat(row.tti?.replace(",", ".") || 0)),
                  data: ueSinrColumns.map((col) =>
                    data.map((row) => parseFloat(row[col]?.replace(",", ".") || 0))
                  ),
                };
              }

              // Cell Throughput
              if (data[0]["dl_throughput_sum_kbps"] !== undefined) {
                const x = data.map((row) => parseFloat(row.tti?.replace(",", ".") || 0));
                const y = data.map((row) => parseFloat(row["dl_throughput_sum_kbps"]?.replace(",", ".") || 0));
                result["dl_throughput_sum_kbps"] = { label: "Cell Throughput", x, data: y };
              }

              setGraphData(result);
            },
          });
          break;

        case "error":
          console.error("CSV WebSocket error:", msg.message);
          break;

        default:
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => ws.close();
  }, []);

  return graphData;
}