/* =========================
   Tema: auto / dark / light (3 estados)
   ========================= */
const THEME_KEY = "theme";
const metaTheme = document.querySelector('meta[name="theme-color"]');
const MODES = ["auto","dark","light"];

function systemPrefersDark(){ return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; }
function effectiveTheme(explicit){ return (!explicit || explicit === "auto") ? (systemPrefersDark() ? "dark" : "light") : explicit; }
function setThemeColor(theme){ if(metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#0b0e14" : "#f6f8fb"); }
function applyTheme(mode){
  const root = document.documentElement;
  if(mode === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", mode);
  const eff = effectiveTheme(mode);
  setThemeColor(eff);
  updateThemeToggleUI(mode, eff);
}
function updateThemeToggleUI(mode, eff){
  const btn = document.getElementById("theme-toggle");
  if(!btn) return;
  const icon = btn.querySelector(".icon");
  const label = btn.querySelector(".label");
  const MAP = { auto:{icon:"🖥️",text:"Auto"}, dark:{icon:"🌙",text:"Dark"}, light:{icon:"☀️",text:"Light"} };
  const ui = MAP[mode] || MAP.auto;
  if(icon) icon.textContent = ui.icon;
  if(label) label.textContent = ui.text;
  btn.setAttribute("data-mode", mode);
  btn.setAttribute("aria-label", `Tema: ${ui.text}`);
  btn.setAttribute("title", `Tema: ${ui.text} (clique para alternar)`);
  btn.setAttribute("aria-pressed", eff === "dark" ? "true" : "false");
}
function getSavedMode(){ return localStorage.getItem(THEME_KEY) || "auto"; }
function nextMode(current){ const i = MODES.indexOf(current); return MODES[(i + 1) % MODES.length]; }

// Init
(function initTheme(){
  const saved = getSavedMode();
  applyTheme(saved);
  if(window.matchMedia){
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if(getSavedMode() === "auto") applyTheme("auto");
    });
  }
})();
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const next = nextMode(getSavedMode());
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
  btn.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); btn.click(); }
  });
});

/* =========================
   UI geral
   ========================= */
function scrollToTop(){ window.scrollTo({ top: 0, behavior: "smooth" }); }
const btnTop = document.getElementById("btnTop");
window.addEventListener("scroll", () => { btnTop.style.display = window.scrollY > 300 ? "block" : "none"; });

// Menu mobile
const hamburger = document.getElementById("hamburger-menu");
const navLinks = document.getElementById("nav-links");
if(hamburger && navLinks){
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.addEventListener("click", (e) => {
    if(e.target.tagName === "A" && navLinks.classList.contains("open")){
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && navLinks.classList.contains("open")){
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded","false");
      hamburger.focus();
    }
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
  const io = new IntersectionObserver((entries) => {
    for(const entry of entries){
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}else{ revealEls.forEach(el => el.classList.add("is-visible")); }

/* =========================
   Modal de imagens (robusto: .img-item OU <img>)
   ========================= */
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const btnClose = document.querySelector(".close-btn");
const btnPrev  = document.querySelector(".nav-arrow.left");
const btnNext  = document.querySelector(".nav-arrow.right");
const mainEl   = document.querySelector("main");

let currentGroup = null;
let currentIndex = -1;
const galleryMap = new Map();
let lastFocus = null;

// util: garante que temos o <img> de um item clicável (button ou img)
function getInnerImg(el){
  if(!el) return null;
  return el.tagName === "IMG" ? el : el.querySelector("img");
}

// monta grupos
document.querySelectorAll(".image-row").forEach(row => {
  const group = row.getAttribute("data-group") || "default";
  // se existir .img-item, priorize; senão, aceite <img> direto
  const useButtons = !!row.querySelector(".img-item");
  const items = Array.from(row.querySelectorAll(useButtons ? ".img-item" : "img"));
  galleryMap.set(group, items);

  items.forEach((el, idx) => {
    el.addEventListener("click", () => openModal(group, idx));
    // acessibilidade: teclado só faz sentido em button
    el.addEventListener("keydown", (e) => {
      if(useButtons && (e.key === "Enter" || e.key === " ")){
        e.preventDefault(); openModal(group, idx);
      }
    });
  });
});

function applyFrom(idx){
  const arr = galleryMap.get(currentGroup);
  const el  = arr[idx];
  const img = getInnerImg(el);
  if(!img) return;
  modalImg.src = img.src;
  modalImg.alt = img.alt || "";
}

function openModal(group, index){
  if(!galleryMap.has(group)) return;
  currentGroup = group;
  currentIndex = index;
  applyFrom(currentIndex);

  lastFocus = document.activeElement;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  if(mainEl) mainEl.setAttribute("aria-hidden","true");
  btnClose && btnClose.focus();

  document.addEventListener("keydown", onModalKey);
  trapFocus(modal);
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  if(mainEl) mainEl.removeAttribute("aria-hidden");
  document.removeEventListener("keydown", onModalKey);
  releaseFocus();
  modalImg.src = "";
  if(lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function showPrev(){
  const arr = galleryMap.get(currentGroup); if(!arr) return;
  currentIndex = (currentIndex - 1 + arr.length) % arr.length;
  applyFrom(currentIndex);
}
function showNext(){
  const arr = galleryMap.get(currentGroup); if(!arr) return;
  currentIndex = (currentIndex + 1) % arr.length;
  applyFrom(currentIndex);
}

function onModalKey(e){
  if(e.key === "Escape") closeModal();
  else if(e.key === "ArrowLeft") showPrev();
  else if(e.key === "ArrowRight") showNext();
}

btnClose && btnClose.addEventListener("click", closeModal);
btnPrev  && btnPrev.addEventListener("click", showPrev);
btnNext  && btnNext.addEventListener("click", showNext);
modal && modal.addEventListener("click", (e) => {
  if(!e.target.closest(".modal-inner")) closeModal();
});

/* =========================
   Focus trap simples
   ========================= */
let trapHandler = null;
function trapFocus(container){
  const focusables = container.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if(!focusables.length) return;
  const first = focusables[0];
  const last  = focusables[focusables.length - 1];
  trapHandler = function(e){
    if(e.key !== "Tab") return;
    if(e.shiftKey){
      if(document.activeElement === first){ e.preventDefault(); last.focus(); }
    }else{
      if(document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  };
  container.addEventListener("keydown", trapHandler);
}
function releaseFocus(){
  if(trapHandler){
    modal.removeEventListener("keydown", trapHandler);
    trapHandler = null;
  }
}
