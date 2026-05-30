import { ArrowRight, Briefcase } from "lucide-react"

const partners = [
  { name: "Techcombank", color: "text-red-600" },
  { name: "FPT", color: "text-orange-500" },
  { name: "VNG", color: "text-blue-600" },
  { name: "viettel", color: "text-red-500" },
]

export function PartnersSection() {
  return (
    <section id="cong-ty" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              <Briefcase className="h-3.5 w-3.5" />
              Đối tác tuyển dụng
            </span>
            <h2 className="mt-4 text-balance text-2xl font-extrabold text-foreground sm:text-3xl">
              Công ty đang tuyển dụng mạnh
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Kết nối với các doanh nghiệp, tập đoàn công nghệ hàng đầu tại Việt Nam.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-end">
            {partners.map((partner) => (
              <span
                key={partner.name}
                className={`flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm ${partner.color}`}
              >
                {partner.name.slice(0, 4)}
              </span>
            ))}
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-sm font-bold text-white shadow-md shadow-brand/30">
              +100
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90">
            Khám phá tất cả các doanh nghiệp đối tác
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
