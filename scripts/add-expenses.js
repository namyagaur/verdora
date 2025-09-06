import {addToExpenses,saveToStorage,removeFromExpenses,loadExpenses,expensesTracker,renderExpenses} from "../data/expenses.js";

  const contentDiv = document.getElementById('content');
contentDiv.addEventListener('click', (e)=>{
  const clicked = e.target;
  if(clicked.classList.contains('category-tab')){
    contentDiv.querySelectorAll('.category-tab').forEach(cat => {
      cat.classList.remove('active');
    });
     clicked.classList.add('active');
  }
})

function getCategory(form){
  const activeCategory = form.querySelector('.category-tab.active');
  return activeCategory ? activeCategory.id || activeCategory.textContent : null;
}

// Adding expenses for every add button

  contentDiv.addEventListener('click', (e) => {
    const clicked = e.target;

    if (clicked.classList.contains('add-button')) {
      const form = clicked.closest('.transaction-form');
    const typeOfClicked = form?.dataset?.type;

      const id = Date.now();
      const amount = parseFloat(form.querySelector('input[type="number"]').value);
      const date = form.querySelector('input[type="date"]').value;
      const title = form.querySelector('input[type="text"]').value;
      const category = getCategory(form);
    const type= typeOfClicked;

    if (amount < 1) {
        alert(`${type} input should be greater than 0`); // alert
        return; // stop further execution
    }

    if (!amount || !category) {
      alert("Please fill in all fields");
        return;
      }

    addToExpenses(id,amount,date,title,category,type);
    saveToStorage();


    console.log(expensesTracker);
      form.querySelectorAll('input').forEach(input => input.value = '');
      form.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));

    }
  });