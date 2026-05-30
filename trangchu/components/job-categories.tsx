"use client"

import { useState } from "react"
import { ArrowRight, Heart, MapPin, Sparkles } from "lucide-react"

const filters = ["Tất cả", "Bán thời gian", "Thực tập sinh", "Toàn thời gian"]

type JobType = "Toàn thời gian" | "Bán thời gian" | "Thực tập sinh"

const typeStyles: Record<JobType, string> = {
  "Toàn thời gian": "bg-violet-100 text-violet-700",
  "Bán thời gian": "bg-emerald-100 text-emerald-700",
  "Thực tập sinh": "bg-amber-100 text-amber-700",
}

const jobs: {
  title: string
  company: string
  location: string
  salary: string
  type: JobType
}[] = [
  {
    title: "test",
    company: "Techcombank",
    location: "Hà Nội",
    salary: "3 - 4tr",
    type: "Toàn thời gian",
  },
  {
    title: "Nhân viên kinh doanh",
    company: "Techcombank",
    location: "Hà Nội",
    salary: "3 - 4tr",
    type: "Bán thời gian",
  },
  {
    title: "it helpdesk",
    company: "Techcombank",
    location: "Hà Nội",
    salary: "3 - 5tr",
    type: "Thực tập sinh",
  },
  {
    title: "Nhân Viên Kinh Doanh Giải Pháp Dành Cho Hộ Kinh Doanh",
    company: "Techcombank",
    location: "Đà Nẵng",
    salary: "3 - 5tr",
    type: "Bán thời gian",
  },
  {
    title: "testing",
    company: "Techcombank",
    location: "Hà Nội",
    salary: "4 - 5tr",
    type: "Toàn thời gian",
  },
  {
    title: "Nhân Viên Digital Marketing - Mạnh Performance (FB, GG, TT)",
    company: "Techcombank",
    location: "Đà Nẵng",
    salary: "3.4 - 4.3tr",
    type: "Toàn thời gian",
  },
]

export function JobCategories() {
  const [active, setActive] = useState("Tất cả")

  const visibleJobs =
    active === "Tất cả" ? jobs : jobs.filter((job) => job.type === active)

  return (
    <section id="tim-viec" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* heading */}
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          Khám phá
        </span>
        <h2 className="mt-4 text-balance text-3xl font-extrabold text-foreground sm:text-4xl">
          Tìm việc theo danh mục ngành nghề
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Chọn nhóm ngành bạn mong muốn để tiếp cận hàng trăm việc làm đang chờ đón.
        </p>
      </div>

      {/* filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 lg:justify-end">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active === filter
                ? "bg-brand text-white shadow-md shadow-brand/30"
                : "border border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-brand"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* job grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleJobs.map((job, i) => (
          <article
            key={`${job.title}-${i}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">
                TE
              </span>
              <button
                aria-label="Lưu việc làm"
                className="text-muted-foreground transition-colors hover:text-brand"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <h3 className="line-clamp-2 min-h-[2.75rem] font-bold text-foreground">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="text-sm font-bold text-warning">
                {job.salary}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${typeStyles[job.type]}`}
              >
                {job.type}
              </span>
              <button className="flex items-center gap-1 text-sm font-semibold text-brand">
                Chi tiết
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex justify-center">
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90">
          Khám phá tất cả công việc
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
