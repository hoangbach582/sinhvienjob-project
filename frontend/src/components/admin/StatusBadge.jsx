import React from 'react';
import { CheckCircle, Clock, Lock, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  active: {
    label: 'Hoạt động',
    Icon: CheckCircle,
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  pending: {
    label: 'Chờ duyệt',
    Icon: Clock,
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  locked: {
    label: 'Bị khóa',
    Icon: Lock,
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  rejected: {
    label: 'Từ chối',
    Icon: XCircle,
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    Icon: AlertCircle,
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const { Icon, label, cls } = cfg;
  const iconSize = size === 'sm' ? 11 : 13;
  const textCls = size === 'sm' ? 'text-[11px]' : 'text-[12px]';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${cls} ${textCls}`}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
};

export default StatusBadge;
