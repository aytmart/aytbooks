/* =========================================================================
   AYT Books — app.js
   সব পেজে ব্যবহৃত কমন ফাংশনসমূহ (রেন্ডারিং, ফিল্টার, WhatsApp লিংক ইত্যাদি)
   ========================================================================= */

const WHATSAPP_NUMBER = "8801786840952"; // +৮৮০১৭৮৬৮৪০৯৫২ (দেশের কোড সহ, শুরুতে + বা ০ ছাড়া)

/* ---------- Helpers ---------- */
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

function bookCountFor(catId) {
  return BOOKS.filter((b) => b.category === catId).length;
}

function waLink(book) {
  const msg = book
    ? `আসসালামু আলাইকুম, আমি "${book.title}" (${book.titleEn || ""}) বইটি কিনতে চাই। মূল্য সম্পর্কে জানতে চাই।`
    : `আসসালামু আলাইকুম, আমি AYT Books থেকে একটি বই সম্পর্কে জানতে চাই।`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function coverGradient(book) {
  const c1 = book.coverColor || "#0f3d3e";
  const c2 = book.coverAccent || "#c9a227";
  return `linear-gradient(155deg, ${c1} 0%, ${shade(c1, -14)} 60%, ${mix(c1, c2, 0.18)} 100%)`;
}
function shade(hex, percent) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + Math.round(2.55 * percent);
  let g = ((n >> 8) & 0xff) + Math.round(2.55 * percent);
  let b = (n & 0xff) + Math.round(2.55 * percent);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function mix(hexA, hexB, amt) {
  const a = parseInt(hexA.slice(1), 16), b = parseInt(hexB.slice(1), 16);
  const ar = a >> 16, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = b >> 16, bg = (b >> 8) & 0xff, bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * amt);
  const g = Math.round(ag + (bg - ag) * amt);
  const bl = Math.round(ab + (bb - ab) * amt);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function coverHTML(book, opts = {}) {
  const badge = opts.badge !== false ? `<span class="cv-badge">ফ্রি পড়ুন</span>` : "";
  // view-transition-name gives a smooth "picked off the shelf" morph into
  // book.html on browsers that support the View Transitions API, and is a
  // silent no-op everywhere else — see @view-transition rule in style.css.
  const vt = `view-transition-name:cover-${(book.id || "").replace(/[^a-zA-Z0-9_-]/g, "")};`;
  if (book.cover) {
    return `<div class="book-cover" style="background:url('${book.cover}') center/cover;${vt}">${badge}</div>`;
  }
  return `
    <div class="book-cover" style="background:${coverGradient(book)};${vt}">
      ${badge}
      <div>
        <div class="cv-title">${book.title}</div>
        <div class="cv-author">${book.author || ""}</div>
      </div>
    </div>`;
}

function bookCardHTML(book) {
  const cat = getCategory(book.category);
  return `
  <article class="book-card">
    <a href="book.html?id=${encodeURIComponent(book.id)}" aria-label="${book.title}">
      ${coverHTML(book)}
    </a>
    <span class="book-cat-tag">${cat ? cat.label : ""}</span>
    <a href="book.html?id=${encodeURIComponent(book.id)}"><h3>${book.title}</h3></a>
    <div class="b-author">${book.author || ""}</div>
    <div class="b-foot">
      <div class="b-price">${book.currency || "৳"}${book.price}<br><small>${book.pages ? book.pages + " পৃষ্ঠা" : ""}</small></div>
      <a class="btn btn-forest btn-sm" href="book.html?id=${encodeURIComponent(book.id)}">দেখুন</a>
    </div>
  </article>`;
}

function categoryCardHTML(cat) {
  const count = bookCountFor(cat.id);
  return `
  <a class="cat-card" href="books.html?cat=${encodeURIComponent(cat.id)}">
    <span class="cat-count">${count}</span>
    <span class="cat-icon">${cat.icon}</span>
    <h3>${cat.label}</h3>
    <p>${cat.desc}</p>
  </a>`;
}

/* ---------- Nav active link + mobile toggle ---------- */
function initNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.dataset.page === path) a.classList.add("active");
  });
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  const y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFooterYear();
});
