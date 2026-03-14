document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation on Scroll
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Enhanced Parallax Effect (using requestAnimationFrame for smooth performance)
    const parallaxElements = document.querySelectorAll('.parallax');

    let ticking = false;
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    // Calculate offset to move background slightly
                    // The CSS background-attachment: fixed does the heavy lifting,
                    // but we can adjust content inside if needed. 
                    const speed = el.dataset.speed || 0.4;
                    const content = el.querySelector('.content');
                    if (content) {
                        const offset = lastScrollY * speed;
                        // content.style.transform = `translateY(${offset}px)`; // Optional content parallax
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // 5. Fetch Destinations from Backend
    async function loadDestinations() {
        try {
            // Try fetching from the new Node.js backend
            const response = await fetch('/api/destinations');
            if (!response.ok) return; // Silent fail, keeps static HTML if backend is missing
            
            const destinations = await response.json();
            const grid = document.querySelector('.destinations-grid');
            if (!grid) return;
            
            grid.innerHTML = ''; // Clear the static HTML cards
            
            destinations.forEach(dest => {
                const card = document.createElement('div');
                card.className = 'card reveal active'; // Keep active classes since it loads dynamically
                card.style.transitionDelay = dest.delay;
                
                card.innerHTML = `
                    <div class="card-img-wrap">
                        <img src="${dest.image}" alt="${dest.alt}" class="card-img">
                    </div>
                    <div class="card-content">
                        <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${dest.location}</div>
                        <h3 class="card-title">${dest.title}</h3>
                        <p class="card-desc">${dest.description}</p>
                        <div class="card-footer">
                            <div class="price">${dest.price} <span>/ person</span></div>
                            <a href="#" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">Details &rarr;</a>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        } catch (error) {
            console.log('Backend server not running, falling back to static HTML cards.');
        }
    }

    // Call the function
    loadDestinations();
});
