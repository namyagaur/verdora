export const expenseList = loadList("expenseList") || [];

function loadList(list) {
  return JSON.parse(localStorage.getItem(list));
}
function saveList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function addExpenseList() {
  const inputButtons = document.querySelectorAll(".input-tab");

  inputButtons.forEach((ib) => {
    ib.addEventListener("click", () => {
      const finalAmount = document.getElementById('amount').value;
      const finalTitle = document.getElementById("desc").value;

      const finalDate = document.getElementById("date").value;

      const expenseId = `${Date.now()}-${finalDate}`;

      const selectedCategory = document.querySelector(
        ".category-tabs.active"
      ).id;

      if (!finalAmount || !finalTitle || !finalDate || !selectedCategory) {
        alert("Fill up All Details");
        return;
      }

      const expense = {
        id: expenseId,
        amount: finalAmount,
        title: finalTitle,
        date: finalDate,
        category: selectedCategory,
      };

      expenseList.push(expense);
      saveList("expenseList", expenseList);
    });
  });

  console.log(expenseList);
}
