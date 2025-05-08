# 🩺 Telemedicine Backend Application

This is a full-stack backend application developed using **Node.js**, **Express.js**, and **MySQL** that powers a telemedicine platform. The backend provides features like patient registration, doctor scheduling, appointment booking, and user authentication.

---

## 🎯 Objective

This project helps students gain practical experience in:

- Building RESTful APIs with Express.js.
- Connecting Node.js applications with MySQL databases.
- Implementing secure user authentication.
- Performing CRUD operations.
- Managing user sessions with cookies.

---

## 🗂️ Features

### 👨‍⚕️ Patients
- Register and log in securely.
- View and update profile.
- Book, view, reschedule, or cancel appointments.
- Delete account (optional).

### 🩺 Doctors
- Added and managed by admin.
- View schedules and assigned appointments.
- Update personal schedule (optional).

### 🛠 Admin
- Manage doctor profiles.
- View all patients and appointments.

### 📅 Appointments
- Patients can book based on doctor availability.
- Status tracking: scheduled, completed, canceled.
- Real-time feedback and validations.

---

## 🧱 Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MySQL (via `mysql2`)
- **Authentication:** `bcrypt`, `express-session`
- **Session Store:** `express-mysql-session`
- **Middleware:** `body-parser`, `cors`

---

## 🗃️ Database Schema

### `patients`
| Column         | Type         |
|----------------|--------------|
| id             | INT (PK)     |
| first_name     | VARCHAR      |
| last_name      | VARCHAR      |
| email          | VARCHAR (UNIQUE) |
| password_hash  | VARCHAR      |
| phone          | VARCHAR      |
| date_of_birth  | DATE         |
| gender         | VARCHAR      |
| address        | TEXT         |

### `doctors`
| Column         | Type         |
|----------------|--------------|
| id             | INT (PK)     |
| first_name     | VARCHAR      |
| last_name      | VARCHAR      |
| specialization | VARCHAR      |
| email          | VARCHAR      |
| phone          | VARCHAR      |
| schedule       | TEXT (JSON or String format) |

### `appointments`
| Column          | Type         |
|-----------------|--------------|
| id              | INT (PK)     |
| patient_id      | INT (FK → patients.id) |
| doctor_id       | INT (FK → doctors.id)  |
| appointment_date| DATE         |
| appointment_time| TIME         |
| status          | ENUM('scheduled', 'completed', 'canceled') |

### `admin`
| Column       | Type         |
|--------------|--------------|
| id           | INT (PK)     |
| username     | VARCHAR      |
| password_hash| VARCHAR      |
| role         | VARCHAR (e.g., 'admin') |

---

## 🚀 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/telemedicine-app.git
   cd telemedicine-app
