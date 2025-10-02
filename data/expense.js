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
      renderExpensePieChart(); 
    });
  });
}

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


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-delete")) {
    const btnid = e.target.dataset.id;
    handleDelete(btnid);
  }
});

function handleDelete(btnid) {
  const deletedItem = eiTracker.find((p) => p.id === btnid);
  if (!deletedItem) return;

  eiTracker.splice(
    eiTracker.findIndex((p) => p.id === btnid),
    1
  );
  saveList("eiTracker", eiTracker);

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
  renderExpensePieChart(); 
}

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
    let totalIncome = balanceList.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    let totalExpense = expenseList.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    let currentBalance = totalIncome - totalExpense;

    const divCurrent = document.querySelector(".current-balance");
    if (divCurrent) divCurrent.textContent = `₹${currentBalance}`;

    const divTotal = document.querySelector(".hi-total-income");
    if (divTotal) divTotal.textContent = `₹${totalIncome}`;
    
    calculateMonthOverMonthChange(); 
}

export function renderRecentTransactions() {
  const container = document.querySelector(".recent-transactions");
  if (!container) return;

  const sortedTransactions = [...eiTracker].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const recentFive = sortedTransactions.slice(0, 5);

  if (recentFive.length === 0) {
    container.innerHTML = "No transactions yet :)";
    return;
  }

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
export function updateTransactionCount(data = eiTracker) {
    const countElement = document.getElementById("transaction-count");
    if (countElement) {
        countElement.textContent = `${data.length} transactions total`;
    }
}
let currentSort = {
    key: 'date', 
    direction: 'desc' 
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

    sortTransactions();
}

function handleSort(key) {
    if (currentSort.key === key) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.key = key;
        currentSort.direction = 'desc';
    }
    
    sortTransactions();
}

function sortTransactions() {
    const sortedList = [...eiTracker].sort((a, b) => {
        let valA, valB;

        if (currentSort.key === 'date') {
            valA = new Date(a.date);
            valB = new Date(b.date);
        } else if (currentSort.key === 'amount') {
            valA = Math.abs(Number(a.amount)); 
            valB = Math.abs(Number(b.amount));
        } else {
            return 0; 
        }

        let comparison = 0;
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }

        return currentSort.direction === 'asc' ? comparison : comparison * -1;
    });

    updateSortIcons();
    renderList(sortedList); 
}

function updateSortIcons() {
    const dateIcon = document.getElementById('date-sort-icon');
    const amountIcon = document.getElementById('amount-sort-icon');

    if(dateIcon) dateIcon.style.transform = '';
    if(amountIcon) amountIcon.style.transform = '';


    if (currentSort.key === 'date' && dateIcon) {
        dateIcon.style.transform = currentSort.direction === 'desc' ? 'rotate(180deg)' : 'none';
        dateIcon.style.opacity = '1';
    } else if (currentSort.key === 'amount' && amountIcon) {
        amountIcon.style.transform = currentSort.direction === 'desc' ? 'rotate(180deg)' : 'none';
        amountIcon.style.opacity = '1';
    }
}

function getBalanceForMonth(targetMonth, targetYear) {
    const incomeThisMonth = balanceList
        .filter(item => {
            const date = new Date(item.date);
            return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const expenseThisMonth = expenseList
        .filter(item => {
            const date = new Date(item.date);
            return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);
        
    return incomeThisMonth - expenseThisMonth;
}

export function calculateMonthOverMonthChange() {
    const today = new Date();
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentMonthBalance = getBalanceForMonth(currentMonth, currentYear);

    let prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    let prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthBalance = getBalanceForMonth(prevMonth, prevYear);
    
    const percentDiv = document.querySelector(".percent");
    if (!percentDiv) return;

    if (prevMonthBalance === 0) {
        if (currentMonthBalance > 0) {
            percentDiv.textContent = `+100% this month`;
             percentDiv.style.color = 'rgba(235, 241, 230, 1)';
        } else if (currentMonthBalance < 0) {
            percentDiv.textContent = `-∞% this month`;
            percentDiv.style.color = 'rgba(245, 225, 225, 1)'; 
        } else {
            percentDiv.textContent = `0% this month`;
            percentDiv.style.color = 'var(--color-text-medium)';
        }
        return;
    }

    const percentageChange = ((currentMonthBalance - prevMonthBalance) / Math.abs(prevMonthBalance)) * 100;
    const roundedChange = Math.round(percentageChange * 10) / 10; 

    const sign = roundedChange >= 0 ? "+" : "";
    
    percentDiv.textContent = `${sign}${roundedChange}% this month`;

    if (roundedChange >= 0) {
        percentDiv.style.color = 'rgba(235, 241, 230, 1)';
    } else {
        percentDiv.style.color = 'rgba(245, 225, 225, 1)'; 
    }
}

