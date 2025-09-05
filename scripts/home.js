const navItems = document.querySelectorAll('.nav-item');
const contentDiv = document.getElementById('content');

function loadPage(name) {
    fetch(`pages/${name}.html`)  // only pass 'overview', 'expenses', etc.
        .then(res => res.text())
        .then(html => {

            console.log(name);
            contentDiv.innerHTML = html;

            // Run page-specific JS if needed
            if (name === "analytics") {
                loadAnalyticsCharts(); // only if analytics page
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
   console.log(loadPage('overview'));  // automatically fetch overview.html
});