(() => {
  const BASE_URL = "https://yashilmakon.eco/#/tree/";

  function init() {
    const form = document.getElementById("treeForm");
    const input = document.getElementById("treeId");
    const error = document.getElementById("errorText");
    const btn = document.getElementById("submitBtn");
    if (!form || !input || !error || !btn) return;

    // inline fallback bilan to‘qnashmasin:
    if (form.dataset.bound === "1") return;
    form.dataset.bound = "1";

    const ua = (navigator.userAgent || "").toLowerCase();
    const isTelegram = ua.includes("telegram") || ua.includes("tgbrowser") || ua.includes("tg");

    function showError(msg) {
      error.textContent = msg;
      input.classList.add("input--bad");
      btn.disabled = false;
      try { input.focus(); } catch {}
    }

    function clearError() {
      error.textContent = "";
      input.classList.remove("input--bad");
    }

    input.addEventListener("input", () => {
      const cleaned = input.value.replace(/\D+/g, "");
      if (input.value !== cleaned) input.value = cleaned;
      clearError();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      btn.disabled = true;
      clearError();

      const id = input.value.trim();
      if (!id) return showError("ID raqamini kiriting.");
      if (!/^\d+$/.test(id)) return showError("Maydonga faqat raqamlar kiritiladi.");

      const target = BASE_URL + encodeURIComponent(id);

      if (isTelegram) {
        window.location.assign(target);
        return;
      }

      const win = window.open(target, "_blank", "noopener,noreferrer");
      if (!win) window.location.assign(target);

      input.value = "";
      btn.disabled = false;
    });

    window.addEventListener("pageshow", () => { btn.disabled = false; });
    window.addEventListener("focus", () => { btn.disabled = false; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
