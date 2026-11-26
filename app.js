/**
 * ============================================================
 *  DNS HUB — APP LOGIC
 *  Reads SITE_CONFIG (config.js), renders UI, fetches DNS source
 * ============================================================
 */
"use strict";

/* ── ICONS (inline SVG strings) ───────────────────────────── */
const ICONS = {
  open: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`,
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>`,
};

/* ── CANVAS PARTICLES ─────────────────────────────────────── */
function initParticles(count) {
  if (!count) return;
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + .4,
      dx: (Math.random() - .5) * .35,
      dy: (Math.random() - .5) * .35,
      a: Math.random(),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = SITE_CONFIG.theme.accentColor || "#0ea5e9";
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent + Math.round(p.a * 120).toString(16).padStart(2, "0");
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  for (let i = 0; i < count; i++) particles.push(mkParticle());
  window.addEventListener("resize", resize);
  draw();
}

/* ── TOAST ────────────────────────────────────────────────── */
function showToast(msg, type = "info", durationMs = 3000) {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  const icon = type === "success" ? ICONS.success : type === "error" ? ICONS.warning : "ℹ️";
  el.className = `toast ${type}`;
  el.innerHTML = `<span style="flex-shrink:0;width:18px;height:18px;display:inline-flex">${icon}</span>${msg}`;
  container.appendChild(el);
  setTimeout(() => { el.style.animation = "slideUp .3s ease reverse both"; setTimeout(() => el.remove(), 300); }, durationMs);
}

