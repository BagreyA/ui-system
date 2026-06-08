import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SectionItem = ({ title, content, text, items }) => (
  <div style={{ marginBottom: "15px" }}>
    {title && (
      <h3 style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "var(--subtext)",
        marginBottom: "8px",
        fontFamily: "sans-serif"
      }}>
        {title}
      </h3>
    )}

    {text && (
      <p style={{ fontSize: "15px", color: "var(--subtext)", lineHeight: "1.5", fontFamily: "sans-serif" }}>
        {text}
      </p>
    )}

    {items && (
      <ul style={{ paddingLeft: "20px", marginTop: "5px", color: "var(--subtext)" }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
        ))}
      </ul>
    )}

    {content && content.map((child, idx) => (
      <SectionItem key={idx} {...child} />
    ))}
  </div>
);

export default function Docs({ showDocsPanel }) {
  const { t } = useTranslation("docs");
  const sections = t("sections", { returnObjects: true });

  const [activeSection, setActiveSection] = useState("interface");
  const [hoveredSection, setHoveredSection] = useState(null);

  const getSubItems = (content) => {
    if (!content) return [];
    return content.flatMap(item => {
      let sub = [];
      
      // Рекурсивно обрабатываем subItems
      if (item.subItems) {
        sub.push(...item.subItems.flatMap(subItem => [subItem.title, ...getSubItems(subItem.subItems || subItem.content)]));
      }
      
      // Рекурсивно обрабатываем content
      if (item.content) {
        sub.push(...getSubItems(item.content));
      }
      
      return sub;
    });
  };

  const sectionItems = Object.keys(sections).map((key) => ({
    id: key,
    label: sections[key].title,
    subItems: getSubItems(sections[key].content)
  }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Левая панель документации */}
      {showDocsPanel && (
        <div style={{
          width: "320px",
          backgroundColor: "var(--bg)",
          borderRadius: "0 22px 22px 0",
          padding: "20px",
          fontSize: "14px",
          color: "var(--subtext)",
          border: "2px solid var(--primary)",
          margin: "10px 20px 10px -17px",
          height: "680px",
          overflow: "auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            color: "var(--text)",
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
                    color: activeSection === item.id ? "var(--primary)" : "var(--text)",
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: activeSection === item.id ? "var(--border)" : "var(--card)",
                    border: activeSection === item.id ? "2px solid var(--primary)" : "2px solid transparent",
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
                        color: "var(--subtext)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "var(--card)",
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
          <h1
            style={{
              fontSize: "30px",
              fontFamily: "sans-serif",
              color: "var(--text)",
              marginTop: "0px",  
              marginBottom: "20px",
              marginLeft: "-20px"
            }}
          >
            {t("documentationTitle")}
          </h1>
          <div style={{
            backgroundColor: "var(--bg)",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 2px 6px var(--text)",
            marginBottom: "25px",
            maxHeight: "550px",
            overflowY: "auto"
          }}>
            <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>
              {sections[activeSection].title}
            </h2>

            {/* Контент секции */}
            {sections[activeSection].content.map((item, idx) => (
              <SectionItem key={idx} {...item} />
            ))}
          </div>
        </div>
    </div>
  );
}
