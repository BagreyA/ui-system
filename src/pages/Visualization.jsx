import React, { useState } from "react";

export default function Visualization({ showParamsPanel, onToggleParams }) {
  const [selectedGraphs, setSelectedGraphs] = useState([]);

  const graphs = [
    { name: "Cell Throughput", description: "Общая пропускная способность соты" },
    { name: "User Throughput", description: "Пропускная способность пользователя" },
    { name: "Average User Throughput", description: "Средняя пропускная способность пользователя" },
    { name: "Fairness (Jain Index)", description: "Индекс справедливости Джайна" },
    { name: "Spectral Efficiency", description: "Спектральная эффективность" },
    { name: "Scheduler Efficiency", description: "Эффективность планировщика" }
  ];

  const toggleGraphSelection = (graphName) => {
    if (selectedGraphs.includes(graphName)) {
      setSelectedGraphs(selectedGraphs.filter(name => name !== graphName));
    } else {
      setSelectedGraphs([...selectedGraphs, graphName]);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Панель параметров (слева от основного контента) */}
      {showParamsPanel && (
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
          // Стили для кастомизации скроллбара
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
            Параметры графиков
          </div>

          {/* Выбор графиков для отображения */}
          <div style={{ marginBottom: "25px" }}>
            <div style={{ 
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#222933"
            }}>
              Выбор графиков для отображения
            </div>
            
            {graphs.map((graph, index) => (
              <div key={index} style={{ marginBottom: "12px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedGraphs.includes(graph.name)}
                    onChange={() => toggleGraphSelection(graph.name)}
                    style={{ 
                      marginRight: "10px",
                      marginTop: "2px"
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold", marginBottom: "2px", fontSize: "13px" }}>
                      {graph.name}
                    </div>
                    <div style={{ 
                      fontSize: "11px", 
                      color: "#666",
                      fontStyle: "italic"
                    }}>
                      {graph.description}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Остальные разделы параметров... */}
          <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "20px 0" }} />

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#222933" }}>
              Параметры передвижения UE
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Настройки мобильности пользовательских устройств
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#222933" }}>
              Параметры трафика
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Настройки генерации трафика
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#222933" }}>
              Пользовательское устройство
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Параметры UE
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#222933" }}>
              Планировщик
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Настройки алгоритма планирования
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#222933" }}>
              Параметры канала
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Модели канальной передачи
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px", color: "#222933" }}>
              Базовая станция
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Параметры eNodeB
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div style={{ 
        flex: 1, 
        marginLeft: showParamsPanel ? "0" : "30px",
        paddingTop: "20px",
        paddingLeft: "20px"
      }}>
        <h1 
          style={{
            fontSize: "30px",
            fontFamily: "sans-serif",
            color: "#222933",
            marginBottom: "20px"
          }}
        >
          Графики
        </h1>
        
        <p 
          style={{
            fontSize: "15px",
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            lineHeight: "1.5",
            marginBottom: "20px"
          }}
        >
          Графики подготавливаются.
        </p>
        
      </div>
    </div>
  );
}