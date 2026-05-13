window.dataLayer = window.dataLayer || [];

(function () {
  const STORAGE_KEY = "padrao_interrompido_tracking";
  const TRACKING_FIELDS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "origem",
    "campanha",
    "pagina",
    "status_funil"
  ];
  const EDuzz_HOSTS = ["chk.eduzz.com", "checkout.eduzz.com"];

  function trackEvent(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      ...payload
    });

    if (window.gtag) {
      window.gtag("event", eventName, payload);
    }
  }

  function trackMeta(eventName, payload = {}) {
    if (window.fbq) {
      window.fbq("track", eventName, payload);
    }
  }

  function trackMetaCustom(eventName, payload = {}) {
    if (window.fbq) {
      window.fbq("trackCustom", eventName, payload);
    }
  }

  function trackFunnelEvent(eventName, payload = {}, metaEventName = null, metaCustom = false) {
    trackEvent(eventName, payload);

    if (metaEventName) {
      if (metaCustom) {
        trackMetaCustom(metaEventName, payload);
      } else {
        trackMeta(metaEventName, payload);
      }
    }
  }

  function getDefaultOrigem(pathname = window.location.pathname) {
    const normalizedPath = normalizePath(pathname);

    if (normalizedPath === "/ebook") return "ebook";
    if (normalizedPath === "/quiz") return "quiz_frio";
    if (normalizedPath === "/quiz-mpi") return "quiz_mpi";
    if (normalizedPath === "/ebook/obrigado.html") return "ebook_obrigado";

    return normalizedPath.replace(/^\/|\/$/g, "") || "site";
  }

  function normalizePath(pathname = "") {
    if (pathname === "/") return "/";
    return pathname.replace(/\/index\.html$/i, "").replace(/\/$/, "") || "/";
  }

  function readStoredTracking() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeStoredTracking(data) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function collectTrackingParams() {
    const params = new URLSearchParams(window.location.search);
    const stored = readStoredTracking();
    const next = { ...stored };

    TRACKING_FIELDS.forEach((field) => {
      const value = params.get(field);

      if (value) {
        next[field] = value;
      }
    });

    if (!next.pagina) {
      next.pagina = window.location.pathname;
    }

    if (!next.origem) {
      next.origem = getDefaultOrigem();
    }

    if (!next.campanha && next.utm_campaign) {
      next.campanha = next.utm_campaign;
    }

    writeStoredTracking(next);

    return next;
  }

  function fillTrackingFields(data = readStoredTracking()) {
    TRACKING_FIELDS.forEach((field) => {
      document.querySelectorAll(`input[name="${field}"]`).forEach((input) => {
        const defaultValue = field === "pagina"
          ? window.location.pathname
          : field === "origem"
            ? getDefaultOrigem()
            : "";
        const value = data[field] || defaultValue;

        if (value) {
          input.value = value;
        }
      });
    });
  }

  function shouldPropagateUrl(url) {
    if (!url || url.protocol === "mailto:" || url.protocol === "tel:") return false;
    if (url.hash && !url.pathname) return false;
    if (url.hash && url.href.endsWith(url.hash)) return false;
    if (/\.pdf$/i.test(url.pathname)) return false;
    if (url.hostname.includes("wa.me") || url.hostname.includes("whatsapp.com")) return false;

    const currentHost = window.location.hostname;
    const isInternal = url.hostname === currentHost || url.hostname === "";
    const path = normalizePath(url.pathname);
    const isFunnelPath = ["/quiz", "/quiz-mpi", "/ebook", "/ebook/obrigado.html"].includes(path);
    const isEduzz = EDuzz_HOSTS.includes(url.hostname);

    return isEduzz || (isInternal && isFunnelPath);
  }

  function appendTrackingParamsToUrl(rawHref, data = readStoredTracking()) {
    const url = new URL(rawHref, window.location.origin);

    if (!shouldPropagateUrl(url)) {
      return rawHref;
    }

    TRACKING_FIELDS.forEach((field) => {
      const value = data[field];

      if (value && !url.searchParams.has(field)) {
        url.searchParams.set(field, value);
      }
    });

    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  }

  function propagateTrackingToLinks(data = readStoredTracking()) {
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      try {
        link.setAttribute("href", appendTrackingParamsToUrl(href, data));
      } catch (error) {
        // Ignora URLs malformadas sem quebrar a página.
      }
    });
  }

  function trackAndNavigate(event, url, trackingCallback) {
    const link = event.currentTarget;
    const target = link ? link.getAttribute("target") : "";

    if (target && target !== "_self") {
      if (typeof trackingCallback === "function") {
        trackingCallback();
      }
      return;
    }

    event.preventDefault();

    if (typeof trackingCallback === "function") {
      trackingCallback();
    }

    window.setTimeout(function () {
      window.location.href = url;
    }, 250);
  }

  function isEduzzUrl(url) {
    return EDuzz_HOSTS.includes(url.hostname);
  }

  function setupClickTracking() {
    document.querySelectorAll("a[href]").forEach((link) => {
      if (link.dataset.trackingBound === "true") return;

      let url;
      try {
        url = new URL(link.href, window.location.origin);
      } catch (error) {
        return;
      }

      const path = normalizePath(url.pathname);
      const currentPath = normalizePath(window.location.pathname);

      if (currentPath === "/ebook/obrigado.html" && path === "/quiz-mpi") {
        link.dataset.trackingBound = "true";
        link.addEventListener("click", function (event) {
          trackAndNavigate(event, link.href, function () {
            trackFunnelEvent(
              "click_quiz_mpi",
              {
                source: "ebook_obrigado",
                product: "quiz_mapeamento",
                funnel_step: "quiz_offer"
              },
              "ClickQuizMPI",
              true
            );
          });
        });
      }

      if ((currentPath === "/quiz" || currentPath === "/quiz-mpi") && isEduzzUrl(url)) {
        link.dataset.trackingBound = "true";
        link.addEventListener("click", function (event) {
          const isMpi = currentPath === "/quiz-mpi";

          trackAndNavigate(event, link.href, function () {
            trackFunnelEvent(
              "begin_checkout",
              {
                product: "quiz_mapeamento",
                content_name: isMpi ? "quiz_mapeamento_mpi" : "quiz_mapeamento",
                value: 17,
                currency: "BRL",
                funnel_step: isMpi ? "quiz_mpi_checkout_click" : "quiz_frio_checkout_click"
              },
              "InitiateCheckout"
            );
          });
        });
      }
    });
  }

  function trackPageEvents() {
    const path = normalizePath(window.location.pathname);

    if (path === "/ebook/obrigado.html") {
      trackFunnelEvent(
        "view_ebook_thank_you",
        {
          content_name: "ebook_obrigado",
          content_category: "ebook",
          funnel_step: "ebook_thank_you",
          page: "/ebook/obrigado.html"
        },
        "ViewContent"
      );
    }

    if (path === "/quiz") {
      trackFunnelEvent(
        "view_quiz_offer",
        {
          content_name: "quiz_mapeamento",
          content_category: "quiz",
          funnel_step: "quiz_frio_offer",
          page: "/quiz"
        },
        "ViewContent"
      );
    }

    if (path === "/quiz-mpi") {
      trackFunnelEvent(
        "view_quiz_mpi_offer",
        {
          content_name: "quiz_mapeamento_mpi",
          content_category: "quiz",
          funnel_step: "quiz_mpi_offer",
          page: "/quiz-mpi"
        },
        "ViewContent"
      );
    }
  }

  function initTracking() {
    const trackingData = collectTrackingParams();

    fillTrackingFields(trackingData);
    propagateTrackingToLinks(trackingData);
    setupClickTracking();
    trackPageEvents();
  }

  window.trackEvent = trackEvent;
  window.trackMeta = trackMeta;
  window.trackMetaCustom = trackMetaCustom;
  window.trackFunnelEvent = trackFunnelEvent;
  window.trackAndNavigate = trackAndNavigate;
  window.getPadraoInterrompidoTracking = readStoredTracking;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTracking);
  } else {
    initTracking();
  }
})();
