import React, { useState, useEffect,  createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../contexts/SettingsContext";
import Graphs from "../components//Graphs";
import trashIcon from "../icons/trash.png";
import pauseIcon from "../icons/pause.png";
import refreshIcon from "../icons/refresh.png";

export default function Visualization({ showParamsPanel }) {
  const { t } = useTranslation("docs");

  const {
    movementParams,
    setMovementParams,
    trafficParams,
    setTrafficParams,
    schedulerParams,
    setSchedulerParams,
    userCount,
    setUserCount,
    userIds,
    setUserIds,
    selectedMovement,
    setSelectedMovement,
    selectedTraffic,
    setSelectedTraffic,
    selectedScheduler,
    setSelectedScheduler,
  } = useSettings();

  const [isO2iOpen, setIsO2iOpen] = useState(false);

  const movementModels = [
    { key: "randomWalk", label: t("settings.movement.randomWalk", "Random Walk Model") },
    { key: "randomWaypoint", label: t("settings.movement.randomWaypoint", "Random Waypoint Model") },
    { key: "randomDirection", label: t("settings.movement.randomDirection", "Random Direction Model") },
    { key: "gaussMarkov", label: t("settings.movement.gaussMarkov", "Gauss Markov Model") },
  ];

  const trafficModels = [
    { key: "poisson", label: t("settings.traffic.poisson", "Poisson Model") },
    { key: "onOff", label: t("settings.traffic.onOff", "On/Off Model") },
    { key: "mmpp", label: t("settings.traffic.mmpp", "MMPP Model") },
  ];

  const schedulers = [
    t("settings.schedulerOptions.roundRobin"),
    t("settings.schedulerOptions.bestCQI"),
    t("settings.schedulerOptions.proportionalFair"),
  ];

  const [expandedSections, setExpandedSections] = useState({
    movement: true,
    traffic: true,
    ue: true,
    scheduler: true,
    channel: true,
    enodeb: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  useEffect(() => {
    if (!movementParams || Object.keys(movementParams).length === 0) return;

    // если в movementParams уже хранится model в виде ключа – используем его
    if (movementParams.model) {
      setSelectedMovement(movementParams.model);
      return;
    }
    // fallback для старых сохранений без model — ставим ключи, не переведённые строки
    if ("alpha" in movementParams) {
      setSelectedMovement("gaussMarkov");
    } else if ("pause_time" in movementParams) {
      setSelectedMovement("randomWaypoint");
    } else {
      setSelectedMovement("randomWalk");
    }
  }, [movementParams]);

  const handleSelectMovement = (key) => {
    setSelectedMovement(key);

    let defaultParams = {};
    switch(key) {
      case "randomWalk":
        defaultParams = { x_min: 0, x_max: 100, y_min: 0, y_max: 100 };
        break;
      case "randomWaypoint":
      case "randomDirection":
        defaultParams = { x_min: 0, x_max: 100, y_min: 0, y_max: 100, pause_time: 0 };
        break;
      case "gaussMarkov":
        defaultParams = { x_min: 0, x_max: 100, y_min: 0, y_max: 100, alpha: 0.75, boundary_threshold: 5 };
        break;
    }

    // сохраняем тоже model = key, чтобы чтение из movementParams было предсказуемым
    defaultParams.model = key;
    setMovementParams(defaultParams);
  };

  const handleSelectScheduler = (model) => {
    setSelectedScheduler(model);
    setSchedulerParams({});
  };

  // --- Обработчики изменения параметров ---
  const handleMovementParamChange = (param, value) => {
    setMovementParams(prev => ({ ...prev, [param]: value }));
  };

  const handleSchedulerParamChange = (param, value) => {
    setSchedulerParams(prev => ({ ...prev, [param]: value }));
  };

  // --- UI состояния для графиков и пользователей ---
  const [selectedGraphs, setSelectedGraphs] = useState([]);
  const [isGraphsOpen, setIsGraphsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [selectedChannelModel, setSelectedChannelModel] = useState("");
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("UE1");
  const ueList = ["UE1", "UE2", "UE3", "UE4"]; // пока фиксированно
  
  const toggleGraphSelection = (key) => {
    setSelectedGraphs(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    if (!trafficParams || Object.keys(trafficParams).length === 0) return;

    const savedModel = Object.keys(trafficParams)[0]; // берём первый ключ
    if (savedModel && savedModel !== selectedTraffic) {
      setSelectedTraffic(savedModel);
    }
  }, [trafficParams, selectedTraffic]);


  const handleSelectTraffic = (model) => {
    setSelectedTraffic(model);

    const defaults = {
      [t("settings.traffic.poisson", "Poisson Model")]: { packet_rate: 1 },
      [t("settings.traffic.onOff", "On/Off Model")]: { duration_on: 1, duration_off: 1, packet_rate: 1 },
      [t("settings.traffic.mmpp", "MMPP Model")]: { lambda0: 1, lambda1: 5, p01: 0.3, p10: 0.2 }
    }
    setTrafficParams({ [model]: defaults[model] });
  };

  const handleTrafficParamChange = (param, value) => {
    if (!selectedTraffic) return;

    setTrafficParams(prev => ({
      ...prev,
      [selectedTraffic]: {
        ...prev[selectedTraffic],
        [param]: value
      }
    }));
  };

  const graphs = [
    { key: "cellThroughput", name: t("graphs.cellThroughput", "Cell Throughput") },
    { key: "userThroughput", name: t("graphs.userThroughput", "User Throughput") }, // карта пользователей
    { key: "averageUserThroughput", name: t("graphs.averageUserThroughput", "Average User Throughput") },
    { key: "fairnessJain", name: t("graphs.fairnessJain", "Fairness Jain Index") },
    { key: "spectralEfficiency", name: t("graphs.spectralEfficiency", "Spectral Efficiency") },
    { key: "schedulerEfficiency", name: t("graphs.schedulerEfficiency", "Scheduler Efficiency") },
  ];

  // Инициализация состояния каналов
  const [channelParams, setChannelParams] = useState({
    RMa: { W: 20.0, h: 5.0, cond_update_period: 0.0 },
    UMa: { cond_update_period: 0.0, o2i_model: "low" },
    UMi: { cond_update_period: 0.0, o2i_model: "low" }
  });

  const handleSelectChannelModel = (model) => {
    setSelectedChannelModel(model);

    setChannelParams(prev => ({
      ...prev,
      [model]: {
        W: prev[model]?.W ?? (model === "RMa" ? 20 : undefined),
        h: prev[model]?.h ?? (model === "RMa" ? 5 : undefined),
        cond_update_period: prev[model]?.cond_update_period ?? 0.0,
        o2i_model: prev[model]?.o2i_model ?? "low"
      }
    }));
  };

  const [ueParams, setUeParams] = useState({
    x: 0.0,
    y: 0.0,
    buffer_size: 1048576,
    ue_class: "pedestrian"
  });

  // Для трафика
  const handlePoissonParamChange = (param, value) => {
    setTrafficParams(prev => ({
      ...prev,
      poisson: { ...prev.poisson, [param]: value }
    }));
  };

  const [bsParams, setBsParams] = useState({
    x: 0.0,
    y: 0.0,
    height: 35.0,
    frequency_GHz: 1.8,
    bandwidth: 10
  });

    // Функция полной очистки параметров
  const handleResetAll = () => {
    setSelectedMovement("");
    setSelectedTraffic("");
    setSelectedScheduler("");
    setMovementParams({});
    setTrafficParams({});
    setSchedulerParams({});
    setUserCount(0);
    setUserIds([]);

    // Очистка локальных стейтов
    setSelectedGraphs([]);
    setChannelParams({
      RMa: { W: 20.0, h: 5.0, cond_update_period: 0.0 },
      UMa: { cond_update_period: 0.0, o2i_model: "low" },
      UMi: { cond_update_period: 0.0, o2i_model: "low" }
    });
    setBsParams({
      x: 0.0,
      y: 0.0,
      height: 35.0,
      frequency_GHz: 1.8,
      bandwidth: 10
    });
    setUeParams({
      x: 0.0,
      y: 0.0,
      buffer_size: 1048576,
      ue_class: "pedestrian"
    });
    setSelectedChannelModel("");
  };
  const controlButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Панель параметров (слева от основного контента) */}
      {showParamsPanel && (
        <div style={{ 
          width: "300px",
          backgroundColor: "white", 
          borderRadius: "0 22px 22px 0", 
          padding: "20px 20px 20px 30px",
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#2A3D4C",
          border: "2px solid #00A7C1",
          margin: "10px 20px 10px -17px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
          height: "653px",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#00A7C1 #f0f0f0"
        }}>
          {/* Стили для Webkit браузеров (Chrome, Safari, Edge) */}
          <style>
            {`
              div::-webkit-scrollbar { width: 8px; }
              div::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 0 4px 4px 0; }
              div::-webkit-scrollbar-thumb { background: #00A7C1; border-radius: 4px; border: 1px solid #f0f0f0; }
              div::-webkit-scrollbar-thumb:hover { background: #0095B3; }
              }
            `}
          </style>
          {/* Выбор графиков (выдвижной список с тегами) */}
          <div style={{ marginBottom: "25px", position: "relative" }}>
            <h3 style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
                color: "#2A3D4C",
                marginBottom: "8px"
              }}
            >
              {t("visualization.selectGraphs", "Выбор графиков для отображения")}
            </h3>
            {/* Контейнер поля и выпадающего списка */}
            <div style={{ position: "relative", width: "260px" }}>
              <div style={{
                  minHeight: "36px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 8px",
                  border: "2px solid #E6E6E6",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}
                onClick={() => setIsGraphsOpen(!isGraphsOpen)}
              >
                {selectedGraphs.length === 0 && (
                  <span style={{ color: "#A7A7AA", fontSize: "12px" }}>{t("visualization.selectGraphs", "Select graphs to display")}</span>
                )}
                {selectedGraphs.map((key, index) => (
                  <div key={index} 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#e6f7fa",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "12px",
                        color: "#2A3D4C"
                      }}>
                    {t(`graphs.${key}`, key)}
                    <span 
                      style={{ marginLeft: "4px", cursor: "pointer", fontWeight: "bold" }}
                      onClick={(e) => { e.stopPropagation(); toggleGraphSelection(key); }}
                    >
                      ×
                    </span>
                  </div>
                ))}
                <span style={{
                    marginLeft: "auto",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid #00A7C1",
                    transform: isGraphsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}
                />
              </div>
              {/* Выпадающий список */}
              {isGraphsOpen && (
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
                }}>
                  {graphs.map((graph) => (
                    <div key={graph.key}
                      onClick={() => toggleGraphSelection(graph.key)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#2A3D4C",
                        borderBottom: "1px solid #f0f0f0",
                        backgroundColor: selectedGraphs.includes(graph.key) ? "#e6f7fa" : "white",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.2s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                      onMouseLeave={(e) =>
                        e.currentTarget.style.backgroundColor = selectedGraphs.includes(graph.key) ? "#e6f7fa" : "white"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedGraphs.includes(graph.key)}
                        onChange={() => toggleGraphSelection(graph.key)}
                        style={{ marginRight: "8px" }}
                      />
                      {t(`graphs.${graph.key}`, graph.name)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Параметры передвижения UE */}
          <div style={{ marginBottom: "10px" }}>
            <div
              style={{ 
                display: "flex", 
                alignItems: "center", 
                fontSize: "14px", 
                fontWeight: "bold", 
                marginBottom: "8px", 
                color: "#222933", 
                cursor: "pointer" 
              }}
              onClick={() => toggleSection("movement")}
            >
              <span style={{ 
                marginRight: "6px", 
                transform: expandedSections.movement ? "rotate(90deg)" : "rotate(0deg)", 
                transition: "transform 0.2s",
                color: "#00A7C1"
              }}>▶</span>
              {t("settings.movement.movementParams", "UE Movement Parameters")}
            </div>
            {expandedSections.movement && (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {movementModels.map((model) => (
                  <label key={model.key} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
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
                        name="movement"
                        value={model.key}
                        checked={selectedMovement === model.key}
                        onChange={() => handleSelectMovement(model.key)} 
                        style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
                      />
                      {selectedMovement === model.key && (
                        <div style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#4EC8F0"
                        }}/>
                      )}
                    </div>
                    <span style={{ fontSize: "14px", color: "#2A3D4C" }}>{model.label}</span>
                  </label>
                ))}
              {/* Дополнительные параметры для выбранной модели */}
              {selectedMovement && (
                <div style={{ marginTop: "0px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {/* X min */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "100px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{t("settings.movement.x", "x:")}</span>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #d3d3d3",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      width: "110px",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.movement.min", "min")}</span>
                      <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                      <input
                        type="number"
                        value={movementParams[`x_min`] ?? ""}
                        onChange={(e) => handleMovementParamChange("x_min", parseFloat(e.target.value))}
                        style={{
                          width: "50px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          textAlign: "right"
                        }}
                      />
                    </div>
                  </div>
                  {/* X max */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "100px" }}></span>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #d3d3d3",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      width: "110px",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.movement.max", "max")}</span>
                      <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                      <input
                        type="number"
                        value={movementParams[`x_max`] ?? ""}
                        onChange={(e) => handleMovementParamChange("x_max", parseFloat(e.target.value))}
                        style={{
                          width: "50px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          textAlign: "right"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {/* Y min */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "100px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{t("settings.movement.y", "y:")}</span>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #d3d3d3",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      width: "110px",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.movement.min", "min")}</span>
                      <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                      <input
                        type="number"
                        value={movementParams[`y_min`] ?? ""}
                        onChange={(e) => handleMovementParamChange("y_min", parseFloat(e.target.value))}
                        style={{
                          width: "50px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          textAlign: "right"
                        }}
                      />
                    </div>
                  </div>
                  {/* Y max */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "100px" }}></span>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #d3d3d3",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      width: "110px",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.movement.max", "max")}</span>
                      <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                      <input
                        type="number"
                        value={movementParams[`y_max`] ?? ""}
                        onChange={(e) => handleMovementParamChange("y_max", parseFloat(e.target.value))}
                        style={{
                          width: "50px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          textAlign: "right"
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* pause_time */}
                {["randomWaypoint", "randomDirection"].includes(selectedMovement) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "100px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{t("settings.movement.pause", "pause:")}</span>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #d3d3d3",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      width: "110px",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.movement.sec", "sec")}</span>
                      <div style={{ width: "1px", height: "18px", background: "#ddd" }} />
                      <input
                        type="number"
                        value={movementParams.pause_time ?? ""}
                        onChange={(e) => handleMovementParamChange("pause_time", parseFloat(e.target.value))}
                        style={{
                          width: "50px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          textAlign: "right"
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* GaussMarkovModel параметры */}
                {selectedMovement === "gaussMarkov" && (
                  <>
                    {/* alpha */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "100px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{t("settings.movement.alpha", "memory:")}</span>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #d3d3d3",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        width: "110px",
                        justifyContent: "space-between"
                      }}>
                        <span></span>
                        <div/>
                        <input
                          type="number"
                          value={movementParams.alpha ?? 0.75}
                          onChange={(e) => handleMovementParamChange("alpha", parseFloat(e.target.value))}
                          style={{
                            width: "50px",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            textAlign: "right"
                          }}
                        />
                      </div>
                    </div>
                    {/* boundary_threshold */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "100px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{t("settings.movement.boundaryThreshold", "boundary:")}</span>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #d3d3d3",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        width: "110px",
                        justifyContent: "space-between"
                      }}>
                        <span></span>
                        <div/>
                        <input
                          type="number"
                          value={movementParams.boundary_threshold ?? 5.0}
                          onChange={(e) => handleMovementParamChange("boundary_threshold", parseFloat(e.target.value))}
                          style={{
                            width: "50px",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            textAlign: "right"
                          }}
                        />
                      </div>
                    </div>
                  </>
                  )}
              </div>
              )}
          </div>
          )}
        </div>

          {/* Секция: Параметры трафика */}
          <div style={{ marginBottom: "10px" }}>
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#222933",
                marginBottom: "4px"
              }}
              onClick={() => toggleSection("traffic")}
            >
              <span
                style={{
                  marginRight: "6px",
                  transform: expandedSections.traffic ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  color: "#00A7C1"
                }}
              >
                ▶
              </span>
              {t("visualization.trafficParams")}
            </div>

            {expandedSections.traffic && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                {/* --- Выбор модели трафика --- */}
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {trafficModels.map((tm) => (
                      <label key={tm.key} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <div
                          style={{
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
                          <input
                            type="radio"
                            name="traffic"
                            value={tm.key}
                            checked={selectedTraffic === tm.key}
                            onChange={() => handleSelectTraffic(tm.key)}
                            style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                          />
                          {selectedTraffic === tm.key && (
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4EC8F0" }} />
                          )}
                        </div>
                        <span style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C" }}>
                          {tm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- Блок дополнительных параметров --- */}
                {selectedTraffic && (
                  <div style={{ marginTop: "0px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                      {selectedTraffic === "poisson" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "120px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                              {t("settings.traffic.poissonAvgRate")}:
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #d3d3d3",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                width: "110px",
                                justifyContent: "space-between",
                                position: "relative"
                              }}
                            >
                              <input
                                type="number"
                                value={trafficParams[selectedTraffic]?.packet_rate || ""}
                                onChange={(e) => handleTrafficParamChange("packet_rate", parseFloat(e.target.value))}
                                style={{ width: "80px", border: "none", outline: "none", fontSize: "14px", textAlign: "right", fontFamily: "sans-serif" }}
                              />
                              <span style={{ position: "absolute", right: "8px", color: "#999999", fontSize: "12px" }}>
                                {t("settings.traffic.packetsPerSecond")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedTraffic === "onOff" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                          {[
                            { label: t("settings.traffic.onAvgOnTime"), unit: t("settings.traffic.seconds"), key: "duration_on" },
                            { label: t("settings.traffic.onAvgOffTime"), unit: t("settings.traffic.seconds"), key: "duration_off" },
                            { label: t("settings.traffic.onPacketRate"), unit: t("settings.traffic.packetsPerSecond"), key: "packet_rate" }
                          ].map(({ label, unit, key }) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ width: "120px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                                {label}:
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  border: "1px solid #d3d3d3",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  width: "110px",
                                  justifyContent: "space-between",
                                  position: "relative"
                                }}
                              >
                                <input
                                  type="number"
                                  value={trafficParams[selectedTraffic]?.[key] || ""}
                                  onChange={(e) => handleTrafficParamChange(key, parseFloat(e.target.value))}
                                  style={{ width: "80px", border: "none", outline: "none", fontSize: "14px", textAlign: "right", fontFamily: "sans-serif" }}
                                />
                                <span style={{ position: "absolute", right: "8px", color: "#999999", fontSize: "12px" }}>
                                  {unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Секция: Пользовательское устройство */}
          <div style={{ marginBottom: "10px" }}>
            <div 
              style={{ display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "bold", cursor: "pointer", color: "#222933", marginBottom: "4px" }}
              onClick={() => toggleSection("ue")}
            >
              <span 
                style={{ 
                  marginRight: "6px", 
                  transform: expandedSections.ue ? "rotate(90deg)" : "rotate(0deg)", 
                  transition: "transform 0.2s",
                  color: "#00A7C1" 
                }}
              >
                ▶
              </span>
              {t("visualization.ueSection")}
            </div>
            {expandedSections.ue && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ position: "relative", width: "260px" }}>
                    {/* Поле выбора пользователя */}
                    <div
                      style={{
                        minHeight: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 10px",
                        border: "2px solid #E6E6E6",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#2A3D4C"
                      }}
                      onClick={() => setIsUsersOpen(!isUsersOpen)}
                    >
                      {selectedUser ? (
                        <span>{selectedUser}</span>
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {t("visualization.selectUser")}
                        </span>
                      )}
                      <span
                        style={{
                          marginLeft: "auto",
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderTop: "6px solid #00A7C1",
                          transform: isUsersOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease"
                        }}
                      />
                    </div>
                    {/* Выпадающий список пользователей */}
                    {isUsersOpen && (
                      <div
                        style={{
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
                        {ueList.map((ue, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedUser(ue);
                              setIsUsersOpen(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "13px",
                              color: "#2A3D4C",
                              borderBottom: "1px solid #f0f0f0",
                              transition: "background-color 0.2s ease",
                              backgroundColor: selectedUser === ue ? "#e6f7fa" : "white"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                selectedUser === ue ? "#e6f7fa" : "white")
                            }
                          >
                            {ue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Дополнительные параметры UE */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "10px" }}>
                    <span
                      style={{
                        width: "129px",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#222933",
                        marginTop: "6px"
                      }}
                    >
                      {t("visualization.coordinates")}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {/* X */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          width: "110px",
                          position: "relative",
                          background: "white",
                          justifyContent: "space-between"
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#999" }}>{t("visualization.x")}</span>
                        <div style={{ width: "1px", height: "18px", background: "#ddd", margin: "0 6px" }} />
                        <input
                          type="number"
                          value={ueParams.x || 0.0}
                          onChange={(e) => setUeParams(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                          style={{
                            width: "60px",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            textAlign: "right",
                            paddingRight: "4px"
                          }}
                        />
                        <span style={{ color: "#999", fontSize: "12px", marginLeft: "4px" }}>{t("visualization.meters")}</span>
                      </div>
                      {/* Y */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          width: "110px",
                          position: "relative",
                          background: "white",
                          justifyContent: "space-between"
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#999" }}>{t("visualization.y")}</span>
                        <div style={{ width: "1px", height: "18px", background: "#ddd", margin: "0 6px" }} />
                        <input
                          type="number"
                          value={ueParams.y || 0.0}
                          onChange={(e) => setUeParams(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                          style={{
                            width: "60px",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            textAlign: "right",
                            paddingRight: "4px"
                          }}
                        />
                        <span style={{ color: "#999", fontSize: "12px", marginLeft: "4px" }}>{t("visualization.meters")}</span>
                      </div>
                    </div>
                  </div>
                    {/* Buffer size */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "124px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{t("visualization.bufferSize")}:</span>
                      <div style={{ marginLeft: "5px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #d3d3d3",
                        borderRadius: "6px",
                        padding: "4px 4px 4px 8px",
                        width: "113px",
                        justifyContent: "space-between",
                        position: "relative"
                      }}>
                        <input
                          type="number"
                          value={ueParams.buffer_size !== undefined ? ueParams.buffer_size : 1048576}
                          onChange={(e) => setUeParams(prev => ({ ...prev, buffer_size: parseInt(e.target.value) }))}
                          style={{
                            width: "70%",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            textAlign: "right",
                            paddingRight: "35px"
                          }}
                        />  
                        <span style={{ position: "absolute", right: "8px", color: "#999", fontSize: "12px" }}>{t("visualization.bytes", "байт")}</span>
                      </div>
                    </div>
                  </div>
                    {/* Выбор класса UE */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "99px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                      {t("visualization.ueClass")}:
                      </span>
                      <div style={{ marginLeft: "25px" }}></div>
                      <div
                        style={{
                          width: "110px",
                          padding: "4px 8px",
                          border: "1px solid #d3d3d3",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#2A3D4C",
                          cursor: "pointer",
                          backgroundColor: "white",
                          position: "relative"
                        }}
                        onClick={() => setIsClassOpen(!isClassOpen)}
                      >
                        {ueParams.ue_class || <span style={{ color: "#A7A7AA", fontSize: "12px" }}>{t("visualization.ueClass")}</span>}
                        <span
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: `translateY(-50%) rotate(${isClassOpen ? 180 : 0}deg)`,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "6px solid #00A7C1",
                            transition: "transform 0.2s"
                          }}
                        />
                        {isClassOpen && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              backgroundColor: "white",
                              border: "1px solid #d3d3d3",
                              borderTop: "none",
                              borderRadius: "0 0 6px 6px",
                              zIndex: 10,
                              maxHeight: "150px",
                              overflowY: "auto"
                            }}
                          >
                            {["indoor", "pedestrian", "cyclist", "car"].map(cls => (
                              <div
                                key={cls}
                                onClick={() => { setUeParams(prev => ({ ...prev, ue_class: cls })); setIsClassOpen(false); }}
                                style={{
                                  padding: "8px 10px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  color: "#2A3D4C",
                                  backgroundColor: ueParams.ue_class === cls ? "#e6f7fa" : "white"
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor = ueParams.ue_class === cls ? "#e6f7fa" : "white")
                                }
                              >
                                {cls}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Другие секции (Планировщик, Параметры канала, Базовая станция) */}
          {["scheduler", "channel", "enodeb"].map(section => (
            <div key={section} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#222933",
                  marginBottom: "4px"
                }}
                onClick={() => toggleSection(section)}
              >
                <span
                  style={{
                    marginRight: "6px",
                    transform: expandedSections[section] ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: "#00A7C1"
                  }}
                >
                  ▶
                </span>
                {section === "scheduler" ? t("visualization.schedulerSection") : section === "channel" ? t("visualization.channelParams") : t("visualization.enodebSection")}
              </div>
              {expandedSections[section] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
                  {/* Планировщик */}
                  {section === "scheduler" && schedulers.map((scheduler, index) => (
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
                          style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
                        />
                        {selectedScheduler === scheduler && (
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4EC8F0" }} />
                        )}
                      </div>
                      <span style={{ fontSize: "14px", fontFamily: "sans-serif", color: "#2A3D4C" }}>{scheduler}</span>
                    </label>
                  ))}
                  {/* Параметры канала с выбором модели */}
                  {section === "channel" && (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                        {["RMa", "UMa", "UMi"].map(model => (
                          <label
                            key={model}
                            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                          >
                            <div
                              style={{
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
                              <input
                                type="radio"
                                name="channelModel"
                                value={model}
                                checked={selectedChannelModel === model}
                                onChange={() => handleSelectChannelModel(model)}
                                style={{
                                  position: "absolute",
                                  opacity: 0,
                                  width: "100%",
                                  height: "100%",
                                  cursor: "pointer"
                                }}
                              />
                              {selectedChannelModel === model && (
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "#4EC8F0"
                                  }}
                                />
                              )}
                            </div>
                            <span style={{ fontSize: "14px", fontFamily: "sans-serif", color: "#2A3D4C" }}>
                              {t(`channel.${model}`)}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Параметры выбранной модели */}
                      {selectedChannelModel && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {Object.entries(channelParams[selectedChannelModel] || {})
                            .filter(([key]) => key !== "W" && key !== "h" && key !== "o2i_model")
                            .map(([key, value]) => {
                              const unit = key.includes("period") ? t("visualization.milliseconds") : t("visualization.meters");
                              const labelMap = {
                                cond_update_period: t("visualization.updatePeriod"),
                              };
                              const label = labelMap[key] || key;
                              return (
                                <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <span style={{ width: "120px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                                    {label}:
                                  </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      border: "1px solid #d3d3d3",
                                      borderRadius: "6px",
                                      padding: "4px 8px",
                                      width: "110px",
                                      justifyContent: "space-between",
                                      marginLeft: "10px",
                                      position: "relative"
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={value}
                                      onChange={(e) =>
                                        setChannelParams(prev => ({
                                          ...prev,
                                          [selectedChannelModel]: { ...prev[selectedChannelModel], [key]: parseFloat(e.target.value) }
                                        }))
                                      }
                                      style={{ width: "70%", border: "none", outline: "none", fontSize: "14px", textAlign: "right", paddingRight: "26px" }}
                                    />
                                    <span style={{ position: "absolute", right: "8px", color: "#999", fontSize: "12px" }}>{unit}</span>
                                  </div>
                                </div>
                              );
                            })}
                          {/* o2i_model */}
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "130px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                              {t("visualization.o2iModel")}:
                            </span>
                            <div
                              style={{
                                width: "110px",
                                padding: "4px 8px",
                                border: "1px solid #d3d3d3",
                                borderRadius: "6px",
                                fontSize: "14px",
                                color: "#2A3D4C",
                                cursor: "pointer",
                                backgroundColor: "white",
                                position: "relative"
                              }}
                              onClick={() => setIsO2iOpen(!isO2iOpen)}
                            >
                              {channelParams[selectedChannelModel].o2i_model || <span style={{ color: "#A7A7AA", fontSize: "12px" }}>{t("visualization.selectModel")}</span>}
                              <span
                                style={{
                                  position: "absolute",
                                  right: "8px",
                                  top: "50%",
                                  transform: `translateY(-50%) rotate(${isO2iOpen ? 180 : 0}deg)`,
                                  borderLeft: "6px solid transparent",
                                  borderRight: "6px solid transparent",
                                  borderTop: "6px solid #00A7C1",
                                  transition: "transform 0.2s"
                                }}
                              />
                              {isO2iOpen && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    backgroundColor: "white",
                                    border: "1px solid #d3d3d3",
                                    borderTop: "none",
                                    borderRadius: "0 0 6px 6px",
                                    zIndex: 10,
                                    maxHeight: "150px",
                                    overflowY: "auto"
                                  }}
                                >
                                  {["low", "high"].map(option => (
                                    <div
                                      key={option}
                                      onClick={() => {
                                        setChannelParams(prev => ({
                                          ...prev,
                                          [selectedChannelModel]: { ...prev[selectedChannelModel], o2i_model: option }
                                        }));
                                        setIsO2iOpen(false);
                                      }}
                                      style={{
                                        padding: "8px 10px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#2A3D4C",
                                        backgroundColor: channelParams[selectedChannelModel].o2i_model === option ? "#e6f7fa" : "white"
                                      }}
                                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                                      onMouseLeave={e =>
                                        (e.currentTarget.style.backgroundColor =
                                          channelParams[selectedChannelModel].o2i_model === option ? "#e6f7fa" : "white")
                                      }
                                    >
                                      {t(`visualization.o2i${option.charAt(0).toUpperCase() + option.slice(1)}`)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* W и h только для RMa */}
                          {selectedChannelModel === "RMa" && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginTop: "6px" }}>
                              <span
                                style={{
                                  width: "130px",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#222933",
                                  marginTop: "6px"
                                }}
                              >
                                {t("visualization.buildingType")}:
                              </span>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {["W", "h"].map(key => (
                                  <div
                                    key={key}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      border: "1px solid #d3d3d3",
                                      borderRadius: "6px",
                                      padding: "4px 8px",
                                      width: "110px",
                                      background: "white",
                                      justifyContent: "space-between"
                                    }}
                                  >
                                    <span style={{ fontSize: "14px", color: "#999" }}>{key.toLowerCase()}</span>
                                    <div style={{ width: "1px", height: "18px", background: "#ddd", margin: "0 6px" }} />
                                    <input
                                      type="number"
                                      value={channelParams[selectedChannelModel][key]}
                                      onChange={(e) =>
                                        setChannelParams(prev => ({
                                          ...prev,
                                          [selectedChannelModel]: {
                                            ...prev[selectedChannelModel],
                                            [key]: parseFloat(e.target.value)
                                          }
                                        }))
                                      }
                                      style={{
                                        width: "60px",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        textAlign: "right",
                                        paddingRight: "4px"
                                      }}
                                    />
                                    <span style={{ color: "#999", fontSize: "12px", marginLeft: "4px" }}>{t("visualization.meters")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                {/* Базовая станция */}
                {section === "enodeb" && (
                  <>
                    {/* Координаты БС */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "12px" }}>
                      <span
                        style={{
                          width: "129px",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#222933",
                          marginTop: "6px"
                        }}
                      >
                        {t("visualization.coordinates")}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {/* X */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #d3d3d3",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            width: "110px",
                            background: "white",
                            justifyContent: "space-between"
                          }}
                        >
                          <span style={{ fontSize: "14px", color: "#999" }}>{t("visualization.x")}</span>
                          <div style={{ width: "1px", height: "18px", background: "#ddd", margin: "0 6px" }} />
                          <input
                            type="number"
                            value={bsParams.x}
                            onChange={(e) =>
                              setBsParams(prev => ({ ...prev, x: parseFloat(e.target.value) }))
                            }
                            style={{
                              width: "60px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              textAlign: "right",
                              paddingRight: "4px"
                            }}
                          />
                          <span style={{ color: "#999", fontSize: "12px", marginLeft: "4px" }}>{t("visualization.meters")}</span>
                        </div>
                        {/* Y */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #d3d3d3",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            width: "110px",
                            background: "white",
                            justifyContent: "space-between"
                          }}
                        >
                          <span style={{ fontSize: "14px", color: "#999" }}>{t("visualization.y")}</span>
                          <div style={{ width: "1px", height: "18px", background: "#ddd", margin: "0 6px" }} />
                          <input
                            type="number"
                            value={bsParams.y}
                            onChange={(e) =>
                              setBsParams(prev => ({ ...prev, y: parseFloat(e.target.value) }))
                            }
                            style={{
                              width: "60px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              textAlign: "right",
                              paddingRight: "4px"
                            }}
                          />
                          <span style={{ color: "#999", fontSize: "12px", marginLeft: "4px" }}>{t("visualization.meters")}</span>
                        </div>
                      </div>
                    </div>
                      {/* Остальные параметры БС */}
                      {[
                        { key: "height", label: t("visualization.height"), unit: t("visualization.meters") },
                        { key: "frequency_GHz", label: t("visualization.frequency_GHz"), unit: t("visualization.GHz")  },
                        { key: "bandwidth", label: t("visualization.bandwidth_MHz"), unit: t("visualization.MHz")  }
                      ].map(param => (
                        <div key={param.key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "119px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                            {param.label}:
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #d3d3d3",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              width: "110px",
                              justifyContent: "space-between",
                              marginLeft: "10px",
                              position: "relative"
                            }}
                          >
                            <input
                              type="number"
                              value={bsParams[param.key]}
                              onChange={(e) =>
                                setBsParams(prev => ({ ...prev, [param.key]: parseFloat(e.target.value) }))
                              }
                              style={{
                                width: "70%",
                                border: "none",
                                outline: "none",
                                fontSize: "14px",
                                textAlign: "right",
                                paddingRight: "26px"
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                right: "8px",
                                color: "#999",
                                fontSize: "12px"
                              }}
                            >
                              {param.unit}
                            </span>
                          </div>
                        </div>
                      ))}

                    </>
                  )}
                </div>
              )}
            </div>
          ))}
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
          {t("mainContent.title")}
        </h1>
        <Graphs selectedGraphs={selectedGraphs} />
      </div>
      {/* Кнопки управления */}
      <div style={{ position: "fixed", right: "30px", bottom: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Сброс */}
        <button
          onClick={handleResetAll}
          style={controlButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          title="Очистить параметры"
        >
          <img src={trashIcon} alt="Очистить" style={{ width: "24px", height: "24px" }} />
        </button>

        {/* Пауза */}
        <button
          onClick={() => console.log("Pause clicked")}
          style={controlButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          title="Пауза"
        >
          <img src={pauseIcon} alt="Пауза" style={{ width: "24px", height: "24px" }} />
        </button>

        {/* Обновление */}
        <button
          onClick={() => console.log("Refresh clicked")}
          style={controlButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          title="Обновить"
        >
          <img src={refreshIcon} alt="Обновить" style={{ width: "24px", height: "24px" }} />
        </button>
        </div>
    </div>
  );
}
