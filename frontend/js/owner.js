async function loadOwnerData() {
    console.log("Loading Owner Specific Data...");
    const users = await api("/users"); // Backend endpoint
    renderUsers(users || []);
}

function renderUsers(users) {
    const list = document.getElementById("userList");
    if(!list) return;
    list.innerHTML = users.map(u => `
        <tr>
            <td>${u.full_name}</td>
            <td><span class="badge">${u.role}</span></td>
            <td>${u.email}</td>
            <td><button onclick="deleteUser('${u.id}')">🗑️</button></td>
        </tr>
    `).join('');
}

async function deleteUser(id) {
    if(confirm("Are you sure?")) {
        await api(`/users/${id}`, "DELETE");
        loadOwnerData();
    }
}