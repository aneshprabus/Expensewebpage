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

  let monthlyBudget = 0;

const { data: budgetData } = await supabaseClient
    .from("user_budget")
    .select("*")
    .eq("user_id", user.id)
    .single();

if (budgetData) {

    monthlyBudget = Number(budgetData.monthly_budget);

}

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

 const remaining = monthlyBudget - totalExpense;

const remainingElement = document.getElementById("remaining");

remainingElement.innerHTML =
    "₹" + remaining.toLocaleString();

// Default Color
remainingElement.style.color = "#22c55e"; // Green

// 75% Budget Consumed
if (totalExpense >= monthlyBudget * 0.75 && totalExpense < monthlyBudget) {

    remainingElement.style.color = "#f59e0b"; // Amber

}

// Budget Exceeded
if (totalExpense >= monthlyBudget) {

    remainingElement.style.color = "#ef4444"; // Red

}

    // =====================================
// Monthly Expense Chart
// =====================================

const monthlyTotals = {};

expenses.forEach(expense => {

    const month = expense.expense_date.substring(0, 7);

    if (!monthlyTotals[month]) {

        monthlyTotals[month] = 0;

    }

    monthlyTotals[month] += Number(expense.amount);

});

const labels = Object.keys(monthlyTotals).sort();

const values = labels.map(month => monthlyTotals[month]);

new Chart(

    document.getElementById("expenseChart"),

    {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Monthly Expenses",

                    data: values,

                    borderWidth: 3,

                    fill: true,

                    tension: .3

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    }

);

    // =====================================
// Expense Category Pie Chart
// =====================================

const categoryTotals = {};

expenses.forEach(expense => {

    if (!categoryTotals[expense.category]) {

        categoryTotals[expense.category] = 0;

    }

    categoryTotals[expense.category] += Number(expense.amount);

});

const categoryLabels = Object.keys(categoryTotals);

const categoryValues = Object.values(categoryTotals);

new Chart(

    document.getElementById("categoryChart"),

    {

        type: "pie",

        data: {

            labels: categoryLabels,

            datasets: [

                {

                    data: categoryValues

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                title: {

                    display: true,

                    text: "Expense by Category"

                },

                legend: {

                    position: "right"

                }

            }

        }

    }

);
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

document.getElementById("setBudget").addEventListener("click", async () => {

    const value = prompt("Enter Monthly Budget");

    if (!value) return;

    const amount = Number(value);

    if (isNaN(amount) || amount < 0) {

        alert("Invalid Budget");
        return;

    }

    const { error } = await supabaseClient
        .from("user_budget")
        .upsert(
            {
                user_id: user.id,
                monthly_budget: amount
            },
            {
                onConflict: "user_id"
            }
        );

    if (error) {

        alert(error.message);
        return;

    }

    alert("Budget Updated Successfully");

    location.reload();

});
    
    console.log("Dashboard Loaded Successfully");

});

// =====================================================
// EXPORT TO EXCEL
// =====================================================

document.getElementById("exportExcel").addEventListener("click", exportExcel);

async function exportExcel() {

    const workbook = XLSX.utils.book_new();

    // =====================================
    // Expense Table
    // =====================================

    const table = document.querySelector("table");

    const worksheet = XLSX.utils.table_to_sheet(table);

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Expenses"
    );

    // =====================================
    // Dashboard Summary
    // =====================================

    const summary = [

        ["AI Expense Manager"],

        [],

        ["Total Expense",
            document.getElementById("totalExpense").innerText],

        ["Monthly Budget",
            document.getElementById("budget").innerText],

        ["Remaining",
            document.getElementById("remaining").innerText],

        ["Transactions",
            document.getElementById("transactions").innerText]

    ];

    const summarySheet =
        XLSX.utils.aoa_to_sheet(summary);

    XLSX.utils.book_append_sheet(

        workbook,

        summarySheet,

        "Summary"

    );

    // =====================================
    // Monthly Line Chart
    // =====================================

    const chart1 = document.getElementById("expenseChart");

    const chart1Image = chart1.toDataURL("image/png");

    const chartSheet1 = XLSX.utils.aoa_to_sheet([

        ["Monthly Expense Chart"],

        ["(Image cannot be embedded in Excel by SheetJS Community Edition)"],

        ["Open Dashboard to view Chart"]

    ]);

    XLSX.utils.book_append_sheet(

        workbook,

        chartSheet1,

        "Monthly Chart"

    );

    // =====================================
    // Category Pie Chart
    // =====================================

    const chart2 = document.getElementById("categoryChart");

    const chart2Image = chart2.toDataURL("image/png");

    const chartSheet2 = XLSX.utils.aoa_to_sheet([

        ["Expense Category Chart"],

        ["(Image cannot be embedded in Excel by SheetJS Community Edition)"],

        ["Open Dashboard to view Chart"]

    ]);

    XLSX.utils.book_append_sheet(

        workbook,

        chartSheet2,

        "Category Chart"

    );

    // =====================================
    // Download
    // =====================================

    XLSX.writeFile(

        workbook,

        "AI_Expense_Manager.xlsx"

    );

}
