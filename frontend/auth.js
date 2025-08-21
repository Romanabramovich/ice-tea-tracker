document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("password").value.trim();
  const correct = "roman";

  if (input === correct) {
    localStorage.setItem("isAuthenticated", "true");
    window.location.href = "form.html";
  } else {
    alert("wrong boyfriend.. maybe you don't deserve me");
  }
});
