import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import Modal, { LoadModal } from "./components/Modal/Modal";

import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Visualization from "./pages/Visualization";
import Tests from "./pages/Tests";
import Docs from "./pages/Docs";
import About from "./pages/About";

import { SettingsProvider } from "./contexts/SettingsContext";

function App() {
  const [showVisualizationParams, setShowVisualizationParams] = useState(false);
  const [showDocsPanel, setShowDocsPanel] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  const [savedConfigParams, setSavedConfigParams] = useState({});
  const [movementParams, setMovementParams] = useState({});
  const [trafficParams, setTrafficParams] = useState({});
  const [schedulerParams, setSchedulerParams] = useState({});
  const [userCount, setUserCount] = useState(0);

  const [configName, setConfigName] = useState(""); // используется как ссылка
  const [selectedFile, setSelectedFile] = useState(null); // выбранный файл

  const [selectedGraphs, setSelectedGraphs] = useState([]);
  const [channelParams, setChannelParams] = useState({});
  const [ueParams, setUeParams] = useState({});
  const [bsParams, setBsParams] = useState({});
  const [userIds, setUserIds] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState("");
  const [selectedTraffic, setSelectedTraffic] = useState("");
  const [selectedScheduler, setSelectedScheduler] = useState("");

  // Сохранение всех параметров в JSON
  const handleSave = () => {
    const data = {
      movementParams,
      trafficParams,
      schedulerParams,
      userCount,
      userIds,
      selectedMovement,
      selectedTraffic,
      selectedScheduler,
      selectedGraphs,
      channelParams,
      ueParams,
      bsParams
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = configName ? `${configName}.json` : "settings.json";
    link.click();

    setShowSaveModal(false);
    setConfigName("");
  };

  // -------------------------
  // Загрузка JSON и восстановление состояния
  const handleLoad = () => {
    if (!selectedFile) {
      alert("Выберите файл для загрузки!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.movementParams) setMovementParams(data.movementParams);
        if (data.trafficParams) setTrafficParams(data.trafficParams);
        if (data.schedulerParams) setSchedulerParams(data.schedulerParams);
        if (data.userCount) setUserCount(data.userCount);
        if (data.userIds) setUserIds(data.userIds);
        if (data.selectedMovement) setSelectedMovement(data.selectedMovement);
        if (data.selectedTraffic) setSelectedTraffic(data.selectedTraffic);
        if (data.selectedScheduler) setSelectedScheduler(data.selectedScheduler);

        if (data.selectedGraphs) setSelectedGraphs(data.selectedGraphs);
        if (data.channelParams) setChannelParams(data.channelParams);
        if (data.ueParams) setUeParams(data.ueParams);
        if (data.bsParams) setBsParams(data.bsParams);

        alert("Конфигурация успешно загружена!");
      } catch (err) {
        alert("Ошибка при загрузке JSON: " + err.message);
      }
    };

    reader.readAsText(selectedFile);
    setShowLoadModal(false);
    setSelectedFile(null);
    setConfigName("");
  };


  const handleSaveConfig = (configName, params) => {
    setSavedConfigParams(prev => ({ ...prev, [configName]: params }));
  };

  const handleLoadConfig = (configName) => {
    const config = savedConfigParams[configName];
    if (config) {
      setMovementParams(config.movement || {});
      setTrafficParams(config.traffic || {});
      setSchedulerParams(config.scheduler || {});
      setUserCount(config.userCount || 0);
    }
  };

  return (
    <Router>
      <SettingsProvider>
        <div className="flex">
          <ThemeToggle />
          <Navbar
            onVisualizationClick={() => setShowVisualizationParams(!showVisualizationParams)}
            onDocsClick={() => setShowDocsPanel(!showDocsPanel)}
            onSaveClick={() => setShowSaveModal(true)}
            onLoadClick={() => setShowLoadModal(true)}
          />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/settings"
                element={
                <Settings
                  movementParams={movementParams}
                  setMovementParams={setMovementParams}
                  trafficParams={trafficParams}
                  setTrafficParams={setTrafficParams}
                  schedulerParams={schedulerParams}
                  setSchedulerParams={setSchedulerParams}
                  userCount={userCount}
                  setUserCount={setUserCount}
                  userIds={userIds}
                  setUserIds={setUserIds}
                  selectedMovement={selectedMovement}
                  setSelectedMovement={setSelectedMovement}
                  selectedTraffic={selectedTraffic}
                  setSelectedTraffic={setSelectedTraffic}
                  selectedScheduler={selectedScheduler}
                  setSelectedScheduler={setSelectedScheduler}
                  onSaveConfig={handleSaveConfig}
                  onLoadConfig={handleLoadConfig}
                />
              }
            />
              <Route
                path="/visualization"
                element={
                  <Visualization
                  showParamsPanel={showVisualizationParams}
                    movementParams={movementParams}
                    trafficParams={trafficParams}
                    schedulerParams={schedulerParams}
                    userCount={userCount}
                    selectedGraphs={selectedGraphs}
                    setSelectedGraphs={setSelectedGraphs}
                    channelParams={channelParams}
                    setChannelParams={setChannelParams}
                    ueParams={ueParams}
                    setUeParams={setUeParams}
                    bsParams={bsParams}
                    setBsParams={setBsParams}
                  />
                }
              />
              <Route path="/tests" element={<Tests />} />
              <Route
                path="/docs"
                element={<Docs showDocsPanel={showDocsPanel} onToggleDocsPanel={() => setShowDocsPanel(!showDocsPanel)} />}
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          {/* Модалка для сохранения */}
          <Modal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            title="Сохранить конфигурацию"
            fileName={configName}
            onFileNameChange={setConfigName}
            description=""
            onDescriptionChange={() => {}}
            onConfirm={handleSave}
          />

          {/* Модалка для загрузки */}
          <LoadModal
            isOpen={showLoadModal}
            onClose={() => setShowLoadModal(false)}
            onFileChange={(file) => setSelectedFile(file)}
            link={configName}
            onLinkChange={setConfigName}
            onConfirm={handleLoad}
          />
        </div>
      </SettingsProvider>
    </Router>
  );
}

export default App;
