import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import trashIcon from "../icons/trash.png";
import Modal from "../components/Modal/Modal.jsx";
import { useSettings } from "../contexts/SettingsContext";

import { getConfigsList, getConfigParams, saveConfig, fetchOverviewSimulation} from "../api/simulation";

const SettingsContext = createContext();

export default function Settings() {
  const { t } = useTranslation("docs");
  const navigate = useNavigate();

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
    selectedConfig,
    setSelectedConfig,
  } = useSettings();

  const [configsList, setConfigsList] = useState([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");

  useEffect(() => {
    const fetchConfigs = async () => {
      const list = await getConfigsList(); // пока вернёт пустой массив
      setConfigsList(list);
    };
    fetchConfigs();
  }, []);

    useEffect(() => {
      setUserIds(prev => {
        const newIds = [...prev];
        while (newIds.length < userCount) newIds.push("");
        return newIds.slice(0, userCount);
      });
    }, [userCount]);

   const configurations = [
    "single user static",
    "multi ue randomwaypoint",
    "pedestrian mobility stress",
    "vehicular mobility pf", 
    "dense network bestcqi"
  ];

 const movementModels = [
  { key: "randomWalk", label: t("settings.movement.randomWalk") },
  { key: "randomWaypoint", label: t("settings.movement.randomWaypoint") },
  { key: "randomDirection", label: t("settings.movement.randomDirection") },
  { key: "gaussMarkov", label: t("settings.movement.gaussMarkov") }
];

  const trafficModelsKeys = [
    { key: "poisson", label: t("settings.traffic.poisson") },
    { key: "onOff", label: t("settings.traffic.onOff") },
    { key: "mmpp", label: t("settings.traffic.mmpp") }
  ];

  const schedulers = [
    t("settings.schedulerOptions.roundRobin"),
    t("settings.schedulerOptions.bestCQI"),
    t("settings.schedulerOptions.proportionalFair")
  ];

  const handleLoadConfig = () => {
    if (selectedConfig) {
      console.log(t("loadConfig") + ": " + selectedConfig);
      handleLoadSelectedConfig();
    }
  };

    const handleMovementParamChange = (param, value) =>
      setMovementParams(prev => ({ ...prev, [param]: value }));
    const handleTrafficParamChange = (param, value) =>
      setTrafficParams(prev => ({ ...prev, [param]: value }));
    const handleSchedulerParamChange = (param, value) =>
      setSchedulerParams(prev => ({ ...prev, [param]: value }));

  const increaseUsers = () => setUserCount(prev => prev + 1);
  const decreaseUsers = () => setUserCount(prev => (prev > 0 ? prev - 1 : 0));
  
  // --- Выбор конфигурации ---
  const handleConfigSelect = (config) => {
    setSelectedConfig(config);
    setIsConfigOpen(false);
  };

    // --- Сохранение текущей конфигурации ---
  const handleSaveCurrentConfig = async (configName) => {
    if (!configName) return;

    // Формируем JSON с правильными ключами
    const paramsToSave = {
      movementParams,
      trafficParams,
      schedulerParams,
      userCount,
      userIds,
      selectedMovement,
      selectedTraffic,
      selectedScheduler,
      selectedGraphs: [],   // если нужно, можно заполнить по умолчанию
      channelParams: {},
      ueParams: {},
      bsParams: {}
    };

    const result = await saveConfig(configName, paramsToSave);

    if (result?.status === "ok") {
      alert("Конфигурация сохранена!");
      // Обновляем локальный список конфигураций
      if (!configsList.includes(configName)) {
        setConfigsList([...configsList, configName]);
      }
    } else {
      alert("Ошибка сохранения конфигурации");
    }
  };

  const handleLoadSelectedConfig = async () => {
    if (!selectedConfig) return;

    // Загружаем параметры конфигурации
    const params = await fetchOverviewSimulation(selectedConfig);

    // Устанавливаем все параметры в state
    setMovementParams(params.movementParams || {});
    setTrafficParams(params.trafficParams || {});
    setSchedulerParams(params.schedulerParams || {});
    setUserCount(params.userCount || 0);
    setUserIds(params.userIds || []);
    setSelectedMovement(params.selectedMovement || "");
    setSelectedTraffic(params.selectedTraffic || "");
    setSelectedScheduler(params.selectedScheduler || "");
  };

  // --- Создание новой конфигурации через модалку ---
  const handleCreateConfig = () => setIsModalOpen(true);

  // --- Создание новой конфигурации через модалку ---
  const handleConfirmCreate = async () => {
    if (!newConfigName) return;
    await handleSaveCurrentConfig(newConfigName);
    setSelectedConfig(newConfigName);
    setNewConfigName("");
    setIsModalOpen(false);
  };

  // --- Передача параметров во вкладку графиков ---
  const handleStartSimulation = () => {
    if (
      selectedConfig &&
      userCount > 0 &&
      selectedMovement &&
      selectedTraffic &&
      selectedScheduler
    ) {
      const simulationParams = {
        movementParams,
        trafficParams,
        schedulerParams,
        userCount,
        userIds,
        selectedMovement,
        selectedTraffic,
        selectedScheduler
      };

      navigate("/visualization", { state: { simulationParams } });
    }
  };

      // --- Рендер блока ID пользователей ---
  const renderUserIds = () =>
    Array.from({ length: Math.min(userCount, 5) }, (_, i) => (
      <div key={i} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", width: "fit-content" }}>
        <span style={{ fontSize: "14px", color: "#222933", fontFamily: "sans-serif" }}>
          {t("settings.userCount")} {i + 1}
        </span>
        <input
          type="text"
          placeholder={`ID ${i + 1}`}
          value={userIds[i] || ""}
          onChange={(e) => {
            const newUserIds = [...userIds];
            newUserIds[i] = e.target.value;
            setUserIds(newUserIds);
          }}
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
    ));

  return (
    <div style={{ marginLeft: "30px" }}>
      <h1 style={{ fontSize: "30px", fontFamily: "sans-serif", color: "#222933", marginBottom: "20px" }}>
        {t("settings.title")}
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
            <h3 style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C", marginBottom: "8px" }}>
              {t("settings.savedConfigs")}
            </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
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
                    <span>{selectedConfig || t("settings.selectConfig")}</span>
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
                  {t("settings.loadConfig")}
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
                {t("settings.userDevice")}
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
              {t("settings.userId")}
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
                  {t("settings.userCount")} {i + 1}
                </span>
                <input type="text"
                  placeholder={`ID ${i + 1}`}
                  value={userIds[i] || ""}
                  onChange={(e) => {
                    const newUserIds = [...userIds];
                    newUserIds[i] = e.target.value;
                    setUserIds(newUserIds);
                  }}
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
              {t("settings.movementModels")}
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
                      value={model.key}
                      checked={selectedMovement === model.key}
                      onChange={(e) => setSelectedMovement(e.target.value)}
                      style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                    {selectedMovement === model.key && (
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
                    {model.label}
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
                    {t("settings.additionalParams")}
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
                          <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.min")}</span>
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
                          <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.max")}</span>
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
                          <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.min")}</span>
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
                          <span style={{ fontSize: "12px", color: "#999" }}>{t("settings.max")}</span>
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
                    {(selectedMovement === "randomWaypoint" || selectedMovement === "randomDirection") && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif", marginTop: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{
                            width: "80px",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#222933",
                            fontFamily: "sans-serif",
                            marginTop: "-10px"
                          }}>
                            {t("settings.pauseTime")}
                          </span>
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
              {t("settings.trafficModel")}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {trafficModelsKeys.map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #00A7C1", marginRight: "6px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <input
                      type="radio"
                      name="traffic"
                      value={key}
                      checked={selectedTraffic === key}
                      onChange={(e) => setSelectedTraffic(e.target.value)}
                      style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                    {selectedTraffic === key && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4EC8F0" }} />}
                  </div>
                  <span style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Блок дополнительных параметров */}
          {(selectedTraffic === "poisson" || selectedTraffic === "onOff") && (
            <div style={{ marginTop: "15px", marginBottom: "25px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h3 style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C", margin: 0 }}>
                  {t("settings.additionalTrafficParams")}
                </h3>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {selectedTraffic === "poisson" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "300px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>
                          {t("settings.averageTrafficIntensity")}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #d3d3d3", borderRadius: "6px", padding: "4px 8px", width: "110px", justifyContent: "space-between", position: "relative" }}>
                          <input
                            type="number"
                            value={trafficParams.packet_rate  || ""}
                            onChange={(e) => handleTrafficParamChange("packet_rate", e.target.value)}
                            style={{ width: "80px", border: "none", outline: "none", fontSize: "14px", textAlign: "right", fontFamily: "sans-serif" }}
                          />
                          <span style={{ position: "absolute", right: "8px", color: "#999999", fontSize: "12px" }}>
                            {t("settings.packetsPerSec")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTraffic === "onOff" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
                      {[
                        { key: "averageActivePhaseDuration", label: t("settings.averageActivePhaseDuration"), unit: "сек" },
                        { key: "averageInactivePhaseDuration", label: t("settings.averageInactivePhaseDuration"), unit: "сек" },
                        { key: "trafficIntensityActivePhase", label: t("settings.trafficIntensityActivePhase"), unit: t("settings.packetsPerSec") }
                      ].map(({ key, label, unit }) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "300px", fontWeight: 600, fontSize: "14px", color: "#222933" }}>{label}:</span>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #d3d3d3", borderRadius: "6px", padding: "4px 8px", width: "110px", justifyContent: "space-between", position: "relative" }}>
                            <input
                              type="number"
                              value={trafficParams[key] || ""}
                              onChange={(e) => handleTrafficParamChange(key, e.target.value)}
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
              {t("settings.scheduler")}
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
          {t("settings.startSimulation")}
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
          setMovementParams({});
          setTrafficParams({});
          setSchedulerParams({});
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
      <Modal
        isOpen={isModalOpen}
        title={t("settings.enterConfigName")}
        value={newConfigName}
        onChange={setNewConfigName}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCreate}
      />
    </div>
  );
}