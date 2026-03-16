console.log("dashboard.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");
  const addBtn = document.getElementById("addBtn");
  const msg = document.getElementById("msg");
  const monthTotalEl = document.getElementById("monthTotal");
  const tbody = document.getElementById("expenseTableBody");

  const amountEl = document.getElementById("amount");
  const categoryEl = document.getElementById("category");
  const dateEl = document.getElementById("expense_date");
  const noteEl = document.getElementById("note");

  console.log({
    userEmail,
    logoutBtn,
    addBtn,
    msg,
    monthTotalEl,
    tbody,
    amountEl,
    categoryEl,
    dateEl,
    noteEl
  });

  const { data: authData, error: authError } = await supabaseClient.auth.getUser();
  console.log("getUser:", authData, authError);

  const user = authData?.user;

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  userEmail.textContent = user.email;

  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });

  // default date = today
  dateEl.value = new Date().toISOString().slice(0, 10);

  async function loadExpenses() {
    const { data, error } = await supabaseClient
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false }); 
    
     const monthTotals = new Array(12).fill(0);
data.forEach((row) => {
  const date = new Date(row.expense_date);
  const monthIndex = date.getMonth(); // 0 = Jan

  monthTotals[monthIndex] += Number(row.amount || 0);
});
  
    const totalsRow = document.getElementById("monthTotalsRow");
totalsRow.innerHTML = "";

monthTotals.forEach((total) => {
  const td = document.createElement("td");
  td.textContent = total.toFixed(2);
  totalsRow.appendChild(td);
});  

    console.log("loadExpenses:", data, error);

    if (error) {
      msg.textContent = "❌ " + error.message;
      return;
    }

    tbody.innerHTML = "";

    let monthTotal = 0;
    const currentMonth = new Date().toISOString().slice(0, 7);

    data.forEach((row) => {
      if ((row.expense_date || "").startsWith(currentMonth)) {
        monthTotal += Number(row.amount || 0);
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.expense_date ?? ""}</td>
        <td>${row.category ?? ""}</td>
        <td>${row.note ?? ""}</td>
        <td>${Number(row.amount ?? 0).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    monthTotalEl.textContent = monthTotal.toFixed(2);
  }

  addBtn.addEventListener("click", async () => {
    console.log("Add button clicked");

    const amount = amountEl.value;
    const category = categoryEl.value.trim();
    const expense_date = dateEl.value;
    const note = noteEl.value.trim();

    console.log("form values:", { amount, category, expense_date, note });

    if (!amount || !category || !expense_date) {
      msg.textContent = "❌ Please fill amount, category and date.";
      return;
    }

    const { data: { user } } = await supabaseClient.auth.getUser();

const { data, error } = await supabaseClient
  .from("expenses")
  .insert([
    {
      user_id: user.id,
      amount: Number(amount),
      category: category,
      expense_date: expense_date,
      note: note 
    }
  ])
      .select();

    console.log("insert result:", data, error);

    if (error) {
      msg.textContent = "❌ " + error.message;
      alert(error.message);
      return;
    }
  
    msg.textContent = "✅ Expense added successfully";

    amountEl.value = "";
    categoryEl.value = "";
    noteEl.value = "";
    dateEl.value = new Date().toISOString().slice(0, 10);

    await loadExpenses();
  });

  await loadExpenses();
});
