const WHATSAPP_NUMBER = "525531185995";
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const leadForm = document.querySelector("[data-lead-form]");
function wa(message) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }
if (whatsappLink) { whatsappLink.href = wa("Hola, contacto desde la web de Papeamigos. Quiero asistencia o más información del sistema."); whatsappLink.target = "_blank"; whatsappLink.rel = "noopener"; }
if (menuToggle && nav) menuToggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); menuToggle.setAttribute("aria-expanded", String(open)); });
if (leadForm) leadForm.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(leadForm); const msg = [`Hola, contacto desde la web de Papeamigos. Quiero asistencia o más información del sistema.`, `Nombre: ${data.get("nombre") || ""}`, `Email: ${data.get("email") || ""}`, `Celular: ${data.get("telefono") || ""}`, `Estado: ${data.get("estado") || ""}`, `Comentarios: ${data.get("comentarios") || ""}`].join("\n"); window.location.href = wa(msg); });






