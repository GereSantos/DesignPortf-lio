/* =========================
   Tema: auto / dark / light (3 estados)
   ========================= */
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
function applyTheme(mode){                 // mode: 'auto' | 'dark' | 'light'
  const root = document.documentElement;
  if(mode === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", mode);
  const eff = effectiveTheme(mode);
  setThemeColor(eff);
  updateThemeToggleUI(mode, eff);
}
function updateThemeToggleUI(mode, eff){   // mode = auto/dark/light, eff = dark/light
  const btn = document.getElementById("theme-toggle");
  if(!btn) return;
  const icon = btn.querySelector(".icon");
  const label = btn.querySelector(".label");
  const MAP = {
    auto:  { icon: "🖥️", text: "Auto"  },
    dark:  { icon: "🌙", text: "Dark"  },
    light: { icon: "☀️", text: "Light" }
  };
  const ui = MAP[mode] || MAP.auto;
  if(icon) icon.textContent = ui.icon;
  if(label) label.textContent = ui.text;

  btn.setAttribute("data-mode", mode);
  btn.setAttribute("aria-label", `Tema: ${ui.text}`);
  btn.setAttribute("title", `Tema: ${ui.text} (clique para alternar)`);
  btn.setAttribute("aria-pressed", eff === "dark" ? "true" : "false");
}
function getSavedMode(){ return localStorage.getItem(THEME_KEY) || "auto"; }
function nextMode(current){
  const i = MODES.indexOf(current);
  return MODES[(i + 1) % MODES.length];
}
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
// UI do botão
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const current = getSavedMode();
    const next = nextMode(current);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
  btn.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); btn.click(); }
  });
});

/* =========================
   UI geral: header, topo, reveal
   ========================= */
// Scroll suave para o topo
function scrollToTop(){ window.scrollTo({ top: 0, behavior: "smooth" }); }

// Mostrar/ocultar botão de topo
const btnTop = document.getElementById("btnTop");
window.addEventListener("scroll", () => {
  const show = window.scrollY > 300;
  btnTop.style.display = show ? "block" : "none";
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
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
  // Fechar com ESC
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
   Modal de imagens (A11y + teclado)
   ========================= */
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const btnClose = document.querySelector(".close-btn");
const btnPrev = document.querySelector(".nav-arrow.left");
const btnNext = document.querySelector(".nav-arrow.right");
const mainEl = document.querySelector("main");

let currentGroup = null;
let currentIndex = -1;
let galleryMap = new Map(); // group -> [imgElements]
let lastFocus = null;

// Monta o mapa de grupos a partir das linhas
document.querySelectorAll(".image-row").forEach(row => {
  const group = row.getAttribute("data-group") || "default";
  const imgs = Array.from(row.querySelectorAll("img.zoomable"));
  galleryMap.set(group, imgs);
});

// Abrir modal
function openModal(group, index){
  if(!galleryMap.has(group)) return;
  currentGroup = group;
  currentIndex = index;
  const imgs = galleryMap.get(group);
  const el = imgs[currentIndex];
  if(!el) return;

  modalImg.src = el.src;
  modalImg.alt = el.alt || "";

  lastFocus = document.activeElement;        // salvar foco
  modal.classList.add("show");
  modal.removeAttribute("aria-hidden");
  if(mainEl) mainEl.setAttribute("aria-hidden","true");
  btnClose.focus();

  document.addEventListener("keydown", onModalKey);
  trapFocus(modal);
}

// Fechar modal
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  if(mainEl) mainEl.removeAttribute("aria-hidden");

  document.removeEventListener("keydown", onModalKey);
  releaseFocus();

  // limpar src por segurança (libera memória)
  modalImg.src = "";
  if(lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

// Navegar
function showPrev(){ if(currentGroup){ const arr = galleryMap.get(currentGroup); currentIndex = (currentIndex - 1 + arr.length) % arr.length; modalImg.src = arr[currentIndex].src; modalImg.alt = arr[currentIndex].alt || ""; } }
function showNext(){ if(currentGroup){ const arr = galleryMap.get(currentGroup); currentIndex = (currentIndex + 1) % arr.length; modalImg.src = arr[currentIndex].src; modalImg.alt = arr[currentIndex].alt || ""; } }

// Eventos teclado no modal
function onModalKey(e){
  if(e.key === "Escape") closeModal();
  else if(e.key === "ArrowLeft") showPrev();
  else if(e.key === "ArrowRight") showNext();
}

// Clicks nas miniaturas (botões .img-item)
document.querySelectorAll(".image-row").forEach(row => {
  const group = row.getAttribute("data-group") || "default";
  const buttons = Array.from(row.querySelectorAll(".img-item"));
  buttons.forEach((btn, idx) => {
    btn.addEventListener("click", () => openModal(group, idx));
    btn.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openModal(group, idx); }
    });
  });
});

// Botões do modal
btnClose && btnClose.addEventListener("click", closeModal);
btnPrev && btnPrev.addEventListener("click", showPrev);
btnNext && btnNext.addEventListener("click", showNext);

// Fechar se clicar fora
modal && modal.addEventListener("click", (e) => {
  const isInner = e.target.closest(".modal-inner");
  if(!isInner) closeModal();
});

/* =========================
   Foco preso no modal (focus trap simples)
   ========================= */
let trapHandler = null;
function trapFocus(container){
  const focusables = container.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  trapHandler = function(e){
    if(e.key !== "Tab") return;
    if(e.shiftKey){
      if(document.activeElement === first){
        e.preventDefault(); last.focus();
      }
    }else{
      if(document.activeElement === last){
        e.preventDefault(); first.focus();
      }
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
