// theme.js
const toggleBtn = document.getElementById('themeToggle');
if(toggleBtn) {
    toggleBtn.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem("theme", next);
    };
}

// i18n.js
function changeLang(lang) {
    localStorage.setItem("lang", lang);
    location.reload(); // Real loyihada elementlarni qayta render qilinadi
}