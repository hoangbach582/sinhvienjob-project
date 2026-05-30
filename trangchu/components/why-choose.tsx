import Image from "next/image"
import { Award } from "lucide-react"

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy via-navy-deep to-navy p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-brand/30 blur-[100px]" />

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Award className="h-3.5 w-3.5 text-warning" />
              Đặc quyền tìm việc
            </span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold text-white sm:text-4xl">
              Tại sao chọn SinhVienJob?
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/70">
              Chúng tôi đem lại những giải pháp thiết thực nhất để sinh viên bắt
              đầu hành trình sự nghiệp dễ dàng.
            </p>
            <button className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-white/90">
              Xem chi tiết
            </button>
          </div>

          <div className="relative">
            <Image
              src="/images/why-choose.png"
              alt="Minh họa lý do chọn SinhVienJob"
              width={560}
              height={420}
              className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
