async function loadDashboard() {

    const {

        data: { session }

    } = await supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "index.html";

        return;

    }

    const user = session.user;

    const name =
        user.user_metadata.full_name ||
        user.user_metadata.user_name ||
        "User";

    document.getElementById("username").innerText = name;

    document.getElementById("email").innerText = user.email;

}

loadDashboard();

document

.getElementById("logout")

.addEventListener("click", async () => {

    await supabaseClient.auth.signOut();

    window.location.href = "index.html";

});
