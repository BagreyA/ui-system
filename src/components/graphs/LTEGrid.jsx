// FILE: components/graphs/LTEGrid.jsx
import React, { useState } from "react";

const ueColors = [
  "#00A7C1",
  "#FF6B6B",
  "#ffb938",
  "#83ff83",
  "#d146ff",
  "#FFD700",
  "#6B6BFF",
];

export default function LTEGrid({ ttiSlots, grid, cellSize = 14 }) {
  if (!grid?.length) return null;

  const [ySize, setYSize] = useState(cellSize);

  const rbStep = 5;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >

     <div
        style={{
          position: "absolute",
          left: "-10px",
          top: "50%",
          transform: "rotate(-90deg) translateX(-50%)",
          transformOrigin: "left top",
          fontSize: "12px",
          fontFamily: "sans-serif",
          color: "var(--text)",
        }}
      >
        Частота (RB)
      </div>

      {/* ================= TOP CONTROL (STICKY) ================= */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#fff",
          padding: "6px 8px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div style={{ fontSize: "12px", color: "var(--text)", fontWeight: 600 }}>
          Y (RB size)
        </div>

        <input
          type="range"
          min="5"
          max="50"
          value={ySize}
          onChange={(e) => setYSize(Number(e.target.value))}
          style={{
            accentColor: "#00A7C1",
            width: "160px",
          }}
        />

        <div style={{ fontSize: "11px", color: "#666" }}>
          {ySize}px
        </div>
      </div>

      {/* ================= SCROLL AREA ================= */}
      <div
        style={{
          overflow: "auto",
          flex: 1,
          position: "relative",
        }}
      >

        <div style={{ display: "flex" }}>

          {/* ================= Y AXIS ================= */}
          <div
            style={{
              position: "sticky",
              left: 0,
              zIndex: 10,
              background: "#fff",
              borderRight: "1px solid #eee",
            }}
          >
            {grid.map((_, rbIdx) => (
              <div
                key={rbIdx}
                style={{
                  height: ySize,
                  width: 40,
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "6px",
                  color: rbIdx % rbStep === 0 ? "var(--text)" : "transparent",
                }}
              >
                {rbIdx}
              </div>
            ))}
          </div>

          {/* ================= GRID ================= */}
          <div>
            {grid.map((row, rbIdx) => (
              <div key={rbIdx} style={{ display: "flex" }}>
                {row.map((ueId, ttiIdx) => (
                  <div
                    key={ttiIdx}
                    style={{
                      width: cellSize,
                      height: ySize,
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

        {/* ================= X AXIS (STICKY) ================= */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 15,
            background: "#fff",
            borderTop: "1px solid #eee",
            display: "flex",
            marginLeft: 40,
          }}
        >
          {ttiSlots?.map((tti, idx) => {
            return (
              <div
                key={idx}
                style={{
                  width: cellSize,
                  minWidth: cellSize,
                  paddingLeft: "1px",
                  paddingRight: "1px",
                  fontSize: "10px",
                  textAlign: "center",
                  color: idx % 10 === 0 ? "var(--text)" : "transparent",
                }}
              >
                {tti}
              </div>
            );
          })}
        </div>

        {/* ================= X LABEL ================= */}
        <div
          style={{
            textAlign: "center",
            padding: "6px 0",
            fontSize: "12px",
            color: "var(--text)",
            borderTop: "1px solid #eee",
          }}
        >
          Время, мс (TTI)
        </div>

      </div>
    </div>
  );
}