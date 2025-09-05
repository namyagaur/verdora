// Include this script in your HTML after loading Chart.js
// Example CDN: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// ----- Pie Chart: Spending by Category -----
const ctxPie = document.getElementById("categoryPieChart").getContext("2d");

const categoryPieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
        labels: ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health", "Other"],
        datasets: [{
            label: "Spending by Category",
            data: [120, 80, 50, 100, 60, 30, 40], // Example data
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#8BC34A"
            ],
            borderWidth: 1,
            borderColor: "#fff"
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `$${context.raw}`;
                    }
                }
            }
        }
    }
});

// ----- Line Chart: Monthly Trends -----
const ctxLine = document.getElementById("monthlyLineChart").getContext("2d");

const monthlyLineChart = new Chart(ctxLine, {
    type: "line",
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        datasets: [{
            label: "Monthly Expenses",
            data: [500, 700, 450, 800, 600, 750, 900, 650, 720], // Example data
            fill: true,
            backgroundColor: "rgba(0, 128, 128, 0.2)",
            borderColor: "#008080",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#008080"
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `$${context.raw}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return `$${value}`;
                    }
                }
            }
        }
    }
});
