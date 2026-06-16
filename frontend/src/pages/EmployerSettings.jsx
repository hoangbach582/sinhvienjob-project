import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Settings,
  Building,
  Mail,
  Briefcase,
  Calendar,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
} from "lucide-react";

function EmployerSettings() {
  const navigate = useNavigate();
  const { logout, userName } = useAuth();

  // State đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State thông tin tài khoản
  const [accountInfo, setAccountInfo] = useState({
    email: "",
    role: "",
    created_at: "",
  });
  const [loadingInfo, setLoadingInfo] = useState(true);

  // State xóa tài khoản
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State popup thành công
  const [successPopup, setSuccessPopup] = useState("");

  const getToken = () =>
    localStorage.getItem("access_token") || localStorage.getItem("token");

  // Lấy thông tin tài khoản
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAccountInfo({
            email: data.email || "",
            role: data.role || "",
            created_at: data.created_at || "",
          });
        }
      } catch (e) {
        console.error("Lỗi tải thông tin:", e);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchAccount();
  }, []);

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: "", type: "" });

    if (passwordForm.new_password.length < 6) {
      setPasswordMsg({
        text: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        type: "error",
      });
      return;
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordMsg({
        text: "Xác nhận mật khẩu mới không khớp.",
        type: "error",
      });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/account/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
          body: JSON.stringify(passwordForm),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setSuccessPopup("Đổi mật khẩu thành công!");
        setPasswordForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        const errMsg = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message;
        setPasswordMsg({ text: errMsg || "Có lỗi xảy ra!", type: "error" });
      }
    } catch {
      setPasswordMsg({ text: "Lỗi kết nối máy chủ!", type: "error" });
    } finally {
      setPasswordSaving(false);
    }
  };

  // Xử lý xóa tài khoản
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "XOA TAI KHOAN") return;
    setDeleting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        logout();
        navigate("/");
      }
    } catch {
      alert("Lỗi kết nối máy chủ!");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Styles - Light theme matching EmployerLayout
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "24px",
  };

  const dangerCard = {
    ...cardStyle,
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
  };

  const sectionTitle = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#0F172A",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    color: "#64748B",
    marginBottom: "8px",
    fontWeight: 500,
  };

  const inputContainer = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    paddingRight: "48px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #CBD5E1",
    color: "#334155",
    outline: "none",
    fontSize: "15px",
    transition: "all 0.2s",
  };

  const eyeIconBtn = {
    position: "absolute",
    right: "16px",
    background: "none",
    border: "none",
    color: "#64748B",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  const btnPrimary = {
    padding: "12px 24px",
    backgroundColor: "#10B981",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const infoRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #F1F5F9",
  };

  return (
    <>
      {/* POPUP THÀNH CÔNG */}
      {successPopup && (
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
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "32px",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "340px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                color: "#10B981",
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#0F172A",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Hoàn tất!
            </h3>
            <p
              style={{
                margin: "0 0 24px 0",
                color: "#64748B",
                fontSize: "15px",
              }}
            >
              {successPopup}
            </p>
            <button
              onClick={() => setSuccessPopup("")}
              style={{ ...btnPrimary, width: "100%", justifyContent: "center" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#10B981")}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA TÀI KHOẢN */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "32px",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "420px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "#EF4444",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <AlertTriangle size={32} />
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0F172A",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                Xóa tài khoản vĩnh viễn?
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#64748B",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Hành động này{" "}
                <strong style={{ color: "#EF4444" }}>không thể hoàn tác</strong>
                . Toàn bộ thông tin công ty, tin tuyển dụng đã đăng và hồ sơ ứng
                viên đã nhận sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ ...labelStyle, fontSize: "13px" }}>
                Gõ{" "}
                <strong
                  style={{
                    color: "#EF4444",
                    fontFamily: "monospace",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  XOA TAI KHOAN
                </strong>{" "}
                để xác nhận:
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Nhập tại đây..."
                style={{
                  ...inputStyle,
                  borderColor:
                    deleteConfirm === "XOA TAI KHOAN"
                      ? "#EF4444"
                      : "#CBD5E1",
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: "16px",
                  letterSpacing: "1px",
                  color: "#0F172A",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor =
                    deleteConfirm === "XOA TAI KHOAN"
                      ? "#EF4444"
                      : "#94A3B8")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    deleteConfirm === "XOA TAI KHOAN"
                      ? "#EF4444"
                      : "#CBD5E1")
                }
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#334155",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ffffff")
                }
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "XOA TAI KHOAN" || deleting}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  backgroundColor:
                    deleteConfirm === "XOA TAI KHOAN"
                      ? "#EF4444"
                      : "rgba(239, 68, 68, 0.5)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor:
                    deleteConfirm === "XOA TAI KHOAN"
                      ? "pointer"
                      : "not-allowed",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (deleteConfirm === "XOA TAI KHOAN" && !deleting)
                    e.target.style.backgroundColor = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  if (deleteConfirm === "XOA TAI KHOAN" && !deleting)
                    e.target.style.backgroundColor = "#EF4444";
                }}
              >
                {deleting ? (
                  "Đang xóa..."
                ) : (
                  <>
                    <Trash2 size={18} /> Xóa vĩnh viễn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          padding: "4px 0 40px 0",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34d399",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)",
              }}
            >
              <Settings size={24} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: "0 0 4px 0",
                }}
              >
                Cài đặt tài khoản
              </h1>
              <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
                Quản lý bảo mật và thông tin tài khoản nhà tuyển dụng
              </p>
            </div>
          </div>

          {/* SECTION 1: THÔNG TIN TÀI KHOẢN */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Building size={18} />
              </div>
              Thông tin tài khoản
            </h2>
            {loadingInfo ? (
              <p
                style={{
                  color: "#64748B",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Đang tải...
              </p>
            ) : (
              <div>
                <div style={infoRow}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    <Building size={16} /> Tên công ty
                  </div>
                  <span
                    style={{ color: "#0F172A", fontWeight: 500, fontSize: "15px" }}
                  >
                    {userName || "—"}
                  </span>
                </div>
                <div style={infoRow}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    <Mail size={16} /> Email đăng nhập
                  </div>
                  <span
                    style={{ color: "#0F172A", fontWeight: 500, fontSize: "15px" }}
                  >
                    {accountInfo.email || "—"}
                  </span>
                </div>
                <div style={infoRow}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    <Briefcase size={16} /> Loại tài khoản
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    Nhà tuyển dụng
                  </span>
                </div>
                <div
                  style={{ ...infoRow, borderBottom: "none", paddingBottom: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    <Calendar size={16} /> Ngày tạo tài khoản
                  </div>
                  <span
                    style={{ color: "#0F172A", fontWeight: 500, fontSize: "15px" }}
                  >
                    {formatDate(accountInfo.created_at)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: ĐỔI MẬT KHẨU */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748B",
                }}
              >
                <Lock size={18} />
              </div>
              Đổi mật khẩu
            </h2>

            {passwordMsg.text && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "24px",
                  borderRadius: "12px",
                  backgroundColor:
                    passwordMsg.type === "error"
                      ? "#FEF2F2"
                      : "#ECFDF5",
                  color: passwordMsg.type === "error" ? "#DC2626" : "#059669",
                  border: `1px solid ${passwordMsg.type === "error" ? "#FECACA" : "#A7F3D0"}`,
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {passwordMsg.type === "error" ? (
                  <AlertTriangle size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {passwordMsg.text}
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <label style={labelStyle}>Mật khẩu hiện tại</label>
                <div style={inputContainer}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        current_password: e.target.value,
                      })
                    }
                    placeholder="Nhập mật khẩu hiện tại..."
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#10B981")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#CBD5E1")
                    }
                  />
                  <button
                    type="button"
                    style={eyeIconBtn}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mật khẩu mới</label>
                <div style={inputContainer}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        new_password: e.target.value,
                      })
                    }
                    placeholder="Ít nhất 6 ký tự..."
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#10B981")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#CBD5E1")
                    }
                  />
                  <button
                    type="button"
                    style={eyeIconBtn}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Xác nhận mật khẩu mới</label>
                <div style={inputContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordForm.new_password_confirmation}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        new_password_confirmation: e.target.value,
                      })
                    }
                    placeholder="Nhập lại mật khẩu mới..."
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#10B981")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#CBD5E1")
                    }
                  />
                  <button
                    type="button"
                    style={eyeIconBtn}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <button
                  type="submit"
                  disabled={passwordSaving}
                  style={{
                    ...btnPrimary,
                    cursor: passwordSaving ? "not-allowed" : "pointer",
                    opacity: passwordSaving ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!passwordSaving)
                      e.target.style.backgroundColor = "#059669";
                  }}
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#10B981")
                  }
                >
                  {passwordSaving ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <Lock size={18} /> Đổi mật khẩu
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: VÙNG NGUY HIỂM */}
          <div style={dangerCard}>
            <h2
              style={{
                ...sectionTitle,
                color: "#EF4444",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EF4444",
                }}
              >
                <AlertTriangle size={18} />
              </div>
              Vùng nguy hiểm
            </h2>
            <p
              style={{
                color: "#64748B",
                fontSize: "14px",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            >
              Khi xóa tài khoản, tất cả dữ liệu bao gồm thông tin công ty, tin
              tuyển dụng đã đăng và hồ sơ ứng viên đã nhận sẽ bị xóa{" "}
              <strong style={{ color: "#EF4444", fontWeight: 500 }}>
                vĩnh viễn
              </strong>{" "}
              và không thể khôi phục.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ffffff",
                  color: "#EF4444",
                  border: "1px solid #FECACA",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEF2F2";
                  e.target.style.borderColor = "#FCA5A5";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#FECACA";
                }}
              >
                <Trash2 size={18} /> Xóa tài khoản của tôi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployerSettings;
