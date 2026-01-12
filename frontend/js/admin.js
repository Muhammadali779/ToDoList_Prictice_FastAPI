// Admin Dashboard Logic
async function initAdminDashboard() {
    const projects = await request("/projects");
    renderProjects(projects);
}

function renderProjects(projects) {
    const projectGrid = document.getElementById("projectGrid");
    projectGrid.innerHTML = projects.map(p => `
        <div class="card project-card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${p.completion}%"></div>
            </div>
            <button onclick="assignMember('${p.id}')" data-i18n="assign_btn">Assign</button>
        </div>
    `).join('');
}