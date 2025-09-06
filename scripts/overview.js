import { expensesTracker } from "../data/expenses.js";


export function renderTotalExpenses(){
    let total = 0;
    expensesTracker.forEach(exp =>{
        total += isNaN(Number(exp.amount)) ? 0 : Number(exp.amount);
    });
    const totalExpContent = document.querySelector('.total-expense');
    if (totalExpContent) {
    totalExpContent.textContent = `Total Expense: ₹${total.toFixed(2)}`;
  }

}

export function renderTopCategory() {
  const categoryMap = {};

  expensesTracker.forEach(exp => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const top = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
  const div = document.querySelector('.top-category');

  if (div) {
    div.textContent = top
      ? `🏆 Top Category: ${top[0]} (₹${top[1].toFixed(2)})`
      : `🏆 Top Category: N/A`;
  }
}

export function renderThisMonthExpenses() {
  const currentMonth = new Date().toISOString().slice(0, 7); 
  const monthlyTotal = expensesTracker
    .filter(exp => exp.date.startsWith(currentMonth))
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const el = document.querySelector('.this-month');
  if (el) el.textContent = `📅 This Month: ₹${monthlyTotal.toFixed(2)}`;
}

export function renderAverageExpense() {
  if (expensesTracker.length === 0) return;

  const total = expensesTracker.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const avg = total / expensesTracker.length;

  const el = document.querySelector('.average-expense');
  if (el) el.textContent = `📊 Average Expense: ₹${avg.toFixed(2)}`;
}