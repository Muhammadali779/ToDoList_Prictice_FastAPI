// Member Dashboard Manager

class MemberManager {
    constructor() {
        this.currentUser = null;
        this.currentView = 'all';
        this.currentFilter = null;
        this.allTasks = [];
        this.init();
    }

    async init() {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            // Load user data
            await this.loadUserData();
            
            // Setup navigation
            this.setupNavigation();
            
            // Setup search
            this.setupSearch();
            
            // Setup logout
            this.setupLogout();
            
            // Load tasks
            await this.loadTasks();
            
        } catch (error) {
            console.error('Member dashboard initialization error:', error);
            this.showNotification('Failed to load dashboard', 'error');
        }
    }

    async loadUserData() {
        const userData = localStorage.getItem('user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserDisplay();
        }
    }

    updateUserDisplay() {
        const userNameEl = document.getElementById('userName');
        const userAvatarEl = document.getElementById('userAvatar');

        if (userNameEl && this.currentUser) {
            userNameEl.textContent = this.currentUser.first_name || this.currentUser.email;
        }

        if (userAvatarEl && this.currentUser) {
            const initial = (this.currentUser.first_name || this.currentUser.email).charAt(0).toUpperCase();
            userAvatarEl.textContent = initial;
        }
    }

    setupNavigation() {
        // View navigation
        const viewItems = document.querySelectorAll('.nav-item[data-view]');
        viewItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.changeView(view);
            });
        });

        // Filter navigation
        const filterItems = document.querySelectorAll('.nav-item[data-filter]');
        filterItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = item.getAttribute('data-filter');
                this.applyFilter(filter);
            });
        });

        // Sort button
        document.getElementById('sortBtn')?.addEventListener('click', () => this.toggleSort());
        
        // Filter button
        document.getElementById('filterBtn')?.addEventListener('click', () => this.showFilterOptions());

        // Modal close
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeTaskModal());
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTasks(e.target.value);
            });
        }
    }

    changeView(view) {
        this.currentView = view;
        
        // Update active nav item
        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.nav-item[data-view="${view}"]`)?.classList.add('active');

        // Update title
        const titles = {
            'all': 'All Tasks',
            'todo': 'To Do Tasks',
            'in-progress': 'In Progress Tasks',
            'done': 'Completed Tasks'
        };
        
        const pageTitleEl = document.getElementById('pageTitle');
        const listTitleEl = document.getElementById('listTitle');
        
        if (pageTitleEl) pageTitleEl.textContent = titles[view] || 'My Tasks';
        if (listTitleEl) listTitleEl.textContent = titles[view] || 'Tasks';

        // Filter and display tasks
        this.displayTasks();
    }

    applyFilter(filter) {
        this.currentFilter = filter === this.currentFilter ? null : filter;
        this.displayTasks();
    }

    async loadTasks() {
        try {
            // Mock data - replace with actual API call: await apiManager.getMyTasks()
            this.allTasks = [
                {
                    id: 1,
                    title: 'Design new landing page',
                    description: 'Create a modern and responsive landing page for the new product launch. Include hero section, features, testimonials, and CTA.',
                    status: 'in_progress',
                    priority: 'high',
                    deadline: '2026-01-15',
                    project: 'Website Redesign'
                },
                {
                    id: 2,
                    title: 'Update user documentation',
                    description: 'Add new features to the user guide and update screenshots',
                    status: 'todo',
                    priority: 'medium',
                    deadline: '2026-01-20',
                    project: 'Documentation'
                },
                {
                    id: 3,
                    title: 'Fix authentication bug',
                    description: 'Resolve login issues reported by users in the support tickets',
                    status: 'done',
                    priority: 'high',
                    deadline: '2026-01-10',
                    project: 'Bug Fixes'
                },
                {
                    id: 4,
                    title: 'Implement search feature',
                    description: 'Add search functionality to the dashboard with filters and sorting',
                    status: 'todo',
                    priority: 'medium',
                    deadline: '2026-01-25',
                    project: 'Features'
                },
                {
                    id: 5,
                    title: 'Write API documentation',
                    description: 'Document all API endpoints with examples and response formats',
                    status: 'in_progress',
                    priority: 'low',
                    deadline: '2026-02-01',
                    project: 'API'
                },
                {
                    id: 6,
                    title: 'Create mobile mockups',
                    description: 'Design mobile-responsive mockups for all major screens',
                    status: 'todo',
                    priority: 'high',
                    deadline: '2026-01-18',
                    project: 'Design'
                },
                {
                    id: 7,
                    title: 'Review code submissions',
                    description: 'Review and approve pending pull requests from team members',
                    status: 'done',
                    priority: 'medium',
                    deadline: '2026-01-12',
                    project: 'Code Review'
                }
            ];

            this.updateStats();
            this.displayTasks();
            
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showNotification('Failed to load tasks', 'error');
        }
    }

    updateStats() {
        const now = new Date();
        
        const todoTasks = this.allTasks.filter(t => t.status === 'todo');
        const inProgressTasks = this.allTasks.filter(t => t.status === 'in_progress');
        const doneTasks = this.allTasks.filter(t => t.status === 'done');
        const overdueTasks = this.allTasks.filter(t => {
            return t.status !== 'done' && new Date(t.deadline) < now;
        });

        document.getElementById('totalTasksCount').textContent = this.allTasks.length;
        document.getElementById('todoCount').textContent = todoTasks.length;
        document.getElementById('inProgressCount').textContent = inProgressTasks.length;
        document.getElementById('doneCount').textContent = doneTasks.length;
        document.getElementById('overdueCount').textContent = overdueTasks.length;
        document.getElementById('progressCount').textContent = inProgressTasks.length;
        document.getElementById('completedCount').textContent = doneTasks.length;
    }

    displayTasks() {
        let filteredTasks = [...this.allTasks];

        // Apply view filter
        if (this.currentView !== 'all') {
            const statusMap = {
                'todo': 'todo',
                'in-progress': 'in_progress',
                'done': 'done'
            };
            filteredTasks = filteredTasks.filter(t => t.status === statusMap[this.currentView]);
        }

        // Apply priority filter
        if (this.currentFilter) {
            filteredTasks = filteredTasks.filter(t => t.priority === this.currentFilter);
        }

        this.renderTasks(filteredTasks);
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasksList');
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-tertiary);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem;">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');

        // Add click handlers
        tasks.forEach(task => {
            const taskElement = container.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.addEventListener('click', () => this.openTaskModal(task));
            }
        });
    }

    createTaskHTML(task) {
        const statusClass = `status-${task.status.replace('_', '-')}`;
        const priorityClass = `priority-${task.priority}`;
        const isOverdue = task.status !== 'done' && new Date(task.deadline) < new Date();
        
        return `
            <div class="task-item" data-task-id="${task.id}" style="cursor: pointer;">
                <div class="task-header">
                    <div style="flex: 1;">
                        <h4 class="task-title">${task.title}</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                            <span class="task-priority ${priorityClass}">${task.priority}</span>
                            <span style="font-size: 0.75rem; color: var(--color-text-tertiary);">•</span>
                            <span style="font-size: 0.875rem; color: var(--color-text-tertiary);">${task.project}</span>
                        </div>
                    </div>
                    ${isOverdue ? `
                        <span style="padding: 0.375rem 0.75rem; background: rgba(239, 68, 68, 0.1); color: #EF4444; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                            Overdue
                        </span>
                    ` : ''}
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-footer">
                    <span class="task-status ${statusClass}">${task.status.replace('_', ' ')}</span>
                    <div class="task-deadline" style="${isOverdue ? 'color: #EF4444;' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>${this.formatDate(task.deadline)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    openTaskModal(task) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTaskTitle');
        const modalContent = document.getElementById('modalTaskContent');

        if (modalTitle) modalTitle.textContent = task.title;
        
        if (modalContent) {
            const isOverdue = task.status !== 'done' && new Date(task.deadline) < new Date();
            
            modalContent.innerHTML = `
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span class="task-status status-${task.status.replace('_', '-')}">${task.status.replace('_', ' ')}</span>
                    ${isOverdue ? '<span style="padding: 0.375rem 0.75rem; background: rgba(239, 68, 68, 0.1); color: #EF4444; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Overdue</span>' : ''}
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-tertiary); margin-bottom: 0.5rem;">Description</h4>
                    <p style="color: var(--color-text-secondary);">${task.description}</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-tertiary); margin-bottom: 0.5rem;">Project</h4>
                        <p style="color: var(--color-text-primary); font-weight: 500;">${task.project}</p>
                    </div>
                    <div>
                        <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-tertiary); margin-bottom: 0.5rem;">Deadline</h4>
                        <p style="color: var(--color-text-primary); font-weight: 500; ${isOverdue ? 'color: #EF4444;' : ''}">${this.formatDate(task.deadline)}</p>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-tertiary); margin-bottom: 0.75rem;">Update Status</h4>
                    <div style="display: flex; gap: 0.75rem;">
                        <button class="btn ${task.status === 'todo' ? 'btn-primary' : 'btn-secondary'}" onclick="window.memberManager.updateTaskStatus(${task.id}, 'todo')" style="flex: 1; padding: 0.75rem;">
                            To Do
                        </button>
                        <button class="btn ${task.status === 'in_progress' ? 'btn-primary' : 'btn-secondary'}" onclick="window.memberManager.updateTaskStatus(${task.id}, 'in_progress')" style="flex: 1; padding: 0.75rem;">
                            In Progress
                        </button>
                        <button class="btn ${task.status === 'done' ? 'btn-primary' : 'btn-secondary'}" onclick="window.memberManager.updateTaskStatus(${task.id}, 'done')" style="flex: 1; padding: 0.75rem;">
                            Done
                        </button>
                    </div>
                </div>
            `;
        }

        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async updateTaskStatus(taskId, newStatus) {
        try {
            // Update local state
            const task = this.allTasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
            }

            // In real app, call API: await apiManager.updateTaskStatus(taskId, newStatus)
            
            this.showNotification('Task status updated successfully', 'success');
            this.closeTaskModal();
            this.updateStats();
            this.displayTasks();
            
        } catch (error) {
            console.error('Error updating task status:', error);
            this.showNotification('Failed to update task status', 'error');
        }
    }

    searchTasks(query) {
        if (!query.trim()) {
            this.displayTasks();
            return;
        }

        const searchQuery = query.toLowerCase();
        const filteredTasks = this.allTasks.filter(task => {
            return task.title.toLowerCase().includes(searchQuery) ||
                   task.description.toLowerCase().includes(searchQuery) ||
                   task.project.toLowerCase().includes(searchQuery);
        });

        this.renderTasks(filteredTasks);
    }

    toggleSort() {
        this.showNotification('Sort feature - Coming soon!', 'info');
    }

    showFilterOptions() {
        this.showNotification('Advanced filter - Coming soon!', 'info');
    }

    setupLogout() {
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                if (confirm('Do you want to logout?')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                }
            });
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add badge styles
const style = document.createElement('style');
style.textContent = `
    .badge {
        background: var(--color-primary);
        color: white;
        padding: 0.125rem 0.5rem;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-left: auto;
    }
`;
document.head.appendChild(style);

// Initialize member manager
document.addEventListener('DOMContentLoaded', () => {
    window.memberManager = new MemberManager();
});