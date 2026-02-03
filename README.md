# 🏭 Factory Automation Dashboard (MERN Stack)

> A full-stack Industrial IoT (IIoT) simulation system featuring real-time monitoring, automated fault detection, and role-based control.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**FactoryOS** is a comprehensive dashboard designed to simulate and manage industrial machinery. It uses a custom-built physics engine to simulate temperature, vibration, and efficiency metrics, automatically triggering alerts when thresholds are breached.

---

## 📸 Screenshots

![Dashboard View](https://via.placeholder.com/1000x500?text=Dashboard+Overview)
*(Replace this link with your actual screenshot after uploading to GitHub)*

---

## 🚀 Key Features

### 🔌 Intelligent Simulation Engine
- **Physics Modeling:** Simulates realistic machine behavior (heating curves, cooling rates, vibration spikes).
- **Self-Healing:** Machines automatically restart after cooling down from an emergency stop.
- **Chaos Monkey:** Randomly injects faults (overheating, high load) to test system resilience.

### 🛡️ Role-Based Access Control (RBAC)
- **👑 Admin:** Full system access, add/remove machines, emergency shutdown.
- **👷 Engineer:** Can start/stop machines, acknowledge alerts, and assign jobs.
- **👀 Viewer:** Read-only access to live analytics and logs.

### 📊 Real-Time Analytics
- **Live Graphs:** Visualizes Temperature, Efficiency, and Vibration trends (Recharts).
- **Instant Alerts:** Critical (Red) and Warning (Yellow) indicators for immediate attention.
- **Audit Logs:** Tracks every user action and system event for accountability.

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Recharts, Lucide React, Axios, CSS Modules |
| **Backend** | Node.js, Express.js, JWT Authentication |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Tools** | Postman, Git, VS Code |

---

## 📡 API Documentation

The backend provides **13 RESTful endpoints** for managing the factory ecosystem.

### 🔐 1. Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user (Default: Viewer) | Public |
| `POST` | `/api/users/login` | Authenticate and receive JWT Token | Public |
| `GET` | `/api/users/profile` | Get current user details | Private |

### 🤖 2. Machine Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/machines` | Retrieve all machines and live metrics | Public |
| `GET` | `/api/machines/:id` | Get detailed data for a specific machine | Public |
| `POST` | `/api/machines` | Add a new machine to the floor | **Admin** |
| `PUT` | `/api/machines/:id` | Update machine status (Start/Stop) | **Engineer+** |
| `PUT` | `/api/machines/:id/job` | Assign a manufacturing job | **Engineer+** |
| `DELETE` | `/api/machines/:id` | Remove a machine from the system | **Admin** |

### 🚨 3. Alerts & Safety
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/alerts` | Fetch recent system alerts (Limit 50) | Public |
| `PUT` | `/api/alerts/:id/ack` | Acknowledge/Resolve an alert | **Engineer+** |
| `DELETE` | `/api/alerts/:id` | Clear a resolved alert | **Admin** |

### 📜 4. System Logs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/logs` | Retrieve system audit logs | Public |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Connection String (Atlas or Local)

### 1. Clone the Repository
```bash
git clone [https://github.com/Sai1305/factory_automation.git]
(https://github.com/Sai1305/factory_automation.git)
cd factory_automation

### 2. Backend Setup
```bash
cd backend
npm install

###Configure Environment Variables: Create a .env file in the backend/ directory:
#code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_123