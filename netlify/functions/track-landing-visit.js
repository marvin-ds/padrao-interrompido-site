/**
 * track-landing-visit
 * Registra visitas à landing page /teste-momento-invisivel no Supabase.
 * Chamado via POST a partir do evento landing_loaded na página.
 */

const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("track-landing-visit: Supabase credentials not configured.");
    // Falha silenciosa — não bloqueia o usuário.
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: "not_configured" }) };
  }

  const userAgent  = (event.headers["user-agent"] || "").slice(0, 500);
  const deviceType = detectDevice(userAgent);

  const payload = {
    page:         sanitize(body.page)         || "/teste-momento-invisivel",
    utm_source:   sanitize(body.utm_source)   || null,
    utm_medium:   sanitize(body.utm_medium)   || null,
    utm_campaign: sanitize(body.utm_campaign) || null,
    utm_content:  sanitize(body.utm_content)  || null,
    utm_term:     sanitize(body.utm_term)     || null,
    gclid:        sanitize(body.gclid)        || null,
    fbclid:       sanitize(body.fbclid)       || null,
    msclkid:      sanitize(body.msclkid)      || null,
    origem:       sanitize(body.origem)       || null,
    referrer:     sanitize(body.referrer)     || null,
    user_agent:   userAgent,
    device_type:  deviceType,
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/landing_page_visits`, {
      method: "POST",
      headers: {
        "apikey":        SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type":  "application/json",
        "Prefer":        "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("track-landing-visit: Supabase error", res.status, err);
      return { statusCode: 200, body: JSON.stringify({ ok: false, reason: "db_error" }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("track-landing-visit: fetch error", err.message);
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: "network_error" }) };
  }
};

/** Detecta tipo de dispositivo pelo User-Agent. */
function detectDevice(ua = "") {
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  if (/iPad|Tablet|PlayBook/i.test(ua))                                     return "tablet";
  if (ua)                                                                    return "desktop";
  return "unknown";
}

/** Remove espaços excessivos e limita tamanho para evitar payloads abusivos. */
function sanitize(value, maxLen = 500) {
  if (typeof value !== "string") return null;
  return value.trim().slice(0, maxLen) || null;
}
