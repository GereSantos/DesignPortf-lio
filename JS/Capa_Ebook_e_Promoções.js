// Variável global para controlar o índice da imagem atual
let currentIndex = 0;

// Selecionando o modal e a imagem dentro dele
let modal = document.querySelector('.modal');
let modalImg = modal.querySelector('img');

// Selecionando as setas de navegação
let prevArrow = document.querySelector('.prev-arrow');
let nextArrow = document.querySelector('.next-arrow');

// Ocultar as setas inicialmente
prevArrow.style.visibility = 'hidden';
nextArrow.style.visibility = 'hidden';

// Função para abrir o modal e exibir a imagem
document.querySelectorAll('.ebook-card img').forEach((img, index) => {
    img.addEventListener('click', function() {
        currentIndex = index;  // Atualiza o índice da imagem
        modal.style.display = 'flex';
        modalImg.src = this.src;  // Define a imagem no modal

        // Exibe as setas de navegação ao abrir o modal
        prevArrow.style.visibility = 'visible';
        nextArrow.style.visibility = 'visible';
    });
});

// Função para fechar o modal
document.querySelector('#closeModal').addEventListener('click', function() {
    modal.style.display = 'none';

    // Ocultar as setas de navegação ao fechar o modal
    prevArrow.style.visibility = 'hidden';
    nextArrow.style.visibility = 'hidden';
});

// Função para exibir a imagem anterior
prevArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + document.querySelectorAll('.ebook-card img').length) % document.querySelectorAll('.ebook-card img').length;
    modalImg.src = document.querySelectorAll('.ebook-card img')[currentIndex].src;
});

// Função para exibir a imagem seguinte
nextArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % document.querySelectorAll('.ebook-card img').length;
    modalImg.src = document.querySelectorAll('.ebook-card img')[currentIndex].src;
});

// Zoom na imagem ao passar o mouse sobre ela
modalImg.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.2)';  // Efeito de zoom
    this.style.transition = 'transform 0.3s ease';  // Suaviza a transição
});

modalImg.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';  // Retorna ao tamanho original
});
