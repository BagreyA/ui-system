import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HomeIcon from "../icons/home.png";
import SettingsIcon from "../icons/settings.png";
import VisualizationIcon from "../icons/visualization.png";
import TestsIcon from "../icons/tests.png";
import DocsIcon from "../icons/docs.png";
import AboutIcon from "../icons/about.png";
import SaveIcon from "../icons/save.png";
import LoadIcon from "../icons/load.png";

import HomeIconActive from "../icons/home.png";
import SettingsIconActive from "../icons/settings-active.png";
import VisualizationIconActive from "../icons/visualization-active.png";
import TestsIconActive from "../icons/tests-active.png";
import DocsIconActive from "../icons/docs-active.png";
import AboutIconActive from "../icons/about-active.png";
import SaveIconActive from "../icons/save.png";
import LoadIconActive from "../icons/load.png";

export default function Navbar({ onVisualizationClick, onDocsClick, onSaveClick, onLoadClick }) {
  const { t } = useTranslation("docs");
  const location = useLocation();

  const tabs = [
    { path: "/", key: "home", icon: HomeIcon, iconActive: HomeIconActive },
    { path: "/settings", key: "settings", icon: SettingsIcon, iconActive: SettingsIconActive },
    { path: "/visualization", key: "visualization", icon: VisualizationIcon, iconActive: VisualizationIconActive },
    { path: "/tests", key: "tests", icon: TestsIcon, iconActive: TestsIconActive },
    { path: "/docs", key: "docs", icon: DocsIcon, iconActive: DocsIconActive },
    { path: "/about", key: "about", icon: AboutIcon, iconActive: AboutIconActive },
    { path: "/save", key: "save", icon: SaveIcon, iconActive: SaveIconActive },
    { path: "/load", key: "load", icon: LoadIcon, iconActive: LoadIconActive },
  ];

  const handleVisualizationClick = (e, isActive) => {
    if (isActive && location.pathname === "/visualization") {
      e.preventDefault();
      onVisualizationClick();
    }
  };

  const handleDocsClick = (e, isActive) => {
    if (isActive && location.pathname === "/docs") {
      e.preventDefault();
      onDocsClick();
    }
  };

  return (
    <aside
      style={{
        width: "65px",
        height: "680px",
        backgroundColor: "#00A7C1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px 0",
        borderRadius: "22px",
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "4px",
        position: "relative",
        overflow: "visible",
      }}
    >
      {tabs.map((tab, index) => {
        // Кнопка Save
        if (tab.key === "save") {
          return (
            <button
              key={tab.key}
              onClick={onSaveClick}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: "30px",
                backgroundColor: "transparent",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: index !== tabs.length - 1 ? "10px" : 0,
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src={tab.icon} alt={t(`tabs.${tab.key}`)} width={32} height={32} />
              <span style={{ fontSize: "13px", fontFamily: "sans-serif" }}>{t(`tabs.${tab.key}`)}</span>
            </button>
          );
        }

        // Кнопка Load
        if (tab.key === "load") {
          return (
            <button
              key={tab.key}
              onClick={onLoadClick}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: "30px",
                backgroundColor: "transparent",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: index !== tabs.length - 1 ? "10px" : 0,
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src={tab.icon} alt={t(`tabs.${tab.key}`)} width={32} height={32} />
              <span style={{ fontSize: "13px", fontFamily: "sans-serif" }}>{t(`tabs.${tab.key}`)}</span>
            </button>
          );
        }

        // Остальные вкладки через NavLink
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            onClick={(e) => {
              if (tab.path === "/visualization") {
                const isActive = location.pathname === "/visualization";
                handleVisualizationClick(e, isActive);
              }
              if (tab.path === "/docs") {
                const isActive = location.pathname === "/docs";
                handleDocsClick(e, isActive);
              }
            }}
            style={({ isActive }) => ({
              width: isActive && tab.path !== "/" ? "calc(100% - 8px)" : "100%",
              padding: "10px 0",
              borderRadius: isActive && tab.path !== "/" ? "30px 0 0 30px" : "30px",
              textDecoration: "none",
              color: tab.path === "/" ? "white" : (isActive ? "#00A7C1" : "white"),
              backgroundColor: tab.path === "/" ? "transparent" : (isActive ? "white" : "transparent"),
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "0px",
              marginBottom: index !== tabs.length - 1 ? "10px" : 0,
              position: "relative",
              marginLeft: isActive && tab.path !== "/" ? "8px" : "0px",
            })}
          >
            {({ isActive }) => (
              <>
                {tab.icon && (
                  <img
                    src={isActive && tab.iconActive ? tab.iconActive : tab.icon}
                    alt={t(`tabs.${tab.key}`)}
                    width={32}
                    height={32}
                  />
                )}
                <span style={{ fontSize: "13px", fontFamily: "sans-serif" }}>
                  {t(`tabs.${tab.key}`)}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
}
