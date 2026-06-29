import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { Activity, Clock, User, Tag } from "lucide-react";

function AdminActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = React.useCallback(async (currentPage) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/admin/activity-logs?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Không thể tải nhật ký hoạt động");
      
      const data = await res.json();
      setLogs(data.data);
      setTotalPages(data.last_page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const formatProperties = (properties) => {
    if (!properties || Object.keys(properties).length === 0) return null;
    
    return (
      <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
        <pre className="whitespace-pre-wrap font-mono text-slate-600 dark:text-slate-300">
          {JSON.stringify(properties, null, 2)}
        </pre>
      </div>
    );
  };

  const getEventBadge = (event) => {
    switch (event) {
      case 'created':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Tạo mới</span>;
      case 'updated':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Cập nhật</span>;
      case 'deleted':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Xóa</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">{event}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand" />
            Nhật ký hoạt động hệ thống
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi tất cả thay đổi dữ liệu quan trọng trong hệ thống
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Chưa có hoạt động nào được ghi nhận.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Thời gian</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Người thực hiện</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Hành động</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Đối tượng</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Chi tiết thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                        <User className="w-4 h-4 text-slate-400" />
                        {log.causer ? log.causer.name : "Hệ thống"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEventBadge(log.event)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[150px]">{log.log_name || log.subject_type}</span>
                        <span className="text-slate-400 text-xs">#{log.subject_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[300px]">
                      <div className="text-slate-600 dark:text-slate-300">{log.description}</div>
                      {formatProperties(log.properties)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm disabled:opacity-50 dark:text-slate-300"
            >
              Trước
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm disabled:opacity-50 dark:text-slate-300"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminActivityLog;
