import React from "react";

const ProfileExtendedFields = ({ formData, handleInputChange }) => {
  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "all 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    color: "#cbd5e1",
    marginBottom: "8px",
    fontWeight: 500,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          height: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          margin: "10px 0",
        }}
      ></div>

      <h3
        style={{
          fontSize: "18px",
          color: "#f8fafc",
          margin: "0 0 10px 0",
          fontWeight: 600,
        }}
      >
        Thông tin mở rộng
      </h3>

      <div>
        <label style={labelStyle}>Portfolio URL (Link trang web cá nhân)</label>
        <input
          type="url"
          name="portfolio_url"
          value={formData.portfolio_url || ""}
          onChange={handleInputChange}
          placeholder="https://yourportfolio.com"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.boxShadow = "0 0 0 1px #6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div>
        <label style={labelStyle}>Học vấn (Mỗi trường 1 dòng)</label>
        <textarea
          name="education"
          value={formData.education || ""}
          onChange={handleInputChange}
          placeholder="VD: Đại học Bách Khoa - Ngành CNTT (2020-2024)"
          rows="3"
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        ></textarea>
      </div>

      <div>
        <label style={labelStyle}>
          Kinh nghiệm làm việc (Mỗi công việc 1 dòng)
        </label>
        <textarea
          name="experience"
          value={formData.experience || ""}
          onChange={handleInputChange}
          placeholder="VD: Thực tập sinh Frontend - Công ty ABC (06/2023 - 09/2023)"
          rows="3"
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        ></textarea>
      </div>

      <div>
        <label style={labelStyle}>Dự án cá nhân (Mỗi dự án 1 dòng)</label>
        <textarea
          name="projects"
          value={formData.projects || ""}
          onChange={handleInputChange}
          placeholder="VD: Web tìm việc làm - Sử dụng React, Laravel (Link: github.com/...)"
          rows="3"
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        ></textarea>
      </div>

      <div>
        <label style={labelStyle}>Kỹ năng (Mỗi kỹ năng 1 dòng)</label>
        <textarea
          name="skills"
          value={formData.skills || ""}
          onChange={handleInputChange}
          placeholder="VD: ReactJS&#10;Laravel&#10;Tiếng Anh giao tiếp"
          rows="3"
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default ProfileExtendedFields;
