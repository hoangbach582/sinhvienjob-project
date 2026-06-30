import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, AlertCircle, Bug } from 'lucide-react';
import { toast } from 'react-hot-toast';
import feedbackService from '../services/feedbackService';

function FeedbackModal({ isOpen, onClose }) {
  const [type, setType] = useState('feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback({ type, subject, message });
      toast.success('Phản hồi của bạn đã được gửi. Cảm ơn bạn!');
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra, không thể gửi phản hồi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" size={24} />
                Gửi phản hồi
              </h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-700 mb-2">Loại phản hồi</label>
                <div className="grid grid-cols-3 gap-3">
                  <TypeButton 
                    active={type === 'feedback'} 
                    onClick={() => setType('feedback')} 
                    icon={<MessageSquare size={16} />} 
                    label="Góp ý" 
                    colorClass="text-blue-600 bg-blue-50 border-blue-200"
                  />
                  <TypeButton 
                    active={type === 'report'} 
                    onClick={() => setType('report')} 
                    icon={<AlertCircle size={16} />} 
                    label="Báo cáo" 
                    colorClass="text-rose-600 bg-rose-50 border-rose-200"
                  />
                  <TypeButton 
                    active={type === 'bug'} 
                    onClick={() => setType('bug')} 
                    icon={<Bug size={16} />} 
                    label="Lỗi" 
                    colorClass="text-purple-600 bg-purple-50 border-purple-200"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                  placeholder="Nhập tiêu đề ngắn gọn..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung chi tiết</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all resize-none"
                  placeholder="Mô tả chi tiết ý kiến hoặc vấn đề bạn gặp phải..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Đang gửi...' : (
                    <>
                      <Send size={16} /> Gửi phản hồi
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const TypeButton = ({ active, onClick, icon, label, colorClass }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-1.5 py-2.5 border rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
      active ? colorClass : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);

export default FeedbackModal;
