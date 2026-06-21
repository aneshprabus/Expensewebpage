// ======================================================
// AI Expense Manager
// Dashboard JavaScript
// ======================================================

// Wait until page loads
document.addEventListener("DOMContentLoaded", async () => {

    // -----------------------------
    // Check whether user is logged in
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

    // GitHub Avatar

    if (user.user_metadata.avatar_url) {

        document.getElementById("avatar").src =
            user.user_metadata.avatar_url;

    }

    // -----------------------------
    // Default Dashboard Values
    // -----------------------------

    document.getElementById("totalExpense").innerHTML = "₹0";

    document.getElementById("budget").innerHTML = "₹0";

    document.getElementById("remaining").innerHTML = "₹0";

    document.getElementById("transactions").innerHTML = "0";

    // -----------------------------
    // Logout
    // -----------------------------

    document.getElementById("logout")
        .addEventListener("click", async () => {

            await supabaseClient.auth.signOut();

            window.location.href = "index.html";

        });

    // -----------------------------
    // Quick Action Buttons
    // -----------------------------

    const buttons = document.querySelectorAll(".quick-actions button");

    buttons[0].addEventListener("click", () => {

        alert("Add Expense page will be created in Phase 2.");

    });

    buttons[1].addEventListener("click", () => {

        alert("Reports module coming in Phase 3.");

    });

    buttons[2].addEventListener("click", () => {

        alert("Budget module coming in Phase 3.");

    });

    buttons[3].addEventListener("click", () => {

        alert("Settings module coming soon.");

    });

    // -----------------------------
    // Welcome Animation
    // -----------------------------

    console.log("===================================");

    console.log("AI Expense Manager Dashboard");

    console.log("Logged in as :", user.email);

    console.log("===================================");

});
