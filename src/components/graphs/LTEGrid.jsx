// FILE: components/graphs/LTEGrid.jsx
import React from "react";

const ueColors = [
  "#00A7C1",
  "#FF6B6B",
  "#FFA500",
  "#6BFF6B",
  "#C100FF",
  "#FFD700",
  "#6B6BFF",
];

export default function LTEGrid({ ttiSlots, grid, cellSize = 14 }) {
  if (!grid.length) return null;

  const rbStep = 5;   // шаг подписей RB
  const ttiStep = 1;  // шаг подписей времени

  return (
    <div style={{ display: "inline-block" }}>
      {/* Подпись оси Y */}
      <div
        style={{
          position: "absolute",
          left: "-80px",
          top: "50%",
          transform: "rotate(-90deg) translateX(-50%)",
          transformOrigin: "left top",
          fontSize: "12px",
          fontFamily: "sans-serif",
          color: "#222933",
        }}
      >
        Частота (RB)
      </div>

      {/* Основная сетка */}
      <div style={{ display: "flex" }}>
        {/* Левая колонка с RB индексами */}
        <div>
          {grid.map((_, rbIdx) => (
            <div
              key={rbIdx}
              style={{
                height: cellSize,
                width: 30,
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "4px",
                color: rbIdx % rbStep === 0 ? "#222933" : "transparent",
              }}
            >
              {rbIdx}
            </div>
          ))}
        </div>

        {/* Сама таблица */}
        <div style={{ border: "1px solid #ccc" }}>
          {grid.map((row, rbIdx) => (
            <div key={rbIdx} style={{ display: "flex" }}>
              {row.map((ueId, ttiIdx) => (
                <div
                  key={ttiIdx}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    border: "1px solid #eee",
                    backgroundColor: ueId
                      ? ueColors[(ueId - 1) % ueColors.length]
                      : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                  }}
                >
                  {ueId || ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Нижняя ось X с TTI (0, _, 1, _, 2 ...) */}
      <div style={{ display: "flex", marginLeft: 30 }}>
        {grid[0].map((_, idx) => {
          const timeMs = idx * 0.5;
          const showLabel = Number.isInteger(timeMs);

          return (
            <div
              key={idx}
              style={{
                width: cellSize,
                fontSize: "10px",
                textAlign: "center",
                color: showLabel ? "#222933" : "transparent",
              }}
            >
              {showLabel ? timeMs : ""}
            </div>
          );
        })}
      </div>

      {/* Подпись оси X */}
      <div
        style={{
          textAlign: "center",
          marginTop: "4px",
          fontSize: "12px",
          fontFamily: "sans-serif",
          color: "#222933",
        }}
      >
        Время, мс (TTI)
      </div>
    </div>
  );
}
