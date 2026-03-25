const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function showStatus(message, tone) {
  const el = $("#formStatus");
  if (!el) return;
  el.textContent = message;
  el.style.color = tone === "good" ? "rgba(52, 211, 153, 0.95)" : "rgba(251, 113, 133, 0.95)";
}

function wireUI() {
  // Mobile menu
  const menuToggle = $("#menuToggle");
  const primaryNav = $("#primaryNav");
  const scrim = $("#mobileScrim");
  if (menuToggle && primaryNav && scrim) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      scrim.hidden = !isOpen;
      if (isOpen) primaryNav.querySelector("a")?.focus();
    });

    scrim.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      scrim.hidden = true;
    });

    $$("#primaryNav a").forEach((a) => {
      a.addEventListener("click", () => {
        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        scrim.hidden = true;
      });
    });
  }

  // Smooth scroll for internal anchors
  $$("#primaryNav a, .footer-links a, .hero-cta a, .btn[href^='#']").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    a.addEventListener("click", (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const focusable = target.querySelector("h2, h3, button, input, select, textarea, a[href]") || target;
        if (focusable && typeof focusable.focus === "function") focusable.focus();
      }, 350);
    });
  });

  // FAQ accordion
  $$(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      if (!panelId) return;
      const panel = document.getElementById(panelId);
      if (!panel) return;

      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      panel.hidden = expanded;
    });
  });

  // Contact form
  $("#contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const serviceType = $("#serviceType")?.value;
    const name = $("#name")?.value?.trim();
    const email = $("#email")?.value?.trim();
    const message = $("#message")?.value?.trim();

    if (!serviceType || !name || !email || !message) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Email invalide. Vérifiez et réessayez.", "danger");
      return;
    }

    showStatus("Demande envoyée (démo). On vous recontacte très vite !", "good");
    e.target.reset();

    // Petit confort: remonter le curseur sur le statut.
    setTimeout(() => $("#formStatus")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
  });
}

function init() {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  wireUI();
}

document.addEventListener("DOMContentLoaded", init);

