import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function StudentSettings() {
  const navigate = useNavigate();
  const { logout, userName, userRole } = useAuth();

  // State đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // State thông tin tài khoản
  const [accountInfo, setAccountInfo] = useState({ email: '', role: '', created_at: '' });
  const [loadingInfo, setLoadingInfo] = useState(true);

  // State xóa tài khoản
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State popup thành công
  const [successPopup, setSuccessPopup] = useState('');

  const getToken = () => localStorage.getItem('access_token') || localStorage.getItem('token');

  // Lấy thông tin tài khoản
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/user', {
          headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setAccountInfo({ email: data.email || '', role: data.role || '', created_at: data.created_at || '' });
        }
      } catch (e) { console.error('Lỗi tải thông tin:', e); }
      finally { setLoadingInfo(false); }
    };
    fetchAccount();
  }, []);

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (passwordForm.new_password.length < 6) {
      setPasswordMsg({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
      return;
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordMsg({ text: 'Xác nhận mật khẩu mới không khớp.', type: 'error' });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/account/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessPopup('Đổi mật khẩu thành công!');
        setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      } else {
        const errMsg = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
        setPasswordMsg({ text: errMsg || 'Có lỗi xảy ra!', type: 'error' });
      }
    } catch { setPasswordMsg({ text: 'Lỗi kết nối máy chủ!', type: 'error' }); }
    finally { setPasswordSaving(false); }
  };

  // Xử lý xóa tài khoản
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'XOA TAI KHOAN') return;
    setDeleting(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        logout();
        navigate('/');
      }
    } catch { alert('Lỗi kết nối máy chủ!'); }
    finally { setDeleting(false); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const roleLabel = (r) => {
    if (r === 'student') return 'Sinh viên';
    if (r === 'employer') return 'Nhà tuyển dụng';
    if (r === 'admin') return 'Quản trị viên';
    return r;
  };

  // Styles
  const sectionCard = { backgroundColor: '#fff', padding: '28px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginBottom: '24px' };
  const sectionTitle = { fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' };
  const labelStyle = { display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px', fontWeight: 500 };
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '15px', boxSizing: 'border-box', transition: 'border-color 0.2s' };
  const btnPrimary = { padding: '12px 32px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' };
  const infoRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F1F5F9' };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '40px' }}>
      <Topbar />

      {/* POPUP THÀNH CÔNG */}
      {successPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '50px', marginBottom: '12px', lineHeight: 1 }}>✅</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>Hoàn tất!</h3>
            <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '15px' }}>{successPopup}</p>
            <button onClick={() => setSuccessPopup('')} style={{ ...btnPrimary, width: '100%' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}>Đóng</button>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA TÀI KHOẢN */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>⚠️</div>
              <h3 style={{ margin: '0 0 8px', color: '#0F172A', fontSize: '20px', fontWeight: 700 }}>Xóa tài khoản vĩnh viễn?</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>
                Hành động này <strong style={{ color: '#DC2626' }}>không thể hoàn tác</strong>. Toàn bộ hồ sơ, CV và lịch sử ứng tuyển sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ ...labelStyle, fontSize: '13px' }}>Gõ <strong style={{ color: '#DC2626', fontFamily: 'monospace', backgroundColor: '#FEF2F2', padding: '2px 6px', borderRadius: '4px' }}>XOA TAI KHOAN</strong> để xác nhận:</label>
              <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Nhập tại đây..."
                style={{ ...inputStyle, borderColor: deleteConfirm === 'XOA TAI KHOAN' ? '#DC2626' : '#CBD5E1', textAlign: 'center', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '1px' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', color: '#475569' }}>Hủy bỏ</button>
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'XOA TAI KHOAN' || deleting}
                style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: deleteConfirm === 'XOA TAI KHOAN' ? '#DC2626' : '#FDA4AF', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: deleteConfirm === 'XOA TAI KHOAN' ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                {deleting ? 'Đang xóa...' : '🗑️ Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '8px' }}>⚙️ Cài đặt tài khoản</h1>
        <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '28px' }}>Quản lý bảo mật và thông tin tài khoản của bạn</p>

        {/* SECTION 1: THÔNG TIN TÀI KHOẢN */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>👤 Thông tin tài khoản</h2>
          {loadingInfo ? (
            <p style={{ color: '#94A3B8', textAlign: 'center', padding: '20px' }}>Đang tải...</p>
          ) : (
            <div>
              <div style={infoRow}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Họ và tên</span>
                <span style={{ color: '#0F172A', fontWeight: 500, fontSize: '15px' }}>{userName || '—'}</span>
              </div>
              <div style={infoRow}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Email đăng nhập</span>
                <span style={{ color: '#0F172A', fontWeight: 500, fontSize: '15px' }}>{accountInfo.email || '—'}</span>
              </div>
              <div style={infoRow}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Loại tài khoản</span>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, backgroundColor: accountInfo.role === 'student' ? '#DBEAFE' : '#D1FAE5', color: accountInfo.role === 'student' ? '#1E40AF' : '#065F46' }}>
                  {roleLabel(accountInfo.role)}
                </span>
              </div>
              <div style={{ ...infoRow, borderBottom: 'none' }}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Ngày tạo tài khoản</span>
                <span style={{ color: '#0F172A', fontWeight: 500, fontSize: '15px' }}>{formatDate(accountInfo.created_at)}</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: ĐỔI MẬT KHẨU */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>🔒 Đổi mật khẩu</h2>

          {passwordMsg.text && (
            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', backgroundColor: passwordMsg.type === 'error' ? '#FEE2E2' : '#D1FAE5', color: passwordMsg.type === 'error' ? '#DC2626' : '#065F46', fontSize: '14px', fontWeight: 500 }}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Mật khẩu hiện tại</label>
              <input type="password" required value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại..." style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'} />
            </div>
            <div>
              <label style={labelStyle}>Mật khẩu mới</label>
              <input type="password" required value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="Ít nhất 6 ký tự..." style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'} />
            </div>
            <div>
              <label style={labelStyle}>Xác nhận mật khẩu mới</label>
              <input type="password" required value={passwordForm.new_password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                placeholder="Nhập lại mật khẩu mới..." style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={passwordSaving} style={{ ...btnPrimary, cursor: passwordSaving ? 'not-allowed' : 'pointer', opacity: passwordSaving ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!passwordSaving) e.target.style.backgroundColor = '#2563EB'; }}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}>
                {passwordSaving ? 'Đang xử lý...' : '🔐 Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 3: VÙNG NGUY HIỂM */}
        <div style={{ ...sectionCard, borderColor: '#FECACA', backgroundColor: '#FFFBFB' }}>
          <h2 style={{ ...sectionTitle, color: '#DC2626' }}>🚨 Vùng nguy hiểm</h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
            Khi xóa tài khoản, tất cả dữ liệu bao gồm hồ sơ cá nhân, CV đã tải lên và lịch sử ứng tuyển sẽ bị xóa <strong>vĩnh viễn</strong> và không thể khôi phục.
          </p>
          <button onClick={() => setShowDeleteModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#fff', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#FEE2E2'; e.target.style.borderColor = '#DC2626'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.borderColor = '#FECACA'; }}>
            🗑️ Xóa tài khoản của tôi
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentSettings;
