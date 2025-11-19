import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { runTestRequest } from "../api/tests";

export default function Tests() {
  const { t } = useTranslation("docs");
  const [selectedTest, setSelectedTest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const tests = [
    { key: "schedulerBuffer" },
    { key: "visualizeTimeline" },
    { key: "schedulerGrid" },
    { key: "schedulerMetrics" },
    { key: "schedulerEfficiency" }
  ];

  const handleRunTest = async () => {
    if (!selectedTest) return;

    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      const data = await runTestRequest(selectedTest);
      setOutput(data.output || t("noServerData"));
    } catch (err) {
      setError(err.response?.data?.detail || t("errorDefault"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: "30px", display: "flex", gap: "40px", alignItems: "flex-start" }}>

      {/* Левая панель */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "sans-serif", fontSize: "30px", color: "#222933", marginBottom: "20px" }}>
          {t("title")}
        </h1>

        <h2 style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#2A3D4C", marginBottom: "15px", marginLeft: "20px" }}>
          {t("listTitle")}
        </h2>

        <div style={{ marginBottom: "30px", marginLeft: "20px" }}>
          {tests.map((item) => (
            <div key={item.key} style={{ marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "2px solid #00A7C1",
                  marginRight: "10px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <input
                    type="radio"
                    name="test"
                    value={item.key}
                    checked={selectedTest === item.key}
                    onChange={() => setSelectedTest(item.key)}
                    style={{ position: "absolute", opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                  />
                  {selectedTest === item.key && (
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4EC8F0" }} />
                  )}
                </div>

                <span style={{ fontSize: "15px", fontFamily: "sans-serif", color: "#2A3D4C" }}>
                  {t(`list.${item.key}`)}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Кнопка запуска */}
        <div style={{ marginLeft: "80px", marginTop: "20px" }}>
          <button
            style={{
              backgroundColor: "#00A7C1",
              color: "white",
              fontSize: "18px",
              width: "120px",
              height: "45px",
              borderRadius: "8px",
              border: "2px solid white",
              fontFamily: "sans-serif",
              cursor: selectedTest ? "pointer" : "not-allowed",
              opacity: selectedTest ? 1 : 0.6
            }}
            onClick={handleRunTest}
            disabled={!selectedTest || isLoading}
          >
            {isLoading ? t("loading") : t("runButton")}
          </button>
        </div>
      </div>

      {/* Правая панель вывода */}
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          minHeight: "500px",
          fontSize: "14px",
          color: "#2A3D4C",
          fontFamily: "sans-serif",
          overflow: "auto",
          border: "1px solid #e0e0e0",
          marginTop: "75px",
          marginLeft: "-500px",
          marginRight: "50px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div style={{ color: "#222933", marginBottom: "15px", fontSize: "16px", fontFamily: "sans-serif", fontWeight: "bold" }}>
          {t("outputTitle")}
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {t("error")}: {error}
          </div>
        )}

        {isLoading && <div>{t("runningTest")}</div>}

        {!isLoading && output && (
          <pre style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
            {output}
          </pre>
        )}

        {!selectedTest && !isLoading && !output && !error && (
          <div>{t("outputSelect")}</div>
        )}
      </div>
    </div>
  );
}
