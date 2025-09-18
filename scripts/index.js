import { initTransCategory } from "./transactions.js";
import { addExpenseList } from "../data/expense.js";

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
    })
    .catch(() => {
      mainBody.innerHTML = `Error bhai, ${page}.html nahi mila`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage("transactions"); // default load

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loadPage(tab.id);
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
