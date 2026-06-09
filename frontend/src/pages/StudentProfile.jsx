import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [phoneError, setPhoneError] = useState("");
  const { updateUser } = useAuth(); // Gọi hàm cập nhật từ Context

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
    cvUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            avatarUrl: data.avatar || "",
            cvUrl: data.cv_url || "",
          });
        }
      } catch (error) {
        console.error("Lỗi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
      if (numericValue.length > 12) {
        setPhoneError("Số điện thoại không được vượt quá 12 số.");
      } else {
        setPhoneError("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.phone && formData.phone.length > 12) {
      setMessage({ text: "Số điện thoại không được vượt quá 12 số!", type: "error" });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "" });

    const submitData = new FormData();
    submitData.append("full_name", formData.full_name);
    submitData.append("phone", formData.phone);
    submitData.append("bio", formData.bio);

    if (avatarFile) submitData.append("avatar", avatarFile);
    if (cvFile) submitData.append("cv", cvFile);

    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        // Gắn thông báo thành công để kích hoạt Popup Box
        setMessage({ text: "Cập nhật hồ sơ thành công!", type: "success" });

        setFormData((prev) => ({
          ...prev,
          avatarUrl: data.profile.avatar || prev.avatarUrl,
          cvUrl: data.profile.cv_url || prev.cvUrl,
        }));
        setAvatarFile(null);
        setCvFile(null);

        // GỌI HÀM UPDATE USER ĐỂ TRUYỀN DỮ LIỆU LÊN TOPBAR
        updateUser({
          name: formData.full_name,
          avatar: data.profile.avatar, // Đẩy ảnh mới lấy từ Backend lên
        });

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          storedUser.name = formData.full_name;
          localStorage.setItem("user", JSON.stringify(storedUser));
        }
      } else {
        const errorMessages = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message;
        setMessage({ text: errorMessages || "Có lỗi xảy ra!", type: "error" });
      }
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      setMessage({ text: "Lỗi kết nối máy chủ!", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div
          style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}
        >
          Đang tải dữ liệu...
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      {/* KHU VỰC POPUP THÀNH CÔNG (Nổi giữa màn hình) */}
      {message.text && message.type === "success" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "32px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "340px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#f8fafc",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Hoàn tất!
            </h3>
            <p
              style={{
                margin: "0 0 24px 0",
                color: "#94a3b8",
                fontSize: "15px",
              }}
            >
              {message.text}
            </p>
            <button
              onClick={() => setMessage({ text: "", type: "" })}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#f8fafc",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)")
              }
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#0B0F19",
          minHeight: "100vh",
          padding: "40px 0",
        }}
      >
        <div
          style={{ maxWidth: "1170px", margin: "0 auto", padding: "0 20px" }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                padding: "8px",
                borderRadius: "8px",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1
              style={{
                fontSize: "24px",
                color: "#f8fafc",
                margin: 0,
                fontWeight: 600,
              }}
            >
              Hồ sơ cá nhân
            </h1>
          </div>

          {/* Main Card */}
          <div
            style={{
              background:
                "linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)",
              padding: "32px",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Thông báo lỗi */}
            {message.text && message.type === "error" && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "24px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#fca5a5",
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                {/* Left Column: Avatar */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                    width: "200px",
                  }}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {avatarFile ? (
                      <img
                        src={URL.createObjectURL(avatarFile)}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <label
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#a5b4fc",
                      fontWeight: 500,
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      padding: "8px 20px",
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        "rgba(99, 102, 241, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor =
                        "rgba(99, 102, 241, 0.1)")
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ pointerEvents: "none" }}
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Đổi ảnh
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {/* Right Column: Form Fields */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    minWidth: "300px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#cbd5e1",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Họ và tên <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      style={{
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
                      }}
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#cbd5e1",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Email (Tài khoản đăng nhập){" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        backgroundColor: "rgba(15, 23, 42, 0.4)",
                        color: "#64748b",
                        outline: "none",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#cbd5e1",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Số điện thoại liên hệ{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: phoneError ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.1)",
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        color: "#f8fafc",
                        outline: "none",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = phoneError ? "#ef4444" : "#6366f1";
                        e.target.style.boxShadow = phoneError ? "0 0 0 1px #ef4444" : "0 0 0 1px #6366f1";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = phoneError ? "#ef4444" : "rgba(255, 255, 255, 0.1)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    {phoneError && (
                      <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        {phoneError}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#cbd5e1",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Giới thiệu ngắn gọn (Bio)
                    </label>
                    <div style={{ position: "relative" }}>
                      <textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                        placeholder="Viết vài dòng giới thiệu về bản thân, kỹ năng nổi bật..."
                        rows="4"
                        maxLength="500"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          paddingBottom: "32px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          backgroundColor: "rgba(15, 23, 42, 0.6)",
                          color: "#f8fafc",
                          outline: "none",
                          fontSize: "15px",
                          boxSizing: "border-box",
                          resize: "vertical",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#6366f1";
                          e.target.style.boxShadow = "0 0 0 1px #6366f1";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      ></textarea>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          right: "16px",
                          fontSize: "12px",
                          color: "#64748b",
                          pointerEvents: "none",
                        }}
                      >
                        {(formData.bio || "").length}/500
                      </div>
                    </div>
                  </div>

                  {/* CV Section */}
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      padding: "24px",
                      borderRadius: "12px",
                      border: "1px dashed rgba(255, 255, 255, 0.15)",
                      marginTop: "8px",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: "16px",
                        color: "#f8fafc",
                        marginBottom: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Hồ sơ xin việc (CV)
                    </label>
                    <p
                      style={{
                        margin: "0 0 20px 0",
                        fontSize: "14px",
                        color: "#94a3b8",
                      }}
                    >
                      Tải lên file PDF định dạng chuẩn để nhà tuyển dụng đánh
                      giá. (Tối đa 5MB)
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <label
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          fontSize: "14px",
                          cursor: "pointer",
                          fontWeight: 500,
                          color: "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor =
                            "rgba(255, 255, 255, 0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor =
                            "rgba(255, 255, 255, 0.05)")
                        }
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ pointerEvents: "none" }}
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        {cvFile ? "Đã chọn file mới" : "Chọn file PDF"}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setCvFile(e.target.files[0])}
                          style={{ display: "none" }}
                        />
                      </label>

                      {cvFile ? (
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#10b981",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          {cvFile.name}
                        </span>
                      ) : formData.cvUrl ? (
                        <a
                          href={formData.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: "14px",
                            color: "#a5b4fc",
                            textDecoration: "none",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Xem CV hiện tại của bạn
                        </a>
                      ) : (
                        <span style={{ fontSize: "14px", color: "#64748b" }}>
                          Chưa có file nào được tải lên.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  margin: "8px 0",
                }}
              ></div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "12px 32px",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: saving ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!saving)
                      e.target.style.boxShadow =
                        "0 6px 16px rgba(99, 102, 241, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    if (!saving)
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(99, 102, 241, 0.3)";
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pointerEvents: "none" }}
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  {saving ? "Đang lưu..." : "Lưu Hồ Sơ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default StudentProfile;
