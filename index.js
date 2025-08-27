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
// UI
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
   Utilidades e UI
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
  // Fechar menu com ESC (A11y teclado)
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
   Busca + Filtros (cards)
   ========================= */
const chips = document.querySelectorAll(".chip");
const searchInput = document.getElementById("projectSearch");
const cards = document.querySelectorAll("#cards .card");

let activeCategory = "all";
let searchTerm = "";

function normalize(s){ return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function applyFilters(){
  const q = normalize(searchTerm);
  cards.forEach(card => {
    const cat = card.getAttribute("data-category");
    const title = normalize(card.getAttribute("data-title"));
    const matchCategory = (activeCategory === "all") || (cat === activeCategory);
    const matchSearch = !q || title.includes(q);
    card.style.display = (matchCategory && matchSearch) ? "" : "none";
  });
}
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeCategory = chip.getAttribute("data-filter");
    applyFilters();
  });
});
// Debounce da busca
let t = null;
if(searchInput){
  searchInput.addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => {
      searchTerm = e.target.value.trim();
      applyFilters();
    }, 200);
  });
}

/* =========================
   Formulário de Contato
   ========================= */
const form = document.getElementById("contactForm");
const feedback = document.querySelector(".form-feedback");
if(form){
  form.addEventListener("submit", () => {
    if(feedback){
      feedback.textContent = "Enviando...";
      setTimeout(() => { feedback.textContent = "Mensagem enviada! (verifique seu e-mail)"; }, 1200);
    }
  });
}

