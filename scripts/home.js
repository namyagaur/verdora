
import {addToExpenses,saveToStorage,removeFromExpenses,applyFilters ,loadExpenses,expensesTracker,renderExpenses} from "../data/expenses.js";

import "../scripts/add-expenses.js"
import  "../scripts/overview.js"
import { renderTopCategory, renderTotalExpenses, renderAverageExpense, renderThisMonthExpenses } from "../scripts/overview.js";
import { initAnalyticsCharts } from "./analytics.js";
import { initSettingsPage } from "./settings.js";

const navItems = document.querySelectorAll('.nav-item');
const contentDiv = document.getElementById('content');

function loadPage(name) {
    fetch(`pages/${name}.html`)  
        .then(res => res.text())
        .then(html => {
            contentDiv.innerHTML = html;

            
            if (name === "analytics") {
                initAnalyticsCharts()
            }
            if (name === "expenses") {
                loadExpenses();
                applyFilters(); 

                const searchInput = document.querySelector(".expenses-controls input");
                const categorySelect = document.querySelector(".expenses-controls select");

                if (searchInput) {
                searchInput.addEventListener("input", applyFilters);
                }

                if (categorySelect) {
                categorySelect.addEventListener("change", applyFilters);
                }
            }




            if (name === "overview") {
                initAnalyticsCharts();
                renderTotalExpenses(); 
                renderTopCategory();
                renderAverageExpense();
                renderThisMonthExpenses();
            }
            if (name === "settings") {
                initSettingsPage();
            }
            
        })
        .catch(err => console.error("Error loading page:", err));
}


navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const targetPage = item.dataset.page;
        loadPage(targetPage);
    });
});

window.addEventListener('DOMContentLoaded', () => {
  const defaultNav = document.querySelector('.nav-item[data-page="overview"]');
  defaultNav.classList.add('active');
  loadExpenses();
  loadPage('overview'); 
});
