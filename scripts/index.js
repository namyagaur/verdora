import { initTransCategory } from "./transactions.js";
import {
  renderList,
  addExpenseList,
  currentExpenseUpdate,
  totalExpenseUpdate,
} from "../data/expense.js";
import { addToWishlist, renderWishList } from "../data/wishlist.js";
import { currentBalanceUpdate, totalBalanceUpdate } from "../data/balance.js";
import { currentsavingsUpdate } from "../data/savings.js";

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
          totalBalanceUpdate();
          totalExpenseUpdate();
        }, 0);
      }
      if (page === "dashboard") {
        setTimeout(() => {
          currentBalanceUpdate();
          currentExpenseUpdate();
          currentsavingsUpdate();
        }, 0);
      }
      if (page === "wishlist") {
        addToWishlist();
        renderWishList();
        // renderWishList();
      }
    })
    .catch(() => {
      mainBody.innerHTML = `Error bhai, ${page}.html nahi mila`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage("wishlist"); // default load

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loadPage(tab.id);
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
