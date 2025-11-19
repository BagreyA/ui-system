import React from "react";
import { useTranslation } from "react-i18next";

export default function Modal({
  isOpen,
  title,
  fileName,
  description,
  onFileNameChange,
  onDescriptionChange,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation("docs"); // указываем namespace "docs"
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        fontFamily: "sans-serif",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px 30px 20px 20px",
          borderRadius: "10px",
          minWidth: "500px",
          maxWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>

        <label style={{ fontWeight: "bold" }}>{t("saveModal.fileNameLabel")}</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />

        <label style={{ fontWeight: "bold" }}>{t("saveModal.descriptionLabel")}</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            height: "100px",
            resize: "none",
          }}
        />

        <button
          onClick={onConfirm}
          style={{
            padding: "10px",
            backgroundColor: "#00A7C1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {t("saveModal.saveButton")}
        </button>
      </div>
    </div>
  );
}

export function LoadModal({
  isOpen,
  title,
  onFileChange,
  link,
  onLinkChange,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation("docs");
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        fontFamily: "sans-serif",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px 30px 20px 20px",
          borderRadius: "10px",
          minWidth: "400px",
          maxWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: 0 }}>{title || t("loadModal.title")}</h2>

        <label style={{ fontWeight: "bold" }}>{t("loadModal.uploadFileLabel")}</label>
        <input
          type="file"
          onChange={(e) => onFileChange(e.target.files[0])}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ fontWeight: "bold" }}>{t("loadModal.enterLinkLabel")}</label>
        <input
          type="text"
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          style={{
            padding: "6px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />

        <button
          onClick={onConfirm}
          style={{
            padding: "10px",
            backgroundColor: "#00A7C1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {t("loadModal.uploadButton")}
        </button>
      </div>
    </div>
  );
}
