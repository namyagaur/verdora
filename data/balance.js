import { balanceList, eiTracker, expenseList } from "./expense.js";



export function currentBalanceUpdate() {

    let totalexpense = 0;
    expenseList.forEach((item)=>{
        totalexpense += Number(item.amount);
    });

  let totalBalance = 0;
  balanceList.forEach((item) => {
    totalBalance += Number(item.amount);
  });

  const tb = totalBalance-totalexpense;
  const currentBalanceDiv = document.querySelector(".current-balance");
  if (currentBalanceDiv) {
    currentBalanceDiv.textContent = `₹${tb}`; // or `$${tb}` or just tb
  }
}
export function totalBalanceUpdate() {
  let totalBalance = 0;
  eiTracker.forEach((item) => {
    if(item.type==='balance'){
        totalBalance += Number(item.amount);
    }
  });

  const tb = totalBalance;
  const currentBalanceDiv = document.querySelector(".hi-total-income");
  if (currentBalanceDiv) {
    currentBalanceDiv.textContent = `₹${tb}`; // or `$${tb}` or just tb
  }
}
