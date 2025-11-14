import React from "react";
import { useNavigate } from "react-router-dom";

import OverviewIcon from "../icons/overview.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen justify-center items-center bg-gray-50">
      {/* Основная область */}
      <main className="flex flex-col justify-center items-center relative text-center w-full px-10" style={{ marginTop: "-100px" }}>
        <h1 
          className="font-bold"
          style={{
            fontFamily: "sans-serif",
            color: "#222933",
            fontSize: "35px",
            textAlign: "center",
            maxWidth: "1200px",
            marginBottom: "30px"
          }}
        >
          Добро пожаловать в LTE Network Simulator!
        </h1>

        <p 
          className="mb-10 w-full"
          style={{
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            fontSize: "20px",
            textAlign: "center",
            width: "100%",
            maxWidth: "800px",
            marginBottom: "40px"
          }}
        >
          Моделируйте работу LTE-сети, распределение ресурсов между пользователями
          и анализируйте ключевые метрики: пропускную способность, справедливость и
          эффективность планировщика
        </p>

        <button
          style={{
            backgroundColor: "#00A7C1",
            color: "white",
            fontSize: "25px", // Такой же размер как у заголовка
            width: "150px", // Уменьшил ширину
            height: "60px", // Уменьшил высоту
            borderRadius: "12px",
            border: "2px solid white",
            fontFamily: "sans-serif",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            marginTop: "40px" // Добавил отступ сверху
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#0095B3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#00A7C1"}
          onClick={() => navigate("/settings")}
        >
          Начать
        </button>
      </main>

      <div 
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#00A7C1",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid white",
          fontFamily: "sans-serif",
          padding: "0",
          gap: "0px",
          opacity: "0.6" // Добавил прозрачность для визуального обозначения неактивности
        }}
      >
        <img 
          src={OverviewIcon}
          alt="обзор" 
          width="34" 
          height="34"
        />
        <span 
          style={{
            fontSize: "11px",
            fontFamily: "sans-serif",
            color: "white"
          }}
        >
          обзор
        </span>
      </div>
    </div>
  );
}