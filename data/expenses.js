export let expensesTracker = [];

export function loadExpenses(){
    const storedData = JSON.parse(localStorage.getItem('expensesTracker'));
    expensesTracker = storedData ? storedData : [];
}

export function saveToStorage(){
    localStorage.setItem('expensesTracker',JSON.stringify(expensesTracker));
}

export function addToExpenses(id,amount,date,title,category,type){
    const newExpense ={
        id : id,
        amount : amount,
        date : date,
        title : title,
        category : category,
        type : type
    };
    expensesTracker.push(newExpense);
    saveToStorage();
}

export function removeFromExpenses(id){
    expensesTracker = expensesTracker.filter(e=> e.id !== id)
    saveToStorage();

}