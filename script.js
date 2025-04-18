document.addEventListener("DOMContentLoaded", function () {
    // Fade-in nas seções com IntersectionObserver
    const sections = document.querySelectorAll("section");
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // remove depois da animação
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('hidden-section'); // inicia invisível
        observer.observe(section);
    });

    // Menu hamburguer
    const hamburger = document.getElementById("hamburger-menu");
    const navLinks = document.getElementById("nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Modal de Imagem com Navegação
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close-btn");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");

    const allImages = Array.from(document.querySelectorAll(".image-row img"));
    let currentIndex = 0;

    // Função para bloquear/desbloquear scroll do fundo
    function toggleBodyScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : 'auto';
    }

    // Abrir modal ao clicar na imagem
    allImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            modal.classList.add("show");
            modal.style.display = "flex";
            modalImg.src = img.src;
            currentIndex = index;
            toggleBodyScroll(true);
        });
    });

    // Fechar modal (botão fechar)
    closeBtn.addEventListener("click", () => {
        closeModal();
    });

    // Fechar modal clicando fora da imagem
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });

    // Função para fechar modal com animação
    function closeModal() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
            toggleBodyScroll(false);
        }, 300); // mesmo tempo da transição CSS
    }

    // Navegar para imagem anterior
    leftArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        modalImg.src = allImages[currentIndex].src;
    });

    // Navegar para próxima imagem
    rightArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % allImages.length;
        modalImg.src = allImages[currentIndex].src;
    });
});

// Botão "Voltar ao topo"
window.onscroll = function () {
    const btn = document.getElementById("btnTop");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
