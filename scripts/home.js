import "../data/expenses.js"
import {addToExpenses,saveToStorage,removeFromExpenses,loadExpenses,expensesTracker,renderExpenses} from "../data/expenses.js";

import "../scripts/add-expenses.js"
import  "../scripts/overview.js"
import { renderTopCategory, renderTotalExpenses, renderAverageExpense, renderThisMonthExpenses } from "../scripts/overview.js";
import { initAnalyticsCharts } from "./analytics.js";

const navItems = document.querySelectorAll('.nav-item');
const contentDiv = document.getElementById('content');

function loadPage(name) {
    fetch(`pages/${name}.html`)  // only pass 'overview', 'expenses', etc.
        .then(res => res.text())
        .then(html => {
            contentDiv.innerHTML = html;

            // Run page-specific JS if needed
            if (name === "analytics") {
                initAnalyticsCharts()// only if analytics page
            }
            if (name === "expenses") {
                renderExpenses(); // only if analytics page
            }
            if (name === "overview") {
                initAnalyticsCharts();
                renderTotalExpenses(); 
                renderTopCategory();
                renderAverageExpense();
                renderThisMonthExpenses();
            }
            
        })
        .catch(err => console.error("Error loading page:", err));
}

// Handle nav clicks
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
   console.log(loadPage('overview'));  // automatically fetch overview.html
});


