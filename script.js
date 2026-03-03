// ==============================
// PARTICLE CANVAS
// ==============================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x -= dx * 0.015;
        this.y -= dy * 0.015;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      }
    }
  }

  // Draw hexagon instead of circle
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    
    // Draw hexagon
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = Math.cos(angle) * this.size;
      const py = Math.sin(angle) * this.size;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    
    ctx.strokeStyle = `rgba(99, 102, 241, ${this.opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add subtle fill
    ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity * 0.2})`;
    ctx.fill();
    
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const opacity = (1 - dist / 150) * 0.15;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

initParticles();
animateParticles();
window.addEventListener('resize', initParticles);

// ==============================
// MOUSE PARALLAX FOR BACKGROUND
// ==============================
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (e) => {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateMouseParallax() {
  // Smooth interpolation
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;
  
  // Apply to background elements
  const hexClusters = document.querySelectorAll('.hex-cluster');
  hexClusters.forEach((cluster, i) => {
    const depth = i === 0 ? 20 : 15;
    cluster.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
  });
  
  const orbs = document.querySelectorAll('.bg-gradient-orb');
  orbs.forEach((orb, i) => {
    const depths = [30, 25, 20];
    orb.style.transform = `translate(${mouseX * depths[i]}px, ${mouseY * depths[i]}px)`;
  });
  
  const ripples = document.querySelectorAll('.sound-ripple');
  ripples.forEach((ripple, i) => {
    const depth = 10 + i * 5;
    ripple.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
  });
  
  requestAnimationFrame(animateMouseParallax);
}

animateMouseParallax();

// ==============================
// NAVBAR
// ==============================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Active nav highlight
const sections = document.querySelectorAll('.section, .hero');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 200;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ==============================
// COUNTER ANIMATION
// ==============================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

heroObserver.observe(document.querySelector('.hero-stats'));

// ==============================
// SCROLL ANIMATIONS
// ==============================
const animatedElements = document.querySelectorAll('[data-aos]');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => scrollObserver.observe(el));

// ==============================
// PROFESSIONAL SCROLL-REVEAL
// ==============================

// Tag all reveal targets
(function setupReveal() {
  // Section headers
  document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));

  // Research cards
  document.querySelectorAll('.research-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  // Exploration cards (Emerging Frontiers)
  document.querySelectorAll('.exploration-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  // Live-viz cards
  document.querySelectorAll('.live-viz-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = (i * 0.09) + 's';
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add('reveal-left');
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  // Project blocks
  document.querySelectorAll('.project-block').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.07) + 's';
  });

  // Publication items
  document.querySelectorAll('.pub-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.06) + 's';
  });

  // Article cards
  document.querySelectorAll('.article-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = (i * 0.07) + 's';
  });

  // Skills cards
  document.querySelectorAll('.skill-category').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.09) + 's';
  });

  // Collab banner
  document.querySelectorAll('.collab-banner-modern').forEach(el => el.classList.add('reveal'));

  // Impact / stat cards
  document.querySelectorAll('.impact-card, .rcm-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = (i * 0.08) + 's';
  });
})();

// Single IntersectionObserver for all reveal classes
const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
const revealElements = document.querySelectorAll(revealClasses.join(','));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Section Reveal (legacy — kept for in-view class users)
const allSections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -80px 0px'
});
allSections.forEach(section => sectionObserver.observe(section));

// Staggered Children (legacy)
const staggerContainers = document.querySelectorAll('.research-grid, .skills-grid, .edu-grid, .impact-grid, .pub-stats');
staggerContainers.forEach(container => container.classList.add('stagger-children'));
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

// Hero Parallax on Scroll
const heroText = document.querySelector('.hero-text');
const heroPhoto = document.querySelector('.hero-photo');
const hero = document.querySelector('.hero');

let ticking = false;

function updateHeroParallax() {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;
  
  if (scrollY < heroHeight) {
    const progress = scrollY / heroHeight;
    
    if (heroText) {
      heroText.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroText.style.opacity = 1 - progress * 1.2;
    }
    if (heroPhoto) {
      heroPhoto.style.transform = `translateY(${scrollY * 0.15}px) scale(${1 - progress * 0.1})`;
      heroPhoto.style.opacity = 1 - progress * 0.8;
    }
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateHeroParallax);
    ticking = true;
  }
});

// ==============================
// DYNAMIC BACKGROUND PARALLAX
// ==============================
const bgDecoration = document.querySelector('.bg-decoration');
const hexClusters = document.querySelectorAll('.hex-cluster');
const soundWaves = document.querySelectorAll('.bg-soundwaves');
const soundRipples = document.querySelectorAll('.sound-ripple');
const bgOrbs = document.querySelectorAll('.bg-gradient-orb');

