const themeToggle = document.getElementById("themeToggle");
const body = document.documentElement;

themeToggle.addEventListener("click", () => {
    const isDark = body.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    themeToggle.textContent = isDark ? "🌙" : "☀️";
    localStorage.setItem("theme", newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";