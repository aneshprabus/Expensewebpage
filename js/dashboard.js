// ======================================================
// AI Expense Manager
// Dashboard JavaScript
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    // -----------------------------
    // Check Login
    // -----------------------------

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "index.html";
        return;

    }

    const user = session.user;

    // -----------------------------
    // Display User Information
    // -----------------------------

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

    // -----------------------------
    // Monthly Budget
    // -----------------------------

    const monthlyBudget = 100000;

    document.getElementById("budget").innerHTML =
        "₹" + monthlyBudget.toLocaleString();

    // -----------------------------
    // Load Expenses
    // -----------------------------

    const { data: expenses, error } = await supabaseClient
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("expense_date", { ascending: false });

    const table = document.getElementById("expenseTable");

    table.innerHTML = "";

    let totalExpense = 0;

    if (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="4">Unable to load expenses.</td>
            </tr>
        `;

    } else {

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
                    <tr>
                        <td>${expense.expense_date}</td>
                        <td>${expense.expense_name}</td>
                        <td>${expense.category}</td>
                        <td>₹${Number(expense.amount).toLocaleString()}</td>
                    </tr>
                `;

            });

        }

    }

    // -----------------------------
    // Dashboard Cards
    // -----------------------------

    document.getElementById("totalExpense").innerHTML =
        "₹" + totalExpense.toLocaleString();

    document.getElementById("transactions").innerHTML =
        expenses ? expenses.length : 0;

    document.getElementById("remaining").innerHTML =
        "₹" + (monthlyBudget - totalExpense).toLocaleString();

    // -----------------------------
    // Logout
    // -----------------------------

    document.getElementById("logout").addEventListener("click", async () => {

        await supabaseClient.auth.signOut();

        window.location.href = "index.html";

    });

    // -----------------------------
    // Quick Action Buttons
    // -----------------------------

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
