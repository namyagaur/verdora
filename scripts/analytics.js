import { expensesTracker } from "../data/expenses.js";

// --- Pie Chart: Spending by Category ---
export function renderCategoryPieChart() {
  const categoryTotals = {};

  expensesTracker.forEach(exp => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + Number(exp.amount);
  });

  const ctx = document.getElementById("categoryPieChart");
  if (ctx) {
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [
          {
            data: Object.values(categoryTotals),
            backgroundColor: [
              "#FF6384", "#36A2EB", "#FFCE56",
              "#4BC0C0", "#9966FF", "#FF9F40"
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          legend: { display: false }, // legend remove, custom banayenge
          title: {
            display: true,
            // text: "Spending by Category",
            color: "#222",
            font: { size: 18, weight: "bold", family: "Poppins, Arial, sans-serif" }
          }
        },
      },
    });
  }

  // --- Custom Analysis Text ---
  const analysisDiv = document.querySelector(".analysisText");
  if (analysisDiv) {
    analysisDiv.innerHTML = ""; // clear old data
    Object.entries(categoryTotals).forEach(([category, total]) => {
      const row = document.createElement("div");
      row.className = "analysis-row";
      row.innerHTML = `
        <div class="analysis-category">${category}</div>
        <div class="analysis-amount">₹${total.toLocaleString()}</div>
      `;
      analysisDiv.appendChild(row);
    });
  }
}
// --- Line Chart: Monthly Spending Trends ---
export function renderMonthlyLineChart() {
  const monthlyTotals = {};

  expensesTracker.forEach(exp => {
    const month = exp.date.slice(0, 7); // YYYY-MM
    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(exp.amount);
  });

  const sortedMonths = Object.keys(monthlyTotals).sort();
  const totals = sortedMonths.map((month) => monthlyTotals[month]);

  const ctx = document.getElementById("monthlyLineChart");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedMonths,
        datasets: [
          {
            label: "Monthly Expense",
            data: totals,
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#333",
              font: {
                size: 14,
                weight: "600",
                family: "Poppins, Arial, sans-serif",
              },
              padding: 15,
            },
          },
          title: {
            display: true,
            // text: "Monthly Expense Trends",
            color: "#222",
            font: {
              size: 18,
              weight: "bold",
              family: "Poppins, Arial, sans-serif",
            },
            padding: { top: 10, bottom: 20 },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#444",
              font: {
                size: 13,
                family: "Poppins, Arial, sans-serif",
              },
            },
          },
          y: {
            ticks: {
              color: "#444",
              font: {
                size: 13,
                family: "Poppins, Arial, sans-serif",
              },
            },
          },
        },
      },
    });
  }
}

// --- Initialize Charts ---
export function initAnalyticsCharts() {
  renderCategoryPieChart();
  renderMonthlyLineChart();
}
