// Tema (auto/dark/light) – igual às outras telas
const THEME_KEY = "theme";
const metaTheme = document.querySelector('meta[name="theme-color"]');
const MODES = ["auto","dark","light"];
function systemPrefersDark(){ return window.matchMedia("(prefers-color-scheme: dark)").matches; }
function effectiveTheme(explicit){ return (!explicit||explicit==="auto") ? (systemPrefersDark()?"dark":"light") : explicit; }
function setThemeColor(theme){ if(metaTheme) metaTheme.setAttribute("content", theme==="dark"?"#0b0e14":"#f6f8fb"); }
function applyTheme(mode){ const root=document.documentElement; if(mode==="auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme",mode); setThemeColor(effectiveTheme(mode)); updateThemeToggleUI(mode,effectiveTheme(mode)); }
function updateThemeToggleUI(mode,eff){ const btn=document.getElementById("theme-toggle"); if(!btn)return; const icon=btn.querySelector(".icon"); const label=btn.querySelector(".label"); const MAP={auto:{icon:"🖥️",text:"Auto"},dark:{icon:"🌙",text:"Dark"},light:{icon:"☀️",text:"Light"}}; const ui=MAP[mode]||MAP.auto; if(icon)icon.textContent=ui.icon; if(label)label.textContent=ui.text; btn.setAttribute("aria-label",`Tema: ${ui.text}`); btn.setAttribute("title",`Tema: ${ui.text}`); btn.setAttribute("aria-pressed",eff==="dark"?"true":"false"); }
function getSavedMode(){ return localStorage.getItem(THEME_KEY)||"auto"; }
function nextMode(current){ return MODES[(MODES.indexOf(current)+1)%MODES.length]; }
(function initTheme(){ const saved=getSavedMode(); applyTheme(saved); if(window.matchMedia){ window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{ if(getSavedMode()==="auto") applyTheme("auto"); }); }})();
document.addEventListener("DOMContentLoaded",()=>{ const btn=document.getElementById("theme-toggle"); if(btn){ btn.addEventListener("click",()=>{ const next=nextMode(getSavedMode()); localStorage.setItem(THEME_KEY,next); applyTheme(next); }); }});

// Scroll to top
function scrollToTop(){ window.scrollTo({top:0,behavior:"smooth"}); }
const btnTop=document.getElementById("btnTop");
window.addEventListener("scroll",()=>{ btnTop.style.display=window.scrollY>300?"block":"none"; });

// Menu mobile
const hamburger=document.getElementById("hamburger-menu");
const navLinks=document.getElementById("nav-links");
if(hamburger&&navLinks){
  hamburger.addEventListener("click",()=>{ const open=navLinks.classList.toggle("open"); hamburger.setAttribute("aria-expanded",open?"true":"false"); });
  navLinks.addEventListener("click",(e)=>{ if(e.target.tagName==="A") navLinks.classList.remove("open"); });
}

// Modal
const modal=document.getElementById("image-modal");
const modalImg=document.getElementById("modal-img");
const btnClose=document.querySelector(".close-btn");
const btnPrev=document.querySelector(".nav-arrow.left");
const btnNext=document.querySelector(".nav-arrow.right");
let images=[],currentIndex=0;
document.querySelectorAll(".gallery img").forEach((img,idx)=>{ images.push(img); img.addEventListener("click",()=>openModal(idx)); });
function openModal(i){ currentIndex=i; modalImg.src=images[i].src; modal.classList.add("show"); modal.setAttribute("aria-hidden","false"); document.addEventListener("keydown",onKey); }
function closeModal(){ modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); document.removeEventListener("keydown",onKey); }
function showPrev(){ currentIndex=(currentIndex-1+images.length)%images.length; modalImg.src=images[currentIndex].src; }
function showNext(){ currentIndex=(currentIndex+1)%images.length; modalImg.src=images[currentIndex].src; }
function onKey(e){ if(e.key==="Escape") closeModal(); if(e.key==="ArrowLeft") showPrev(); if(e.key==="ArrowRight") showNext(); }
btnClose.addEventListener("click",closeModal);
btnPrev.addEventListener("click",showPrev);
btnNext.addEventListener("click",showNext);
modal.addEventListener("click",(e)=>{ if(!e.target.closest(".modal-inner")) closeModal(); });
