import React, { useState } from "react";

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState("");

  const tests = [
    "Test scheduler with buffer",
    "Test visualize lte timeline", 
    "Test scheduler grid",
    "Test scheduler with metrics",
    "Test scheduler efficiency"
  ];

  const handleRunTest = () => {
    if (selectedTest) {
      console.log(`Запуск теста: ${selectedTest}`);
      // Здесь будет логика запуска выбранного теста
    }
  };

  return (
    <div style={{ marginLeft: "30px", display: "flex", gap: "40px", alignItems: "flex-start" }}>
      {/* Левая часть - список тестов и кнопка */}
      <div style={{ flex: 1 }}>
        <h1 
          style={{
            fontSize: "30px",
            fontFamily: "sans-serif",
            color: "#222933",
            marginBottom: "20px"
          }}
        >
          Тесты
        </h1>
        
        <h2
          style={{
            fontSize: "15px",
            fontFamily: "sans-serif",
            color: "#2A3D4C",
            marginBottom: "15px",
            marginLeft: "20px"
          }}
        >
          Список тестов
        </h2>

        <div style={{ marginBottom: "30px", marginLeft: "20px" }}>
          {tests.map((test, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                {/* Кастомная радио-кнопка */}
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
                    value={test}
                    checked={selectedTest === test}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      cursor: "pointer",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                  {selectedTest === test && (
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#4EC8F0",
                    }} />
                  )}
                </div>
                <span style={{
                  fontSize: "15px",
                  fontFamily: "sans-serif",
                  color: "#2A3D4C"
                }}>
                  {test}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Уменьшенная кнопка "Запустить" - сдвинута на 60px вправо */}
        <div style={{ 
          marginLeft: "80px",
          marginTop: "20px"
        }}>
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
              transition: "background-color 0.2s ease",
              opacity: selectedTest ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (selectedTest) {
                e.target.style.backgroundColor = "#0095B3";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTest) {
                e.target.style.backgroundColor = "#00A7C1";
              }
            }}
            onClick={handleRunTest}
            disabled={!selectedTest}
          >
            Запустить
          </button>
        </div>
      </div>

      {/* Правая часть - панель для вывода работы тестов с тенью и смещением */}
      <div style={{ 
        flex: 1, 
        backgroundColor: "white", 
        borderRadius: "8px", 
        padding: "20px",
        minHeight: "500px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#2A3D4C",
        overflow: "auto",
        border: "1px solid #e0e0e0",
        marginTop: "75px",
        marginLeft: "-500px", // Смещение панели левее
        marginRight: "50px", // Добавил отступ справа от края экрана
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)" // Тень для глубины
      }}>
        <div style={{ 
          color: "#222933", 
          marginBottom: "15px",
          fontSize: "16px",
          fontFamily: "sans-serif",
          fontWeight: "bold"
        }}>
          Вывод тестов
        </div>
        <div style={{ lineHeight: "1.5" }}>
          {selectedTest ? (
            <div>Готов к запуску теста: <strong>{selectedTest}</strong></div>
          ) : (
            <div>Выберите тест для запуска...</div>
          )}
        </div>
      </div>
    </div>
  );
}