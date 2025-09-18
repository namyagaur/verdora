export const expenseList = loadList("expenseList") || [];
export const incomeList = loadList("incomeList") || [];
export const savingsList = loadList("savingsList") || [];
export const eiTracker = loadList("eiTracker") || [];

function loadList(list) {
  return JSON.parse(localStorage.getItem(list));
}
function saveList(key, value) {
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
      const activeNav = document.querySelector(".nav-item.active")?.id || " ";

      const selectedCategory = document.querySelector(
        ".category-tabs.active"
      ).id;

      if (!finalAmount || !finalTitle || !finalDate || !selectedCategory) {
        alert("Fill up All Details");
        return;
      }

      const item = {
        id: `${Date.now()}-${finalDate}`,
        amount: finalAmount,
        title: finalTitle,
        date: finalDate,
        category: selectedCategory,
      };

      if (activeNav === "expense") {
        expenseList.push(item);
        eiTracker.push(item);
        saveList("eiTracker", eiTracker);
        saveList("expenseList", expenseList);
      }
      if (activeNav === "income") {
        incomeList.push(item);
        saveList("incomeList", incomeList);
         eiTracker.push(item);
        saveList("eiTracker", eiTracker);
      }
      if (activeNav === "savings") {
        savingsList.push(item);
        saveList("savingsList", savingsList);
      }

      console.log(activeNav);
      console.log(incomeList);
      console.log(expenseList);
      console.log(savingsList);
      console.log(eiTracker);

      // CLEAR INPUTS
      amountInput.value = "";
      titleInput.value = "";
      dateInput.value = "";
      document
        .querySelectorAll(".category-tabs")
        .forEach((g) => g.classList.remove("active"));
    });
  });
}
