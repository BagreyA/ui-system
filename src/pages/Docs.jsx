import React, { useState } from "react";

export default function Docs({ showDocsPanel, onToggleDocsPanel }) {
  const [activeSection, setActiveSection] = useState("graphs");

  const sections = {
    graphs: {
      title: "Параметры графиков и метрик",
      content: (
        <>
          <p style={{
            fontSize: "15px",
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            Добро пожаловать на страницу объяснения параметров визуализации и метрик симуляции.
            Здесь вы найдете описание всех второстепенных настроек, которые можно изменять на странице с графиками, чтобы анализировать результаты работы LTE-сети.
          </p>
        </>
      )
    },
    simulation: {
      title: "Параметры симуляции",
      content: (
        <>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Simulation Duration (ms)
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Общая продолжительность симуляции в миллисекундах.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Num Frames
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Количество кадров для симуляции.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Update Interval (ms)
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Интервал обновления данных в миллисекундах.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Num Users
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Количество пользователей в симуляции.
            </p>
          </div>
        </>
      )
    },
    users: {
      title: "Параметры пользователей (UE)",
      content: (
        <>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Скорость/Пауза/Alpha
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Параметры мобильности пользователя: скорость движения, время паузы, коэффициент альфа.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              x, y – текущие координаты пользователя
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Текущие координаты пользовательского оборудования на карте симуляции.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              UE Class
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Класс пользовательского оборудования.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Buffer Size
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Размер буфера пользовательского оборудования.
            </p>
          </div>
        </>
      )
    },
    traffic: {
      title: "Параметры трафика",
      content: (
        <>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              PoissonModel
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", marginBottom: "10px", fontFamily: "sans-serif" }}>
              Модель трафика Пуассона:
            </p>
            <ul style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", paddingLeft: "20px", fontFamily: "sans-serif" }}>
              <li><strong style={{ fontFamily: "sans-serif" }}>packet_rate</strong> - интенсивность пакетов</li>
              <li><strong style={{ fontFamily: "sans-serif" }}>min_packet_size</strong> - минимальный размер пакета</li>
              <li><strong style={{ fontFamily: "sans-serif" }}>max_packet_size</strong> - максимальный размер пакета</li>
            </ul>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              OnOffModel
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", marginBottom: "10px", fontFamily: "sans-serif" }}>
              Модель трафика Вкл/Выкл:
            </p>
            <ul style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", paddingLeft: "20px", fontFamily: "sans-serif" }}>
              <li><strong style={{ fontFamily: "sans-serif" }}>duration_on</strong> - продолжительность активной фазы</li>
              <li><strong style={{ fontFamily: "sans-serif" }}>duration_off</strong> - продолжительность неактивной фазы</li>
              <li><strong style={{ fontFamily: "sans-serif" }}>packet_rate</strong> - интенсивность пакетов в активной фазе</li>
            </ul>
          </div>
        </>
      )
    },
    channel: {
      title: "Параметры канала",
      content: (
        <>
          <p style={{
            fontSize: "15px",
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            Раздел с параметрами канальной передачи данных.
          </p>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Channel Model
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Модель канальной передачи данных.
            </p>
          </div>
        </>
      )
    },
    enodeb: {
      title: "Базовая станция (eNodeB)",
      content: (
        <>
          <p style={{
            fontSize: "15px",
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            Параметры базовой станции LTE.
          </p>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              eNodeB Configuration
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Конфигурация базовой станции.
            </p>
          </div>
        </>
      )
    },
    scheduler: {
      title: "Планировщик",
      content: (
        <>
          <p style={{
            fontSize: "15px",
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            Параметры алгоритма планирования ресурсов.
          </p>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#2A3D4C", marginBottom: "8px", fontFamily: "sans-serif" }}>
              Scheduler Type
            </h3>
            <p style={{ fontSize: "15px", color: "#2A3D4C", lineHeight: "1.5", fontFamily: "sans-serif" }}>
              Тип используемого планировщика.
            </p>
          </div>
        </>
      )
    }
  };

  const sectionItems = [
    { id: "graphs", label: "Параметры графиков и метрик" },
    { id: "simulation", label: "Параметры симуляции" },
    { id: "users", label: "Параметры пользователей (UE)" },
    { id: "traffic", label: "Параметры трафика" },
    { id: "channel", label: "Параметры канала" },
    { id: "enodeb", label: "Базовая станция (eNodeB)" },
    { id: "scheduler", label: "Планировщик" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Панель разделов документации (слева от основного контента) */}
      {showDocsPanel && (
        <div style={{ 
          width: "300px",
          backgroundColor: "white", 
          borderRadius: "0 22px 22px 0", 
          padding: "20px",
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#2A3D4C",
          border: "2px solid #00A7C1",
          margin: "10px 20px 10px -10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
          height: "680px",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#00A7C1 #f0f0f0"
        }}>
          {/* Стили для Webkit браузеров (Chrome, Safari, Edge) */}
          <style>
            {`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: #f0f0f0;
                border-radius: 0 4px 4px 0;
              }
              div::-webkit-scrollbar-thumb {
                background: #00A7C1;
                border-radius: 4px;
                border: 1px solid #f0f0f0;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #0095B3;
              }
            `}
          </style>

          <div style={{ 
            color: "#222933", 
            marginBottom: "20px",
            fontSize: "18px",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            Разделы документации
          </div>

          {/* Разделы документации */}
          <div style={{ marginBottom: "25px" }}>
            {sectionItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{ 
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                  color: activeSection === item.id ? "#00A7C1" : "#222933",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: activeSection === item.id ? "#e6f7fa" : "#f8f9fa",
                  border: activeSection === item.id ? "2px solid #00A7C1" : "2px solid transparent",
                  transition: "all 0.2s ease",
                  fontFamily: "sans-serif"
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Основной контент документации */}
      <div style={{ 
        flex: 1, 
        marginLeft: showDocsPanel ? "0" : "30px",
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        fontFamily: "sans-serif"
      }}>
        <h1 
          style={{
            fontSize: "30px",
            fontFamily: "sans-serif",
            color: "#222933",
            marginBottom: "20px"
          }}
        >
          Документация
        </h1>
        
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "25px"
        }}>
          <h2 style={{
            fontSize: "24px",
            fontFamily: "sans-serif",
            color: "#222933",
            marginBottom: "15px"
          }}>
            {sections[activeSection].title}
          </h2>
          
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
}