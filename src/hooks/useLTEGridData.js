import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function useLTEGridData() {
  const [gridData, setGridData] = useState({ ttiSlots: [], grid: [] });

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
          // собираем текст CSV
          csvText += msg.data.join(";") + "\n";
          break;

        case "completed":
          console.log("CSV streaming completed, total rows:", msg.total_rows);

          // парсим весь CSV через PapaParse
          Papa.parse(csvText, {
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results) => {
              const data = results.data;
              if (!data?.length) return;

              const ttiSlots = data.map((row) =>
                parseInt(row.tti?.replace(",", ".") || 0)
              );
              const maxRB = Math.max(
                ...data.map((row) => parseInt(row.dl_rb_allocated_count || 0))
              );

              const grid = Array.from({ length: maxRB }, () =>
                Array(ttiSlots.length).fill(null)
              );

              data.forEach((row, colIdx) => {
                const allocatedRBs = parseInt(
                  row.dl_rb_allocated_count?.replace(",", ".") || 0
                );
                const activeUEs = parseInt(
                  row.sch_active_ue_count?.replace(",", ".") || 0
                );

                for (let rb = 0; rb < allocatedRBs; rb++) {
                  const ueId = (rb % activeUEs) + 1;
                  grid[rb][colIdx] = ueId;
                }
              });

              setGridData({ ttiSlots, grid });
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

  return gridData;
}