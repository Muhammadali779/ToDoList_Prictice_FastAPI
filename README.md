# ToDoList_Prictice_FastAPI# 📘 TaskFlow – Multi-Tenant Task Management System

**Loyiha turi:** Full-stack (Frontend + Backend)
**Texnologiyalar:** FastAPI, PostgreSQL, JavaScript (Frontend), HTML/CSS, Tailwind/Custom CSS
**Maqsad:** Professional task management tizimi, multi-tenant, role-based.

---

## 1️⃣ LOYIHANING MAQSADI

TaskFlow – bu **multi-tenant task management tizimi** bo‘lib, u tashkilotlar, foydalanuvchilar va ularning loyihalari/taqsimlangan vazifalarini boshqarish imkonini beradi.

Frontend zamonaviy UI bilan ta’minlangan: **dark/light mode**, **gold/orange/black ranglar**, **responsive design**.
Backend esa **role-based permission** va **token-based authentication** orqali xavfsizlikni ta’minlaydi.

---

## 2️⃣ FOYDALANUVCHI ROLES

| Role       | Kirish huquqlari                       | Nima qilishi mumkin                                                                                 |
| ---------- | -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Owner**  | To‘liq organization access             | Users qo‘shish/o‘zgartirish, Projects va Tasks yaratish/o‘chirish, Organization settings, Analytics |
| **Admin**  | Organization ichidagi Projects & Tasks | Project yaratish/edit, Task assign/update, Members tasklarini ko‘rish                               |
| **Member** | Faqat o‘z tasklari                     | Task status update, Deadline ko‘rish                                                                |

> **Muhim:** UI tugmalari faqat vizual, backend har doim role tekshiradi.

---

## 3️⃣ UMUMIY FILE STRUKTURASI

```
project-root/
│
├── backend/
│   └── app/
│       ├── api/                       # Routes & Schemas
│       │   ├── auth/                  # Login/Register
│       │   │   ├── routes.py
│       │   │   └── schemas.py
│       │   ├── users/                 # User CRUD
│       │   │   ├── routes.py
│       │   │   └── schemas.py
│       │   ├── organizations/         # Org CRUD + members
│       │   │   ├── routes.py
│       │   │   └── schemas.py
│       │   ├── projects/              # Project CRUD
│       │   │   ├── routes.py
│       │   │   └── schemas.py
│       │   └── tasks/                 # Task CRUD
│       │       ├── routes.py
│       │       └── schemas.py
│       │
│       ├── core/                       # Config & Security
│       │   ├── config.py
│       │   ├── security.py
│       │   └── dependencies.py
│       │
│       ├── models/                     # SQLAlchemy Models
│       │   ├── user.py
│       │   ├── organization.py
│       │   ├── organization_member.py
│       │   ├── project.py
│       │   └── task.py
│       │
│       ├── repositories/               # DB queries abstraction
│       │   ├── user_repository.py
│       │   ├── organization_repository.py
│       │   ├── project_repository.py
│       │   └── task_repository.py
│       │
│       ├── services/                   # Business logic + role check
│       │   ├── auth_service.py
│       │   ├── user_service.py
│       │   ├── organization_service.py
│       │   ├── project_service.py
│       │   └── task_service.py
│       │
│       ├── db/                         # DB session & engine
│       │   ├── base.py
│       │   ├── session.py
│       │   ├── engine.py
│       │   └── init_db.py
│       │
│       ├── tests/                      # Unit/Integration tests
│       │   ├── conftest.py
│       │   ├── test_auth.py
│       │   ├── test_user.py
│       │   ├── test_organization.py
│       │   ├── test_project.py
│       │   └── test_task.py
│       │
│       └── main.py                     # FastAPI entry point
│
├── frontend/
│   ├── index.html                       # Login/Register
│   ├── dashboard.html                   # Owner/Admin
│   ├── my-tasks.html                    # Member
│   ├── css/
│   │   └── style.css                    # Theme, colors, layout
│   └── js/
│       ├── auth.js                      # Login/Register + token
│       ├── api.js                       # API wrapper
│       ├── owner.js                     # Owner UI logic
│       ├── admin.js                     # Admin UI logic
│       └── member.js                    # Member UI logic
│
├── docker-compose.yml
├── .env                                 # DB, JWT secret
└── README.md

```

> Bu struktura backend + frontendni bir joyda professional tarzda ko‘rsatadi.

---

## 4️⃣ POSTGRESQL TABLES

### 🧑 USERS TABLE

| Field           | Type      | Description           |
| --------------- | --------- | --------------------- |
| id              | UUID      | Primary Key           |
| email           | VARCHAR   | Unique                |
| hashed_password | TEXT      | Bcrypt hash           |
| is_active       | BOOLEAN   | User active flag      |
| created_at      | TIMESTAMP | Account creation date |

---

### 🏢 ORGANIZATIONS TABLE

