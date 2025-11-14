import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [selectedConfig, setSelectedConfig] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [selectedMovement, setSelectedMovement] = useState("");
  const [selectedTraffic, setSelectedTraffic] = useState("");
  const [selectedScheduler, setSelectedScheduler] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const navigate = useNavigate();

  const configurations = [
    "Конфигурация по умолчанию",
    "Высокая нагрузка",
    "Низкая задержка", 
    "Максимальная пропускная способность",
    "Сбалансированная"
  ];

  const movementModels = [
    "Random Walk Model",
    "Random Waypoint Model", 
    "Random Direction Model",
    "Gauss Markov Model"
  ];

  const trafficModels = [
    "Poisson Model",
    "On Off Model",
    "MMPP Model"
  ];

  const schedulers = [
    "Round Robin",
    "BestCQI", 
    "ProportionalFair"
  ];

  const handleStartSimulation = () => {
    if (selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler) {
      console.log("Запуск симуляции с параметрами:", {
        config: selectedConfig,
        users: userCount,
        movement: selectedMovement,
        traffic: selectedTraffic,
        scheduler: selectedScheduler
      });
      
      // Переход на страницу графиков
      navigate("/visualization");
    }
  };

  const increaseUsers = () => {
    setUserCount(prev => prev + 1);
  };

  const decreaseUsers = () => {
    setUserCount(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleLoadConfig = () => {
    if (selectedConfig) {
      console.log(`Загрузка конфигурации: ${selectedConfig}`);
      // Здесь будет логика загрузки конфигурации
    }
  };

  const handleConfigSelect = (config) => {
    setSelectedConfig(config);
    setIsConfigOpen(false);
  };

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
        Основные настройки
      </h1>

      {/* Контейнер с двумя столбиками */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "40px",
        marginLeft: "20px",
        marginRight: "50px"
      }}>
        
        {/* Левый столбик */}
        <div>
          {/* Список сохранённых конфигураций с выпадающим списком */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "15px"
              }}
            >
              Список сохранённых конфигураций
            </h3>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px",
              marginBottom: "15px"
            }}>
              {/* Выпадающий список */}
              <div style={{ position: "relative", flex: 1 }}>
                <div
                  onClick={() => setIsConfigOpen(!isConfigOpen)}
                  style={{
                    border: "2px solid #00A7C1",
                    borderRadius: "8px",
                    padding: "10px 15px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "15px",
                    fontFamily: "sans-serif",
                    color: selectedConfig ? "#2A3D4C" : "#999"
                  }}
                >
                  <span>{selectedConfig || "Выберите конфигурацию"}</span>
                  <span style={{ 
                    transform: isConfigOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}>
                    ▼
                  </span>
                </div>
                
                {isConfigOpen && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "2px solid #00A7C1",
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                    zIndex: 10,
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                  }}>
                    {configurations.map((config, index) => (
                      <div
                        key={index}
                        onClick={() => handleConfigSelect(config)}
                        style={{
                          padding: "10px 15px",
                          cursor: "pointer",
                          fontSize: "15px",
                          fontFamily: "sans-serif",
                          color: "#2A3D4C",
                          borderBottom: "1px solid #f0f0f0",
                          backgroundColor: selectedConfig === config ? "#e6f7fa" : "white",
                          transition: "background-color 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = selectedConfig === config ? "#e6f7fa" : "white";
                        }}
                      >
                        {config}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Кнопка Загрузить */}
              <button
                onClick={handleLoadConfig}
                style={{
                  backgroundColor: selectedConfig ? "#00A7C1" : "#cccccc",
                  color: "white",
                  fontSize: "14px",
                  width: "120px",
                  height: "44px",
                  borderRadius: "8px",
                  border: "2px solid white",
                  fontFamily: "sans-serif",
                  cursor: selectedConfig ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s ease",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (selectedConfig) {
                    e.target.style.backgroundColor = "#0095B3";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConfig) {
                    e.target.style.backgroundColor = "#00A7C1";
                  }
                }}
                disabled={!selectedConfig}
              >
                Загрузить
              </button>
            </div>
          </div>

          {/* Пользовательское устройство */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "15px"
              }}
            >
              Пользовательское устройство
            </h3>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "2px solid #00A7C1",
                borderRadius: "8px",
                padding: "5px 10px",
                backgroundColor: "white"
              }}>
                <button
                  onClick={decreaseUsers}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "18px",
                    color: "#00A7C1",
                    cursor: "pointer",
                    padding: "0 8px"
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: "15px",
                  fontFamily: "sans-serif",
                  color: "#2A3D4C",
                  margin: "0 10px",
                  minWidth: "30px",
                  textAlign: "center"
                }}>
                  {userCount}
                </span>
                <button
                  onClick={increaseUsers}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "18px",
                    color: "#00A7C1",
                    cursor: "pointer",
                    padding: "0 8px"
                  }}
                >
                  +
                </button>
              </div>
              <span style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C"
              }}>
                Количество устройств
              </span>
            </div>
          </div>
        </div>

        {/* Правый столбик */}
        <div>
          {/* Модели передвижения абонентов */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "15px"
              }}
            >
              Модели передвижения абонентов
            </h3>
            
            {movementModels.map((model, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid #00A7C1",
                    marginRight: "10px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <input
                      type="radio"
                      name="movement"
                      value={model}
                      checked={selectedMovement === model}
                      onChange={(e) => setSelectedMovement(e.target.value)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        cursor: "pointer",
                        width: "100%",
                        height: "100%"
                      }}
                    />
                    {selectedMovement === model && (
                      <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#4EC8F0",
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: "15px",
                    fontFamily: "sans-serif",
                    color: "#2A3D4C"
                  }}>
                    {model}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* Модели трафика */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "15px"
              }}
            >
              Модели трафика
            </h3>
            
            {trafficModels.map((model, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid #00A7C1",
                    marginRight: "10px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <input
                      type="radio"
                      name="traffic"
                      value={model}
                      checked={selectedTraffic === model}
                      onChange={(e) => setSelectedTraffic(e.target.value)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        cursor: "pointer",
                        width: "100%",
                        height: "100%"
                      }}
                    />
                    {selectedTraffic === model && (
                      <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#4EC8F0",
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: "15px",
                    fontFamily: "sans-serif",
                    color: "#2A3D4C"
                  }}>
                    {model}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* Планировщик */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "15px"
              }}
            >
              Планировщик
            </h3>
            
            {schedulers.map((scheduler, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid #00A7C1",
                    marginRight: "10px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <input
                      type="radio"
                      name="scheduler"
                      value={scheduler}
                      checked={selectedScheduler === scheduler}
                      onChange={(e) => setSelectedScheduler(e.target.value)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        cursor: "pointer",
                        width: "100%",
                        height: "100%"
                      }}
                    />
                    {selectedScheduler === scheduler && (
                      <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#4EC8F0",
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: "15px",
                    fontFamily: "sans-serif",
                    color: "#2A3D4C"
                  }}>
                    {scheduler}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка "Запустить симуляцию" - по центру */}
      <div style={{ 
        display: "flex",
        justifyContent: "center",
        marginTop: "30px"
      }}>
        <button
          style={{
            backgroundColor: (selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler) 
              ? "#00A7C1" : "#cccccc",
            color: "white",
            fontSize: "18px",
            width: "200px",
            height: "45px",
            borderRadius: "8px",
            border: "2px solid white",
            fontFamily: "sans-serif",
            cursor: (selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler) 
              ? "pointer" : "not-allowed",
            transition: "background-color 0.2s ease",
            opacity: (selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler) ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler) {
              e.target.style.backgroundColor = "#0095B3";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler) {
              e.target.style.backgroundColor = "#00A7C1";
            }
          }}
          onClick={handleStartSimulation}
          disabled={!(selectedConfig && userCount > 0 && selectedMovement && selectedTraffic && selectedScheduler)}
        >
          Запустить симуляцию
        </button>
      </div>
    </div>
  );
}