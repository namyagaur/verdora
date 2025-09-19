export const expenseList = loadList("expenseList") || [];
export const balanceList = loadList("balanceList") || [];
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
      const eiItem = {
        id: `${Date.now()}-${finalDate}`,
        amount: finalAmount,
        title: finalTitle,
        date: finalDate,
        category: selectedCategory,
        type: activeNav,
      };

      if (activeNav === "expense") {
        expenseList.push(item);
        eiTracker.push(eiItem);
        saveList("eiTracker", eiTracker);
        saveList("expenseList", expenseList);
      }
      if (activeNav === "balance") {
        balanceList.push(item);
        saveList("balanceList", balanceList);
        eiTracker.push(eiItem);
        saveList("eiTracker", eiTracker);
      }
      if (activeNav === "savings") {
        savingsList.push(item);
        saveList("savingsList", savingsList);
      }

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

export function renderList() {

 
  const contentDiv = document.querySelector(".ei-list");
  let html = "";
   if(eiTracker.length===0){
    html = "No Expense Yet :) "
    contentDiv.innerHTML = html;
    return;
  }
  eiTracker.forEach((ei) => {
    const isSign = ei.type === "expense" ? "-" : "+";

    html += `<div class="item-wrapper">
    <div class="item-info">
      <div class="item-name">${ei.title}</div>
      <div class="icd-wrapper">
        <div class="item-category">${ei.category}</div>
        <div class="item-date">${ei.date}</div>
      </div>
    </div>
    <div class="item-amount-edit">
      <div class="item-amount" id="${ei.type}-part">${isSign} ₹${ei.amount}</div>
      <div class="item-delete" 
      id="${ei.id}" >🗑️</div>
    </div>
  </div>`;
  });

  contentDiv.innerHTML = html;
  const deleteBtns = document.querySelectorAll(".item-delete");
  deleteBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const btnid = button.id;
      const newList = eiTracker.filter((p) => p.id !== btnid);

      eiTracker.length = 0;
      eiTracker.push(...newList);
      saveList("eiTracker", eiTracker);
      renderList();
    });
  });
}
