const PAPEAMIGOS_HOME = "https://papeamigos.com/inicio.php";
const PAPEAMIGOS_API = "https://papeamigos.com/api/index.php";

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function xmlValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function htmlDecode(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function getToken(html) {
  const match = html.match(/(?:id|name)=["']csrfTokenReg["'][^>]*value=["']([^"']+)["']/i);
  return match ? match[1] : "";
}

function getCookieHeader(headers) {
  const raw = headers.getSetCookie ? headers.getSetCookie() : (headers.get("set-cookie") ? [headers.get("set-cookie")] : []);
  return raw.map((cookie) => cookie.split(";")[0]).join("; ");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo no permitido" });
  }

  try {
    const { nombre, correo, telefono, estado } = req.body || {};
    if (!nombre || !correo || !telefono || !estado) {
      return res.status(400).json({ error: "Completa todos los campos." });
    }
    if (!/^\d{10}$/.test(String(telefono))) {
      return res.status(400).json({ error: "El celular debe tener 10 digitos." });
    }

    const homeResponse = await fetch(PAPEAMIGOS_HOME, { method: "GET" });
    const homeHtml = await homeResponse.text();
    const csrfToken = getToken(homeHtml);
    const cookieHeader = getCookieHeader(homeResponse.headers);

    if (!csrfToken || !cookieHeader) {
      return res.status(502).json({ error: "No se pudo iniciar sesion de registro." });
    }

    const soapBody = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body><gestionarPDV xmlns="/api"><xml><![CDATA[<PDV><Accion>alta</Accion><Tipo>3</Tipo><Nombre>${escapeXml(nombre)}</Nombre><Correo>${escapeXml(correo)}</Correo><Telefono>${escapeXml(telefono)}</Telefono><Estado>${escapeXml(estado)}</Estado><CsrfToken>${escapeXml(csrfToken)}</CsrfToken></PDV>]]></xml></gestionarPDV></soap:Body></soap:Envelope>`;

    const apiResponse = await fetch(PAPEAMIGOS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/soap+xml; charset=utf-8",
        "Cookie": cookieHeader
      },
      body: soapBody
    });

    const soapResponse = await apiResponse.text();
    const inner = htmlDecode(xmlValue(soapResponse, "return"));
    const error = xmlValue(inner, "Error");
    if (error) return res.status(400).json({ error });

    const exito = xmlValue(inner, "Exito");
    const usuario = xmlValue(inner, "Usuario");
    const contrasena = xmlValue(inner, "Contrasena");
    if (!exito || !usuario || !contrasena) {
      return res.status(502).json({ error: "Respuesta incompleta de Papeamigos." });
    }

    return res.status(200).json({ exito, usuario, contrasena });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo procesar el registro." });
  }
};


