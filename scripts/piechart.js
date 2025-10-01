// piechart.js
import { expenseList } from "../data/expense.js";

let expenseChart;

export function renderExpensePieChart() {
  const canvas = document.getElementById("expensePieChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Categories
  const categories = [
    "food",
    "transport",
    "shopping",
    "bills",
    "entertainment",
    "coffee",
    "others"
  ];

  // Initialize totals
  const categoryTotals = {};
  categories.forEach((cat) => (categoryTotals[cat] = 0));

  // Sum by category
  expenseList.forEach((exp) => {
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += Number(exp.amount);
    } else {
      categoryTotals["others"] += Number(exp.amount);
    }
  });

  // Colors
  const colors = [
    "#4285F4", // Food
    "#34A853", // Transport
    "#8B5CF6", // Shopping
    "#FBBC05", // Bills
    "#FF6B6B", // Entertainment
    "#8E44AD", // Coffee
    "#95A5A6"  // Others
  ];

  const data = {
    labels: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const config = {
    type: "doughnut", // donut style
    data: data,
    options: {
      responsive: true,
      cutout: "57%", // donut hole size
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw;
              return `${context.label}: ₹${value}`;
            }
          }
        }
      }
    }
  };

  // Destroy old chart if exists
  if (expenseChart) expenseChart.destroy();
  expenseChart = new Chart(ctx, config);

  // --- Custom Legend ---
  const legendContainer = document.getElementById("chart-legend");
  if (!legendContainer) return;
  legendContainer.innerHTML = "";

  categories.forEach((cat, idx) => {
    const total = categoryTotals[cat];
    if (total === 0) return;

    const color = colors[idx];
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    legendItem.innerHTML = `
      <span class="legend-circle" style="background-color:${color};"></span>
      <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}: ₹${total}</span>
    `;

    legendContainer.appendChild(legendItem);
  });
}
