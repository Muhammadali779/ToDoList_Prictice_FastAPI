// API Communication Manager

class ApiManager {
    constructor() {
        this.baseUrl = 'http://localhost:8000/api';
        this.token = this.getToken();
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle token expiration
                if (response.status === 401) {
                    this.handleUnauthorized();
                    throw new Error('Session expired. Please login again.');
                }

                throw new Error(data.detail || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Organization endpoints
    async getOrganizations() {
        return this.request('/organizations');
    }

    async createOrganization(name) {
        return this.request('/organizations', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    async getOrganization(id) {
        return this.request(`/organizations/${id}`);
    }

    async updateOrganization(id, data) {
        return this.request(`/organizations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteOrganization(id) {
        return this.request(`/organizations/${id}`, {
            method: 'DELETE',
        });
    }

    // Organization members endpoints
    async getOrganizationMembers(orgId) {
        return this.request(`/organizations/${orgId}/members`);
    }

    async inviteMember(orgId, email, role) {
        return this.request(`/organizations/${orgId}/members`, {
            method: 'POST',
            body: JSON.stringify({ email, role }),
        });
    }

    async updateMemberRole(orgId, userId, role) {
        return this.request(`/organizations/${orgId}/members/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    }

    async removeMember(orgId, userId) {
        return this.request(`/organizations/${orgId}/members/${userId}`, {
            method: 'DELETE',
        });
    }

    // Project endpoints
    async getProjects(orgId) {
        return this.request(`/organizations/${orgId}/projects`);
    }

    async createProject(orgId, projectData) {
        return this.request(`/organizations/${orgId}/projects`, {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    }

    async getProject(projectId) {
        return this.request(`/projects/${projectId}`);
    }

    async updateProject(projectId, data) {
        return this.request(`/projects/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProject(projectId) {
        return this.request(`/projects/${projectId}`, {
            method: 'DELETE',
        });
    }

    // Task endpoints
    async getTasks(projectId) {
        return this.request(`/projects/${projectId}/tasks`);
    }

    async getMyTasks() {
        return this.request('/tasks/my-tasks');
    }

    async createTask(projectId, taskData) {
        return this.request(`/projects/${projectId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async getTask(taskId) {
        return this.request(`/tasks/${taskId}`);
    }

    async updateTask(taskId, data) {
        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTask(taskId) {
        return this.request(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
    }

    async updateTaskStatus(taskId, status) {
        return this.request(`/tasks/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    async assignTask(taskId, userId) {
        return this.request(`/tasks/${taskId}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ assigned_to: userId }),
        });
    }

    // Analytics endpoints
    async getAnalytics(orgId) {
        return this.request(`/organizations/${orgId}/analytics`);
    }

    async getProjectAnalytics(projectId) {
        return this.request(`/projects/${projectId}/analytics`);
    }

    // Search endpoints
    async searchTasks(query) {
        return this.request(`/tasks/search?q=${encodeURIComponent(query)}`);
    }

    async searchProjects(query) {
        return this.request(`/projects/search?q=${encodeURIComponent(query)}`);
    }
}

// Initialize API manager
window.apiManager = new ApiManager();