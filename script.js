const WHATSAPP_NUMBER = "525531185995";
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link], [data-footer-whatsapp], [data-whatsapp-contact]");
const WHATSAPP_MESSAGE = "Hola, escribo desde la página web PapeAmigos:\nhttps://papeamigos-web.vercel.app/";
const leadForm = document.querySelector("[data-lead-form]");
function wa(message) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }
whatsappLinks.forEach((link) => { link.href = wa(WHATSAPP_MESSAGE); link.target = "_blank"; link.rel = "noopener"; });
if (menuToggle && nav) menuToggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); menuToggle.setAttribute("aria-expanded", String(open)); });
const encodeXml = (value) => String(value || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

function xmlValue(documentNode, name) {
  return Array.from(documentNode.getElementsByTagName("*")).find((node) => node.localName === name)?.textContent || "";
}

if (leadForm) leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;

  const data = new FormData(leadForm);
  const nombre = String(data.get("nombre") || "").trim();
  const correo = String(data.get("correo") || data.get("email") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  const estado = String(data.get("estado") || "").trim();
  const comentarios = String(data.get("comentarios") || "").trim();
  const csrfToken = String(data.get("csrfTokenReg") || document.querySelector('meta[name="csrf-token"]')?.content || "").trim();
  const apiEndpoint = leadForm.dataset.apiEndpoint || document.querySelector('meta[name="registration-api"]')?.content || "";
  const message = [
    "Hola, escribo desde la página web PapeAmigos: https://papeamigos-web.vercel.app/",
    `Nombre: ${nombre}`,
    `Email: ${correo}`,
    `Celular: ${telefono}`,
    `Estado: ${estado}`,
    `Comentarios: ${comentarios}`
  ].join("\n");

  // En Vercel no existe sesión PHP; se conserva el envío por WhatsApp.
  if (!apiEndpoint || !csrfToken) {
    window.location.href = wa(message);
    return;
  }

  const submitButton = leadForm.querySelector('[type="submit"]');
  const status = leadForm.querySelector("[data-registration-status]");
  const originalLabel = submitButton?.textContent || "Enviar Datos";
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Creando cuenta..."; }
  if (status) status.textContent = "Procesando registro...";

  const soapBody = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Body>
        <gestionarPDV xmlns="/api">
          <xml><![CDATA[
            <PDV>
              <Accion>alta</Accion>
              <Tipo>3</Tipo>
              <Nombre>${encodeXml(nombre)}</Nombre>
              <Correo>${encodeXml(correo)}</Correo>
              <Telefono>${encodeXml(telefono)}</Telefono>
              <Estado>${encodeXml(estado)}</Estado>
              <CsrfToken>${encodeXml(csrfToken)}</CsrfToken>
            </PDV>
          ]]></xml>
        </gestionarPDV>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      credentials: "same-origin",
      body: soapBody
    });
    if (!response.ok) throw new Error(`Error del servidor (${response.status})`);

    const parser = new DOMParser();
    const soapDocument = parser.parseFromString(await response.text(), "application/xml");
    const returnText = xmlValue(soapDocument, "return");
    if (!returnText) throw new Error("Respuesta inválida del servidor");

    const resultDocument = parser.parseFromString(returnText, "application/xml");
    const apiError = xmlValue(resultDocument, "Error");
    if (apiError) throw new Error(apiError);

    const success = xmlValue(resultDocument, "Exito");
    const usuario = xmlValue(resultDocument, "Usuario");
    const contrasena = xmlValue(resultDocument, "Contrasena");
    if (!success || !usuario || !contrasena) throw new Error("Respuesta incompleta del servidor");

    window.alert(`${success}\n\nUsuario: ${usuario}\nContraseña: ${contrasena}`);
    const params = new URLSearchParams({ usuario, contrasena, bienvenido: "1" });
    window.location.href = `/?${params.toString()}`;
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