| Field      | Type      | Description                |
| ---------- | --------- | -------------------------- |
| id         | UUID      | Primary Key                |
| name       | VARCHAR   | Organization name          |
| owner_id   | UUID      | FK → users.id              |
| created_at | TIMESTAMP | Organization creation date |

---

### 👥 ORGANIZATION_MEMBERS TABLE

| Field                            | Type      | Description                  |
| -------------------------------- | --------- | ---------------------------- |
| id                               | UUID      | Primary Key                  |
| user_id                          | UUID      | FK → users.id                |
| organization_id                  | UUID      | FK → organizations.id        |
| role                             | VARCHAR   | owner / admin / member       |
| joined_at                        | TIMESTAMP | Member join date             |
| UNIQUE(user_id, organization_id) | -         | Prevent duplicate membership |

> Bu jadval multi-tenant tizimning yuragi hisoblanadi.

---

### 📁 PROJECTS TABLE

| Field           | Type      | Description           |
| --------------- | --------- | --------------------- |
| id              | UUID      | Primary Key           |
| name            | VARCHAR   | Project name          |
| organization_id | UUID      | FK → organizations.id |
| created_by      | UUID      | FK → users.id         |
| is_deleted      | BOOLEAN   | Soft delete flag      |
| created_at      | TIMESTAMP | Project creation date |

---

### ✅ TASKS TABLE

| Field       | Type      | Description               |
| ----------- | --------- | ------------------------- |
| id          | UUID      | Primary Key               |
| title       | VARCHAR   | Task title                |
| description | TEXT      | Task details              |
| status      | VARCHAR   | todo / in_progress / done |
| priority    | VARCHAR   | low / medium / high       |
| deadline    | TIMESTAMP | Deadline                  |
| project_id  | UUID      | FK → projects.id          |
| assigned_to | UUID      | FK → users.id             |
| is_deleted  | BOOLEAN   | Soft delete flag          |
| created_at  | TIMESTAMP | Task creation date        |

---

### 📌 Eslatmalar:

1. **UUID ishlatilishi** barcha primary keylar uchun tavsiya qilinadi.
2. **Soft delete**: `is_deleted` field foydalanuvchiga ko‘rinmay turib, ma’lumotlarni saqlash imkonini beradi.
3. **Multi-tenant**: `organization_members` orqali user → organization → role bog‘lanadi.

---

## 5️⃣ FRONTEND ↔ BACKEND INTEGRATION

* Login → JWT token olinadi
* Token `localStorage`da saqlanadi
* Har bir API requestda token yuboriladi:

```http
Authorization: Bearer <token>
```

* Backend token orqali:

  * `user_id`
  * `organization_id`
  * `role`
    aniqlaydi

* Role-based UI avtomatik frontend orqali boshqariladi:

  * Owner → Dashboard, Projects, Tasks, Users, Settings
  * Admin → Dashboard, Projects, Tasks
  * Member → My Tasks

---

## 6️⃣ API ENDPOINTS

### Authentication

* `POST /api/auth/login`
* `POST /api/auth/register`
* `GET /api/auth/me`

### Organizations

* `GET /api/organizations`
* `POST /api/organizations`
* `GET /api/organizations/{id}/members`
* `POST /api/organizations/{id}/members` (invite user)

### Projects

* `GET /api/organizations/{id}/projects`
* `POST /api/organizations/{id}/projects`

### Tasks

* `GET /api/tasks/my-tasks`
* `PATCH /api/tasks/{id}/status`
* `PUT /api/tasks/{id}`

---

## 7️⃣ DEVELOPMENT SETUP

### Backend

```bash
# Virtual env yaratish
python -m venv venv
source venv/bin/activate

# Dependencies
pip install -r requirements.txt

# Database migration
alembic upgrade head

# Run server
uvicorn app.main:app --reload
```

### Frontend

```bash
# Local server
python -m http.server 8080
# yoki Node.js: npx serve
```

> Backend `http://localhost:8000/api` bilan ishlaydi

---

## 8️⃣ ENV VARIABLES (.env)

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/taskflow
SECRET_KEY=<jwt-secret-key>
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 9️⃣ NEXT STEPS / FUTURE FEATURES

* File upload (task attachments)
* Notifications & reminders
* Real-time updates (WebSockets)
* Analytics dashboard enhancements
* Tests coverage increase

---

## 🔟 TROUBLESHOOTING

* **API connection error:** Backend ishlayotganini tekshiring, `baseUrl` to‘g‘ri ekanligini tekshiring
* **Theme not saving:** Browser localStorage yoqilganligini tekshiring
* **Login redirect issues:** Token `localStorage`da borligini va backend to‘g‘ri response yuborayotganini tekshiring

---

## 💡 TIPS

* **Development:** Browser DevTools’dan foydalaning
* **Testing:** Turli role’lar bilan test qiling
* **Performance:** Chrome Lighthouse
* **Accessibility:** Screen reader bilan tekshirish

---
