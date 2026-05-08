// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

const animRing = () => {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
};
animRing();

document.querySelectorAll('a, button, .tech-card, .project-card, .stat-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
});

// ── PARTICLES ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
resize();
window.addEventListener('resize', resize);

const COLORS = ['rgba(0,245,255,', 'rgba(0,128,255,', 'rgba(0,191,255,'];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * 2000, y: Math.random() * 2000,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  });
}

const drawParticles = () => {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();

    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,245,255,' + (0.06 * (1 - dist/130)) + ')';
        ctx.lineWidth = 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
};
drawParticles();

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
}));

// ── TYPING EFFECT ──
const roles = ['Frontend Developer', 'UI/UX Designer', 'Full Stack Dev', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedRole');

const type = () => {
  const word = roles[ri];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 55 : 90);
};
type();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => bar.classList.add('animate'), 200);
      });
      // Animate counters
      e.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 40);
        const counter = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + (target > 10 ? '+' : '+');
          if (current >= target) clearInterval(counter);
        }, 40);
      });
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Also observe skill fills globally
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => {
          bar.style.transform = `scaleX(${bar.dataset.width})`;
        }, 200);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-container').forEach(el => skillObserver.observe(el));

// ── SEND BUTTON ──
document.getElementById('sendBtn').addEventListener('click', function() {
  this.textContent = '✓ PESAN TERKIRIM!';
  this.style.background = '#22c55e';
  this.style.boxShadow = '0 0 30px rgba(34,197,94,0.4)';
  setTimeout(() => {
    this.textContent = '⟶ KIRIM PESAN';
    this.style.background = '';
    this.style.boxShadow = '';
  }, 3000);
});

// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--cyan)' : '');
});

// 1. Definisikan fungsi inisialisasi ke dalam global window
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'id', // Bahasa asli website Anda (Indonesia)
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
};

// 2. Buat fungsi untuk memuat script Google Translate dari luar secara dinamis
function loadGoogleTranslate() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  
  // Masukkan script ke dalam halaman
  document.body.appendChild(script);
}

// 3. Panggil fungsinya
loadGoogleTranslate();