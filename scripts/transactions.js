export function initTransCategory() {
  const mainB = document.querySelector(".transactions-box");
  const categoryGroups = document.querySelectorAll(".category-group");
  const inputTabs = document.querySelectorAll(".input-tab");
  const navGroup =     document.querySelectorAll('.nav-item');
  const categoryTabs = document.querySelectorAll('.category-tabs');

  mainB.addEventListener("click", (e) => {
    const navItem = e.target.closest(".nav-item");
    if (!navItem) return;

    const navId = navItem.id;
    const categoryId = `${navId}-categories`;
    const inputId = `${navId}-input`;
    navGroup.forEach(n => n.classList.remove('active'));
    const targetNav = document.getElementById(navId);
    targetNav.classList.add('active');


    categoryGroups.forEach((group) => (group.style.display = "none"));
    inputTabs.forEach((ip) => (ip.style.display = "none"));
    const iid = document.getElementById(inputId);
    const cid = document.getElementById(categoryId);

    if (cid) cid.style.display = "grid";
    if (iid) iid.style.display = "grid";

   });
   categoryTabs.forEach(ct =>{
      ct.addEventListener('click',()=>{

        categoryTabs.forEach(c => c.classList.remove('active'));
        ct.classList.add('active');
      });
    });
}
