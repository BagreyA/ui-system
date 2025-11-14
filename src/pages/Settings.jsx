import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import trashIcon from "../icons/trash.png";

export default function Settings() {
  const [selectedConfig, setSelectedConfig] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [selectedMovement, setSelectedMovement] = useState("");
  const [selectedTraffic, setSelectedTraffic] = useState("");
  const [selectedScheduler, setSelectedScheduler] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [movementParams, setMovementParams] = useState({});
  const navigate = useNavigate();

  const handleMovementParamChange = (param, value) => {
    setMovementParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

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
    if (
      selectedConfig &&
      userCount > 0 &&
      selectedMovement &&
      selectedTraffic &&
      selectedScheduler
    ) {
      console.log("Запуск симуляции с параметрами:", {
        config: selectedConfig,
        users: userCount,
        movement: selectedMovement,
        traffic: selectedTraffic,
        scheduler: selectedScheduler
      });
      navigate("/visualization");
    }
  };

  const increaseUsers = () => setUserCount(prev => prev + 1);
  const decreaseUsers = () => setUserCount(prev => (prev > 0 ? prev - 1 : 0));

  const handleLoadConfig = () => {
    if (selectedConfig) {
      console.log(`Загрузка конфигурации: ${selectedConfig}`);
      // Логика загрузки конфигурации
    }
  };

  const handleConfigSelect = (config) => {
    setSelectedConfig(config);
    setIsConfigOpen(false);
  };

  return (
    <div style={{ marginLeft: "30px" }}>
      <h1 style={{
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
          marginRight: "50px",
          marginTop: "-15px"
        }}
      >
        {/* Левый столбик */}
        <div>
          {/* Список сохранённых конфигураций */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "8px"
              }}
            >
              Список сохранённых конфигураций
            </h3>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0", flex: 1 }}>
                {/* Плашка выбора конфигурации */}
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    style={{
                      border: "2px solid #E6E6E6",
                      borderRadius: "8px 0 0 8px",
                      padding: "6px 12px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "12px",
                      fontFamily: "sans-serif",
                      color: selectedConfig ? "#2A3D4C" : "#A7A7AA",
                      width: "240px",
                      height: "21px"
                    }}
                  >
                    <span>{selectedConfig || "Выберите конфигурацию"}</span>
                    <span style={{
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid #00A7C1",
                        transform: isConfigOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        marginLeft: "8px"
                      }}
                    />
                  </div>

                  {/* Выпадающий список */}
                  {isConfigOpen && (
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "2px solid #d3d3d3",
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        zIndex: 10,
                        maxHeight: "200px",
                        overflowY: "auto",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      {configurations.map((config, index) => (
                        <div key={index}
                          onClick={() => handleConfigSelect(config)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontFamily: "sans-serif",
                            color: "#2A3D4C",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: selectedConfig === config ? "#e6f7fa" : "white",
                            transition: "background-color 0.2s ease"
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = selectedConfig === config ? "#e6f7fa" : "white")
                          }
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
                    backgroundColor: "#00A7C1",
                    color: "white",
                    fontSize: "15px",
                    width: "100px",
                    height: "36px",
                    borderRadius: "0 8px 8px 0",
                    border: "2px solid #00A7C1",
                    fontFamily: "sans-serif",
                    cursor: selectedConfig ? "pointer" : "not-allowed",
                    transition: "background-color 0.2s ease",
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConfig) e.target.style.backgroundColor = "#00A7C1";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConfig) e.target.style.backgroundColor = "#00A7C1";
                  }}
                  disabled={!selectedConfig}
                >
                  Загрузить
                </button>
              </div>
            </div>
          </div>

          {/* Пользовательское устройство */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <h3 style={{
                  fontSize: "15px",
                  fontFamily: "sans-serif",
                  color: "#2A3D4C",
                  margin: 0
                }}
              >
                Пользовательское устройство
              </h3>

            {/* Контейнер с кнопками и количеством */}
              <div style={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  border: "2px solid #E6E6E6",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  marginTop: "8px"
                }}
              >
              {/* Кнопка уменьшения */}
                <button
                  onClick={decreaseUsers}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "18px",
                    color: "#7C7C80",
                    cursor: "pointer",
                    padding: "0 12px",
                    borderRight: "1px solid #d3d3d3"
                  }}
                >
                  -
                </button>
                <span style={{
                    fontSize: "15px",
                    fontFamily: "sans-serif",
                    color: "#2A3D4C",
                    minWidth: "30px",
                    textAlign: "center"
                  }}
                >
                  {userCount}
                </span>

              {/* Кнопка увеличения */}
                <button
                  onClick={increaseUsers}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "18px",
                    color: "#7C7C80",
                    cursor: "pointer",
                    padding: "0 12px",
                    borderLeft: "1px solid #d3d3d3"
                  }}
                >
                  +
                </button>
              </div>
            </div>

          {/* Подсказка под параметром */}
            <span style={{
                fontSize: "12px",
                color: "#999",
                fontFamily: "sans-serif",
                marginTop: "4px",
                display: "block",
                marginLeft: "245px"
              }}
            >
              кол-во устройств
            </span>

          {/* Всплывающие блоки для уникальных идентификаторов (до 5 пользователей) */}
            {Array.from({ length: Math.min(userCount, 5) }, (_, i) => (
              <div key={i}
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "fit-content"
                }}
              >
                <span style={{
                    fontSize: "14px",
                    color: "#222933",
                    fontFamily: "sans-serif"
                  }}
                >
                  Уникальный идентификатор пользователя {i + 1}
                </span>
                <input type="text"
                  placeholder={`ID ${i + 1}`}
                  style={{
                    fontSize: "14px",
                    padding: "4px 6px",
                    border: "1px solid #d3d3d3",
                    borderRadius: "4px",
                    width: "120px",
                    outline: "none"
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #00A7C1")}
                  onBlur={(e) => (e.target.style.border = "1px solid #d3d3d3")}
                />
              </div>
            ))}
          </div>
        </div>
 
        {/* Правый столбик */}
        <div style={{ marginTop: "15px" }}>
          {/* Модели передвижения */}
          <div style={{ marginBottom: "30px", display: "flex", gap: "20px", alignItems: "flex-start" }}
          >
            <h3 style={{
                width: "220px",
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                margin: 0,
                flexShrink: 0
              }}
            >
              Модели передвижения абонентов
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {movementModels.map((model, index) => (
                <label key={index} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "2px solid #00A7C1",
                      marginRight: "6px",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <input type="radio"
                      name="movement"
                      value={model}
                      checked={selectedMovement === model}
                      onChange={(e) => setSelectedMovement(e.target.value)}
                      style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                    {selectedMovement === model && (
                      <div style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#4EC8F0"
                        }}
                      />
                    )}
                  </div>
                  <span style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C" }}>
                    {model}
                  </span>
                </label>
              ))}

            {/* Блок дополнительных параметров */}
            {selectedMovement && (
              <div style={{ marginTop: "15px", marginLeft: "-240px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                  {/* Заголовок слева */}
                  <h3 style={{
                    fontSize: "15px",
                    fontFamily: "sans-serif",
                    color: "#222933",
                    margin: 0,
                    minWidth: "200px"
                  }}>
                    Дополнительные параметры
                  </h3>

                  {/* Блок X / Y / pause_time */}
                  <div style={{ display: "flex", gap: "40px" }}>

                    {/* --- X column --- */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                      {/* X min */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{
                          width: "40px",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#222933",
                          fontFamily: "sans-serif",
                          marginTop: "-10px"
                        }}>x:</span>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          width: "110px",
                          justifyContent: "space-between",
                          fontFamily: "sans-serif"
                        }}>
                          <span style={{ fontSize: "12px", color: "#999" }}>min</span>
                          <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                          <input
                            type="number"
                            value={movementParams.x_min || ""}
                            onChange={(e) => handleMovementParamChange("x_min", e.target.value)}
                            style={{
                              width: "50px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              textAlign: "right",
                              fontFamily: "sans-serif",
                              MozAppearance: "textfield",
                              WebkitAppearance: "none",
                              appearance: "none"
                            }}
                          />
                        </div>
                      </div>

                      {/* X max */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "40px", fontWeight: 600 }}></span>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          width: "110px",
                          justifyContent: "space-between",
                          fontFamily: "sans-serif"
                        }}>
                          <span style={{ fontSize: "12px", color: "#999" }}>max</span>
                          <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                          <input
                            type="number"
                            value={movementParams.x_max || ""}
                            onChange={(e) => handleMovementParamChange("x_max", e.target.value)}
                            style={{
                              width: "50px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              textAlign: "right",
                              fontFamily: "sans-serif",
                              MozAppearance: "textfield",
                              WebkitAppearance: "none",
                              appearance: "none"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* --- Y column --- */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                      {/* Y min */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{
                          width: "40px",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#222933",
                          fontFamily: "sans-serif",
                          marginTop: "-10px"
                        }}>y:</span>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          width: "110px",
                          justifyContent: "space-between",
                          fontFamily: "sans-serif"
                        }}>
                          <span style={{ fontSize: "12px", color: "#999" }}>min</span>
                          <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                          <input
                            type="number"
                            value={movementParams.y_min || ""}
                            onChange={(e) => handleMovementParamChange("y_min", e.target.value)}
                            style={{
                              width: "50px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              textAlign: "right",
                              fontFamily: "sans-serif",
                              MozAppearance: "textfield",
                              WebkitAppearance: "none",
                              appearance: "none"
                            }}
                          />
                        </div>
                      </div>

                      {/* Y max */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "40px", fontWeight: 600 }}></span>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          width: "110px",
                          justifyContent: "space-between",
                          fontFamily: "sans-serif"
                        }}>
                          <span style={{ fontSize: "12px", color: "#999" }}>max</span>
                          <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                          <input
                            type="number"
                            value={movementParams.y_max || ""}
                            onChange={(e) => handleMovementParamChange("y_max", e.target.value)}
                            style={{
                              width: "50px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              textAlign: "right",
                              fontFamily: "sans-serif",
                              MozAppearance: "textfield",
                              WebkitAppearance: "none",
                              appearance: "none"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* --- pause_time --- */}
                    {(selectedMovement === "Random Waypoint Model" || selectedMovement === "Random Direction Model") && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{
                            width: "80px",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#222933",
                            fontFamily: "sans-serif",
                            marginTop: "-10px"
                          }}>паузы:</span>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #d3d3d3",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            width: "110px",
                            justifyContent: "space-between",
                            fontFamily: "sans-serif"
                          }}>
                            <input
                              type="number"
                              value={movementParams.pause_time || ""}
                              onChange={(e) => handleMovementParamChange("pause_time", e.target.value)}
                              style={{
                                width: "80px",
                                border: "none",
                                outline: "none",
                                fontSize: "14px",
                                textAlign: "right",
                                fontFamily: "sans-serif",
                                MozAppearance: "textfield",
                                WebkitAppearance: "none",
                                appearance: "none"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* Модель трафика */}
          <div style={{ marginBottom: "30px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <h3 style={{ width: "220px", fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C", margin: 0, flexShrink: 0 }}>
              Модель трафика
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {trafficModels.map((model, index) => (
                <label key={index} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #00A7C1", marginRight: "6px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <input type="radio" name="traffic" value={model} checked={selectedTraffic === model} onChange={(e) => setSelectedTraffic(e.target.value)} style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                    {selectedTraffic === model && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4EC8F0" }} />}
                  </div>
                  <span style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C" }}>{model}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Блок дополнительных параметров для трафика */}
          {selectedTraffic && (
            <div style={{ marginTop: "15px", marginBottom: "25px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Заголовок */}
                <h3 style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C", margin: 0 }}>
                  Дополнительные параметры трафика
                </h3>

                {/* Параметры */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {selectedTraffic === "Poisson Model" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "300px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                          Средняя интенсивность трафика:
                        </span>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #d3d3d3", borderRadius: "6px", padding: "4px 8px", width: "110px", justifyContent: "space-between", position: "relative" }}>
                          <input
                            type="number"
                            value={movementParams.packet_rate || ""}
                            onChange={(e) => handleMovementParamChange("packet_rate", e.target.value)}
                            style={{ width: "80px", border: "none", outline: "none", fontSize: "14px", textAlign: "right", fontFamily: "sans-serif" }}
                          />
                          <span style={{ position: "absolute", right: "8px", color: "#999999", fontSize: "12px" }}>пакет/сек</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTraffic === "On Off Model" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                      {[
                        { label: "Средняя длительность активной фазы", unit: "сек" },
                        { label: "Средняя длительность неактивной фазы", unit: "сек" },
                        { label: "Интенсивность трафика в активной фазе", unit: "пакет/сек" }
                      ].map(({ label, unit }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "300px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                            {label}:
                          </span>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #d3d3d3", borderRadius: "6px", padding: "4px 8px", width: "110px", justifyContent: "space-between", position: "relative" }}>
                            <input
                              type="number"
                              value={movementParams[label] || ""}
                              onChange={(e) => handleMovementParamChange(label, e.target.value)}
                              style={{ width: "80px", border: "none", outline: "none", fontSize: "14px", textAlign: "right", fontFamily: "sans-serif" }}
                            />
                            <span style={{ position: "absolute", right: "8px", color: "#999999", fontSize: "12px" }}>{unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Планировщик */}
          <div style={{ marginBottom: "30px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <h3 style={{ width: "220px", fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C", margin: 0, flexShrink: 0 }}>
              Планировщик
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {schedulers.map((scheduler, index) => (
                <label key={index} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid #00A7C1",
                    marginRight: "6px",
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
                      style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                    {selectedScheduler === scheduler && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4EC8F0" }} />}
                  </div>
                  <span style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C" }}>{scheduler}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
    </div>

      {/* Кнопка "Запустить симуляцию" */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <button
          style={{
            backgroundColor:
              selectedConfig &&
              userCount > 0 &&
              selectedMovement &&
              selectedTraffic &&
              selectedScheduler
                ? "#00A7C1"
                : "#80D3E0",
            color: "white",
            fontSize: "18px",
            width: "200px",
            height: "45px",
            borderRadius: "8px",
            border: "2px solid white",
            fontFamily: "sans-serif",
            cursor:
              selectedConfig &&
              userCount > 0 &&
              selectedMovement &&
              selectedTraffic &&
              selectedScheduler
                ? "pointer"
                : "not-allowed",
            transition: "background-color 0.2s ease",
            opacity:
              selectedConfig &&
              userCount > 0 &&
              selectedMovement &&
              selectedTraffic &&
              selectedScheduler
                ? 1
                : 0.6
          }}
          onClick={handleStartSimulation}
          disabled={
            !(
              selectedConfig &&
              userCount > 0 &&
              selectedMovement &&
              selectedTraffic &&
              selectedScheduler
            )
          }
        >
          Запустить симуляцию
        </button>
      </div>

      {/* Кнопка очистки параметров */}
      <button
        onClick={() => {
          setSelectedConfig("");
          setUserCount(0);
          setSelectedMovement("");
          setSelectedTraffic("");
          setSelectedScheduler("");
        }}
        style={{
          position: "fixed",
          right: "30px",
          bottom: "30px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          borderRadius: "50%",
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Очистить параметры"
      >
        <img src={trashIcon} alt="Очистить" style={{ width: "24px", height: "24px" }} />
      </button>
    </div>
  );
}