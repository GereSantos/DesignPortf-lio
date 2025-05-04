const imageCards = document.querySelectorAll('.banner-card img, .thumb-card img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.getElementById('closeModal');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentIndex = 0;
let images = [];

// Coletar todas as imagens clicáveis
imageCards.forEach((img, index) => {
    images.push(img.src);
    img.addEventListener('click', () => {
        currentIndex = index;
        openModal(images[currentIndex]);
    });
});

function openModal(src) {
    modal.style.display = 'flex';
    modalImg.src = src;
}

function showImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    modalImg.src = images[index];
    currentIndex = index;
}

prev.addEventListener('click', () => showImage(currentIndex - 1));
next.addEventListener('click', () => showImage(currentIndex + 1));
closeModal.addEventListener('click', () => modal.style.display = 'none');
