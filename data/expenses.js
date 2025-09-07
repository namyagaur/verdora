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

  let cont = '';
  list.forEach(exp => {
    cont += `
      <div class="expense-item" data-id="${exp.id}">
        <div class="expense-left">
          <div class="expense-amount">₹${exp.amount}</div>
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

  contentArea.innerHTML = cont || "<p>No matching expenses found.</p>";


  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const expenseItem = e.target.closest('.expense-item');
      const id = expenseItem.getAttribute('data-id');
      if (id) {
        removeFromExpenses(id);
        applyFilters(); // filters ke sath re-render
      }
    });
  });
}

export function addToExpenses(id, amount, date, title, category, type) {
  const newExpense = {
    id,
    amount,
    date,
    title,
    category,
    type
  };
  expensesTracker.push(newExpense);
  saveToStorage();
}

export function removeFromExpenses(id) {
  expensesTracker = expensesTracker.filter(e => String(e.id) !== String(id));
  saveToStorage();
}



export function filterExpenses(category) {
  if (category === "All Categories") return expensesTracker;
  return expensesTracker.filter(exp => exp.category === category);
}


export function searchExpenses(searchText) {
  const lower = searchText.toLowerCase();
  return expensesTracker.filter(exp => exp.title.toLowerCase().includes(lower));
}


export function applyFilters() {
  const searchInput = document.querySelector(".expenses-controls input");
  const categorySelect = document.querySelector(".expenses-controls select");

  const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const selectedCategory = categorySelect ? categorySelect.value : "All Categories";

  console.log("🔍 SearchText:", `"${searchText}"`, "| Category:", selectedCategory);

  let filtered = [...expensesTracker]; // copy of all data


  if (selectedCategory && selectedCategory !== "All Categories") {
    filtered = filtered.filter(exp => 
      exp.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
    );
  }


  if (searchText) {
    filtered = filtered.filter(exp => 
      exp.title && exp.title.toLowerCase().trim().includes(searchText)
    );
  }

  renderExpenses(filtered);
}
