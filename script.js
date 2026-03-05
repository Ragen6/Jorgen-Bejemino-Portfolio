// ========================================
// RETRO 8-BIT PORTFOLIO JAVASCRIPT
// ========================================

// Navbar Toggle Functionality
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

// Close menu when a link is clicked
const navbarLinks = document.querySelectorAll(".navbar-menu li a");
navbarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbarToggle.classList.remove("active");
    navbarMenu.classList.remove("active");
  });
});

// Change navbar theme when section changes and darken on scroll
const navbar = document.querySelector('.navbar');

// helper: switch navbar theme based on section id or data-nav
function setNavTheme(id) {
  navbar.classList.remove('navbar-home','navbar-about','navbar-projects','navbar-contact');
  if (id) navbar.classList.add(`navbar-${id}`);
}

// observe which section/header is prominently visible
const pageSections = document.querySelectorAll('[id]'); // including header and sections
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const theme = entry.target.dataset.nav || entry.target.id;
      setNavTheme(theme);
    }
  });
}, { threshold: 0.5 });
pageSections.forEach(el => sectionObserver.observe(el));

// ensure home theme when scrolled to very top (observer may miss tiny offsets)
window.addEventListener('scroll', () => {
  if (window.scrollY < 50) {
    setNavTheme('home');
  }
});

// projects carousel controls
const carouselGrid = document.querySelector('.projects-carousel .projects-grid');
if (carouselGrid) {
  const prevBtn = document.querySelector('.projects-carousel .carousel-btn.prev');
  const nextBtn = document.querySelector('.projects-carousel .carousel-btn.next');
  const dotsContainer = document.querySelector('.projects-carousel + .carousel-dots');
  let isMoving = false;
  let currentIndex = 0;           // track which card is currently visible

  // prepare dots
  let dots = [];
  if (dotsContainer) {
    const count = carouselGrid.children.length;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function updateDots() {
    if (dots.length === 0) return;
    dots.forEach(d => d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function goTo(targetIndex) {
    if (isMoving || targetIndex === currentIndex) return;
    const count = carouselGrid.children.length;
    const forwardSteps = (targetIndex - currentIndex + count) % count;
    const backwardSteps = (currentIndex - targetIndex + count) % count;
    if (forwardSteps <= backwardSteps) {
      slideNext(() => goTo(targetIndex));
    } else {
      slidePrev(() => goTo(targetIndex));
    }
  }

  function slideNext(callback) {
    if (isMoving) return;
    isMoving = true;
    carouselGrid.style.transition = 'transform 0.3s ease';
    carouselGrid.style.transform = 'translateX(-100%)';
    carouselGrid.addEventListener('transitionend', function handler() {
      carouselGrid.style.transition = 'none';
      carouselGrid.style.transform = 'none';
      carouselGrid.appendChild(carouselGrid.firstElementChild);
      currentIndex = (currentIndex + 1) % carouselGrid.children.length;
      isMoving = false;
      updateDots();
      carouselGrid.removeEventListener('transitionend', handler);
      if (callback) callback();
    });
  }

  function slidePrev(callback) {
    if (isMoving) return;
    isMoving = true;
    carouselGrid.insertBefore(carouselGrid.lastElementChild, carouselGrid.firstElementChild);
    carouselGrid.style.transition = 'none';
    carouselGrid.style.transform = 'translateX(-100%)';
    requestAnimationFrame(() => {
      carouselGrid.style.transition = 'transform 0.1s ease';
      carouselGrid.style.transform = 'translateX(0)';
    });
    carouselGrid.addEventListener('transitionend', function handler() {
      carouselGrid.style.transition = 'none';
      carouselGrid.style.transform = 'none';
      currentIndex = (currentIndex - 1 + carouselGrid.children.length) % carouselGrid.children.length;
      isMoving = false;
      updateDots();
      carouselGrid.removeEventListener('transitionend', handler);
      if (callback) callback();
    });
  }

  nextBtn.addEventListener('click', () => slideNext());
  prevBtn.addEventListener('click', () => slidePrev());
}


// additional scroll listener just for darkening effect
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Form Submission Handling (Web3Forms)
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    // Web3Forms handles the submission automatically
    // This is just for additional feedback if needed
    const submitBtn = contactForm.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "SENDING...";
    submitBtn.disabled = true;

    // Wait a bit for visual feedback
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// Add animation to project cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px 0px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe project cards and other elements
document.querySelectorAll(".project-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Parallax effect for header
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (header) {
    const scrolled = window.pageYOffset;
    header.style.backgroundPosition = `center ${scrolled * 0.5}px`;
  }
});

// Add retro cursor effect (optional)
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Create subtle glow effect at cursor on buttons
  const buttons = document.querySelectorAll(".btn-retro, .btn-submit");
  buttons.forEach((btn) => {
    const rect = btn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    const distance = Math.hypot(mouseX - btnX, mouseY - btnY);

    if (distance < 200) {
      btn.style.boxShadow = `
        0 0 ${30 + (200 - distance) / 10}px rgba(255, 0, 110, ${0.8 + (200 - distance) / 500}),
        0 0 ${20 + (200 - distance) / 15}px rgba(131, 56, 236, ${0.6 + (200 - distance) / 500})
      `;
    }
  });
});