function updateBackgroundParallax() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollProgress = scrollY / (docHeight - windowHeight);
  
  // Move hexagon clusters at different speeds
  hexClusters.forEach((cluster, i) => {
    const speed = i === 0 ? 0.05 : 0.03;
    const rotateSpeed = i === 0 ? 15 : -10;
    cluster.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02 + rotateSpeed}deg)`;
  });
  
  // Sound waves parallax
  soundWaves.forEach((wave, i) => {
    const direction = i === 0 ? 1 : -1;
    wave.style.transform = `translateY(${scrollY * 0.08 * direction}px)${i === 1 ? ' scaleX(-1)' : ''}`;
  });
  
  // Orbs subtle movement
  bgOrbs.forEach((orb, i) => {
    const speeds = [0.02, -0.03, 0.025];
    orb.style.transform = `translateY(${scrollY * speeds[i]}px)`;
  });
}

let bgTicking = false;
window.addEventListener('scroll', () => {
  if (!bgTicking) {
    requestAnimationFrame(() => {
      updateBackgroundParallax();
      bgTicking = false;
    });
    bgTicking = true;
  }
});

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.classList.add('scroll-progress');
document.body.appendChild(progressBar);

function updateScrollProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (window.scrollY / scrollHeight) * 100;
  progressBar.style.width = `${scrollProgress}%`;
}

window.addEventListener('scroll', updateScrollProgress);

// Magnetic Button Effect
document.querySelectorAll('.btn').forEach(btn => {
  btn.classList.add('magnetic');
  
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// Card Tilt Effect
document.querySelectorAll('.research-card, .skill-category, .edu-card, .article-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

// Smooth Scroll with Easing
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
      smoothScrollTo(targetPosition, 1000);
    }
  });
});

function smoothScrollTo(target, duration) {
  const start = window.scrollY;
  const distance = target - start;
  const startTime = performance.now();
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    
    window.scrollTo(0, start + distance * eased);
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// Counter Animation with Easing (Enhanced)
function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = Math.floor(start + (end - start) * eased);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Text Reveal Animation
document.querySelectorAll('.section-header h2').forEach(heading => {
  const text = heading.innerHTML;
  heading.innerHTML = `<span class="text-reveal-wrapper"><span>${text}</span></span>`;
  heading.classList.add('text-reveal');
});

const textRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.text-reveal').forEach(el => textRevealObserver.observe(el));

// Blur Reveal for Images
document.querySelectorAll('.proj-img img, .gallery-item img, .hero-photo img').forEach(img => {
  img.classList.add('blur-reveal');
});

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.blur-reveal').forEach(el => imageObserver.observe(el));

// ==============================
// PULSEFIT-STYLE PHOTO CAROUSELS
// ==============================

function buildCarousel(trackId, items, cardClass = '') {
  const track = document.getElementById(trackId);
  if (!track) return;
  // Duplicate for seamless infinite loop (same as pulsefit-hero technique)
  const allItems = [...items, ...items];
  track.innerHTML = allItems.map(item => `
    <div class="photo-card ${cardClass}">
      <img src="${item.src}" alt="${item.label}" loading="lazy" />
      <div class="photo-card-overlay"></div>
      <div class="photo-card-label">${item.label}</div>
    </div>
  `).join('');
}

// ── Carousel data ──────────────────────────────────────────────────────────
const TEAM_ITEMS = [
  { src: '1.jpg',  label: 'Presentation' },
  { src: '2.jpg',  label: 'Conference Talk' },
  { src: '3.jpg',  label: 'Team Meeting' },
  { src: 'ThesisSnap.jpg', label: 'PhD Defense' },
  { src: 'Untitled_Project_12.png', label: 'Research Lab' },
  { src: 'Untitled_Project_5.png', label: 'Collaboration' },
];

const TAMS_ITEMS = [
  { src: 'Themaocosutic_Liner_V5.png', label: 'Thermoacoustic Liner' },
  { src: 'Tams_Barriere.png', label: 'TAMS Barrier' },
  { src: 'Tams_Barrierer_Unit_Cell.png', label: 'TAMS Unit Cell' },
  { src: 'V2HelicalResonator_100_ISSOMERIC_Transparents_Sectional.PNG', label: 'Helical Resonator' },
  { src: 'MetaWallAssembly_Isometric_V6_WhiteFebric_V3_Transparent_V2.png', label: 'Meta Wall Assembly' },
  { src: 'SpiralStack_2Turns_v4_Slice_ZOOMED.png', label: 'Spiral Stack Detail' },
  { src: 'Stack_GeometryComparison_Font.png_Trimetric.png', label: 'Stack Geometry Comparison' },
];

// Combined showcase for hero section (mix of TAMS and team)
const SHOWCASE_ITEMS = [
  { src: 'Themaocosutic_Liner_V5.png', label: 'Thermoacoustic Liner' },
  { src: '1.jpg', label: 'Research Presentation' },
  { src: 'Tams_Barriere.png', label: 'TAMS Barrier' },
  { src: '2.jpg', label: 'Conference Talk' },
  { src: 'MetaWallAssembly_Isometric_V6_WhiteFebric_V3_Transparent_V2.png', label: 'Meta Wall Assembly' },
  { src: '3.jpg', label: 'Team Meeting' },
  { src: 'V2HelicalResonator_100_ISSOMERIC_Transparents_Sectional.PNG', label: 'Helical Resonator' },
  { src: 'ThesisSnap.jpg', label: 'PhD Defense' },
  { src: 'SpiralStack_2Turns_v4_Slice_ZOOMED.png', label: 'Spiral Stack Detail' },
];

// Build carousels as soon as DOM is ready (safe for both inline and deferred)
function initCarousels() {
  buildCarousel('teamTrack',  TEAM_ITEMS);
  buildCarousel('tamsTrack',  TAMS_ITEMS, 'photo-card-sq');
  buildCarousel('showcaseTrack', SHOWCASE_ITEMS);  // Hero showcase carousel
  // also build on sub-pages if those tracks exist
  buildCarousel('teamTrack2', TEAM_ITEMS);
  buildCarousel('tamsTrack2', TAMS_ITEMS, 'photo-card-sq');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}

// ==============================
// CONTACT FORM
// ==============================
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span>Message Sent!</span>';
  btn.style.background = 'var(--accent)';

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});
