// scripts/settings.js

// Initialize Settings Page
export function initSettingsPage() {
  const contentDiv = document.getElementById("content");

  // Inject Settings HTML
  contentDiv.innerHTML = `
    <div class="settings-page">
      <h2>⚙️ Settings</h2>

      <!-- Profile Section -->
      <div class="settings-section">
        <h3>Profile</h3>
        <label>
          Username:
          <input type="text" id="usernameInput" placeholder="Enter your name">
        </label>
        <button class="btn" id="saveProfileBtn">Save</button>
      </div>

      <!-- Preferences Section -->
      <div class="settings-section">
        <h3>Preferences</h3>
        <label>
          Default Currency:
          <select id="currencySelect">
            <option value="₹">INR (₹)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
          </select>
        </label>
        <label>
          Theme Color:
          <input type="color" id="colorPicker">
        </label>
        <button class="btn" id="savePrefsBtn">Save</button>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section danger-zone">
        <h3>Danger Zone</h3>
        <p>This will delete all your expenses permanently.</p>
        <button class="btn reset-btn" id="resetBtn">Reset All Data</button>
      </div>
    </div>

    <!-- Modal -->
    <div id="confirmModal" class="modal hidden">
      <div class="modal-content">
        <h3>⚠️ Confirm Reset</h3>
        <p>This will delete <b>all data</b>. Are you sure?</p>
        <div class="modal-actions">
          <button class="btn danger" id="confirmResetBtn">Yes, Reset</button>
          <button class="btn" id="cancelResetBtn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div id="toast" class="toast"></div>
  `;

  // Load existing settings or defaults
  const settings = JSON.parse(localStorage.getItem("settings")) || {
    username: "",
    currency: "₹",
    themeColor: "#f5f5f5",
  };

  // Pre-fill form fields
  document.getElementById("usernameInput").value = settings.username;
  document.getElementById("currencySelect").value = settings.currency;
  document.getElementById("colorPicker").value = settings.themeColor;

  // Apply saved theme color initially
  applyThemeColor(settings.themeColor);

  // ---- Event Listeners ----

  // Live color picker preview
  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("input", (e) => {
    applyThemeColor(e.target.value);
  });

  // Save Profile
  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    const username = document.getElementById("usernameInput").value.trim();
    settings.username = username;
    localStorage.setItem("settings", JSON.stringify(settings));
    showToast("✅ Profile saved!");
  });

  // Save Preferences (currency + theme)
  document.getElementById("savePrefsBtn").addEventListener("click", () => {
    const currency = document.getElementById("currencySelect").value;
    const themeColor = document.getElementById("colorPicker").value;

    settings.currency = currency;
    settings.themeColor = themeColor;
    localStorage.setItem("settings", JSON.stringify(settings));

    applyThemeColor(themeColor);
    showToast("✅ Preferences saved!");

    // Notify other scripts (like expenses.js)
    window.dispatchEvent(new CustomEvent("settingsChanged"));
  });

  // Reset Modal
  const modal = document.getElementById("confirmModal");
  const resetBtn = document.getElementById("resetBtn");
  const confirmResetBtn = document.getElementById("confirmResetBtn");
  const cancelResetBtn = document.getElementById("cancelResetBtn");

  resetBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  cancelResetBtn.addEventListener("click", () => modal.classList.add("hidden"));
  confirmResetBtn.addEventListener("click", () => {
    localStorage.removeItem("expensesTracker");
    localStorage.removeItem("settings");
    modal.classList.add("hidden");
    showToast("🗑️ All data has been reset.");
    setTimeout(() => window.location.reload(), 1000);
  });
}

// ---- Helper Functions ----

// Apply theme color globally
function applyThemeColor(color) {
  document.body.style.background = color;
  document.body.style.color = getTextColor(color);
}

// Determine text color based on background brightness
function getTextColor(bgColor) {
  const c = bgColor.substring(1); // remove #
  const rgb = parseInt(c, 16); // convert to integer
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 186 ? "#111" : "#eee";
}

// Toast notifications
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Getter for currency (used in expenses.js)
export function getCurrency() {
  const settings = JSON.parse(localStorage.getItem("settings")) || { currency: "₹" };
  return settings.currency || "₹";
}

// ---- Apply saved theme color on initial load globally ----
(function applySavedThemeOnLoad() {
  const settings = JSON.parse(localStorage.getItem("settings"));
  if (settings && settings.themeColor) {
    applyThemeColor(settings.themeColor);
  }
})();

// ---- Listen for settings changes and re-render expenses ----
window.addEventListener("settingsChanged", () => {
  import("../data/expenses.js").then(module => module.renderExpenses());
});
