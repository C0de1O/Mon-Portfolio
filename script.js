// ============================================
// CONFIGURATION GSAP
// ============================================
gsap.registerPlugin(ScrollTrigger);

// ============================================
// PRELOADER - VERSION CORRIGÉE
// ============================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    // Animation de sortie du preloader
    gsap.to('.loader-bar::before', {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut'
    });
    
    setTimeout(() => {
        gsap.to(preloader, {
            y: '-100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
                initAnimations();
            }
        });
    }, 2200);
});

// Bloquer le scroll pendant le chargement
document.body.style.overflow = 'hidden';

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Cursor hover effect
    const hoverElements = document.querySelectorAll('a, button, .magnetic, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.background = 'rgba(99, 102, 241, 0.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.background = 'transparent';
        });
    });
}

// ============================================
// MAGNETIC EFFECT
// ============================================
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// ============================================
// NAVBAR SCROLL
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// TYPING EFFECT
// ============================================
const typingText = document.querySelector('.typing-text');

if (typingText) {
    const texts = [
        'Développeur Full Stack',
        'Expert WordPress',
        'Créateur d\'expériences web',
        'Spécialiste E-commerce'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 2500);
}

// ============================================
// REVEAL ANIMATIONS - VERSION CORRIGÉE
// ============================================
function initAnimations() {
    // Observer pour les révélations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Appliquer l'observer sur tous les éléments .reveal
    const reveals = document.querySelectorAll('.reveal, .reveal-image');
    reveals.forEach(element => {
        observer.observe(element);
    });

    // Animations GSAP pour les images parallax
    const parallaxImages = document.querySelectorAll('.parallax-image');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    });

    // Counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        let current = 0;
        
        const updateCounter = () => {
            const increment = target / 100;
            
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        // Observer pour démarrer le compteur
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && current === 0) {
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(stat);
    });
}

// Lancer les animations immédiatement si pas de preloader
if (!document.querySelector('.preloader')) {
    initAnimations();
}

// ============================================
// PROJECT HOVER EFFECTS
// ============================================
const projectItems = document.querySelectorAll('.projet-item');

projectItems.forEach(item => {
    const imageContainer = item.querySelector('.image-container');
    const overlay = item.querySelector('.projet-overlay');
    
    if (imageContainer) {
        item.addEventListener('mouseenter', () => {
            gsap.to(imageContainer, {
                scale: 1.05,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0.2,
                    duration: 0.4
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(imageContainer, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0.4,
                    duration: 0.4
                });
            }
        });
    }
});

// ============================================
// MOBILE MENU
// ============================================
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const body = document.body;

if (burger && navMenu) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('active');
        
        // Animation du burger
        const spans = burger.querySelectorAll('span');
        if (burger.classList.contains('active')) {
            gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
            gsap.to(spans[1], { rotation: -45, duration: 0.3 });
        } else {
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { rotation: 0, duration: 0.3 });
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            burger.classList.remove('active');
            
            const spans = burger.querySelectorAll('span');
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { rotation: 0, duration: 0.3 });
        });
    });
}

// ============================================
// FORM INPUTS ANIMATION
// ============================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// ============================================
// FORM SUBMISSION
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = contactForm.querySelector('.btn-submit');
        const originalHTML = button.innerHTML;
        
        // Animation du bouton
        button.innerHTML = '<span>Envoi en cours...</span>';
        button.disabled = true;
        
        // Simuler l'envoi (remplacer par votre logique)
        setTimeout(() => {
            button.innerHTML = '<span>Message envoyé ! ✓</span>';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.disabled = false;
                contactForm.reset();
                
                // Retirer les classes focused
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('focused');
                });
            }, 2000);
        }, 2000);
    });
}

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// FLOATING SHAPES ANIMATION
// ============================================
const shapes = document.querySelectorAll('.shape');

shapes.forEach((shape, index) => {
    gsap.to(shape, {
        y: 'random(-100, 100)',
        x: 'random(-100, 100)',
        duration: 'random(10, 20)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 2
    });
});

// ============================================
// GRADIENT SPHERES ANIMATION
// ============================================
const spheres = document.querySelectorAll('.gradient-sphere');

spheres.forEach((sphere, index) => {
    gsap.to(sphere, {
        x: 'random(-200, 200)',
        y: 'random(-200, 200)',
        duration: 'random(15, 25)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 3
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Désactiver le cursor sur mobile
if (window.innerWidth < 768) {
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
}

// Lazy loading des images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback pour navigateurs anciens
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

console.log('✅ Portfolio chargé avec succès !');

