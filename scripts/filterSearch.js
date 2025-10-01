import { eiTracker, renderList } from "../data/expense.js";

export function initFilters() {
  const categorySelect = document.getElementById("category");
  const timeSelect = document.getElementById("time");
  const searchInput = document.querySelector(".search-text input");
  const incomeOnlyBtn = document.querySelector(".income-only");
  const expenseOnlyBtn = document.querySelector(".expense-only");

  function applyFilters() {
    let filtered = [...eiTracker];

    // category filter
    const categoryVal = categorySelect.value;
    if (categoryVal !== "option1") {
      const selected = categorySelect.options[categorySelect.selectedIndex].text.toLowerCase();
      filtered = filtered.filter((tx) => tx.category.toLowerCase() === selected);
    }

    // time filter
    const timeVal = timeSelect.value;
    if (timeVal !== "option1") {
      const now = new Date();
      let cutoff = new Date();
      if (timeVal === "option2") cutoff.setMonth(now.getMonth() - 1);
      if (timeVal === "option3") cutoff.setMonth(now.getMonth() - 3);
      filtered = filtered.filter((tx) => new Date(tx.date) >= cutoff);
    }

    // search filter
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((tx) => tx.title.toLowerCase().includes(query));
    }

    // income/expense toggle
    const incomeActive = incomeOnlyBtn.classList.contains("active");
    const expenseActive = expenseOnlyBtn.classList.contains("active");

    if (incomeActive && !expenseActive) {
      filtered = filtered.filter((tx) => tx.type === "balance");
    }
    if (!incomeActive && expenseActive) {
      filtered = filtered.filter((tx) => tx.type === "expense");
    }

    renderList(filtered);
  }

  // attach events
  categorySelect.addEventListener("change", applyFilters);
  timeSelect.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);
  incomeOnlyBtn.addEventListener("click", () => {
    incomeOnlyBtn.classList.toggle("active");
    applyFilters();
  });
  expenseOnlyBtn.addEventListener("click", () => {
    expenseOnlyBtn.classList.toggle("active");
    applyFilters();
  });

  // default render
  applyFilters();
}
