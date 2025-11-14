import React from "react";

export default function About() {
  return (
    <div style={{ marginLeft: "30px" }}>
      <h1 
        style={{
          fontSize: "30px",
          fontFamily: "sans-serif",
          color: "#222933",
          marginBottom: "20px"
        }}
      >
        Команда разработки
      </h1>
      <p 
        style={{
          fontSize: "15px",
          fontFamily: "sans-serif",
          color: "#2A3D4C",
          lineHeight: "1.5"
        }}
      >
        Раздел пока находится в разработке и будет завершен на завершающем этапе проекта.
      </p>
    </div>
  );
}