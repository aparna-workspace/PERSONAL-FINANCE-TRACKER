document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Registering...";

    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    const { error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
      msg.textContent = "❌ " + error.message;
      return;
    }

    msg.textContent = "✅ Registration successful! Please check your email to confirm, then login.";
    form.reset();
  });
});
