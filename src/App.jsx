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

  // Обработчики кнопок Save/Load
  const handleSave = () => {
    console.log("Сохраняем конфигурацию:", configName);
    setShowSaveModal(false);
    setConfigName("");
  };

  const handleLoad = () => {
    console.log("Загружаем файл или ссылку:", selectedFile, configName);
    setShowLoadModal(false);
    setConfigName("");
    setSelectedFile(null);
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
                  onToggleParams={() => setShowVisualizationParams(!showVisualizationParams)}
                  movementParams={movementParams}
                  trafficParams={trafficParams}
                  schedulerParams={schedulerParams}
                  userCount={userCount}
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
    </Router>
  );
}

export default App;
