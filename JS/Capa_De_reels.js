// Obter os elementos do modal, imagem e setas
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");
const prevArrow = document.getElementById("prev-arrow");
const nextArrow = document.getElementById("next-arrow");

// Obter todas as imagens da galeria
const images = document.querySelectorAll('.reels-card img');

// Variável para armazenar o índice da imagem atual
let currentImageIndex = 0;

// Função para abrir o modal com a imagem clicada
images.forEach((image, index) => {
    image.addEventListener('click', () => {
        currentImageIndex = index; // Armazena o índice da imagem clicada
        modal.style.display = 'flex';
        modalImg.src = image.src; // Define a imagem do modal para a imagem clicada
        showImage(currentImageIndex); // Atualiza a imagem no modal
        enableNavigationArrows(); // Habilita as setas
    });
});

// Função para fechar o modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    disableNavigationArrows(); // Desabilita as setas quando o modal é fechado
});

// Fechar o modal ao clicar fora da imagem
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        disableNavigationArrows(); // Desabilita as setas quando o modal é fechado
    }
});

// Função para exibir a imagem com base no índice
function showImage(index) {
    const reelImages = document.querySelectorAll('.reels-card img'); // Obter todas as imagens da galeria novamente
    if (index >= reelImages.length) {
        currentImageIndex = 0; // Se chegar ao final, volta para o início
    } else if (index < 0) {
        currentImageIndex = reelImages.length - 1; // Se for antes do primeiro, vai para o último
    } else {
        currentImageIndex = index;
    }
    modalImg.src = reelImages[currentImageIndex].src; // Altera a imagem exibida no modal
}

// Habilitar as setas
function enableNavigationArrows() {
    prevArrow.style.visibility = 'visible'; // Torna a seta anterior visível
    nextArrow.style.visibility = 'visible'; // Torna a seta seguinte visível
    prevArrow.disabled = false; // Habilita a seta anterior
    nextArrow.disabled = false; // Habilita a seta seguinte
}

// Desabilitar as setas
function disableNavigationArrows() {
    prevArrow.style.visibility = 'hidden'; // Torna a seta anterior invisível
    nextArrow.style.visibility = 'hidden'; // Torna a seta seguinte invisível
    prevArrow.disabled = true; // Desabilita a seta anterior
    nextArrow.disabled = true; // Desabilita a seta seguinte
}

// Setas de navegação
prevArrow.addEventListener('click', () => {
    showImage(currentImageIndex - 1); // Mostra a imagem anterior
});

nextArrow.addEventListener('click', () => {
    showImage(currentImageIndex + 1); // Mostra a próxima imagem
});

