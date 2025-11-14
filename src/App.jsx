import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Visualization from "./pages/Visualization";
import Tests from "./pages/Tests";
import Docs from "./pages/Docs";
import About from "./pages/About";

function App() {
  const [showVisualizationParams, setShowVisualizationParams] = useState(false);
  const [showDocsPanel, setShowDocsPanel] = useState(false);

  return (
    <Router>
      <div className="flex">
        <ThemeToggle />
        <Navbar 
          onVisualizationClick={() => setShowVisualizationParams(!showVisualizationParams)}
          onDocsClick={() => setShowDocsPanel(!showDocsPanel)}
        />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/visualization" element={
              <Visualization 
                showParamsPanel={showVisualizationParams}
                onToggleParams={() => setShowVisualizationParams(!showVisualizationParams)}
              />
            } />
            <Route path="/tests" element={<Tests />} />
            <Route path="/docs" element={
              <Docs 
                showDocsPanel={showDocsPanel}
                onToggleDocsPanel={() => setShowDocsPanel(!showDocsPanel)}
              />
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;