import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Award } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";

function BenefitsSectionNew() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="home-benefits mx-auto" ref={ref}>
      <div className="home-benefits-panel relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-navy via-navy-deep to-navy">
        <div
          className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-brand/30 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Award className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              Đặc quyền tìm việc
            </span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold text-white sm:text-4xl">
              Tại sao chọn SinhVienJob?
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/70">
              Chúng tôi đem lại những giải pháp thiết thực nhất để sinh viên bắt
              đầu hành trình sự nghiệp dễ dàng.
            </p>
            <button
              style={{ padding: "0.6rem" }}
              type="button"
              onClick={() => navigate("/jobs")}
              className="mt-6 rounded-xl border-none bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-white/90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ripple-button hover-scale"
            >
              Xem chi tiết
            </button>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <motion.img
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src="/images/home/why-choose.png"
              alt="Minh họa lý do chọn SinhVienJob"
              width="560"
              height="420"
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSectionNew;
