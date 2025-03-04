document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear(); 
    let transactions = []; 

    const form = document.getElementById("transaction-form");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");
    const transactionList = document.getElementById("transaction-list");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");
    const balanceEl = document.getElementById("balance");
    const filterRadios = document.querySelectorAll("input[name='filter']");
    const resetBtn = document.getElementById("reset");

    function updateUI() {
        let totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
        let totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
        let balance = totalIncome - totalExpense;
        totalIncomeEl.innerText = `₹${totalIncome}`;
        totalExpenseEl.innerText = `₹${totalExpense}`;
        balanceEl.innerText = `₹${balance}`;
        transactionList.innerHTML = "";

        let filterType = document.querySelector("input[name='filter']:checked").value;
        let filteredTransactions = transactions.filter(t => filterType === "all" || t.type === filterType);

        filteredTransactions.forEach(transaction => {
            const li = document.createElement("li");
            li.className = `flex justify-between p-3 rounded-xl shadow-md ${transaction.type === "income" ? "bg-green-800" : "bg-red-200"}`;
            li.innerHTML = `${transaction.description} - ₹${transaction.amount} 
                <div>
                    <button class="text-blue-500 hover:underline" onclick="editTransaction('${transaction.id}')">Edit</button>
                    <button class="text-red-500 hover:underline ml-2" onclick="deleteTransaction('${transaction.id}')">Delete</button>
                </div>`;
            transactionList.appendChild(li);
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;

        if (description === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter valid details!");
            return;
        }

        transactions.push({ id: Date.now().toString(), description, amount, type });
        updateUI();
        form.reset();
    });

    window.editTransaction = (id) => {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return;
        descriptionInput.value = transaction.description;
        amountInput.value = transaction.amount;
        typeInput.value = transaction.type;
        transactions = transactions.filter(t => t.id !== id);
        updateUI();
    };

    window.deleteTransaction = (id) => {
        transactions = transactions.filter(t => t.id !== id);
        updateUI();
    };

    filterRadios.forEach(radio => {
        radio.addEventListener("change", updateUI);
    });

    resetBtn.addEventListener("click", () => {
        transactions = [];
        updateUI();
    });

    updateUI();
});

