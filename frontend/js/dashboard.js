document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
    
    if (role === 'owner') {
        loadOwnerFeatures();
    } else if (role === 'admin') {
        document.getElementById('addBtn').style.display = 'none'; // Admin user qo'sholmaydi
        loadAdminFeatures();
    }
});