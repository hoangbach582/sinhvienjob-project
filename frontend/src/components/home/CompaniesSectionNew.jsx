import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";

const partners = [
  { name: "Techcombank", color: "text-red-600" },
  { name: "FPT", color: "text-orange-500" },
  { name: "VNG", color: "text-blue-600" },
  { name: "viettel", color: "text-red-500" },
];

function CompaniesSectionNew() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 90 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <section id="cong-ty" className="home-partners mx-auto" ref={ref}>
      <div className="home-partners-panel rounded-3xl border border-border bg-card relative overflow-hidden">
        {/* Shimmer background effect */}
        <div className="absolute inset-0 shimmer-bg opacity-10 pointer-events-none" />
        
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              Đối tác tuyển dụng
            </span>
            <h2 className="mt-4 text-balance text-2xl font-extrabold text-foreground sm:text-3xl">
              Công ty đang tuyển dụng mạnh
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Kết nối với các doanh nghiệp, tập đoàn công nghệ hàng đầu tại Việt Nam.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 lg:justify-end"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {partners.map((partner) => (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotateY: 10, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                key={partner.name}
                type="button"
                onClick={() => navigate("/companies")}
                className={`flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm ${partner.color} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand magnetic-card`}
              >
                {partner.name.slice(0, 4)}
              </motion.button>
            ))}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={() => navigate("/companies")}
              className="flex h-16 w-16 items-center justify-center rounded-full border-none bg-linear-to-br from-brand to-brand-light text-sm font-bold text-white shadow-md shadow-brand/30 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ripple-button"
            >
              +100
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 flex justify-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            type="button"
            onClick={() => navigate("/companies")}
            className="flex items-center gap-2 rounded-xl border-none bg-linear-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand hover-lift breathingGlow ripple-button"
          >
            Khám phá tất cả các doanh nghiệp đối tác
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default CompaniesSectionNew;
