/**
 * Marsh Solar Solutions — site interactions
 * Mobile navigation, scroll state, quote form, WhatsApp links.
 */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "254717244403";

  var WHATSAPP_MESSAGE =
    "Hello Marsh Solar Solutions, I would like a quotation.";

  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var form = document.getElementById("quote-form");
  var statusEl = document.getElementById("form-status");
  var yearEl = document.getElementById("year");

  function whatsappUrl(extra) {
    var text = extra
      ? WHATSAPP_MESSAGE + " " + extra
      : WHATSAPP_MESSAGE;

    return (
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(text)
    );
  }

  function setWhatsAppLinks() {
    [
      "hero-whatsapp",
      "contact-whatsapp",
      "whatsapp-float"
    ].forEach(function (id) {
      var el = document.getElementById(id);

      if (el) {
        el.href = whatsappUrl();
      }
    });
  }

  function closeNav() {
    if (!nav || !toggle) return;

    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");

    document.body.style.overflow = "";
  }

  function openNav() {
    if (!nav || !toggle) return;

    nav.classList.add("is-open");
    toggle.classList.add("is-open");

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");

    document.body.style.overflow = "hidden";
  }

  /* Sticky header shadow */

  function onScroll() {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 12
    );
  }

  /* Highlight navigation link for section in view */

  function updateActiveNav() {
    var sections = document.querySelectorAll(
      "main section[id]"
    );

    var current = "home";
    var offset = 120;

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;

      if (top - offset <= 0) {
        current = section.id;
      }
    });

    document.querySelectorAll(".nav-link").forEach(
      function (link) {
        var href = link.getAttribute("href") || "";

        link.classList.toggle(
          "is-active",
          href === "#" + current
        );
      }
    );
  }

  /* Reveal cards as they enter the viewport */

  function initReveal() {
    var targets = document.querySelectorAll(
      ".product-card, .why-card, .solution-card, .featured-card"
    );

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });

      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    targets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  function setStatus(message, isError) {
    if (!statusEl) return;

    statusEl.textContent = message;

    statusEl.classList.toggle(
      "is-error",
      Boolean(isError)
    );
  }

  function isValidEmail(value) {
    if (!value) return true;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* Mobile navigation */

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll(".nav-link").forEach(
      function (link) {
        link.addEventListener("click", closeNav);
      }
    );

    var headerQuote =
      document.querySelector(".header-actions .btn");

    if (headerQuote) {
      headerQuote.addEventListener("click", closeNav);
    }

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Escape") {
          closeNav();
        }
      }
    );
  }

  /* Quote form */

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        var name =
          (form.name.value || "").trim();

        var phone =
          (form.phone.value || "").trim();

        var email =
          (form.email.value || "").trim();

        var interest = form.interest.value;

        var message =
          (form.message.value || "").trim();

        if (
          !name ||
          !phone ||
          !interest ||
          !message
        ) {
          setStatus(
            "Please complete the required fields.",
            true
          );

          return;
        }

        if (!isValidEmail(email)) {
          setStatus(
            "Please enter a valid email address.",
            true
          );

          return;
        }

        var summary =
          "Name: " +
          name +
          " | Phone: " +
          phone +
          (email
            ? " | Email: " + email
            : "") +
          " | Interest: " +
          interest +
          " | Details: " +
          message;

        setStatus(
          "Thank you. Opening WhatsApp so we can complete your quotation…"
        );

        window.open(
          whatsappUrl(summary),
          "_blank",
          "noopener"
        );

        form.reset();
      }
    );
  }

  /* Product enquiry buttons */

  document.querySelectorAll(".js-enquire").forEach(
    function (link) {
      link.addEventListener(
        "click",
        function () {
          if (!form) return;

          var interest =
            link.getAttribute("data-interest");

          var product =
            link.getAttribute("data-product");

          if (interest) {
            form.interest.value = interest;
          }

          if (
            product &&
            !form.message.value
          ) {
            form.message.value =
              "I would like a quotation for: " +
              product +
              ".";
          }
        }
      );
    }
  );

  /* Footer year */

  if (yearEl) {
    yearEl.textContent =
      String(new Date().getFullYear());
  }

  /* Initialize */

  setWhatsAppLinks();
  onScroll();
  updateActiveNav();
  initReveal();

  window.addEventListener(
    "scroll",
    function () {
      onScroll();
      updateActiveNav();
    },
    {
      passive: true
    }
  );
})();
