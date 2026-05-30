import Image from "next/image"
import { ArrowRight, ChevronDown, MapPin, Search, Star } from "lucide-react"

const popularTags = ["ReactJS", "Marketing", "Part-time", "Thực tập"]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep pb-40 pt-28 sm:pt-32">
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-navy-deep" />
      <div className="pointer-events-none absolute -right-20 top-10 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[120px]" />
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-brand-light/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left content */}
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 lg:mx-0">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
          </div>

          <h1 className="text-pretty text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Tìm kiếm việc làm phù hợp cho{" "}
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              Sinh Viên
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 lg:mx-0">
            Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm
            mới ra trường đã được kiểm duyệt nghiêm ngặt.
          </p>

          {/* Search box */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 md:w-52">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-foreground">Tất cả địa điểm</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90">
                Tìm kiếm
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1 pb-1">
              <span className="text-xs font-medium text-white/60">Phổ biến:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/15"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right illustration */}
        <div className="relative hidden lg:block">
          <Image
            src="/images/hero-briefcase.png"
            alt="Minh họa tìm kiếm việc làm cho sinh viên"
            width={640}
            height={640}
            priority
            className="mx-auto h-auto w-full max-w-lg drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
