import React from "react";
import UPlotGraph from "./UPlotGraph";

// Компонент для набора графиков UE (по каждому UE отдельный subplot)
export default function SubplotsLineUE({ series, width, height }) {
  const cols = 2; // Количество колонок
  const numUsers = series.data.length;
  const rows = Math.ceil(numUsers / cols);

  const subplotWidth = Math.floor(width / cols) - 10;
  const subplotHeight = Math.floor(height / rows) - 10;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${subplotWidth}px)`,
        gridAutoRows: `${subplotHeight}px`,
        gap: "10px",
        width,
        height,
        overflow: "auto",
      }}
    >
      {series.data.map((ueData, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid var(--text-secondary)",
            borderRadius: "6px",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
          }}
        >
        <div style={{ textAlign: "center", fontSize: "12px", marginBottom: "4px" }}>
          Пропускная способность UE{series.userIds[idx]} (Мбит/с)
        </div>

          <UPlotGraph
            width={subplotWidth}
            height={subplotHeight - 20}
            series={{
              label: `UE${series.userIds[idx]}`,
              x: series.x,       // Время (TTI, мс)
              data: ueData,      // Пропускная способность (Мбит/с)
            }}
            type="line"
            xLabel="Время (мс)"
            yLabel="Пропускная способность (Мбит/с)"
          />

          <div style={{ fontSize: "10px", textAlign: "center", marginTop: "2px" }}>Время (мс)</div>
        </div>
      ))}
    </div>
  );
}
