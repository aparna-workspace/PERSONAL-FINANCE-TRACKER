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
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", async () => {

  console.log("Add button clicked");

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const expense_date = document.getElementById("expense_date").value;
  const note = document.getElementById("note").value;

  const { data, error } = await supabaseClient
    .from("expenses")
    .insert([
      {
        amount: Number(amount),
        category: category,
        expense_date: expense_date,
        note: note
      }
    ]);

  console.log("Insert result:", data);
  console.log("Insert error:", error);

  if (error) {
    alert(error.message);
  } else {
    alert("Expense added successfully");
  }

});  
});
