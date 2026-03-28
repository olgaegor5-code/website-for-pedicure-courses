(function () {
  var STORAGE_WELCOME = "pedicureSchoolWelcomeSeen";
  var STORAGE_THEME = "pedicureSchoolTheme";

  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  var year = document.getElementById("year");
  var welcomeBanner = document.getElementById("welcomeBanner");
  var welcomeClose = document.getElementById("welcomeClose");
  var themeToggle = document.getElementById("themeToggle");
  var contactForm = document.getElementById("contactForm");
  var formSuccess = document.getElementById("formSuccess");
  var contactSubmit = document.getElementById("contactSubmit");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function applyTheme(mode, persist) {
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_THEME, mode);
      } catch (e) {}
    }
  }

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem(STORAGE_THEME);
  } catch (e) {}
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme, false);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark", false);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      applyTheme(isDark ? "light" : "dark", true);
    });
  }

  if (welcomeBanner && welcomeClose) {
    var seen = false;
    try {
      seen = localStorage.getItem(STORAGE_WELCOME) === "1";
    } catch (e) {}
    if (!seen) {
      welcomeBanner.hidden = false;
    }
    welcomeClose.addEventListener("click", function () {
      welcomeBanner.hidden = true;
      try {
        localStorage.setItem(STORAGE_WELCOME, "1");
      } catch (e) {}
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Открыть меню");
      });
    });
  }

  var faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.querySelectorAll(".faq-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panelId = btn.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;

        faqList.querySelectorAll(".faq-trigger").forEach(function (other) {
          if (other === btn) return;
          other.setAttribute("aria-expanded", "false");
          var oid = other.getAttribute("aria-controls");
          var op = oid ? document.getElementById(oid) : null;
          if (op) op.hidden = true;
        });

        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function setFieldError(id, message) {
    var el = document.getElementById(id);
    if (el) el.textContent = message || "";
  }

  function validateForm() {
    var nameEl = document.getElementById("contactName");
    var emailEl = document.getElementById("contactEmail");
    var msgEl = document.getElementById("contactMsg");
    var ok = true;

    setFieldError("contactNameErr", "");
    setFieldError("contactEmailErr", "");
    setFieldError("contactMsgErr", "");

    if (!nameEl || nameEl.value.trim().length < 2) {
      setFieldError("contactNameErr", "Укажите имя (не короче 2 символов).");
      ok = false;
    }

    if (!emailEl || !emailEl.value.trim()) {
      setFieldError("contactEmailErr", "Укажите адрес почты.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setFieldError("contactEmailErr", "Похоже, в адресе ошибка.");
      ok = false;
    }

    if (!msgEl || msgEl.value.trim().length < 10) {
      setFieldError("contactMsgErr", "Расскажите чуть подробнее (от 10 символов).");
      ok = false;
    }

    return ok;
  }

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      formSuccess.hidden = true;

      if (!validateForm()) return;

      if (contactSubmit) {
        contactSubmit.disabled = true;
        contactSubmit.textContent = "Отправка…";
      }

      window.setTimeout(function () {
        formSuccess.hidden = false;
        contactForm.reset();
        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.textContent = "Отправить заявку";
        }
        formSuccess.focus({ preventScroll: true });
      }, 450);
    });
  }
})();
