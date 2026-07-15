const WHATSAPP_NUMBER = "525531185995";
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link], [data-footer-whatsapp], [data-whatsapp-contact], [data-modal-whatsapp]");
const WHATSAPP_MESSAGE = "Hola, escribo desde la página web PapeAmigos:\nhttps://papeamigos-web.vercel.app/";
const leadForm = document.querySelector("[data-lead-form]");
function wa(message) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }
whatsappLinks.forEach((link) => { link.href = wa(WHATSAPP_MESSAGE); link.target = "_blank"; link.rel = "noopener"; });
if (menuToggle && nav) menuToggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); menuToggle.setAttribute("aria-expanded", String(open)); });
function resetRegistrationForm() {
  if (leadForm) leadForm.reset();
  const status = leadForm?.querySelector("[data-registration-status]");
  if (status) status.textContent = "";
}

function closeRegistrationResult() {
  const panel = document.querySelector("[data-registration-result]");
  if (panel) {
    panel.hidden = true;
    panel.classList.remove("is-opening");
  }
  resetRegistrationForm();
}

window.addEventListener("pagehide", resetRegistrationForm);
window.addEventListener("beforeunload", resetRegistrationForm);
function buildWelcomeMessage({ usuario, contrasena, concepto }) {
  const paymentLine = concepto ? `Al transferir, pon en concepto:\n${concepto}` : "Antes de transferir, confirma el concepto o referencia de activación.";
  return `Cuenta creada exitosamente

Ingresa a:
https://papeamigos.com/

Usuario: ${usuario}
Contraseña: ${contrasena}

Guarda estos datos en un lugar seguro.

Si tienes dudas, escríbenos por WhatsApp:
55 3118 5995

${paymentLine}`;
}

function showRegistrationResult({ exito, usuario, contrasena, concepto }) {
  const panel = document.querySelector("[data-registration-result]");
  const userBox = document.querySelector("[data-result-user]");
  const passBox = document.querySelector("[data-result-pass]");
  const copyButton = document.querySelector("[data-copy-result]");
  const acceptButton = document.querySelector("[data-accept-result]");
  const closeButton = document.querySelector("[data-close-result]");
  const message = buildWelcomeMessage({ usuario, contrasena, concepto });

  if (!panel || !userBox || !passBox) {
    window.alert(message);
    return;
  }

  userBox.textContent = usuario;
  passBox.textContent = contrasena;
  panel.hidden = false;
  panel.classList.remove("is-opening");
  void panel.offsetWidth;
  panel.classList.add("is-opening");

  if (copyButton) {
    copyButton.onclick = async () => {
      await navigator.clipboard.writeText(message);
      copyButton.textContent = "Copiado";
      setTimeout(() => { copyButton.textContent = "Copiar"; }, 1800);
    };
  }

  if (acceptButton) {
    acceptButton.onclick = () => { window.open("https://papeamigos.com/", "_blank", "noopener"); closeRegistrationResult(); };
    acceptButton.focus();
  }

  if (closeButton) closeButton.onclick = closeRegistrationResult;
}
if (leadForm) leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;

  const data = new FormData(leadForm);
  const payload = {
    nombre: String(data.get("nombre") || "").trim(),
    correo: String(data.get("correo") || data.get("email") || "").trim(),
    telefono: String(data.get("telefono") || "").trim(),
    estado: String(data.get("estado") || "").trim()
  };
  const apiEndpoint = leadForm.dataset.apiEndpoint || document.querySelector('meta[name="registration-api"]')?.content || "/api/registro";
  const submitButton = leadForm.querySelector('[type="submit"]');
  const status = leadForm.querySelector("[data-registration-status]");
  const originalLabel = submitButton?.textContent || "Enviar Datos";

  if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Creando cuenta..."; }
  if (status) status.textContent = "Procesando registro...";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.error) throw new Error(result.error || `Error del servidor (${response.status})`);
    if (!result.exito || !result.usuario || !result.contrasena) throw new Error("Respuesta incompleta del servidor");
    if (status) status.textContent = "Cuenta creada correctamente.";
    showRegistrationResult(result);
  } catch (error) {
    if (status) status.textContent = error.message || "No se pudo procesar el registro.";
    window.alert(error.message || "No se pudo procesar el registro.");
  } finally {
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalLabel; }
  }
});

const closeRegister = document.querySelector('[data-close-register]');
if (closeRegister) closeRegister.addEventListener('click', () => { window.close(); setTimeout(() => { window.location.href = '../'; }, 150); });


document.querySelectorAll('.section, .benefit-band, .hero').forEach(el => el.classList.add('reveal'));
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: .14 });
revealItems.forEach(el => revealObserver.observe(el));
if (nav && menuToggle) nav.querySelectorAll('a, [data-home-link]').forEach(link => link.addEventListener('click', () => { nav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
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
    timer = setInterval(() => show(current + 1), 3000);
  }
  slider.querySelector('[data-slider-prev]').addEventListener('click', () => show(current - 1));
  slider.querySelector('[data-slider-next]').addEventListener('click', () => show(current + 1));
  show(0);
}


const logoMarquee = document.querySelector('.logo-marquee');
if (logoMarquee) {
  const track = logoMarquee.querySelector('.logo-track');
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  const halfWidth = () => track.scrollWidth / 2;
  const wrap = () => {
    const half = halfWidth();
    if (half <= 0) return;
    if (logoMarquee.scrollLeft >= half) logoMarquee.scrollLeft -= half;
    if (logoMarquee.scrollLeft < 0) logoMarquee.scrollLeft += half;
  };
  const move = () => {
    if (!dragging) {
      logoMarquee.scrollLeft += 0.45;
      wrap();
    }
    requestAnimationFrame(move);
  };
  logoMarquee.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startScroll = logoMarquee.scrollLeft;
    logoMarquee.classList.add('is-dragging');
    logoMarquee.setPointerCapture(event.pointerId);
  });
  logoMarquee.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    logoMarquee.scrollLeft = startScroll - (event.clientX - startX);
    wrap();
  });
  ['pointerup', 'pointercancel'].forEach(type => logoMarquee.addEventListener(type, () => {
    dragging = false;
    logoMarquee.classList.remove('is-dragging');
  }));
  requestAnimationFrame(move);
}


const homeLink = document.querySelector('[data-home-link]');
if (homeLink) homeLink.addEventListener('click', () => { history.replaceState(null, '', location.pathname + location.search); window.scrollTo({ top: 0, behavior: 'smooth' }); });
const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
if (dropdownToggle) dropdownToggle.addEventListener('click', (event) => { event.preventDefault(); const box = dropdownToggle.closest('.nav-dropdown'); const open = box.classList.toggle('is-open'); dropdownToggle.setAttribute('aria-expanded', String(open)); });
document.addEventListener('click', (event) => { const box = document.querySelector('.nav-dropdown'); if (box && !box.contains(event.target)) { box.classList.remove('is-open'); const btn = box.querySelector('[data-dropdown-toggle]'); if (btn) btn.setAttribute('aria-expanded', 'false'); } });


// Internal links without hash in the URL.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', location.pathname + location.search);
  });
});





