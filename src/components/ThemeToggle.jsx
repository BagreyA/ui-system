import React, { useState } from "react";

import SunIcon from "../icons/moon.png";
import MoonIcon from "../icons/sun.png";

export default function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      zIndex: 1000
    }}>
      {/* Переключатель темы */}
      <button 
        onClick={toggleTheme}
        style={{
          cursor: "pointer",
          border: "none",
          background: "none",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img 
          src={isDarkTheme ? SunIcon : MoonIcon}
          alt={isDarkTheme ? "Светлая тема" : "Темная тема"}
          width="24"
          height="24"
        />
      </button>
      
      {/* Смена языка */}
      <div 
        style={{
          fontSize: "16px",
          cursor: "pointer",
          fontFamily: "sans-serif",
          color: isDarkTheme ? "white" : "#222933"
        }}
      >
        ru
      </div>
    </div>
  );
}