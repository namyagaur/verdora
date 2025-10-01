import { renderExpensePieChart } from "../scripts/piechart.js";

export const expenseList = loadList("expenseList") || [];
export const balanceList = loadList("balanceList") || [];
export const savingsList = loadList("savingsList") || [];
export const eiTracker = loadList("eiTracker") || [];

export function loadList(list) {
  return JSON.parse(localStorage.getItem(list)) || [];
}

export function saveList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function addExpenseList() {
  const inputButtons = document.querySelectorAll(".input-tab");

  inputButtons.forEach((ib) => {
    const amountInput = document.getElementById("amount");
    const titleInput = document.getElementById("desc");
    const dateInput = document.getElementById("date");

    ib.addEventListener("click", () => {
      const finalAmount = amountInput.value;
      const finalTitle = titleInput.value;
      const finalDate = dateInput.value;
      const activeNav =
        document.querySelector(".nav-item.active")?.id || "expense"; // default to expense

      const selectedCategory = document.querySelector(
        ".category-tabs.active"
      )?.id;

      if (!finalAmount || !finalTitle || !finalDate || !selectedCategory) {
        alert("Fill up All Details");
        return;
      }

      const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const item = {
        id,
        amount: finalAmount,
        title: finalTitle,
        date: finalDate,
        category: selectedCategory,
      };
      const eiItem = { ...item, type: activeNav };

      if (activeNav === "expense") {
        expenseList.push(item);
        eiTracker.push(eiItem);
        saveList("expenseList", expenseList);
        saveList("eiTracker", eiTracker);
        updateExpenseInsights();
      }

      if (activeNav === "balance") {
        balanceList.push(item);
        eiTracker.push(eiItem);
        saveList("balanceList", balanceList);
        saveList("eiTracker", eiTracker);
        updateBalanceInsights();
      }

      if (activeNav === "savings") {
        savingsList.push(item);
        saveList("savingsList", savingsList);
        currentsavingsUpdate();
      }

      // Clear inputs
      amountInput.value = "";
      titleInput.value = "";
      dateInput.value = "";
      document
        .querySelectorAll(".category-tabs")
        .forEach((g) => g.classList.remove("active"));

      renderList();
      renderExpensePieChart(); // render updated list
    });
  });
}

// Render list and use event delegation for delete buttons
export function renderList(data = eiTracker) {
  const contentDiv = document.querySelector(".ei-list");
  if (!contentDiv) return;

  if (data.length === 0) {
    contentDiv.innerHTML = "No Expense Yet :)";
    return;
  }

  let html = data
    .map((ei) => {
      const isSign = ei.type === "expense" ? "-" : "+";
      return `
        <div class="item-wrapper">
          <div class="item-info">
            <div class="item-name">${ei.title}</div>
            <div class="icd-wrapper">
              <div class="item-category ${ei.category}">${ei.category}</div>
              <div class="item-date">${ei.date}</div>
            </div>
          </div>
          <div class="item-amount-edit">
            <div class="item-amount" id="${ei.type}-part">${isSign} ₹${ei.amount}</div>
            <div class="item-delete" data-id="${ei.id}">🗑️</div>
          </div>
        </div>`;
    })
    .join("");

  contentDiv.innerHTML = html;
}


// Event delegation for delete buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-delete")) {
    const btnid = e.target.dataset.id;
    handleDelete(btnid);
  }
});

function handleDelete(btnid) {
  const deletedItem = eiTracker.find((p) => p.id === btnid);
  if (!deletedItem) return;

  // Remove from eiTracker
  eiTracker.splice(
    eiTracker.findIndex((p) => p.id === btnid),
    1
  );
  saveList("eiTracker", eiTracker);

  // Remove from respective lists
  if (deletedItem.type === "expense") {
    const index = expenseList.findIndex((p) => p.id === btnid);
    if (index > -1) expenseList.splice(index, 1);
    saveList("expenseList", expenseList);
    updateExpenseInsights();
  }

  if (deletedItem.type === "balance") {
    const index = balanceList.findIndex((p) => p.id === btnid);
    if (index > -1) balanceList.splice(index, 1);
    saveList("balanceList", balanceList);
    updateBalanceInsights();
  }

  if (deletedItem.type === "savings") {
    const index = savingsList.findIndex((p) => p.id === btnid);
    if (index > -1) savingsList.splice(index, 1);
    saveList("savingsList", savingsList);
    currentsavingsUpdate();
  }

  renderList();
  renderExpensePieChart(); // refresh UI
}

// Update functions
export function currentExpenseUpdate() {
  let total = expenseList.reduce((sum, item) => sum + Number(item.amount), 0);
  const div = document.querySelector(".expense-insights");
  if (div) div.textContent = `₹${total}`;
}