/* ── FETCH WITH PROXY FALLBACK ────────────────────────────── */
async function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { method: "GET", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithFallback(url) {
  const proxies = Array.isArray(SITE_CONFIG.proxyList) ? SITE_CONFIG.proxyList : [];
  const urls = [url, ...proxies.map(p => p + encodeURIComponent(url))];
  let lastErr;
  for (const u of urls) {
    try {
      const r = await fetchWithTimeout(u, 8000);
      if (r.ok) return { ok: true, url: u, status: r.status, text: await r.text() };
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("All endpoints failed");
}

/* ── STATUS CHECK ─────────────────────────────────────────── */
async function checkSourceStatus() {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const retry = document.getElementById("status-retry");
  const notice = document.getElementById("offline-notice");
  const direct = document.getElementById("offline-direct-link");

  dot.className = "status-dot checking";
  retry.classList.remove("visible");
  if (notice) notice.classList.remove("visible");
  text.innerHTML = `<div class="spinner" style="display:inline-block"></div>&nbsp; <strong>Đang kiểm tra</strong> kết nối đến nguồn DNS…`;

  try {
    const res = await fetchWithFallback(SITE_CONFIG.sourceUrl);
    dot.className = "status-dot online";
    text.innerHTML = `<strong>Trực tuyến</strong> · Nguồn DNS đang hoạt động ổn định ✓`;
    return { ok: true, text: res.text };
  } catch {
    dot.className = "status-dot offline";
    text.innerHTML = `<strong>Không thể kết nối</strong> đến nguồn DNS. Hãy thử lại hoặc mở trực tiếp.`;
    retry.classList.add("visible");
    if (direct) direct.href = SITE_CONFIG.sourceUrl;
    if (notice) notice.classList.add("visible");
    return { ok: false, text: null };
  }
}

/* ── RENDER SERVER CARDS ──────────────────────────────────── */
function renderCards(statusOk) {
  const list = document.getElementById("cards-list");
  const pkgs = SITE_CONFIG.serverPackages || [];
  if (!pkgs.length) {
    list.innerHTML = `<p style="color:var(--text-muted);font-size:.85rem">Chưa có server nào được cấu hình trong config.js.</p>`;
    return;
  }

  list.innerHTML = pkgs.map((pkg, i) => {
    const badgeClass = `badge-${pkg.badgeColor || "sky"}`;
    const statusDot = statusOk
      ? `<span style="color:var(--success);font-size:.75rem;font-weight:700">● Trực tuyến</span>`
      : `<span style="color:var(--danger);font-size:.75rem;font-weight:700">● Ngoại tuyến</span>`;

    return `
      <div class="glass server-card fade-in" style="animation-delay:${0.1 + i * 0.08}s" data-pkg-id="${pkg.id}">
        <div class="card-top">
          <div>
            <div class="card-title">${escHtml(pkg.label)}</div>
            <div style="margin-top:5px">${statusDot}</div>
          </div>
          <span class="card-badge ${badgeClass}">${escHtml(pkg.badge || "Free")}</span>
        </div>
        <p class="card-desc">${escHtml(pkg.desc || pkg.description || "")}</p>
        <div class="card-actions">
          <a  class="btn btn-primary" href="${escHtml(pkg.url)}" target="_blank" rel="noopener"
              aria-label="Mở cấu hình ${escHtml(pkg.label)}">
            ${ICONS.open} Mở cấu hình
          </a>
          <button class="btn btn-secondary btn-copy" data-url="${escHtml(pkg.url)}"
              onclick="App.copyUrl(this)" aria-label="Sao chép đường dẫn">
            ${ICONS.copy} Sao chép link
          </button>
        </div>
      </div>`;
  }).join("");
}

/* ── RENDER STEPS ─────────────────────────────────────────── */
function renderSteps() {
  const steps = SITE_CONFIG.installSteps || [];
  document.getElementById("steps-list").innerHTML = steps.map((s, i) => `
    <li class="step-item">
      <div class="step-num">${s.icon || (i + 1)}</div>
      <div class="step-body">
        <div class="step-title">${escHtml(s.title)}</div>
        <div class="step-desc">${escHtml(s.desc)}</div>
      </div>
    </li>`).join("");
}

/* ── RENDER FOOTER ────────────────────────────────────────── */
function renderFooter() {
  const links = SITE_CONFIG.socialLinks || [];
  document.getElementById("social-links").innerHTML = links.map(l => `
    <a class="social-link" href="${escHtml(l.url)}" target="_blank" rel="noopener">
      <span style="width:15px;height:15px;display:inline-flex;align-items:center">${ICONS[l.icon] || ICONS.globe}</span>
      ${escHtml(l.label)}
    </a>`).join("");

  document.getElementById("footer-text").innerHTML =
    `&copy; ${new Date().getFullYear()} ${escHtml(SITE_CONFIG.brandName)}`
    + (SITE_CONFIG.organizationName ? ` &middot; ${escHtml(SITE_CONFIG.organizationName)}` : "")
    + ` &middot; Nguồn DNS: <a href="${escHtml(SITE_CONFIG.sourceUrl)}" target="_blank" rel="noopener" `
    + `style="color:var(--accent);text-decoration:none">${escHtml(SITE_CONFIG.sourceUrl)}</a>`;
}

/* ── APPLY THEME VARS ─────────────────────────────────────── */
function applyTheme() {
  const { accentColor, accentDark, bgFrom, bgTo } = SITE_CONFIG.theme || {};
  const root = document.documentElement;
  if (accentColor) root.style.setProperty("--accent", accentColor);
  if (accentDark) root.style.setProperty("--accent-dark", accentDark);
  if (bgFrom || bgTo) {
    document.body.style.background =
      `linear-gradient(135deg, ${bgFrom || "#060d1a"} 0%, ${bgTo || "#0a0f1e"} 100%)`;
  }
}

/* ── POPULATE PAGE META ───────────────────────────────────── */
function populateMeta() {
  const c = SITE_CONFIG;
  document.getElementById("page-title").textContent = c.brandName;
  document.getElementById("og-title").content = c.brandName;
  document.getElementById("og-desc").content = c.brandTagline;
  document.getElementById("hero-brand").textContent = c.brandName;
  document.getElementById("hero-tagline").textContent = c.brandTagline;

  const orgParts = [c.organizationName, c.profileName].filter(Boolean);
  const orgEl = document.getElementById("hero-org");
  if (orgEl) {
    orgEl.textContent = orgParts.join(" · ");
    orgEl.style.display = orgParts.length ? "inline-block" : "none";
  }

  if (typeof c.brandIcon === "string" && c.brandIcon.startsWith("http")) {
    document.getElementById("hero-icon").innerHTML =
      `<img src="${escHtml(c.brandIcon)}" alt="logo" style="width:3rem;height:3rem;border-radius:50%;object-fit:cover">`;
  } else {
    document.getElementById("hero-icon").textContent = c.brandIcon || "🌐";
  }

  const annoBar = document.getElementById("announcement-bar");
  if (c.announcement) {
    annoBar.textContent = c.announcement;
    annoBar.classList.add("visible");
  }
}

/* ── UTILS ────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ── PUBLIC APP API ───────────────────────────────────────── */
const App = {
  async retryCheck() {
    const result = await checkSourceStatus();
    renderCards(result.ok);
    if (!result.ok) showToast("Nguồn DNS vẫn chưa phản hồi. Thử mở trực tiếp link bên dưới.", "error");
    else showToast("Kết nối thành công! Nguồn DNS đang hoạt động.", "success");
  },

  copyUrl(btn) {
    const url = btn.dataset.url;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = `${ICONS.check} Đã sao chép!`;
      btn.classList.add("copied");
      showToast("Đã sao chép đường dẫn!", "success", 2200);
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove("copied"); }, 2200);
    }).catch(() => {
      // fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Đã sao chép đường dẫn!", "success", 2200);
    });
  },
};

/* ── BOOT ─────────────────────────────────────────────────── */
(async function boot() {
  // 1. Apply theme variables
  applyTheme();

  // 2. Populate static text from config
  populateMeta();

  // 3. Render install steps & footer (static, no network needed)
  renderSteps();
  renderFooter();

  // 4. Init background particles
  initParticles(SITE_CONFIG.theme?.particleCount ?? 40);

  // 5. Check source connectivity, then render cards
  const result = await checkSourceStatus();
  renderCards(result.ok);

  if (!result.ok) {
    showToast(
      "Không thể kết nối nguồn DNS. Nhấn 'Thử lại' hoặc mở link trực tiếp.",
      "error", 5000
    );
  }
})();
