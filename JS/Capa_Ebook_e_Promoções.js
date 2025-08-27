/* ============ Tema 3 estados (auto/dark/light) ============ */
const THEME_KEY = "theme";
const metaTheme = document.querySelector('meta[name="theme-color"]');
const MODES = ["auto","dark","light"];

function systemPrefersDark(){
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function effectiveTheme(explicit){
  if(!explicit || explicit === "auto") return systemPrefersDark() ? "dark" : "light";
  return explicit;
}
function setThemeColor(theme){
  if(!metaTheme) return;
  metaTheme.setAttribute("content", theme === "dark" ? "#0b0e14" : "#f6f8fb");
}
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
function nextMode(current){ const i = MODES.indexOf(current); return MODES[(i+1)%MODES.length]; }

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
  if(btn){
    btn.addEventListener("click", () => {
      const current = getSavedMode();
      const next = nextMode(current);
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
    btn.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); btn.click(); }
    });
  }
});

/* ============ Utilidades ============ */
function scrollToTop(){ window.scrollTo({ top: 0, behavior: "smooth" }); }
const btnTop = document.getElementById("btnTop");
window.addEventListener("scroll", () => {
  const show = window.scrollY > 300;
  if(btnTop) btnTop.style.display = show ? "block" : "none";
});

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
      hamburger.setAttribute("aria-expanded","false");
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

/* ============ Modal de imagens com navegação (por galeria) ============ */
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const btnClose = document.querySelector(".close-btn");
const btnPrev = document.querySelector(".nav-arrow.left");
const btnNext = document.querySelector(".nav-arrow.right");

let currentGroup = [];
let currentIndex = 0;

document.querySelectorAll(".gallery").forEach(gallery => {
  const imgs = Array.from(gallery.querySelectorAll("img"));
  imgs.forEach((img, idx) => {
    img.addEventListener("click", () => {
      currentGroup = imgs.map(i => i.getAttribute("src"));
      currentIndex = idx;
      openModal(currentGroup[currentIndex], img.getAttribute("alt") || "Imagem ampliada");
    });
  });
});

function openModal(src, alt){
  modalImg.src = src;
  modalImg.alt = alt;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", onKeyNav);
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  document.removeEventListener("keydown", onKeyNav);
}

function showPrev(){
  if(!currentGroup.length) return;
  currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
  modalImg.src = currentGroup[currentIndex];
}
function showNext(){
  if(!currentGroup.length) return;
  currentIndex = (currentIndex + 1) % currentGroup.length;
  modalImg.src = currentGroup[currentIndex];
}

function onKeyNav(e){
  if(e.key === "Escape") closeModal();
  if(e.key === "ArrowLeft") showPrev();
  if(e.key === "ArrowRight") showNext();
}

btnClose.addEventListener("click", closeModal);
btnPrev.addEventListener("click", showPrev);
btnNext.addEventListener("click", showNext);

// Fechar ao clicar fora do conteúdo
modal.addEventListener("click", (e) => {
  const inner = e.target.closest(".modal-inner");
  if(!inner) closeModal();
});

// Swipe básico (touch)
let startX = null;
modalImg.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, {passive:true});
modalImg.addEventListener("touchend", (e) => {
  if(startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx) > 40){ dx > 0 ? showPrev() : showNext(); }
  startX = null;
}, {passive:true});
