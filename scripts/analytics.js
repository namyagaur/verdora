import { expensesTracker } from "../data/expenses.js";


export function renderCategoryPieChart() {
  const categoryTotals = {};

  expensesTracker.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
  });

  const ctx = document.getElementById("categoryPieChart");
  if (ctx) {
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [{
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Spending by Category" }
        }
      }
    });
  }
}


export function renderMonthlyLineChart() {
  const monthlyTotals = {};

  expensesTracker.forEach(exp => {
    const month = exp.date.slice(0, 7); // "YYYY-MM"
    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(exp.amount);
  });

  const sortedMonths = Object.keys(monthlyTotals).sort();
  const totals = sortedMonths.map(month => monthlyTotals[month]);

  const ctx = document.getElementById("monthlyLineChart");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedMonths,
        datasets: [{
          label: "Monthly Expense",
          data: totals,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Monthly Expense Trends" }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}


export function initAnalyticsCharts() {
  renderCategoryPieChart();
  renderMonthlyLineChart();
}