export function totalExpenseUpdate() {
  let total = eiTracker
    .filter((i) => i.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const div = document.querySelector(".hi-total-expense");
  if (div) div.textContent = `₹${total}`;
}

export function updateExpenseInsights() {
  currentExpenseUpdate();
  totalExpenseUpdate();
}

export function updateBalanceInsights() {
  // total income (all balance items)
  let totalIncome = balanceList.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  // total expense (all expense items)
  let totalExpense = expenseList.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  // current balance = income - expense
  let currentBalance = totalIncome - totalExpense;

  // Update current balance on UI
  const divCurrent = document.querySelector(".current-balance");
  if (divCurrent) divCurrent.textContent = `₹${currentBalance}`;

  // Update total income (without subtracting expenses)
  const divTotal = document.querySelector(".hi-total-income");
  if (divTotal) divTotal.textContent = `₹${totalIncome}`;
}

export function renderRecentTransactions() {
  const container = document.querySelector(".recent-transactions");
  if (!container) return;

  // Sort eiTracker by date (newest first)
  const sortedTransactions = [...eiTracker].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Take only the 5 most recent
  const recentFive = sortedTransactions.slice(0, 5);

  if (recentFive.length === 0) {
    container.innerHTML = "No transactions yet :)";
    return;
  }

  // Build HTML
  const html = recentFive
    .map((tx) => {
      const sign = tx.type === "expense" ? "-" : "+";
      return `
        <div class="transaction-item">
  <div class="transaction-details">
    <div class="recent-description-title">${tx.title}</div>
    <div class="recent-amount ${tx.type}">   ${sign}₹${tx.amount}</div>
  </div>
  <div class="transaction-time">
    <div class="recent-item-category">${tx.category}</div>
    <div class="recent-item-date">${tx.date}</div>
  </div>
</div>

      `;
    })
    .join("");

  container.innerHTML = html;
}
// Add this function to update the transaction count
// Add this function to update the transaction count
export function updateTransactionCount(data = eiTracker) {
    const countElement = document.getElementById("transaction-count");
    if (countElement) {
        countElement.textContent = `${data.length} transactions total`;
    }
}
// Global state to track sorting
let currentSort = {
    key: 'date', // 'date' or 'amount'
    direction: 'desc' // 'asc' or 'desc'
};

export function initSortListeners() {
    const sortDateBtn = document.getElementById('sort-date');
    const sortAmountBtn = document.getElementById('sort-amount');

    sortDateBtn?.addEventListener('click', () => {
        handleSort('date');
    });

    sortAmountBtn?.addEventListener('click', () => {
        handleSort('amount');
    });

    // Initial sort on load (by date descending)
    sortTransactions();
}

function handleSort(key) {
    // 1. Toggle direction if the same key is clicked
    if (currentSort.key === key) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        // 2. Set new key and default to descending
        currentSort.key = key;
        currentSort.direction = 'desc';
    }
    
    // 3. Perform the sort and update the UI
    sortTransactions();
}

function sortTransactions() {
    // Create a copy of the array to sort (eiTracker is the main data source)
    const sortedList = [...eiTracker].sort((a, b) => {
        let valA, valB;

        if (currentSort.key === 'date') {
            // Compare dates
            valA = new Date(a.date);
            valB = new Date(b.date);
        } else if (currentSort.key === 'amount') {
            // Compare amounts (as numbers)
            // Use Math.abs() to sort by magnitude regardless of expense/income type
            valA = Math.abs(Number(a.amount)); 
            valB = Math.abs(Number(b.amount));
        } else {
            return 0; // No change
        }

        let comparison = 0;
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }

        // Apply direction: 'asc' uses 1*comparison, 'desc' uses -1*comparison
        return currentSort.direction === 'asc' ? comparison : comparison * -1;
    });

    // Update the UI
    updateSortIcons();
    renderList(sortedList); // Pass the sorted list to the renderer
}

function updateSortIcons() {
    const dateIcon = document.getElementById('date-sort-icon');
    const amountIcon = document.getElementById('amount-sort-icon');

    // Reset icons
    if(dateIcon) dateIcon.style.transform = '';
    if(amountIcon) amountIcon.style.transform = '';

    // Apply active icon style
    if (currentSort.key === 'date' && dateIcon) {
        dateIcon.style.transform = currentSort.direction === 'desc' ? 'rotate(180deg)' : 'none';
        dateIcon.style.opacity = '1';
    } else if (currentSort.key === 'amount' && amountIcon) {
        amountIcon.style.transform = currentSort.direction === 'desc' ? 'rotate(180deg)' : 'none';
        amountIcon.style.opacity = '1';
    }
}