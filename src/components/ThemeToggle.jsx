import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SunIcon from "../icons/sun.png"; // светлая тема
import MoonIcon from "../icons/moon.png"; // тёмная тема

export default function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");

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
          alt={isDarkTheme ? "Светлая тема" : "Тёмная тема"}
          width="24"
          height="24"
        />
      </button>

      {/* Переключение языка */}
      <div
        onClick={toggleLanguage}
        style={{
          fontSize: "16px",
          cursor: "pointer",
          fontFamily: "sans-serif",
          color: isDarkTheme ? "#f8f9fa" : "#222933"
        }}
      >
        {i18n.language.toUpperCase()}
      </div>
    </div>
  );
}
