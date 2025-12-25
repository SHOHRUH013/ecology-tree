(() => {
  const BASE_URL = "https://yashilmakon.eco/#/tree/";

  const form = document.getElementById("treeForm");
  const input = document.getElementById("treeId");
  const error = document.getElementById("errorText");
  const btn = document.getElementById("submitBtn");

  if (!form || !input || !error || !btn) return;

  function isTelegramInApp() {
    const ua = (navigator.userAgent || "").toLowerCase();
    return ua.includes("telegram") || ua.includes("tgbrowser") || ua.includes("tg");
  }

  function resetUI({ keepValue = true } = {}) {
    btn.disabled = false;
    error.textContent = "";
    input.classList.remove("input--bad");
    if (!keepValue) input.value = "";
    try { input.focus(); } catch {}
  }

  function showError(msg) {
    error.textContent = msg;
    input.classList.add("input--bad");
    try { input.focus(); } catch {}
  }

  // Back/forward cache’da ham tiklansin
  window.addEventListener("pageshow", () => resetUI({ keepValue: true }));
  window.addEventListener("focus", () => { btn.disabled = false; });

  // Faqat raqam
  input.addEventListener("input", () => {
    const original = input.value;
    const cleaned = original.replace(/\D+/g, "");
    if (original !== cleaned) input.value = cleaned;
    error.textContent = "";
    input.classList.remove("input--bad");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    btn.disabled = true;
    error.textContent = "";
    input.classList.remove("input--bad");

    const id = input.value.trim();

    if (!id) {
      resetUI({ keepValue: true });
      return showError("ID raqamini kiriting.");
    }

    if (!/^\d+$/.test(id)) {
      resetUI({ keepValue: true });
      return showError("Maydonga faqat raqamlar kiritiladi.");
    }

    const target = BASE_URL + encodeURIComponent(id);

    // ✅ Telegram ichida eng barqaror: shu oynada ochish
    if (isTelegramInApp()) {
      window.location.assign(target);
      return;
    }

    // ✅ Oddiy brauzer: yangi tab, bo‘lmasa fallback
    const win = window.open(target, "_blank", "noopener,noreferrer");
    if (!win) {
      window.location.assign(target);
      return;
    }

    // Yangi tab ochildi → bu sahifa qoladi, input tozalanadi
    resetUI({ keepValue: false });
  });

  window.addEventListener("load", () => resetUI({ keepValue: true }));
})();
