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
  return `
  <a class="phys-book" href="book.html?id=${encodeURIComponent(book.id)}" style="--tilt:${tilt}deg" aria-label="${book.title}">
    ${coverHTML(book, { badge: false })}
    <span class="phys-micro">
      <strong>${book.title}</strong>
      <em>${book.author || ""}</em>
      <b>${book.currency || "৳"}${book.price}</b>
      <span class="phys-cta">বইটি দেখুন</span>
    </span>
  </a>`;
}

function miniCoverHTML(book) {
  return `
  <a class="mini-cover-link" href="book.html?id=${encodeURIComponent(book.id)}" aria-label="${book.title}">
    ${coverHTML(book, { badge: false })}
  </a>`;
}

/* ---------- 1. Category shelves (real data only — skips empty categories) ---------- */
function renderShelves() {
  const wrap = document.getElementById("shelves-wrap");
  if (!wrap) return;
  const populated = CATEGORIES.filter((c) => bookCountFor(c.id) > 0);

  if (!populated.length) {
    wrap.innerHTML = `<p class="empty-state">শীঘ্রই নতুন তাক যুক্ত হবে।</p>`;
    return;
  }

  wrap.innerHTML = populated.map((cat) => {
    const books = BOOKS.filter((b) => b.category === cat.id);
    return `
    <div class="shelf-block">
      <div class="shelf-head">
        <div>
          <h3><span class="shelf-badge">${cat.icon}</span>${cat.label}</h3>
          <p>${cat.desc}</p>
        </div>
        <a class="shelf-link" href="books.html?cat=${encodeURIComponent(cat.id)}">সব বই দেখুন →</a>
      </div>
      <div class="wood-shelf">
        <div class="shelf-books">${books.map((b, i) => physBookHTML(b, i)).join("")}</div>
        <div class="shelf-plank"></div>
      </div>
    </div>`;
  }).join("");
}

/* ---------- 2. Jammed shelf — packed books you shove aside to reveal hidden ones ---------- */
let jamOrder = [];
let jamPool = [];

function jamPos(idx) { return jamOrder.indexOf(idx); }

function jamLayout() {
  const track = document.getElementById("jamTrack");
  if (!track) return;
  const offset = window.innerWidth < 640 ? 20 : 32;
  jamPool.forEach((b, i) => {
    const el = track.querySelector(`.jam-spine[data-idx="${i}"]`);
    if (!el) return;
    const pos = jamPos(i);
    el.style.zIndex = jamPool.length - pos;
    el.style.transform = `translateX(${pos * offset}px) translateY(${pos * 2}px) rotate(${pos * 1.1}deg) scale(${1 - pos * 0.015})`;
    el.style.filter = `brightness(${Math.max(0.7, 1 - pos * 0.045)})`;
    el.classList.toggle("is-front", pos === 0);
  });
  const dots = document.getElementById("jamDots");
  if (dots) {
    dots.innerHTML = jamPool.map((_, i) =>
      `<span class="jam-dot ${jamPos(i) === 0 ? "active" : ""}"></span>`
    ).join("");
  }
}

function jamBringToFront(idx) {
  jamOrder = [idx, ...jamOrder.filter((v) => v !== idx)];
  jamLayout();
}
function jamSendToBack(idx) {
  jamOrder = [...jamOrder.filter((v) => v !== idx), idx];
  jamLayout();
}
function jamCycle(dir) {
  if (dir === 1) {
    const idx = jamOrder[jamOrder.length - 1];
    jamOrder = [idx, ...jamOrder.slice(0, -1)];
  } else {
    const idx = jamOrder[0];
    jamOrder = [...jamOrder.slice(1), idx];
  }
  jamLayout();
}

function attachJamDrag(el, idx) {
  let startX = 0;
  let dragging = false;

  el.addEventListener("pointerdown", (e) => {
    if (jamPos(idx) !== 0) return;
    dragging = true;
    startX = e.clientX;
    el.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = Math.min(0, e.clientX - startX);
    el.style.transform = `translateX(${dx}px) rotate(${dx * 0.05}deg)`;
  });
  const finish = (e) => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove("is-dragging");
    const dx = e.clientX - startX;
    el._justDragged = true;
    setTimeout(() => { el._justDragged = false; }, 60);
    if (dx < -50) jamSendToBack(idx); else jamLayout();
  };
  el.addEventListener("pointerup", finish);
  el.addEventListener("pointerleave", (e) => { if (dragging) finish(e); });
}

