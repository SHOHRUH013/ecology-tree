(() => {
  const BASE_URL = "https://yashilmakon.eco/#/tree/";

  const form = document.getElementById("treeForm");
  const input = document.getElementById("treeId");
  const error = document.getElementById("errorText");
  const btn = document.getElementById("submitBtn");

  if (!form || !input || !error || !btn) return;

  const ua = (navigator.userAgent || "").toLowerCase();
  const isTelegram = ua.includes("telegram") || ua.includes("tgbrowser");

  function showError(msg) {
    error.textContent = msg;
    input.classList.add("input--bad");
    try { input.focus(); } catch {}
    btn.disabled = false;
  }

  function clearError() {
    error.textContent = "";
    input.classList.remove("input--bad");
  }

  // back/forward cache’dan qaytganda ham ishlasin
  window.addEventListener("pageshow", () => { btn.disabled = false; });
  window.addEventListener("focus", () => { btn.disabled = false; });

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

    // ✅ Telegram ichida eng barqaror: shu oynada ochish
    if (isTelegram) {
      window.location.assign(target);
      return;
    }

    // ✅ Oddiy brauzer: avval yangi tab, blok bo‘lsa shu oynada
    const win = window.open(target, "_blank", "noopener,noreferrer");
    if (!win) {
      window.location.assign(target);
      return;
    }

    // yangi tab ochildi → bu sahifa qoladi
    input.value = "";
    btn.disabled = false;
    try { input.focus(); } catch {}
  });
})();
