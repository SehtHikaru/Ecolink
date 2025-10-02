document.addEventListener("DOMContentLoaded", () => {
  /* =====================
     DEMO ACCOUNTS
  ====================== */
  const DEMO_ACCOUNTS = {
    "demo@user.com": {
      password: "user123",
      role: "usuario",
      name: "Demo Usuario"
    },
    "demo@worker.com": {
      password: "worker123",
      role: "trabajador",
      name: "Demo Trabajador",
      empresa: "EcoLink Bogotá",
      carnet: "T-0001"
    }
  };

  /* =====================
     LOGIN
  ====================== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (DEMO_ACCOUNTS[email] && DEMO_ACCOUNTS[email].password === password) {
        const user = {
          email,
          role: DEMO_ACCOUNTS[email].role,
          name: DEMO_ACCOUNTS[email].name,
          empresa: DEMO_ACCOUNTS[email].empresa || "",
          carnet: DEMO_ACCOUNTS[email].carnet || ""
        };
        sessionStorage.setItem("ecolink_user", JSON.stringify(user));
        window.location.href = "principal.html";
      } else {
        alert("❌ Credenciales inválidas.\nPrueba:\nUsuario: demo@user.com / user123\nTrabajador: demo@worker.com / worker123");
      }
    });
  }

  /* =====================
     REGISTRO SIMULADO
  ====================== */
  const registroForm = document.getElementById("registroForm");
  if (registroForm) {
    registroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const tipo = document.getElementById("tipo") ? document.getElementById("tipo").value : "usuario";
      const email = registroForm.querySelector('input[type="email"]').value.trim();
      const password = registroForm.querySelector('input[type="password"]').value;

      const newUser = { email, role: tipo, name: email.split("@")[0] };
      sessionStorage.setItem("ecolink_user", JSON.stringify(newUser));
      window.location.href = "principal.html";
    });
  }

  /* =====================
     FUNCIONES DE SESIÓN
  ====================== */
  function getCurrentUser() {
    const raw = sessionStorage.getItem("ecolink_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    if (currentUser.role === "trabajador") {
      document.body.classList.add("trabajador");
    }
    const profileNameEls = document.querySelectorAll(".profile-name");
    profileNameEls.forEach(el => el.textContent = currentUser.name || currentUser.email);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("ecolink_user");
      window.location.href = "index.html";
    });
  }

  /* =====================
     MAPA LEAFLET
  ====================== */
  const mapDiv = document.getElementById("map");
  if (mapDiv) {
    const map = L.map("map").setView([4.6097, -74.0817], 13); // Bogotá

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    L.marker([4.6097, -74.0817])
      .addTo(map)
      .bindPopup("♻️ Caneca disponible aquí");
  }

  /* =====================
     MODAL DETALLES CANECAS
  ====================== */
  const detallesBtns = document.querySelectorAll(".detalles-btn");
  const detallesModal = document.getElementById("detallesModal");
  const closeDetalles = document.getElementById("closeDetalles");
  const detallesInfo = document.getElementById("detallesInfo");

  if (detallesBtns && detallesModal && closeDetalles && detallesInfo) {
    detallesBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        detallesInfo.textContent = `ℹ️ Caneca #${id}\n📍 Dirección: Calle falsa 123\n📊 Estado: 60% lleno`;
        detallesModal.classList.add("active");
      });
    });

    closeDetalles.addEventListener("click", () => {
      detallesModal.classList.remove("active");
    });
  }

  /* =====================
     MODAL REPORTE
  ====================== */
  const reportBtns = document.querySelectorAll(".report-btn");
  const modal = document.getElementById("reportModal");
  const closeModal = document.getElementById("closeModal");
  const reportCaneca = document.getElementById("reportCaneca");
  const reportForm = document.getElementById("reportForm");
  const popup = document.getElementById("popupMessage");

  if (reportBtns && modal && closeModal && reportForm && popup) {
    reportBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const canecaId = btn.getAttribute("data-caneca");
        reportCaneca.textContent = "Caneca seleccionada: " + canecaId;
        modal.classList.add("active");
      });
    });

    closeModal.addEventListener("click", () => modal.classList.remove("active"));

    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      modal.classList.remove("active");
      popup.classList.add("show");
      setTimeout(() => popup.classList.remove("show"), 2500);
    });
  }
});
/* =====================
   MAPA DE RUTA (Recolección)
====================== */
const mapRutaDiv = document.getElementById("mapRuta");
if (mapRutaDiv) {
  const mapRuta = L.map("mapRuta").setView([4.6097, -74.0817], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapRuta);

  // Puntos ficticios de ruta
  const puntos = [
    [4.6097, -74.0817], // Centro
    [4.6120, -74.0800], // Caneca 1
    [4.6150, -74.0830], // Caneca 2
    [4.6180, -74.0860]  // Caneca 3
  ];

  puntos.forEach((p, i) => {
    if (i === 0) {
      L.marker(p).addTo(mapRuta).bindPopup("📍 Centro de acopio");
    } else {
      L.marker(p).addTo(mapRuta).bindPopup("♻️ Caneca " + i);
    }
  });

  L.polyline(puntos, { color: "green", weight: 4 }).addTo(mapRuta);

  // Fix para que se renderice bien
  setTimeout(() => {
    mapRuta.invalidateSize();
  }, 200);
}

/* =====================
   MODAL DE RECOLECCIÓN
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const recogerBtns = document.querySelectorAll(".recoger-btn");
  const modal = document.getElementById("recogerModal");
  const closeModal = document.getElementById("closeRecoger");
  const recogerCaneca = document.getElementById("recogerCaneca");
  const recogerForm = document.getElementById("recogerForm");
  const popup = document.getElementById("popupMessage");

  if (recogerBtns && modal && closeModal && recogerForm && popup) {
    // Abrir modal al dar clic en recolectar
    recogerBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-caneca");
        recogerCaneca.textContent = "Caneca seleccionada: " + id;
        modal.classList.add("active"); // usa la misma clase active de tus otros modales
      });
    });

    // Cerrar modal
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    // Guardar recolección
    recogerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      modal.classList.remove("active");

      // Mostrar popup
      popup.textContent = "✅ ¡Recolección registrada!";
      popup.classList.add("show");
      setTimeout(() => popup.classList.remove("show"), 2500);
    });
  }
});
