# 🌐 DNS Hub — GitHub Pages DNS Portal

> Website giao diện hiện đại, chạy 100% tĩnh trên **GitHub Pages**, kết nối cấu hình DNS từ nguồn gốc.

---

## 🚀 Triển khai lên GitHub Pages

### Bước 1 — Fork / tải về repo

```bash
# Clone hoặc download thư mục dns-hub về máy
git clone https://github.com/YOUR_USERNAME/dns-hub.git
cd dns-hub
```

### Bước 2 — Đẩy lên GitHub

```bash
git init          # (nếu chưa init)
git add .
git commit -m "🚀 Initial commit — DNS Hub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dns-hub.git
git push -u origin main
```

### Bước 3 — Bật GitHub Pages

1. Vào **Settings** → **Pages** của repo.
2. Chọn **Source**: `Deploy from a branch`.
3. Branch: **`main`**, thư mục: **`/ (root)`** → nhấn **Save**.
4. Sau 1–2 phút, website sẽ chạy tại:
   ```
   https://YOUR_USERNAME.github.io/dns-hub/
   ```

---

## ✏️ Đổi tên thương hiệu & nguồn DNS

Mọi thứ bạn cần chỉnh đều nằm trong **`config.js`** — không cần sửa HTML/CSS/JS.

### Các trường chính

| Trường | Mô tả | Ví dụ |
|---|---|---|
| `brandName` | Tên web / thương hiệu | `"MyDNS"` |
| `brandTagline` | Khẩu hiệu ngắn | `"DNS nhanh cho mọi người"` |
| `brandIcon` | Emoji hoặc URL ảnh | `"🛡️"` hoặc `"https://…/logo.png"` |
| `organizationName` | Tên tổ chức | `"MyOrg"` |
| `sourceUrl` | URL trang nguồn DNS gốc | `"https://…/dns/sever-free-v3/"` |
| `announcement` | Thông báo nổi bật (để `""` nếu không dùng) | `"⚡ Server vừa được nâng cấp!"` |

### Thêm / bớt server

Chỉnh mảng `serverPackages` trong `config.js`:

```js
serverPackages: [
  {
    id: "v3",
    label: "Máy Chủ 03",          // Tên hiển thị
    badge: "Miễn Phí",             // Nhãn badge
    badgeColor: "sky",             // sky | emerald | violet | amber
    description: "Mô tả ngắn…",
    url: "https://…/dns/sever-free-v3/",
    configFileName: "sever-free-v3.mobileconfig",
  },
  // thêm object {} cho server tiếp theo
],
```

### Thêm link mạng xã hội

```js
socialLinks: [
  { label: "Website gốc", url: "https://dalymmo.com", icon: "globe" },
  { label: "Telegram",    url: "https://t.me/yourgroup", icon: "send"   },
  { label: "GitHub",      url: "https://github.com/…",   icon: "github" },
],
```

Các icon hỗ trợ: `globe`, `send`, `github`.

---

## ⚙️ Xử lý CORS & Nguồn offline

Trang nguồn DNS gốc trả về **HTML** (không phải JSON/API thuần). App sẽ:

1. **Thử fetch trực tiếp** `sourceUrl`.
2. Nếu bị CORS hoặc lỗi → **thử lần lượt qua proxy** trong `proxyList`.
3. Nếu tất cả đều thất bại → hiển thị trạng thái **Ngoại tuyến** + nút **Thử lại**.
4. Người dùng vẫn có thể **nhấn thẳng "Mở cấu hình"** để truy cập trực tiếp dù fetch lỗi.

> **Mẹo:** Nếu cần thêm proxy, chỉnh mảng `proxyList` trong `config.js`:
> ```js
> proxyList: [
>   "https://api.allorigins.win/raw?url=",
>   "https://corsproxy.io/?",
> ],
> ```

---

## 📁 Cấu trúc thư mục

```
dns-hub/
├── index.html   ← Cấu trúc trang chính
├── config.js    ← ⭐ Cấu hình thương hiệu & nguồn DNS (SỬA Ở ĐÂY)
├── styles.css   ← Giao diện responsive, dark-mode, biến màu CSS
├── app.js       ← Logic render, fetch DNS, xử lý lỗi/copy
└── README.md    ← Hướng dẫn này
```

---

## 📱 Hướng dẫn cài DNS cho iOS

1. Mở trang web và nhấn **"Mở cấu hình"**.
2. Trình duyệt sẽ điều hướng đến trang nguồn DNS — nhấn **Cho phép tải xuống**.
3. Vào **Cài đặt → Hồ sơ đã tải về → Cài đặt**.
4. Vào **Cài đặt → VPN & Quản lý thiết bị** → chọn hồ sơ → **Cài đặt**.
5. Vào **Cài đặt → Wi-Fi / Dữ liệu di động → Cấu hình DNS** → chọn hồ sơ vừa cài.

---

## 🛠️ Tùy chỉnh màu sắc (Theme)

Trong `config.js`, chỉnh khối `theme`:

```js
theme: {
  accentColor:   "#0ea5e9",  // màu chủ đạo
  accentDark:    "#0284c7",  // màu khi hover
  bgFrom:        "#060d1a",  // gradient nền từ
  bgTo:          "#0a0f1e",  // gradient nền đến
  particleCount: 40,         // số hạt nền động (0 = tắt)
},
```

---

## 📄 License

MIT — Tự do sử dụng, chỉnh sửa và tái phân phối.
