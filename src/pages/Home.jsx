import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OverviewIcon from "../icons/overview.png";
import { fetchOverviewSimulation } from "../api/index_home";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation("docs");
  const [loading, setLoading] = useState(false);

  async function handleOverviewClick() {
    setLoading(true);
    try {
      const data = await fetchOverviewSimulation();
      navigate("/overview", { state: { simulation: data } });
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Ошибка симуляции");
    }
    setLoading(false);
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-50">
      <main className="flex flex-col justify-center items-center relative text-center w-full px-10" style={{ marginTop: "-100px" }}>
        <h1 style={{ fontFamily: "sans-serif", color: "#222933", fontSize: "35px", textAlign: "center", maxWidth: "1200px", marginBottom: "30px" }}>
          {t("home.welcome")}
        </h1>

        <p style={{ fontFamily: "sans-serif", color: "#2A3D4C", fontSize: "20px", textAlign: "center", maxWidth: "800px", marginBottom: "40px" }}>
          {t("home.description")}
        </p>

        <button
          style={{ backgroundColor: "#00A7C1", color: "white", fontSize: "25px", width: "150px", height: "60px", borderRadius: "12px", border: "2px solid white", fontFamily: "sans-serif", cursor: "pointer", transition: "background-color 0.2s ease", marginTop: "40px" }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#0095B3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#00A7C1"}
          onClick={() => navigate("/settings")}
        >
          {t("home.startButton")}
        </button>
      </main>

      <div
        style={{ position: "fixed", bottom: "20px", right: "20px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: loading ? "#00889B" : "#00A7C1", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "2px solid white", fontFamily: "sans-serif", padding: "0", gap: "0px", opacity: loading ? "1" : "0.6", cursor: "pointer" }}
        onClick={handleOverviewClick}
      >
        {loading ? (
          <span style={{ fontSize: "12px" }}>...</span>
        ) : (
          <>
            <img src={OverviewIcon} alt={t("home.overview")} width="34" height="34" />
            <span style={{ fontSize: "11px" }}>{t("home.overview")}</span>
          </>
        )}
      </div>
    </div>
  );
}
