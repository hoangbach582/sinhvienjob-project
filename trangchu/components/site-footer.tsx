import {
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react"

const columns = [
  {
    title: "Dành cho sinh viên",
    links: ["Tìm việc làm", "Danh sách công ty", "Tạo CV trực tuyến"],
  },
  {
    title: "Nhà tuyển dụng",
    links: ["Đăng nhập tuyển dụng", "Đăng ký tuyển dụng"],
  },
]

const socials = [Facebook, Linkedin, Instagram, Youtube]

export function SiteFooter() {
  return (
    <footer id="nha-tuyen-dung" className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light">
                <GraduationCap className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-bold">SinhVienJob</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Nền tảng kết nối việc làm hàng đầu dành cho sinh viên Việt Nam. Tìm
              kiếm cơ hội thực tập, part-time và full-time phù hợp nhất với bạn.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Mạng xã hội"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Hỗ trợ & Liên hệ
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                support@sinhvienjob.vn
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                (+84) 123 456 789
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                Hà Nội, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>© 2024 SinhVienJob. Mọi quyền được bảo lưu.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="transition-colors hover:text-white">
              Điều khoản sử dụng
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Chính sách bảo mật
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Quy chế hoạt động
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
