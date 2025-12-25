(() => {
    const app = document.getElementById("app");
    const yearEl = document.getElementById("year");
    yearEl.textContent = String(new Date().getFullYear());

    const LS_KEY = "yashilmakon_last_id";

    function sanitizeId(raw) {
        // ID: harf/son/_/- bo‘lsin, qolganini chiqarib tashlaymiz
        const v = (raw || "").trim();
        const cleaned = v.replace(/[^\w-]/g, "");
        return cleaned;
    }

    function getHash() {
        // #/id/ABC123 yoki #/
        return location.hash || "#/";
    }

    function setRouteToId(id) {
        location.hash = `#/id/${encodeURIComponent(id)}`;
    }

    function setRouteHome() {
        location.hash = "#/";
    }

    function renderHome() {
        const last = localStorage.getItem(LS_KEY) || "";
        app.innerHTML = `
      <div class="label">ID kiriting</div>
      <div class="row">
        <input id="idInput" class="input" inputmode="text" autocomplete="off"
               placeholder="Masalan: A12B34" value="${escapeHtml(last)}" />
        <button id="goBtn" class="btn btn-primary">Kirish ➜</button>
      </div>

      <div id="err" class="err"></div>

      <div class="hint">
        Maslahat: ID faqat <span class="kbd">harf</span>, <span class="kbd">son</span>,
        <span class="kbd">_</span>, <span class="kbd">-</span> bo‘lsin.
      </div>

      <div class="hr"></div>

      <div class="hint">
        Telefon “Back” bosilganda ham shu input qoladi — refresh shart emas.
      </div>
    `;

        const input = document.getElementById("idInput");
        const btn = document.getElementById("goBtn");
        const err = document.getElementById("err");

        function showError(msg) {
            err.textContent = msg;
            err.style.display = "block";
        }
        function clearError() {
            err.textContent = "";
            err.style.display = "none";
        }

        // UX: sahifa ochilganda fokus
        setTimeout(() => input.focus(), 50);

        // Har yozganda last_id saqlab boramiz
        input.addEventListener("input", () => {
            clearError();
            localStorage.setItem(LS_KEY, input.value);
        });

        function go() {
            const id = sanitizeId(input.value);
            if (!id) return showError("ID bo‘sh. Biror narsa yoz 😄");
            if (id.length < 2) return showError("ID juda qisqa. Kamida 2 ta belgi bo‘lsin.");
            localStorage.setItem(LS_KEY, id);
            setRouteToId(id);
        }

        btn.addEventListener("click", go);

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") go();
        });
    }

    function renderIdPage(id) {
        app.innerHTML = `
      <div class="big">Sahifa ochildi ✅</div>
      <div class="badge">🆔 ID: <span class="kbd">${escapeHtml(id)}</span></div>

      <div class="hint" style="margin-top:12px;">
        Bu joyga xohlasang ID bo‘yicha kontent qo‘shamiz: ma’lumot, jadval, link, qr, nima desang.
      </div>

      <div class="hr"></div>

      <div class="row">
        <button id="backBtn" class="btn btn-ghost">⬅ Orqaga</button>
        <button id="newBtn" class="btn btn-primary">Boshqa ID kiritish</button>
      </div>

      <div class="hint" style="margin-top:10px;">
        Telefonning Back tugmasi ham ishlaydi. Refresh kerak emas.
      </div>
    `;

        document.getElementById("backBtn").addEventListener("click", () => history.back());
        document.getElementById("newBtn").addEventListener("click", () => setRouteHome());
    }

    function route() {
        const h = getHash();

        // Home: #/ yoki # yoki bo‘sh
        if (h === "#" || h === "#/" || h === "") {
            return renderHome();
        }

        // ID route: #/id/XYZ
        const m = h.match(/^#\/id\/(.+)$/);
        if (m) {
            const id = decodeURIComponent(m[1] || "");
            if (!id) return renderHome();
            return renderIdPage(id);
        }

        // Noma’lum route bo‘lsa — home
        return renderHome();
    }

    window.addEventListener("hashchange", route);

    // Start
    if (!location.hash) location.hash = "#/";
    route();

    // HTML escape
    function escapeHtml(str) {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
})();
