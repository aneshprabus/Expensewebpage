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

            const user = session.user;

            const { error } = await supabaseClient
                .from("expenses")
                .insert({

                    user_id: user.id,

                    user_name:
                        user.user_metadata.user_name ||
                        user.user_metadata.preferred_username ||
                        user.user_metadata.full_name ||
                        user.email.split("@")[0],

                    email: user.email,

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

            window.location.href = "dashboard.html?refresh=true";

        });

});
