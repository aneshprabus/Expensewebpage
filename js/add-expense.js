document.addEventListener("DOMContentLoaded", async () => {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "index.html";
        return;

    }

    document
        .getElementById("expenseForm")
        .addEventListener("submit", async (e) => {

            e.preventDefault();

            const { error } = await supabaseClient
                .from("expenses")
                .insert({

                    user_id: session.user.id,

                    expense_date: document.getElementById("expenseDate").value,

                    expense_name: document.getElementById("expenseName").value,

                    category: document.getElementById("category").value,

                    amount: parseFloat(document.getElementById("amount").value),

                    payment_method: document.getElementById("paymentMethod").value,

                    notes: document.getElementById("notes").value

                });

            if (error) {

                alert(error.message);

                return;

            }

            alert("Expense Saved Successfully!");

            window.location.href = "dashboard.html";

        });

});
