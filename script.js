
document.addEventListener("DOMContentLoaded", () => {
const loader = document.getElementById("loader");
const progressBar = document.querySelector(".loader-progress");
const track = document.querySelector('.testimonial-track');
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.querySelector('.testimonial-dots');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentSlide = 0;
let autoSlideInterval;
// Animate bar to 100% using GSAP for smooth fill
gsap.to(progressBar, {
  width: "100%",
  duration: 2.5, // bar fill time
  ease: "power2.inOut",
  onComplete: () => {
    // Only hide loader AFTER bar is full
    setTimeout(() => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          loader.style.display = "none";
          startTypewriter(); // start typing after loader gone
        }
      });
    }, 300);
  }
});

/* ===== CONTINUOUS TYPEWRITER ===== */
function startTypewriter() {
  const typewriterEl = document.querySelector(".typewriter");
  if(!typewriterEl) return;

  // Add your lines here - it will cycle forever
  const texts = [
    "I'M Paul Odugbemi", // your name
    "I'M A Revenue-Driven Developer", // your heading
    "Let's Build Something Great" // another line
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  function type() {
    const currentText = texts[textIndex];

    if(isDeleting) {
      typewriterEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting? deletingSpeed : typingSpeed;

    // Finished typing current text
    if(!isDeleting && charIndex === currentText.length) {
      speed = pauseTime;
      isDeleting = true;
    }
    // Finished deleting
    else if(isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length; // loop to next text
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}
  /* ===== THEME TOGGLE ===== */
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  // Load saved theme
  if(localStorage.getItem("theme") === "light") {
    body.classList.add("light");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");
    const isLight = body.classList.contains("light");
    themeToggle.innerHTML = isLight? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("theme", isLight? "light" : "dark");
  });

  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active")? "hidden" : "auto";
  });

  document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if(target) target.scrollIntoView({behavior: "smooth", block: "start"});
    });
  });

  /* ===== PROJECT MODALS ===== */
  
  const projectCards = document.querySelectorAll(".project-card");
  const modals = document.querySelectorAll(".project-modal");
  const closeBtns = document.querySelectorAll(".close-modal");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if(modal){
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        // Reset slider to first image
        modal.querySelectorAll(".slide").forEach((s,i) => s.classList.toggle("active", i===0));
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".project-modal").classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  modals.forEach(modal => {
    modal.addEventListener("click", e => {
      if(e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  });

  // Slider
  modals.forEach(modal => {
    let slideIndex = 0;
    const slides = modal.querySelectorAll(".slide");
    const nextBtn = modal.querySelector(".next");
    const prevBtn = modal.querySelector(".prev");
    if(!nextBtn || slides.length <= 1) return;

    const showSlide = n => {
      slides.forEach(s => s.classList.remove("active"));
      slideIndex = (n + slides.length) % slides.length;
      slides[slideIndex].classList.add("active");
    }
    nextBtn.onclick = () => showSlide(slideIndex + 1);
    prevBtn.onclick = () => showSlide(slideIndex - 1);
  });


  /* ===== MAGNETIC BUTTONS ===== */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      btn.style.transform = `translate(${x*0.15}px, ${y*0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });

  /* ===== GSAP SCROLL ANIMATIONS ===== */
  gsap.registerPlugin(ScrollTrigger);

  // Hero text animation
  gsap.from(".hero-content h1", {
    y: 100, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.5
  });
  gsap.from(".hero-content p", {
    y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.8, stagger: 0.2
  });
  gsap.from(".hero-buttons", {
    y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 1.2
  });

  // Section animations
  gsap.utils.toArray("section h2").forEach(h2 => {
    gsap.from(h2, {
      scrollTrigger: {trigger: h2, start: "top 85%"},
      y: 60, opacity: 0, duration: 1, ease: "power3.out"
    });
  });

  // Card stagger animations
  gsap.utils.toArray(".service-card,.project-card,.skill-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {trigger: card, start: "top 90%"},
      y: 80, opacity: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out"
    });
  });

  /* ===== THREE.JS 3D SCENE ===== */
  let scene, camera, renderer, mesh;

  function init3D() {
    const container = document.getElementById("canvas-container");
    if(!container) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Neon icosahedron - looks cool and lightweight
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);

      if(mesh) {
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        mesh.rotation.x += mouseY * 0.0005;
        mesh.rotation.y += mouseX * 0.0005;
      }

      if(particlesMesh) {
        particlesMesh.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  init3D();

  /* ===== NAVBAR SCROLL EFFECT ===== */
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if(window.scrollY > 50) {
      nav.style.background = 'var(--glass)';
      nav.style.boxShadow = '0 10px 40px rgba(0,0,0,.4)';
    } else {
      nav.style.boxShadow = '0 8px 32px rgba(0,0,0,.3)';
    }
  });

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  if(i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  currentSlide = n;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % cards.length;
  goToSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + cards.length) % cards.length;
  goToSlide(currentSlide);
}

// Arrow clicks
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

// Auto slide every 6 seconds
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 6000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

startAutoSlide();

// Pause on hover
const slider = document.querySelector('.testimonial-slider');
slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
slider.addEventListener('mouseleave', startAutoSlide);
});
// Testimonial Slider


// Create dots