function renderJamShelf() {
  const section = document.getElementById("jamShelfSection");
  const track = document.getElementById("jamTrack");
  if (!section || !track) return;
  if (!BOOKS.length) { section.style.display = "none"; return; }

  jamPool = BOOKS.slice(0, Math.min(8, BOOKS.length));
  jamOrder = jamPool.map((_, i) => i);

  track.innerHTML = jamPool.map((b, i) => `
    <button type="button" class="jam-spine" data-idx="${i}" aria-label="${b.title}">
      ${coverHTML(b, { badge: false })}
    </button>`).join("");

  track.querySelectorAll(".jam-spine").forEach((el) => {
    const idx = Number(el.dataset.idx);
    el.addEventListener("click", () => {
      if (el._justDragged) return;
      if (jamPos(idx) === 0) {
        location.href = `book.html?id=${encodeURIComponent(jamPool[idx].id)}`;
      } else {
        jamBringToFront(idx);
      }
    });
    attachJamDrag(el, idx);
  });

  document.getElementById("jamPrev")?.addEventListener("click", () => jamCycle(1));
  document.getElementById("jamNext")?.addEventListener("click", () => jamCycle(-1));

  jamLayout();
  window.addEventListener("resize", jamLayout);
}

/* ---------- 3. Book of the Day — deterministic daily pick, real data only ---------- */
function renderBookOfDay() {
  const el = document.getElementById("botd");
  const section = document.getElementById("botdSection");
  if (!el) return;
  if (!BOOKS.length) { if (section) section.style.display = "none"; return; }

  const dayIndex = Math.floor(Date.now() / 86400000) % BOOKS.length;
  const book = BOOKS[dayIndex];
  const cat = getCategory(book.category);
  const desc = book.description || "";
  const shortDesc = desc.length > 230 ? desc.slice(0, 230) + "…" : desc;

  el.innerHTML = `
    <div class="botd-cover">${coverHTML(book, { badge: false })}</div>
    <div class="botd-info">
      <span class="eyebrow">আজকের বই</span>
      <h2>${book.title}</h2>
      ${book.titleEn ? `<p class="botd-sub">${book.titleEn}</p>` : ""}
      <div class="botd-meta">
        <span>${book.author || ""}</span>
        ${cat ? `<span>•</span><span>${cat.label}</span>` : ""}
      </div>
      <p class="botd-desc">${shortDesc}</p>
      <div class="botd-price">${book.currency || "৳"}${book.price}</div>
      <div class="botd-actions">
        <a class="btn btn-gold" href="book.html?id=${encodeURIComponent(book.id)}">বইটি আবিষ্কার করুন</a>
        <a class="btn btn-whatsapp" href="${waLink(book)}" target="_blank" rel="noopener">অর্ডার করুন</a>
      </div>
    </div>`;
}

/* ---------- 4. Curated collections — built from real tag frequency in BOOKS ---------- */
function renderCollections() {
  const wrap = document.getElementById("collections-wrap");
  const section = document.getElementById("collectionsSection");
  if (!wrap) return;

  const freq = {};
  BOOKS.forEach((b) => (b.tags || []).forEach((t) => { freq[t] = (freq[t] || 0) + 1; }));
  const tags = Object.entries(freq).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 4);

  if (!tags.length) { if (section) section.style.display = "none"; return; }

  wrap.innerHTML = tags.map(([tag, count]) => `
    <button type="button" class="collection-card" data-tag="${tag}">
      <span class="collection-count">${count} টি বই</span>
      <h3>${tag}</h3>
      <span class="collection-cta">পাঠযাত্রা শুরু করুন</span>
    </button>`).join("");

  wrap.querySelectorAll(".collection-card").forEach((btn) => {
    btn.addEventListener("click", () => showCollectionPreview(btn.dataset.tag));
  });
}

function showCollectionPreview(tag) {
  const preview = document.getElementById("collection-preview");
  if (!preview) return;
  const list = BOOKS.filter((b) => (b.tags || []).includes(tag));
  preview.innerHTML = `
    <div class="section-head">
      <div><span class="eyebrow">পাঠযাত্রা</span><h3 style="margin-top:6px;">${tag}</h3></div>
      <a class="btn btn-forest btn-sm" href="books.html?q=${encodeURIComponent(tag)}">সব ফলাফল দেখুন →</a>
    </div>
    <div class="book-grid">${list.map(bookCardHTML).join("")}</div>`;
  preview.style.display = "block";
  preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- 5. Popular / full catalog grid ---------- */
function renderPopularGrid() {
  const grid = document.getElementById("popular-grid");
  if (!grid) return;
  grid.innerHTML = BOOKS.length
    ? BOOKS.map(bookCardHTML).join("")
    : `<p class="empty-state">এখনো কোনো বই যোগ করা হয়নি।</p>`;
}

/* ---------- 6. Hero mini shelf ---------- */
function renderHeroMiniShelf() {
  const el = document.getElementById("hero-mini-books");
  if (!el) return;
  el.innerHTML = BOOKS.slice(0, 4).map(miniCoverHTML).join("");
}

/* ---------- 7. Smart search overlay ---------- */
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
  renderHeroMiniShelf();
  renderShelves();
  renderJamShelf();
  renderBookOfDay();
  renderCollections();
  renderPopularGrid();
  initSearchOverlay();
});
