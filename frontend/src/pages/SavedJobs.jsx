import React, { useState, useEffect } from "react";
import HomeNavbar from "../components/home/HomeNavbar";
import FooterNew from "../components/FooterNew";
import { useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import { useSavedJobs } from "../context/SavedJobsContext";
import { toast } from "react-hot-toast";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  Bookmark,
  MapPin,
  Briefcase,
  Calendar,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const navigate = useNavigate();
  const { toggleSave, isSaved } = useSavedJobs();

  const fetchSavedJobs = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);
      const data = await jobService.getSavedJobs(page);
      
      if (page === 1) {
        setSavedJobs(data.data);
      } else {
        setSavedJobs(prev => [...prev, ...data.data]);
      }
      
      setTotalJobs(data.total);
      setHasMore(page < data.last_page);
    } catch (error) {
      console.error("Lỗi khi tải việc làm đã lưu:", error);
    } finally {
      if (page === 1) setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchSavedJobs(1);
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      // eslint-disable-next-line
      fetchSavedJobs(currentPage);
    }
  }, [currentPage]);

  const { lastElementRef, isFetching } = useInfiniteScroll(async () => {
    setCurrentPage(prev => prev + 1);
  }, hasMore);

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return "Thỏa thuận";
  };

  const translateType = (type) => {
    const types = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      internship: "Thực tập sinh",
    };
    return types[type] || type;
  };

  const handleToggleSave = async (e, jobId) => {
    e.stopPropagation();
    try {
      const newState = await toggleSave(jobId);
      toast.success(newState ? "Đã lưu việc làm" : "Đã bỏ lưu việc làm");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div
      className="home-page min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
      }}
    >
      <HomeNavbar />

      <main
        style={{ marginTop: "5rem", padding: "2rem 0" }}
        className="flex-1 w-full pt-28 pb-16 px-4"
      >
        <div
          style={{ maxWidth: "1130px", margin: "0 auto" }}
          className="max-w-[1000px] mx-auto"
        >
          {/* Header */}
          <div
            style={{ marginBottom: "1.6rem" }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 border border-white/10">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 m-0">
                  Việc làm đã lưu
                </h2>
                <p className="text-white/60 text-sm m-0">
                  Danh sách việc làm bạn đã lưu để xem sau
                </p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm font-semibold">
              {totalJobs || 0} việc làm
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-white/60 font-medium">
              Đang tải danh sách...
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl text-white font-bold mb-2 m-0">
                Bạn chưa lưu việc làm nào
              </h3>
              <p className="text-white/60 mb-6 m-0">
                Hãy khám phá các cơ hội việc làm và lưu lại những tin bạn quan
                tâm.
              </p>
              <button
                onClick={() => navigate("/jobs")}
                className="px-6 py-3 rounded-xl text-white font-semibold cursor-pointer border-none transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #823feb, #6366f1)",
                }}
              >
                Tìm việc ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((item) => {
                const job = item.job;
                if (!job) return null;
                const saved = isSaved(job.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="group relative rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 cursor-pointer overflow-hidden transition-all duration-300"
                    style={{
                      padding: "2rem 1.2rem 0.6rem",
                      marginBottom: "1rem",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(130, 63, 235, 0.4)";
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                    }}
                  >
                    {/* Company Logo */}
                    <div
                      style={{
                        width: "8rem",
                        height: "8rem",
                        background: "#36278b",
                        fontSize: "2.4rem",
                      }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#0B0F19] border border-white/5 flex items-center justify-center text-xl md:text-2xl font-bold text-blue-500 shrink-0 mt-5 md:mt-2 shadow-inner"
                    >
                      {job.employer?.company_name
                        ?.substring(0, 2)
                        .toUpperCase() || "CT"}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2 mt-1 md:mt-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                              <Bookmark className="w-3 h-3" /> Đã lưu
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                            title="Bỏ lưu"
                          >
                            <Heart
                              className={`w-5 h-5 transition-colors ${saved ? "text-pink-500 fill-pink-500" : "text-white/40"}`}
                            />
                          </button>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors m-0">
                          {job.title}
                        </h4>
                        <div className="text-purple-400 text-sm font-medium mb-4">
                          {job.employer?.company_name}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm mb-5">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/70">
                            <MapPin className="w-4 h-4 text-white/40" />{" "}
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                            <span className="text-base">💰</span>{" "}
                            {formatSalary(job.salary_min, job.salary_max)}
                          </span>
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/70 font-medium">
                            {translateType(job.type)}
                          </span>
                        </div>
                      </div>

                      {/* Footer of card */}
                      <div
                        style={{ marginTop: "1.4rem", padding: "0.6rem 0" }}
                        className="pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-white/40 flex-wrap"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Đã đăng:{" "}
                          {new Date(job.created_at).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20 hidden md:block"></span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> Đã xem:{" "}
                          {item.created_at
                            ? formatDistanceToNow(new Date(item.created_at), {
                                addSuffix: true,
                                locale: vi,
                              }).replace("khoảng ", "")
                            : "Vừa xong"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasMore && !loading && savedJobs.length > 0 && (
            <div ref={lastElementRef} className="flex justify-center py-8">
              {isFetching && (
                <div className="w-8 h-8 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
              )}
            </div>
          )}
        </div>
      </main>

      <FooterNew />
    </div>
  );
}

export default SavedJobs;
