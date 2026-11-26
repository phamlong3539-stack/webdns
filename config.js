/**
 * ============================================================
 *  DNS HUB — FILE CẤU HÌNH TRUNG TÂM
 *  Chỉ cần sửa file này để đổi toàn bộ thương hiệu & nguồn DNS
 * ============================================================
 */
const SITE_CONFIG = {
  /* ── THƯƠNG HIỆU ─────────────────────────────────────────── */
  brandName: "DNS Hub",
  brandTagline: "Kết nối DNS miễn phí · Nhanh · Ổn định",
  brandIcon: "🌐",                 // emoji hoặc URL ảnh

  organizationName: "LAMDev Community",
  profileName: "Máy Chủ DNS Miễn Phí",

  /* ── NGUỒN DNS GỐC ──────────────────────────────────────── */
  sourceUrl: "https://locketlam-free.dalymmo.com/dns/sever-free-v3/",

  /**
   * Nếu nguồn trên bị CORS hoặc ngừng hoạt động, app sẽ thử
   * lần lượt các proxy/mirror trong mảng dưới đây.
   * Để trống [] nếu không dùng proxy.
   *
   * Cú pháp proxy: "https://api.allorigins.win/raw?url=" + encodeURIComponent(sourceUrl)
   */
  proxyList: [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
  ],

  /* ── CÁC GÓI / NHÃN SERVER HIỂN THỊ ───────────────────── */
  serverPackages: [
    {
      id: "v3",
      label: "Máy Chủ 03",
      badge: "Miễn Phí",
      badgeColor: "sky",        // sky | emerald | violet | amber
      description: "Máy chủ mở rộng, ổn định, phù hợp iOS & Android.",
      url: "https://locketlam-free.dalymmo.com/dns/sever-free-v3/",
      configFileName: "sever-free-v3.mobileconfig",   // dùng khi tải file .mobileconfig
    },
    // Thêm server khác tại đây nếu muốn:
    // {
    //   id: "v2",
    //   label: "Máy Chủ 02",
    //   badge: "Thử nghiệm",
    //   badgeColor: "violet",
    //   description: "Server thử nghiệm tốc độ cao.",
    //   url: "https://locketlam-free.dalymmo.com/dns/sever-free-v2/",
    //   configFileName: "sever-free-v2.mobileconfig",
    // },
  ],

  /* ── LIÊN KẾT MẠNG XÃ HỘI & HỖ TRỢ ───────────────────── */
  socialLinks: [
    { label: "Website gốc", url: "https://dalymmo.com", icon: "globe" },
    // { label: "Telegram",    url: "https://t.me/yourgroup", icon: "send" },
    // { label: "GitHub",      url: "https://github.com/yourrepo", icon: "github" },
  ],

  /* ── HƯỚNG DẪN CÀI ĐẶT ─────────────────────────────────── */
  installSteps: [
    { icon: "⬇️", title: "Mở cấu hình", desc: "Nhấn nút \"Mở cấu hình\" bên dưới để truy cập trang DNS gốc." },
    { icon: "📥", title: "Tải & Cài đặt", desc: "Trên iOS: nhấn Cho phép → vào Cài đặt → Hồ sơ → Cài đặt hồ sơ." },
    { icon: "✅", title: "Kích hoạt", desc: "Vào Cài đặt → VPN & Quản lý thiết bị → Bật hồ sơ DNS vừa cài." },
    { icon: "🚀", title: "Tận hưởng", desc: "Kết nối internet nhanh hơn, an toàn hơn, không quảng cáo!" },
  ],

  /* ── GIAO DIỆN & THEME ──────────────────────────────────── */
  theme: {
    accentColor: "#0ea5e9",   // màu chủ đạo (sky-500)
    accentDark: "#0284c7",   // hover
    bgFrom: "#060d1a",   // gradient nền từ
    bgTo: "#0a0f1e",   // gradient nền đến
    particleCount: 40,          // số hạt nền động (0 = tắt)
  },

  /* ── THÔNG BÁO / TIN TỨC (tuỳ chọn) ───────────────────── */
  announcement: "",
  // announcement: "⚡ Server v3 vừa được nâng cấp băng thông x2!",
};