// Pixel art animation for skills
const skillBoxes = document.querySelectorAll(".skill-box");
skillBoxes.forEach((box, index) => {
  box.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`;
});

// Add CSS animation dynamically
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Typing effect for section titles (optional enhancement)
function typeWriter(element, text, speed = 50) {
  let index = 0;
  element.textContent = "";

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  // Only activate if element is in viewport
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && element.textContent === "") {
      type();
      observer.unobserve(element);
    }
  });

  observer.observe(element);
}

// Confirmation dialog for social links
function confirmRedirect(event, platform) {
  event.preventDefault();
  const userConfirm = confirm(`You are about to visit our ${platform} page. Continue?`);
  if (userConfirm) {
    window.open(event.target.href, '_blank');
  }
}

// Resume Modal Functions
function openResumeModal() {
  try {
    const modal = document.getElementById('resumeModal');
    
    if (!modal) {
      console.error('❌ CRITICAL: resumeModal element not found in DOM!');
      alert('Error: Resume modal not found. Please refresh the page.');
      return;
    }
    
    modal.classList.add('active');
    console.log('✅ Resume modal opened successfully');
    
    // Verify the class was added
    if (modal.classList.contains('active')) {
      console.log('✅ Active class successfully added to modal');
    } else {
      console.error('❌ Active class failed to add!');
    }
    
  } catch (error) {
    console.error('❌ Error in openResumeModal:', error);
  }
}

function closeResumeModal() {
  try {
    const modal = document.getElementById('resumeModal');
    
    if (!modal) {
      console.error('❌ resumeModal element not found');
      return;
    }
    
    modal.classList.remove('active');
    console.log('✅ Resume modal closed');
    
  } catch (error) {
    console.error('❌ Error in closeResumeModal:', error);
  }
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  try {
    const modal = document.getElementById('resumeModal');
    if (modal && event.target === modal) {
      closeResumeModal();
    }
  } catch (error) {
    console.error('❌ Error in window.onclick:', error);
  }
};


// wire up modal triggers specific to pixel-frame-large/resume button
function initializeResumeModalTriggers() {
  try {
    const triggers = document.querySelectorAll('.pixel-frame-large.resume-trigger');
    triggers.forEach(el => {
      el.addEventListener('click', openResumeModal);
      // also make the image itself clickable like in verification.html
      const img = el.querySelector('img');
      if (img) img.addEventListener('click', openResumeModal);
    });

    const resumeBtn = document.getElementById('resumeButton');
    if (resumeBtn) {
      // if you want the button to open the modal as well, keep this listener;
      // remove if you really want *only* the pixel frame to do it.
      resumeBtn.addEventListener('click', openResumeModal);
    }

    console.log('✅ Resume modal triggers initialized:', triggers.length, 'frames');
  } catch (err) {
    console.error('❌ Failed to initialize resume modal triggers', err);
  }
}

initializeResumeModalTriggers();

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  try {
    if (event.key === 'Escape') {
      closeResumeModal();
    }
  } catch (error) {
    console.error('❌ Error in keydown listener:', error);
  }
});

// Check modal exists on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Page loaded, checking for modal...');
  const modal = document.getElementById('resumeModal');
  if (modal) {
    console.log('✅ Resume modal element found');
  } else {
    console.error('❌ WARNING: Resume modal element NOT FOUND');
  }
});

// Initialize any additional features
console.log("🎮 Retro 8-Bit Portfolio Loaded! 🎮");
