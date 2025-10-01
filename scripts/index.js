import { initTransCategory } from "./transactions.js";
import {
  renderList,
  addExpenseList,
  updateBalanceInsights,
  updateExpenseInsights,
  expenseList,
  renderRecentTransactions,
  updateTransactionCount,
  initSortListeners,
} from "../data/expense.js";
import { addToWishlist, initWishlistToggle, renderWishList } from "../data/wishlist.js";
import { currentsavingsUpdate } from "../data/savings.js";
import { initSettingsPage } from "./settings.js";
import { renderExpensePieChart } from "./piechart.js";
import { initFilters } from "./filterSearch.js";

const mainBody = document.querySelector(".main-body");
const tabs = document.querySelectorAll(".icon-tab");

function loadPage(page) {
  fetch(`${page}.html`)
    .then((response) => response.text())
    .then((data) => {
      mainBody.innerHTML = data;

      if (page === "transactions") {
        setTimeout(() => {
          // ensure DOM fully rendered
          initTransCategory();
          addExpenseList();
        }, 0);
      }
      if (page === "expenseList") {
        setTimeout(() => {
          renderList();
          updateBalanceInsights();
          updateExpenseInsights();
          initFilters();
          updateTransactionCount();
          initSortListeners();
          
        }, 0);
      }
      if (page === "dashboard") {
        setTimeout(() => {
          updateBalanceInsights();
          updateExpenseInsights();
          currentsavingsUpdate();
          renderRecentTransactions();

          // Wait until canvas exists
          const canvas = document.getElementById("expensePieChart");
          if (canvas) renderExpensePieChart();
        }, 50); // small delay to ensure DOM is painted
      }
      if (page === "wishlist") {
         setTimeout(() => {
        addToWishlist();
        renderWishList();
        initWishlistToggle();// toggle button works
    }, 50);
      }
      if (page === "settings") {
        setTimeout(() => {
          initSettingsPage();
        }, 0);
      }
    })
    .catch(() => {
      mainBody.innerHTML = `Error bhai, ${page}.html nahi mila`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage("expenseList"); // default load

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loadPage(tab.id);
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
