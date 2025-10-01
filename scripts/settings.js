// settings.js

// --- Dark Mode ---
export function initDarkMode() {
  const toggle = document.querySelector("#dark-mode-toggle");
  if (!toggle) return;

  // Load saved preference
  const darkPref = localStorage.getItem("darkMode");
  if (darkPref === "enabled") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

// --- Theme Selection ---
// --- Theme Selection ---
export function initThemes() {
  const themes = document.querySelectorAll(".color-theme");
  if (!themes.length) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) applyTheme(savedTheme);

  // Restore active state & badge from saved theme
  if (savedTheme) {
    themes.forEach((t) => {
      if (t.dataset.theme === savedTheme) {
        t.classList.add("active");
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("theme-status");
        statusSpan.textContent = "Active";
        t.appendChild(statusSpan);
      }
    });
  }

  themes.forEach((theme) => {
    theme.addEventListener("click", () => {
      const selected = theme.dataset.theme;
      applyTheme(selected);
      localStorage.setItem("theme", selected);

      // Remove previous active class & badge
      themes.forEach((t) => {
        t.classList.remove("active");
        const oldStatus = t.querySelector(".theme-status");
        if (oldStatus) oldStatus.remove();
      });

      // Set new active class & badge
      theme.classList.add("active");
      const statusSpan = document.createElement("span");
      statusSpan.classList.add("theme-status");
      statusSpan.textContent = "Active";
      theme.appendChild(statusSpan);
    });
  });
}

// Helper function to apply theme
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}


// --- Notifications ---
export function initNotifications() {
  const toggles = document.querySelectorAll(".notification-card input[type='checkbox']");
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const setting = toggle.closest(".setting-row").innerText.trim();
      console.log(`Notification setting changed: ${setting} = ${toggle.checked}`);
      // Save to localStorage if needed
    });
  });
}

// --- Data & Privacy ---
export function initDataPrivacy() {
  const exportBtn = document.querySelector(".primary-action");
  const clearBtn = document.querySelector(".danger-action");
  const signOutBtn = document.querySelector(".secondary-action");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      alert("Exporting data... (here you can trigger download)");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all data?")) {
        localStorage.clear();
        alert("All data cleared.");
        location.reload();
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      alert("Signing out... (redirect to login page)");
      // Example: window.location.href = "login.html";
    });
  }
}

// --- Master Init ---
export function initSettingsPage() {
  initDarkMode();
  initThemes();
  initNotifications();
  initDataPrivacy();
}
