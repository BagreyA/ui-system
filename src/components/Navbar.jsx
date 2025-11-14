import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import HomeIcon from "../icons/home.png";
import SettingsIcon from "../icons/settings.png";
import VisualizationIcon from "../icons/visualization.png";
import TestsIcon from "../icons/tests.png";
import DocsIcon from "../icons/docs.png";
import AboutIcon from "../icons/about.png";
import SaveIcon from "../icons/save.png";
import LoadIcon from "../icons/load.png";

//иконок для активного состояния (синие)
import HomeIconActive from "../icons/home.png";
import SettingsIconActive from "../icons/settings-active.png";
import VisualizationIconActive from "../icons/visualization-active.png";
import TestsIconActive from "../icons/tests-active.png";
import DocsIconActive from "../icons/docs-active.png";
import AboutIconActive from "../icons/about-active.png";
import SaveIconActive from "../icons/save.png";
import LoadIconActive from "../icons/load.png";

const tabs = [
  { 
    path: "/", 
    label: "", 
    icon: HomeIcon,
    iconActive: HomeIconActive 
  },
  { 
    path: "/settings", 
    label: "среда", 
    icon: SettingsIcon,
    iconActive: SettingsIconActive 
  },
  { 
    path: "/visualization", 
    label: "графики", 
    icon: VisualizationIcon,
    iconActive: VisualizationIconActive 
  },
  { 
    path: "/tests", 
    label: "тесты", 
    icon: TestsIcon,
    iconActive: TestsIconActive 
  },
  { 
    path: "/docs", 
    label: "гайд", 
    icon: DocsIcon,
    iconActive: DocsIconActive 
  },
  { 
    path: "/about", 
    label: "о нас", 
    icon: AboutIcon,
    iconActive: AboutIconActive 
  },
  { 
    path: "/save", 
    label: "сохранить", 
    icon: SaveIcon,
    iconActive: SaveIconActive 
  },
  { 
    path: "/load", 
    label: "загрузка", 
    icon: LoadIcon,
    iconActive: LoadIconActive 
  },
];

export default function Navbar({ onVisualizationClick, onDocsClick }) {
  const location = useLocation();

  const handleVisualizationClick = (e, isActive) => {
    // Если уже на странице графиков, переключаем панель параметров
    if (isActive && location.pathname === "/visualization") {
      e.preventDefault();
      onVisualizationClick();
    }
  };

  const handleDocsClick = (e, isActive) => {
    // Если уже на странице документации, переключаем панель разделов
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
      {tabs.map((tab, index) => (
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
            width: isActive && tab.path !== "/" && tab.path !== "/save" && tab.path !== "/load" ? "calc(100% - 8px)" : "100%",
            padding: "10px 0",
            borderRadius: isActive && tab.path !== "/" && tab.path !== "/save" && tab.path !== "/load" ? "30px 0 0 30px" : "30px",
            textDecoration: "none",
            color: tab.path === "/" || tab.path === "/save" || tab.path === "/load" ? "white" : (isActive ? "#00A7C1" : "white"),
            backgroundColor: tab.path === "/" || tab.path === "/save" || tab.path === "/load" ? "transparent" : (isActive ? "white" : "transparent"),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0px",
            marginBottom: index !== tabs.length - 1 ? "10px" : 0,
            position: "relative",
            marginLeft: isActive && tab.path !== "/" && tab.path !== "/save" && tab.path !== "/load" ? "8px" : "0px",
          })}
        >
          {({ isActive }) => (
            <>
              {tab.icon && (
                <img
                  src={isActive && tab.iconActive ? tab.iconActive : tab.icon}
                  alt={tab.label || "icon"}
                  width={
                    tab.path === "/" ? 42 :
                    tab.path === "/settings" ? 32 :
                    tab.path === "/visualization" ? 34 :
                    tab.path === "/tests" ? 40 :
                    tab.path === "/docs" ? 32 :
                    tab.path === "/about" ? 32 : 
                    tab.path === "/save" ? 32 :
                    tab.path === "/load" ? 32 : 28
                  }
                  height={
                    tab.path === "/" ? 34 :
                    tab.path === "/settings" ? 32 :
                    tab.path === "/visualization" ? 34 :
                    tab.path === "/tests" ? 40 :
                    tab.path === "/docs" ? 32 :
                    tab.path === "/about" ? 32 :
                    tab.path === "/save" ? 32 :
                    tab.path === "/load" ? 32 : 28
                  }
                />
              )}
              {tab.label && (
                <span
                  style={{
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {tab.label}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
}