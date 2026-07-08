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
const slider = document.querySelector('[data-slider]');
if (slider) {
  const slides = Array.from(slider.querySelectorAll('.slider-slide'));
  const dotsWrap = slider.querySelector('[data-slider-dots]');
  let current = 0;
  let timer;
  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ver banner ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dotsWrap.appendChild(dot);
    return dot;
  });
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 6000);
  }
  slider.querySelector('[data-slider-prev]').addEventListener('click', () => show(current - 1));
  slider.querySelector('[data-slider-next]').addEventListener('click', () => show(current + 1));
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', () => show(current));
  show(0);
}

