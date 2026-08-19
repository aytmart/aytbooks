/* =========================================================================
   AYT Books — library.js
   Homepage-only rendering. Uses BOOKS/CATEGORIES from data.js and the
   shared helpers from app.js (coverHTML, bookCardHTML, getCategory,
   bookCountFor, waLink). Loaded only on index.html — never touches
   books.html / book.html logic.
   ========================================================================= */

/* ---------- small extra render helper (physical book on a wood shelf) ---------- */
function physBookHTML(book, i) {
  const tilt = (i % 2 === 0 ? -1 : 1) * (1 + (i % 3));
  const href = book.comingSoon
    ? `books.html?cat=${encodeURIComponent(book.category)}`
    : `book.html?id=${encodeURIComponent(book.id)}`;
  const priceLine = book.comingSoon
    ? `<b>শীঘ্রই যুক্ত হবে</b>`
    : `<b>${book.currency || "৳"}${book.price}</b>`;
  const ctaLine = book.comingSoon ? "ক্যাটাগরি দেখুন" : "বইটি দেখুন";
  return `
  <a class="phys-book${book.comingSoon ? " coming-soon" : ""}" href="${href}" style="--tilt:${tilt}deg" aria-label="${book.title}">
    ${coverHTML(book, { badge: true })}
    <span class="phys-micro">
      <strong>${book.title}</strong>
      <em>${book.author || ""}</em>
      ${priceLine}
      <span class="phys-cta">${ctaLine}</span>
    </span>
  </a>`;
}

/* ---------- 1. Home page shelves — fixed 4-category grid (islamic / kids / educational / life) ----------
   Real books (from BOOKS) fill each shelf first; if a category doesn't yet have
   6 books, clearly-marked "শীঘ্রই" (coming soon) placeholder covers top up the
   row so the shelf still reads as full — swap these out as real titles are added. */
const HOME_SHELF_CATS = ["islamic", "kids", "self-help", "life"];
const HOME_SHELF_PILL = {
  islamic: "pill-forest",
  kids: "pill-brick",
  "self-help": "pill-gold",
  life: "pill-rose"
};
const HOME_SHELF_PLACEHOLDER_TONES = {
  islamic: { coverColor: "#0f3d3e", coverAccent: "#c9a227" },
  kids: { coverColor: "#a8462f", coverAccent: "#e0c268" },
  "self-help": { coverColor: "#163832", coverAccent: "#c9a227" },
  life: { coverColor: "#5b2f43", coverAccent: "#e0c268" }
};
const SHELF_SIZE = 6;

function makePlaceholderBooks(catId, count) {
  const tone = HOME_SHELF_PLACEHOLDER_TONES[catId] || { coverColor: "#0f3d3e", coverAccent: "#c9a227" };
  return Array.from({ length: count }, (_, i) => ({
    id: `placeholder-${catId}-${i}`,
    title: "শীঘ্রই আসছে",
    author: "AYT Books",
    category: catId,
    price: 0,
    coverColor: tone.coverColor,
    coverAccent: tone.coverAccent,
    comingSoon: true
  }));
}

function renderShelves() {
  const wrap = document.getElementById("shelves-wrap");
  if (!wrap) return;

  wrap.innerHTML = HOME_SHELF_CATS.map((catId) => {
    const cat = getCategory(catId);
    if (!cat) return "";
    const real = BOOKS.filter((b) => b.category === catId).slice(0, SHELF_SIZE);
    const shelfBooks = real.length < SHELF_SIZE
      ? [...real, ...makePlaceholderBooks(catId, SHELF_SIZE - real.length)]
      : real;
    const pillCls = HOME_SHELF_PILL[catId] || "pill-forest";

    return `
    <div class="shelf-block">
      <div class="shelf-pill-row">
        <span class="shelf-pill ${pillCls}"><span class="shelf-badge">${cat.icon}</span>${cat.label}</span>
      </div>
      <div class="wood-shelf">
        <div class="shelf-books">${shelfBooks.map((b, i) => physBookHTML(b, i)).join("")}</div>
        <button type="button" class="shelf-next" data-shelf="${catId}" aria-label="আরও বই দেখুন">›</button>
        <div class="shelf-plank"></div>
      </div>
      <a class="shelf-link" href="books.html?cat=${encodeURIComponent(catId)}">সব দেখুন →</a>
    </div>`;
  }).join("");

  wrap.querySelectorAll(".shelf-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".wood-shelf")?.querySelector(".shelf-books");
      if (row) row.scrollBy({ left: 280, behavior: "smooth" });
    });
  });
}

/* ---------- 2. Smart search overlay ---------- */
function initSearchOverlay() {
  const openBtn = document.getElementById("lib-search-trigger");
  const overlay = document.getElementById("search-overlay");
  const input = document.getElementById("search-overlay-input");
  const results = document.getElementById("search-overlay-results");
  const closeBtn = document.getElementById("search-overlay-close");
  const chipsWrap = document.getElementById("search-overlay-chips");
  if (!openBtn || !overlay) return;

  const popularTags = [...new Set(BOOKS.flatMap((b) => b.tags || []))].slice(0, 5);
  const cats = CATEGORIES.filter((c) => bookCountFor(c.id) > 0);
  chipsWrap.innerHTML =
    cats.map((c) => `<button type="button" class="so-chip" data-q="${c.label}">${c.icon} ${c.label}</button>`).join("") +
    popularTags.map((t) => `<button type="button" class="so-chip" data-q="${t}">${t}</button>`).join("");

  function openOverlay(e) {
    if (e) e.preventDefault();
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 60);
  }
  function closeOverlay() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openOverlay);
  closeBtn?.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeOverlay(); });

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    const list = BOOKS.filter((b) =>
      (b.title || "").toLowerCase().includes(q) ||
      (b.titleEn || "").toLowerCase().includes(q) ||
      (b.author || "").toLowerCase().includes(q) ||
      (b.tags || []).some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
    results.innerHTML = list.length
      ? list.map((b) => `
        <a class="so-result" href="book.html?id=${encodeURIComponent(b.id)}">
          <span class="so-result-title">${b.title}</span>
          <span class="so-result-meta">${b.author || ""} · ${b.currency || "৳"}${b.price}</span>
        </a>`).join("")
      : `<p class="empty-state" style="padding:16px 0;">কোনো ফলাফল পাওয়া যায়নি।</p>`;
  }

  input.addEventListener("input", (e) => runSearch(e.target.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      location.href = `books.html?q=${encodeURIComponent(input.value.trim())}`;
    }
  });
  chipsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".so-chip");
    if (!btn) return;
    input.value = btn.dataset.q;
    runSearch(btn.dataset.q);
    input.focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShelves();
  initSearchOverlay();
});
