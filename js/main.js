/**
 * SMALL GEAR AI AGENCY - INTERACTIVE ENGINE & ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollReveal();
  initNumberCounters();
  initSplineAmbientParticles();
  initVerticalTimeline();
});

/**
 * Vertical Timeline Scroll Progress and Activation Engine
 */
function initVerticalTimeline() {
  const container = document.querySelector('.process-container');
  if (!container) return;

  const progress = document.querySelector('.timeline-progress');
  const steps = document.querySelectorAll('.timeline-step');

  function updateTimeline() {
    const containerRect = container.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.65; // Trigger line is 65% down the viewport

    // Calculate container scale relative to the trigger point
    const containerHeight = container.clientHeight;
    const scrollOffset = triggerPoint - containerRect.top;

    let percent = 0;
    if (scrollOffset > 0) {
      percent = Math.min((scrollOffset / containerHeight) * 100, 100);
    }

    progress.style.height = `${percent}%`;

    // Activate/deactivate steps based on whether they've crossed the trigger line
    steps.forEach(step => {
      const stepRect = step.getBoundingClientRect();
      if (stepRect.top < triggerPoint) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // Register listeners
  window.addEventListener('scroll', updateTimeline);
  window.addEventListener('resize', updateTimeline);
  
  // Initial run
  updateTimeline();
}

/**
 * Navbar blur and background change on scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Scroll Reveal using Intersection Observer
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Un-observe once revealed for performance
        observer.unobserve(entry.target);
      }
    });
  };

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  reveals.forEach(el => observer.observe(el));
}

/**
 * Dynamic Number Counting Animation on Scroll
 */
function initNumberCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const targetText = element.getAttribute('data-target') || '100';
    // Extract numerical prefix and string suffix (like "+", "x", "%")
    const numPart = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    const suffix = targetText.replace(/[0-9.]/g, '');
    
    let startTime = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing curve (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * numPart);
      
      element.innerText = currentVal + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = targetText; // Ensure exact final string
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterElements.forEach(el => observer.observe(el));
}

/**
 * Ambient Particle Matrix for Spline 3D Placeholder Area
 * Creates subtle futuristic light connections behind where the Spline model will live.
 */
function initSplineAmbientParticles() {
  const canvas = document.getElementById('spline-canvas-placeholder');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  
  let width = parent.clientWidth;
  let height = parent.clientHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = [];
  const particleCount = 45;

  const colors = ['#00F2FE', '#9D4EDD', '#00FFFF', '#FF007F'];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect adjacent particles with glowing lines
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const strokeAlpha = (1 - dist / 140) * 0.25;
          ctx.strokeStyle = '#00F2FE';
          ctx.globalAlpha = strokeAlpha;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Handle responsive resizing
  window.addEventListener('resize', () => {
    width = parent.clientWidth;
    height = parent.clientHeight;
    canvas.width = width;
    canvas.height = height;
  });
}
