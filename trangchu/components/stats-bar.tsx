import { Building2, ShieldCheck, Star, Users } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10.000+",
    label: "Sinh viên có việc",
    gradient: "from-brand to-brand-light",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Doanh nghiệp tin dùng",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Star,
    value: "98%",
    label: "Hài lòng tuyển dụng",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Bảo mật thông tin",
    gradient: "from-emerald-400 to-teal-500",
  },
]

export function StatsBar() {
  return (
    <div className="relative z-20 mx-auto -mt-24 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-navy/90 p-6 shadow-2xl shadow-navy-deep/40 backdrop-blur sm:p-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 sm:gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg sm:h-14 sm:w-14`}
              >
                <stat.icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
              </span>
              <div>
                <div className="text-xl font-extrabold text-white sm:text-2xl">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
