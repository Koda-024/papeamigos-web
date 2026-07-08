const WHATSAPP_NUMBER = "525531185995";
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const leadForm = document.querySelector("[data-lead-form]");
function wa(message) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }
if (whatsappLink) { whatsappLink.href = wa("Hola, contacto desde la web de Papeamigos. Quiero asistencia o más información del sistema."); whatsappLink.target = "_blank"; whatsappLink.rel = "noopener"; }
if (menuToggle && nav) menuToggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); menuToggle.setAttribute("aria-expanded", String(open)); });
if (leadForm) leadForm.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(leadForm); const msg = [`Hola, contacto desde la web de Papeamigos. Quiero asistencia o más información del sistema.`, `Nombre: ${data.get("nombre") || ""}`, `Email: ${data.get("email") || ""}`, `Celular: ${data.get("telefono") || ""}`, `Estado: ${data.get("estado") || ""}`, `Comentarios: ${data.get("comentarios") || ""}`].join("\n"); window.location.href = wa(msg); });







const closeRegister = document.querySelector('[data-close-register]');
if (closeRegister) closeRegister.addEventListener('click', () => { window.close(); setTimeout(() => { window.location.href = '../'; }, 150); });


document.querySelectorAll('.section, .benefit-band, .hero').forEach(el => el.classList.add('reveal'));
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: .14 });
revealItems.forEach(el => revealObserver.observe(el));
if (nav && menuToggle) nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dotsWrap = carousel.querySelector('[data-carousel-dots]');
  let currentSlide = 0;
  let carouselTimer;
  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ver banner ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsWrap.appendChild(dot);
    return dot;
  });
  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === currentSlide));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === currentSlide));
    restartCarousel();
  }
  function nextSlide() { showSlide(currentSlide + 1); }
  function restartCarousel() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextSlide, 6000);
  }
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => showSlide(currentSlide - 1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => showSlide(currentSlide + 1));
  carousel.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  carousel.addEventListener('mouseleave', restartCarousel);
  showSlide(0);
}
