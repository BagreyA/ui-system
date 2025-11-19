import React from "react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("docs"); 
  
  return (
    <div style={{ marginLeft: "30px" }}>
      <h1
        style={{
          fontSize: "30px",
          fontFamily: "sans-serif",
          color: "#222933",
          marginBottom: "20px"
        }}
      >
        {t("about.title")}
      </h1>
      <p
        style={{
          fontSize: "15px",
          fontFamily: "sans-serif",
          color: "#2A3D4C",
          lineHeight: "1.5"
        }}
      >
        {t("about.text")}
      </p>
    </div>
  );
}
