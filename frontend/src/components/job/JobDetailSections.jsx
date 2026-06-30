import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Briefcase } from "lucide-react";
import SaveButton from "../SaveButton";

function JobDetailSimilar({ currentJobId, formatSalary, translateType }) {
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/jobs/latest");
        if (response.ok) {
          const data = await response.json();
          setSimilarJobs(data.filter((j) => j.id !== currentJobId).slice(0, 4));
        }
      } catch (e) {
        console.error("Error fetching similar jobs:", e);
      }
    };
    fetchSimilar();
  }, [currentJobId]);

  if (similarJobs.length === 0) return null;

  const cardStyleLg = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    borderRadius: "1rem",
    padding: "1.5rem 2rem",
  };

  return (
    <section
      style={{
        padding: "0 2rem 2.5rem 2rem",
        background: "#09144B",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
        <div style={cardStyleLg}>
          <div
            style={{ marginBottom: "1.5rem" }}
            className="flex items-center justify-between"
          >
            <h3 className="text-white font-semibold text-base flex items-center gap-2 m-0">
              <div className="w-7 h-7 rounded bg-brand/20 flex items-center justify-center text-brand-light">
                <Briefcase className="w-4 h-4" />
              </div>
              Việc làm tương tự
            </h3>
            <Link
              to="/jobs"
              className="text-white/60 text-sm font-medium no-underline hover:text-white flex items-center gap-1 transition-colors"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {similarJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link
                  to={`/job/${job.id}`}
                  className="rounded-2xl p-4 no-underline transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full hover-card"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(130,63,235,0.3), rgba(99,102,241,0.2))",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  >
                    {job.employer?.company_name
                      ?.substring(0, 2)
                      .toUpperCase() || "CT"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm mb-1 truncate group-hover:text-brand-light transition-colors">
                      {job.title}
                    </h4>
                  </div>
                  <div
                    onClick={(e) => e.preventDefault()}
                    className="shrink-0 pt-1"
                  >
                    <SaveButton jobId={job.id} size={18} variant="minimal" />
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Briefcase className="w-3.5 h-3.5" />{" "}
                      {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                  </div>
                  <div className="flex">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-semibold text-brand-light"
                      style={{
                        background: "rgba(130,63,235,0.15)",
                        border: "1px solid rgba(130,63,235,0.3)",
                      }}
                    >
                      {translateType(job.type)}
                    </span>
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { JobDetailSimilar };
