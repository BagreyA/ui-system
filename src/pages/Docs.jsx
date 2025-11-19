import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SectionItem = ({ title, text }) => (
  <div style={{ marginBottom: "15px" }}>
    <h3 style={{
      fontSize: "20px",
      fontWeight: "bold",
      color: "#2A3D4C",
      marginBottom: "8px",
      fontFamily: "sans-serif"
    }}>
      {title}
    </h3>
    <p style={{
      fontSize: "15px",
      color: "#2A3D4C",
      lineHeight: "1.5",
      fontFamily: "sans-serif"
    }}>
      {text}
    </p>
  </div>
);

export default function Docs({ showDocsPanel }) {
  const { t } = useTranslation("docs");
  const sections = t("sections", { returnObjects: true });

  const [activeSection, setActiveSection] = useState("graphs");
  const [hoveredSection, setHoveredSection] = useState(null);

  const sectionItems = Object.keys(sections).map((key) => ({
    id: key,
    label: sections[key].title,
    subItems: sections[key].subItems
  }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Левая панель документации */}
      {showDocsPanel && (
        <div style={{
          width: "300px",
          backgroundColor: "white",
          borderRadius: "0 22px 22px 0",
          padding: "20px",
          fontSize: "14px",
          color: "#2A3D4C",
          border: "2px solid #00A7C1",
          margin: "10px 20px 10px -17px",
          height: "653px",
          overflow: "auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            color: "#222933",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "left",
            paddingLeft: "10px" 
          }}>
            {t("documentationSections")}
          </div>

          <div>
            {sectionItems.map((item) => (
              <div key={item.id}>
                <div
                  onClick={() => setActiveSection(item.id)}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: activeSection === item.id ? "#00A7C1" : "#222933",
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: activeSection === item.id ? "#e6f7fa" : "#f8f9fa",
                    border: activeSection === item.id ? "2px solid #00A7C1" : "2px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  {item.label}
                </div>

                {/* Подпункты */}
                {hoveredSection === item.id && item.subItems && (
                  <div style={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginBottom: "4px"
                  }}>
                    {item.subItems.map((sub, idx) => (
                      <div key={idx} style={{
                        fontSize: "14px",
                        color: "#2A3D4C",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#f0f4f5",
                      }}>
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Основная часть документации */}
      <div style={{ flex: 1, marginLeft: showDocsPanel ? "0" : "30px", padding: "20px" }}>
        <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>
          {t("documentationTitle")}
        </h1>

        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: "25px"
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>
            {sections[activeSection].title}
          </h2>

          {/* Контент секции */}
          {sections[activeSection].content.map((item, idx) => (
            <SectionItem key={idx} title={item.title} text={item.text} />
          ))}

        </div>
      </div>
    </div>
  );
}
