console.log("dashboard.js is loaded");
document.addEventListener("DOMContentLoaded", async () => {
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    // not logged in
    window.location.href = "index.html";
    return;
  }

  userEmail.textContent = user.email;

  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
});
