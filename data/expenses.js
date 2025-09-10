// expenses.js

export let expensesTracker = [];

export function loadExpenses() {
  const storedData = JSON.parse(localStorage.getItem('expensesTracker'));
  expensesTracker = storedData ? storedData : [];
}

export function saveToStorage() {
  localStorage.setItem('expensesTracker', JSON.stringify(expensesTracker));
}

export function renderExpenses(list = expensesTracker) {
  const contentArea = document.querySelector('.expense-list');
  if (!contentArea) {
    console.warn("⚠️ .expense-list not found in DOM");
    return;
  }

  const currency = JSON.parse(localStorage.getItem("settings"))?.currency || "₹";

  let cont = '';
  if (list.length === 0) {
    cont = "<p>No matching expenses found.</p>";
  } else {
    list.forEach(exp => {
      cont += `
        <div class="expense-item" data-id="${exp.id}">
          <div class="expense-left">
            <div class="expense-amount">- ${currency}${exp.amount}</div>
            <div class="expense-title">${exp.title}</div>
            <div class="expense-date">${exp.date}</div>
          </div>
          <div class="expense-right">
            <div class="expense-category ${exp.category.toLowerCase()}">${exp.category}</div>
            <button class="delete-button">🗑️</button>
          </div>
        </div>
      `;
    });
  }

  contentArea.innerHTML = cont;

  // Delete buttons
  contentArea.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', e => {
      const id = e.target.closest('.expense-item')?.dataset.id;
      if (!id) return;
      removeFromExpenses(id);
      applyFilters();
    });
  });
}

export function addToExpenses(id, amount, date, title, category, type) {
  expensesTracker.push({ id, amount, date, title, category, type });
  saveToStorage();
}

export function removeFromExpenses(id) {
  expensesTracker = expensesTracker.filter(e => String(e.id) !== String(id));
  saveToStorage();
}

export function applyFilters() {
  const searchInput = document.querySelector(".expenses-controls input");
  const categorySelect = document.querySelector(".expenses-controls select");

  const searchText = searchInput?.value.toLowerCase().trim() || "";
  const selectedCategory = categorySelect?.value || "All Categories";

  let filtered = [...expensesTracker];

  if (selectedCategory !== "All Categories") {
    filtered = filtered.filter(e => e.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (searchText) {
    filtered = filtered.filter(e => e.title.toLowerCase().includes(searchText));
  }

  renderExpenses(filtered);
}

// Re-render on settings change
window.addEventListener("settingsChanged", () => renderExpenses());
