// Menu mobile toggle
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Modal de imagem
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close-btn');
const leftArrow = document.querySelector('.nav-arrow.left');
const rightArrow = document.querySelector('.nav-arrow.right');
const allImages = Array.from(document.querySelectorAll('.image-row img'));

let currentIndex = 0;

// Abre o modal ao clicar em uma imagem
allImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    modalImg.src = img.src;
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  });
});

// Fecha modal
function closeModal() {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }, 300);
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Navegação com setas
leftArrow.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
  modalImg.src = allImages[currentIndex].src;
});

rightArrow.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % allImages.length;
  modalImg.src = allImages[currentIndex].src;
});
