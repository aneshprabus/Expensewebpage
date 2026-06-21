// ======================================================
// AI Expense Manager
// Dashboard JavaScript
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    // Check Login
    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "index.html";
        return;

    }

    const user = session.user;

    // User Details
    document.getElementById("username").textContent =
        user.user_metadata.user_name ||
        user.user_metadata.preferred_username ||
        user.user_metadata.full_name ||
        user.email.split("@")[0];

    document.getElementById("email").textContent =
        user.email;

    if (user.user_metadata.avatar_url) {

        document.getElementById("avatar").src =
            user.user_metadata.avatar_url;

    }

    // Dashboard Cards
    //document.getElementById("totalExpense").innerHTML = "₹0";
    //document.getElementById("budget").innerHTML = "₹0";
    //document.getElementById("remaining").innerHTML = "₹0";
    //document.getElementById("transactions").innerHTML = "0";
// Monthly Budget (Temporary Fixed Value)
const monthlyBudget = 100000;

document.getElementById("budget").innerHTML =
    "₹" + monthlyBudget.toLocaleString();
    // =====================================
// Load Expenses from Supabase
// =====================================

const { data: expenses, error } = await supabaseClient
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("expense_date", { ascending: false });

if (error) {

    console.error(error);

} else {

    let totalExpense = 0;

    const table = document.getElementById("expenseTable");

    table.innerHTML = "";

    if (expenses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    No expenses added yet.
                </td>
            </tr>
        `;

    } else {

        expenses.forEach(expense => {

    totalExpense += Number(expense.amount);

    table.innerHTML += `
        table.innerHTML += `
<tr>
    <td>${expense.expense_date}</td>
    <td>${expense.expense_name}</td>
    <td>${expense.category}</td>
    <td>₹${Number(expense.amount).toLocaleString()}</td>
    <td>
        <button
            onclick="editExpense(${expense.id})"
            class="edit-btn">
            ✏️ Edit
        </button>
    </td>
</tr>
`;
    `;

});
    }

    document.getElementById("totalExpense").innerHTML =
        "₹" + totalExpense.toLocaleString();

    document.getElementById("transactions").innerHTML =
        expenses.length;

    document.getElementById("remaining").innerHTML =
        "₹" + (monthlyBudget - totalExpense).toLocaleString();

}
    
    // Logout
    document.getElementById("logout").addEventListener("click", async () => {

        await supabaseClient.auth.signOut();

        window.location.href = "index.html";

    });

    // Quick Action Buttons
    const buttons = document.querySelectorAll(".quick-actions button");

    // Add Expense
    buttons[0].addEventListener("click", () => {

        window.location.href = "add-expense.html";

    });

    // Reports
    buttons[1].addEventListener("click", () => {

        alert("Reports module coming in Phase 3.");

    });

    // Budget
    buttons[2].addEventListener("click", () => {

        alert("Budget module coming in Phase 3.");

    });

    // Settings
    buttons[3].addEventListener("click", () => {

        alert("Settings module coming soon.");

    });

    console.log("Dashboard Loaded Successfully");

});

// ===================================
// Edit Expense
// ===================================

function editExpense(id){

    window.location.href =
        `add-expense.html?id=${id}`;

}
