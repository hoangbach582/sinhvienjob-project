import React from 'react';
import { CheckCircle, Clock, Lock, XCircle, AlertCircle } from 'lucide-react';

/**
 * Component hiển thị badge trạng thái tài khoản
 * Hỗ trợ: active, pending, locked, rejected
 */
const StatusBadge = ({ status, size = 'md' }) => {
  // Cấu hình cho từng loại trạng thái
  const config = {
    active: {
      label: 'Hoạt động',
      icon: CheckCircle,
      bg: '#EAF3DE',
      color: '#3B6D11',
      border: '#c6e0a0',
    },
    pending: {
      label: 'Chờ duyệt',
      icon: Clock,
      bg: '#FAEEDA',
      color: '#854F0B',
      border: '#f0cc96',
    },
    locked: {
      label: 'Bị khóa',
      icon: Lock,
      bg: '#FCEBEB',
      color: '#A32D2D',
      border: '#f5b8b8',
    },
    rejected: {
      label: 'Bị từ chối',
      icon: XCircle,
      bg: '#F3F3F3',
      color: '#5a5a5a',
      border: '#d0d0d0',
    },
  };

  const cfg = config[status] || {
    label: status,
    icon: AlertCircle,
    bg: '#F1EFE8',
    color: '#5F5E5A',
    border: '#d8d8d0',
  };

  const Icon = cfg.icon;
  const fontSize = size === 'sm' ? '11px' : '12px';
  const iconSize = size === 'sm' ? 11 : 12;
  const padding = size === 'sm' ? '2px 8px' : '3px 10px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        borderRadius: '20px',
        fontSize,
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
