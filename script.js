document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const heartSeal = document.getElementById('heart-seal');
    const heartsContainer = document.getElementById('hearts-container');

    let isOpened = false;

    // Función para crear la lluvia de corazones
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart-fall');
        heart.innerHTML = '❤';
        
        // Posición aleatoria horizontal
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Tamaño aleatorio
        const size = Math.random() * 1.5 + 0.5;
        heart.style.fontSize = size + 'rem';
        
        // Duración aleatoria de la caída
        const duration = Math.random() * 3 + 2;
        heart.style.animationDuration = duration + 's';
        
        heartsContainer.appendChild(heart);
        
        // Eliminar del DOM después de caer para no saturar memoria
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Iniciar lluvia de corazones constante
    function startHeartRain() {
        // Crea un corazón cada 300ms
        setInterval(createHeart, 300);
    }

    // Manejar el evento de abrir la carta
    heartSeal.addEventListener('click', () => {
        if (!isOpened) {
            isOpened = true;
            
            // 1. Abrir la solapa superior (Añadir clase 'open')
            envelopeWrapper.classList.add('open');
            
            // 2. Iniciar lluvia de corazones instantáneamente
            startHeartRain();
            
            // 3. Después de que la carta salga del sobre (1.5s), 
            // la bajamos un poco para que se pueda leer y hacer scroll
            setTimeout(() => {
                envelopeWrapper.classList.add('reading');
            }, 1500); // Coincide con la transición en CSS
        }
    });
    // --- Lógica del Carrusel 3D ---
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    
    // Función para girar la tarjeta
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

    // Función para actualizar el carrusel
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        
        // Actualizar dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Ocultar la parte trasera si pasamos a otra tarjeta (opcional pero más limpio)
        cards.forEach(card => card.classList.remove('is-flipped'));
    }

    // Botones siguiente/anterior
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Soporte para gestos táctiles (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // Umbral de swipe de 50px
            if (diff > 0 && currentIndex < cards.length - 1) {
                // Swipe izquierda (Siguiente)
                currentIndex++;
                updateCarousel();
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe derecha (Anterior)
                currentIndex--;
                updateCarousel();
            }
        }
    }

    // --- Mini Juego: Medidor de Amor ---
    const tapBtn = document.getElementById('tap-btn');
    const meterFill = document.getElementById('meter-fill');
    const resultText = document.getElementById('minigame-result');
    let loveScore = 0;
    let drainInterval = null;

    tapBtn.addEventListener('click', () => {
        if (loveScore >= 100) return; // Ya ganó
        
        loveScore += 15; // Aumenta 15% por click
        if (loveScore > 100) loveScore = 100;
        
        meterFill.style.width = loveScore + '%';

        // Iniciar el drenado si no ha iniciado (hace que tenga que ser rápido)
        if (!drainInterval) {
            drainInterval = setInterval(() => {
                if (loveScore > 0 && loveScore < 100) {
                    loveScore -= 5; // Baja 5% cada medio segundo
                    meterFill.style.width = loveScore + '%';
                }
            }, 400);
        }

        // Ganar el juego
        if (loveScore === 100) {
            clearInterval(drainInterval);
            tapBtn.innerText = "¡COMPLETADO! 🎉";
            tapBtn.style.backgroundColor = "#ff4d6d";
            tapBtn.style.transform = "scale(1.05)";
            resultText.innerText = "¡Tu amor es infinito! ❤️";
            
            // Explosión de corazones desde el centro del botón
            const rect = tapBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            for (let i = 0; i < 50; i++) {
                const heart = document.createElement('div');
                heart.classList.add('heart-explosion');
                heart.innerHTML = '❤';
                
                // Centrar en el botón
                heart.style.left = (centerX - 12) + 'px'; // Ajuste al centro
                heart.style.top = (centerY - 12) + 'px';
                
                // Direcciones aleatorias circulares
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 200 + 50; // Qué tan lejos vuelan
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                // Pasamos las variables CSS para la animación
                heart.style.setProperty('--tx', tx + 'px');
                heart.style.setProperty('--ty', ty + 'px');
                
                // Tamaños distintos
                const scale = Math.random() * 1.5 + 0.5;
                heart.style.fontSize = scale + 'rem';
                
                document.body.appendChild(heart);
                
                // Limpiar después de la animación (1 segundo)
                setTimeout(() => heart.remove(), 1000);
            }
        }
    });

});
