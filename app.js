/* ================================================
   CINEMATIC WEDDING WEBSITE - INTERACTIONS
   Bringing the love story to life
   ================================================ */

(function() {
    'use strict';

    // ---- Configuration ----
    const config = {
        scrollThreshold: 100,
        revealThreshold: 0.15,
        parallaxFactor: 0.5,
        animationDuration: 800,
        typewriterSpeed: 35,
        typewriterDelay: 600
    };

    // ---- Elements ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroVideo = document.querySelector('.hero-video');
    const revealElements = document.querySelectorAll('.reveal');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Celebration Elements
    const celebrationCards = document.querySelectorAll('.celebration-card');
    const celebrationStage = document.querySelector('.celebration-stage');

    // Countdown Elements
    const countdownSection = document.getElementById('countdown');
    const countdownContainer = document.querySelector('.countdown-container');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const particlesContainer = document.getElementById('particles');

    // Journey Video Controls
    const journeyVideo = document.querySelector('.journey-video');
    const playPauseBtn = document.querySelector('.journey-image .play-pause');
    const muteBtn = document.querySelector('.journey-image .mute-btn');
    const volumeBtn = document.querySelector('.journey-image .volume-btn');

    let currentImageIndex = 0;
    let imagesArray = [];
    let previousValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
    let controlsTimeout;

    // ---- Navbar Behavior ----
    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        if (scrollY > config.scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ---- Mobile Menu ----
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ---- Smooth Scroll ----
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        closeMobileMenu();
    }

    // ---- Scroll Reveal Animation ----
    function revealOnScroll(entries, observer) {
        entries.forEach(entry => {
            if (!entry || !entry.target) return;
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const v = entry.target.querySelector('.journey-video');
                if (!v) return;
                const playPromise = v.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        v.muted = true;
                        v.play().catch(() => {});
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }

    function setupScrollReveal() {
        const observerOptions = {
            threshold: config.revealThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(revealOnScroll, observerOptions);
        revealElements.forEach(el => observer.observe(el));
    }

    // ---- Countdown Timer ----
    function updateCountdown() {
        const weddingDate = new Date('October 24, 2026 12:30:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance <= 0) {
            daysEl.textContent = '000';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Animate changes
        animateValue(daysEl, days, previousValues.days, 'days');
        animateValue(hoursEl, hours, previousValues.hours, 'hours', 2);
        animateValue(minutesEl, minutes, previousValues.minutes, 'minutes', 2);
        animateValue(secondsEl, seconds, previousValues.seconds, 'seconds', 2);

        previousValues = { days, hours, minutes, seconds };
    }

    function animateValue(element, newValue, oldValue, unit, padLength = 3) {
        if (oldValue !== newValue) {
            const formatted = newValue.toString().padStart(padLength, '0');
            element.classList.add('flip');
            element.textContent = formatted;

            setTimeout(() => {
                element.classList.remove('flip');
            }, 300);
        }
    }

    // ---- Particle System ----
    function createParticles(count = 50) {
        if (!particlesContainer) return;

        // Reduce particles on mobile for performance
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? Math.min(count, 20) : count;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 4 + 1;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                bottom: -10px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // ---- Initialize Countdown ----
    function initCountdown() {
        if (!countdownSection) return;

        // Create particles
        createParticles(60);

        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Setup intersection observer for reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countdownContainer.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(countdownSection);
    }

    // ---- Parallax Effect ----
    function handleParallax() {
        if (!heroVideo) return;

        const scrolled = window.scrollY;
        const rate = scrolled * config.parallaxFactor;

        if (scrolled < window.innerHeight) {
            heroVideo.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
    }

    // ---- Video Fallback ----
    function setupVideoFallback() {
        if (!heroVideo) return;

        heroVideo.addEventListener('error', function() {
            this.style.display = 'none';
            const wrapper = document.querySelector('.hero-video-wrapper');
            if (wrapper) {
                wrapper.style.background = 'linear-gradient(135deg, #8B7355 0%, #D4A574 50%, #9CAF88 100%)';
            }
        });

        // Ensure video plays
        heroVideo.play().catch(() => {
            // Autoplay failed, fallback already handled
        });
    }

    // ---- RSVP Form ----
    function getRSVPMessage() {
        if (!rsvpForm) return '';
        const attendance = (rsvpForm.querySelector('#attendance')?.value || '').trim();
        const name = (rsvpForm.querySelector('#name')?.value || '').trim();
        const phone = (rsvpForm.querySelector('#phone')?.value || '').trim();
        const plusOne = (rsvpForm.querySelector('#plusone')?.value || '').trim();
        const guestName = (rsvpForm.querySelector('#guestname')?.value || '').trim();
        const events = (rsvpForm.querySelector('#events')?.value || '').trim();

        const attendanceText = attendance === 'accept' ? 'Joyfully Accepts' : attendance === 'decline' ? 'Regretfully Declines' : attendance;
        const eventsText = { engagement: 'Engagement only', ceremony: 'Wedding Ceremony only', reception: 'Reception only', both: 'Both Wedding Ceremony and Reception' }[events] || events;

        return `💍 *Edwin & Regina - Wedding RSVP* 💍\n\n` +
            `*Attendance:* ${attendanceText}\n` +
            `*Name:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `*Plus One:* ${plusOne === 'justme' ? 'Just me' : plusOne === 'meandguest' ? 'Me and my guest' : plusOne}${guestName ? ` (${guestName})` : ''}\n` +
            `*Events Attending:* ${eventsText}`;
    }

    function openModal(selector) {
        const el = document.querySelector(selector);
        if (!el) return;
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        requestAnimationFrame(() => el.classList.add('active'));
    }

    function closeModal(selector) {
        const el = document.querySelector(selector);
        if (el) el.classList.remove('active');
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(rsvpForm);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        console.log('RSVP Submitted:', data);
        if (typeof window.fireConfetti === 'function') {
            window.fireConfetti();
        }
        setTimeout(() => {
            openModal('#methodModal');
        }, 600);
        return false;
    }

    function setupSendMethodModal() {
        const methodModal = document.getElementById('methodModal');
        const contactModal = document.getElementById('contactModal');
        const methodButtons = methodModal?.querySelectorAll('.method-btn');
        const backBtn = document.getElementById('backToMethodBtn');
        const contactButtons = document.getElementById('contactOptions')?.querySelectorAll('.contact-option-btn');

        methodButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                const method = btn.dataset.method;
                methodModal.classList.remove('active');
                if (contactModal) {
                    contactModal.dataset.method = method;
                    requestAnimationFrame(() => contactModal.classList.add('active'));
                }
            });
        });

        backBtn?.addEventListener('click', () => {
            closeModal('#contactModal');
            openModal('#methodModal');
        });

        contactButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                const method = contactModal?.dataset.method || 'whatsapp';
                const phone = btn.dataset.phone;
                const message = encodeURIComponent(getRSVPMessage());
                let url = '';
                if (method === 'whatsapp') {
                    url = `https://wa.me/${phone}?text=${message}`;
                } else {
                    url = `sms:${phone}?body=${message}`;
                }
                closeAllModals();
                window.open(url, '_blank');
                if (rsvpForm) rsvpForm.style.display = 'none';
                if (rsvpSuccess) rsvpSuccess.classList.add('show');
            });
        });

        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            if (!btn.id || btn.id !== 'backToMethodBtn') {
                btn.addEventListener('click', closeAllModals);
            }
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeAllModals();
            });
        });
    }

    // ---- Gallery Lightbox ----
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = galleryItems[currentImageIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');

        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : '';
    }

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + imagesArray.length) % imagesArray.length;
        updateLightboxContent();
    }

    function handleKeyboard(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    }

    // ---- Initialize Gallery ----
    function initGallery() {
        imagesArray = Array.from(galleryItems);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', handleKeyboard);
    }

    // ---- Smooth scroll for all anchor links ----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', smoothScroll);
        });
    }

    // ---- Active section highlight ----
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- Throttle function ----
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ---- Debounce function ----
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ---- Celebration Cards ----
    function typewriter(element, text, speed = config.typewriterSpeed) {
        if (!element || element.dataset.typed === 'true') return;
        element.dataset.typed = 'true';
        element.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typewriter');
            }
        }
        type();
    }

    function revealCelebrationCards() {
        if (!celebrationStage) return;

        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = Array.from(celebrationCards);
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('active');
                            const typewriterEl = card.querySelector('.typewriter');
                            if (typewriterEl) {
                                const text = typewriterEl.dataset.text || typewriterEl.textContent;
                                setTimeout(() => {
                                    typewriter(typewriterEl, text);
                                }, config.typewriterDelay);
                            }
                            const mapEl = card.querySelector('.card-map');
                            if (mapEl) {
                                setTimeout(() => {
                                    mapEl.classList.add('visible-map');
                                    mapEl.classList.remove('hidden-map');
                                }, 800);
                            }
                        }, index * 300);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(celebrationStage);
    }

    function setupMapInteractions() {
        celebrationCards.forEach(card => {
            const mapEl = card.querySelector('.card-map');
            const btn = card.querySelector('.show-map-btn');

            if (!mapEl || !btn) return;

            // Desktop hover
            if (window.matchMedia('(hover: hover)').matches) {
                card.addEventListener('mouseenter', () => {
                    mapEl.classList.add('visible-map');
                    mapEl.classList.remove('hidden-map');
                });

                card.addEventListener('mouseleave', () => {
                    mapEl.classList.remove('visible-map');
                    mapEl.classList.add('hidden-map');
                });
            }

            // Mobile tap
            if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isVisible = mapEl.classList.contains('visible-map');
                    mapEl.classList.toggle('visible-map', !isVisible);
                    mapEl.classList.toggle('hidden-map', isVisible);
                });
            }
        });
    }

    function handleResize() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }

        if (particlesContainer && window.innerWidth <= 768) {
            particlesContainer.innerHTML = '';
            createParticles();
        }

        setupMapInteractions();
    }

    // ---- Journey Video Controls ----

    function showControls() {
        if (!playPauseBtn || !playPauseBtn.parentElement) return;
        const controls = playPauseBtn.closest('.video-controls');
        if (controls) {
            controls.classList.add('visible');
        }
        resetControlsTimer();
    }

    function hideControls() {
        if (!playPauseBtn || !playPauseBtn.parentElement) return;
        const controls = playPauseBtn.closest('.video-controls');
        if (controls) {
            controls.classList.remove('visible');
        }
    }

    function resetControlsTimer() {
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(hideControls, 1000);
    }

    function togglePlayPause() {
        if (!journeyVideo) return;

        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        if (journeyVideo.paused) {
            journeyVideo.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            journeyVideo.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    function toggleMute() {
        if (!journeyVideo) return;

        const muteIcon = muteBtn.querySelector('.mute-icon');
        const unmuteIcon = muteBtn.querySelector('.unmute-icon');

        journeyVideo.muted = !journeyVideo.muted;

        if (journeyVideo.muted) {
            muteIcon.style.display = 'block';
            unmuteIcon.style.display = 'none';
        } else {
            muteIcon.style.display = 'none';
            unmuteIcon.style.display = 'block';
        }
    }

    function increaseVolume() {
        if (!journeyVideo) return;

        journeyVideo.muted = false;
        journeyVideo.volume = Math.min(1, journeyVideo.volume + 0.2);

        // Update mute button state to show unmuted
        const muteIcon = muteBtn.querySelector('.mute-icon');
        const unmuteIcon = muteBtn.querySelector('.unmute-icon');
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';
    }

    // Double-tap to play/pause on touch devices
    function setupJourneyVideoTouch() {
        if (!journeyVideo) return;

        let tapCount = 0;
        let tapTimeout = null;

        const journeyImage = journeyVideo.closest('.journey-image');
        if (journeyImage) {
            journeyImage.addEventListener('touchstart', function(e) {
                if (e.touches.length === 1) {
                    tapCount++;
                    if (tapCount === 1) {
                        tapTimeout = setTimeout(() => {
                            tapCount = 0;
                        }, 300);
                    } else if (tapCount === 2) {
                        e.preventDefault();
                        clearTimeout(tapTimeout);
                        tapCount = 0;
                        togglePlayPause();
                    }
                }
            });

            // Show controls on touch for mobile
            journeyImage.addEventListener('touchstart', function() {
                showControls();
            });
        }
    }

    function initJourneyVideoControls() {
        if (!journeyVideo) return;

        // Setup button events
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showControls();
                togglePlayPause();
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showControls();
                toggleMute();
            });
        }

        if (volumeBtn) {
            volumeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showControls();
                increaseVolume();
            });
        }

        // Desktop: show/hide controls on hover
        const journeyImage = journeyVideo.closest('.journey-image');
        if (journeyImage) {
            journeyImage.addEventListener('mouseenter', showControls);
            journeyImage.addEventListener('mouseleave', () => {
                clearTimeout(controlsTimeout);
                controlsTimeout = setTimeout(hideControls, 1000);
            });

            // Also show controls on click/tap for desktop
            journeyImage.addEventListener('click', function(e) {
                if (!e.target.closest('.video-control-btn')) {
                    showControls();
                }
            });
        }

        // Setup touch double-tap
        setupJourneyVideoTouch();

        // Ensure video plays on load
        journeyVideo.play().catch(() => {
            // Autoplay may fail, that's okay
        });
    }

    // ---- Confetti System ----
    function initConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let confetti = [];
        let animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const colors = [
            '#E1773B',
            '#E8A77A',
            '#C1622C',
            '#8A9DB5',
            '#6B7F9A',
            '#5D77A8',
            '#8B7355',
            '#D4A574',
            '#F9F5F0',
            '#E8A77A'
        ];

        class Confetto {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 10 + 4;
                this.speedY = Math.random() * 6 + 4;
                this.speedX = Math.random() * 4 - 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 10 - 5;
                this.opacity = 1;
                this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.speedY += 0.05;
                this.rotation += this.rotationSpeed;
                this.opacity -= 0.003;

                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                    this.speedY = Math.random() * 6 + 4;
                    this.opacity = 1;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillStyle = this.color;

                if (this.shape === 'rect') {
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        function createBurst(count = 150) {
            for (let i = 0; i < count; i++) {
                const c = new Confetto();
                c.y = Math.random() * canvas.height * 0.3;
                c.speedY = Math.random() * 8 + 2;
                c.speedX = Math.random() * 6 - 3;
                confetti.push(c);
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confetti.forEach(c => {
                c.update();
                c.draw();
            });
            confetti = confetti.filter(c => c.opacity > 0);
            if (confetti.length > 0) {
                animationId = requestAnimationFrame(animate);
            }
        }

        function fire() {
            createBurst(200);
            if (confetti.length <= 200) {
                cancelAnimationFrame(animationId);
                animate();
            }
        }

        window.fireConfetti = fire;

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationId);
        });
    }

    // ---- Cinematic Gallery ----
    function initCinematicGallery() {
        const track = document.querySelector('.gallery-track');
        const wrapper = document.querySelector('.gallery-track-wrapper');
        if (!track || !wrapper) return;

        let isDown = false;
        let startX, scrollLeftPos;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeftPos = wrapper.scrollLeft;
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeftPos - walk;
        });

        // 3D Tilt Effect
        const cards = document.querySelectorAll('.gallery-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });

            // Lightbox
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const caption = card.querySelector('.gallery-card-caption span');
                if (img && lightbox) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = caption ? caption.textContent : '';
                    openLightbox(0);
                }
            });
        });

        // Update gallery items array for lightbox nav
        imagesArray = Array.from(cards);
    }

    // ---- Initialize ----
    function init() {
        // Event listeners
        window.addEventListener('scroll', throttle(() => {
            handleNavbarScroll();
            highlightActiveSection();
            handleParallax();
        }, 16));

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        if (rsvpForm) {
            rsvpForm.addEventListener('submit', handleFormSubmit);
        }

        // Initialize components
        setupScrollReveal();
        initGallery();
        initSmoothScroll();
        setupVideoFallback();
        initCountdown(); // Initialize countdown
        initJourneyVideoControls(); // Journey video controls
        revealCelebrationCards(); // Celebration card reveals
        setupMapInteractions();
        setupSendMethodModal(); // RSVP send method modal
        initConfetti();
        initCinematicGallery();

        window.addEventListener('resize', debounce(handleResize, 250));

        // Initial check
        handleNavbarScroll();
        highlightActiveSection();

        // Add loaded class for initial animations
        document.body.classList.add('loaded');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Preload images for smoother gallery
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });

})();