 let totalsavings = 0;
 import { savingsList } from "./expense.js";

export function initTotalsavings(){
    totalsavings = 0;
    savingsList.forEach(item => {
    totalsavings += Number(item.amount);
});
return totalsavings;
}

export function currentsavingsUpdate(){
    const tb = initTotalsavings();
    const currentsavingsDiv = document.querySelector('.savings-insights');
    if (currentsavingsDiv) {
        currentsavingsDiv.textContent = `₹${tb}`;
    }
}

