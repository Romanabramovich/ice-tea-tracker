document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("password").value.trim();

  if (input === process.env.PASSWORD) {
    localStorage.setItem("isAuthenticated", "true");
    window.location.href = "form.html";
  } else {
    alert("wrong boyfriend.. maybe you don't deserve me");
  }
});
