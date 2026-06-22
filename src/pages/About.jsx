import React from "react";
import { useTranslation } from "react-i18next";
import member1 from "../icons/team/member1.jpg";
import member2 from "../icons/team/member2.jpg";
import member3 from "../icons/team/member3.jpg";
import member4 from "../icons/team/member4.jpg";

export default function About() {
  const { t } = useTranslation("docs");

  return (
    <div style={{ marginLeft: "30px" }}>
      <h1
        style={{
          fontSize: "30px",
          fontFamily: "sans-serif",
          color: "var(--text)",
          marginBottom: "20px"
        }}
      >
        {t("about.title")}
      </h1>

      <p
        style={{
          fontSize: "15px",
          fontFamily: "sans-serif",
          color: "var(--subtext)",
          lineHeight: "1.5"
        }}
      >
        {t("about.text")}
      </p>

            <h2
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          fontSize: "24px",
          fontFamily: "sans-serif",
          color: "var(--text)",
        }}
      >
        Участники
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          fontFamily: "sans-serif",
          gap: "20px",
          marginRight: "30px",
        }}
      >
        {[
          {
            name: "Кирилл Брагин",
            role: "Project Manager",
            img: member1,
            desc: "Проектирование архитектуры, организация разработки и тестирование приложения."
          },
          {
            name: "Иван Норицин",
            role: "Simulation Engineer",
            img: member2,
            desc: "Разработка моделей симуляции, алгоритмов планирования ресурсов и анализа результатов."
          },
          {
            name: "Анастасия Багрей",
            role: "Frontend Developer",
            img: member3,
            desc: "Разработка пользовательского интерфейса, настройка React-приложения, интеграция с API."
          },
          {
            name: "Артём Добромилов",
            role: "Backend Developer",
            img: member4,
            desc: "Разработка REST API и WebSocket, реализация логики взаимодействия с симулятором."
          }
        ].map((member) => (
          <div
            key={member.name}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <img
              src={member.img}
              alt={member.name}
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />

            <h3
              style={{
                margin: "0 0 5px",
                color: "var(--text)",
              }}
            >
              {member.name}
            </h3>

            <p
              style={{
                fontWeight: "bold",
                color: "#00A7C1",
                marginBottom: "10px",
              }}
            >
              {member.role}
            </p>

            <p
              style={{
                color: "var(--subtext)",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {member.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}