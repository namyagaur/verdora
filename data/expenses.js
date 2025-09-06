export let expensesTracker = [];

export function loadExpenses(){
    const storedData = JSON.parse(localStorage.getItem('expensesTracker'));
    expensesTracker = storedData ? storedData : [];
}

export function saveToStorage(){
    localStorage.setItem('expensesTracker',JSON.stringify(expensesTracker));
}

export function renderExpenses() {
  const contentArea = document.querySelector('.expense-list');
  if (!contentArea) {
    console.warn("⚠️ .expense-list not found in DOM");
    return;
  }

  let cont = '';
  expensesTracker.forEach(exp => {
    cont += `
      <div class="expense-item" data-id = "${exp.id}">
        <div class="expense-left">
          <div class="expense-amount">₹${exp.amount}</div>
          <div class="expense-title">${exp.title}</div>
          <div class="expense-date">${exp.date}</div>
        </div>
        <div class="expense-right">
          <div class="expense-category food">${exp.category}</div>
          <button class="delete-button">🗑️</button>
        </div>
      </div>
    `;
  });

  contentArea.innerHTML = cont;

  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button=>{
    button.addEventListener('click', (e)=>{
      const expenseItem =  e.target.closest('.expense-item');
      const id = expenseItem.getAttribute('data-id');
      if(id){
        removeFromExpenses(id);
        renderExpenses();
      }
    });
  });
}

export function addToExpenses(id,amount,date,title,category,type){
    const newExpense ={
        id : id,
        amount : amount,
        date : date,
        title : title,
        category : category,
        type : type
    };
    expensesTracker.push(newExpense);
    saveToStorage();
}

export function removeFromExpenses(id){
    expensesTracker = expensesTracker.filter(e => String(e.id) !== String(id));
    saveToStorage();
}