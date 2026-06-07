# Vendor & Contract Management Portal (VCMP)

## Project Overview

Vendor & Contract Management Portal is a full-stack application built using Node.js, Express.js, MySQL, React.js, Material UI, JWT Authentication, and Role-Based Access Control.

The system manages:

* Vendors
* Contracts
* Purchase Orders
* Invoices
* Users & Roles
* Audit Logs
* Notifications
* Dashboard & Reports

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* bcrypt
* express-validator

### Frontend

* React.js
* React Router v6
* Axios
* Material UI
* React Toastify

---

## Installation

### Backend

```bash
cd backend

npm install

npm start
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Database Setup

1. Create MySQL Database

```sql
CREATE DATABASE vendor_contract_management;
```

2. Execute migration scripts.

3. Run seed script.

---

## Seed Credentials

### Admin

Email:
[admin@finvesco.com](mailto:admin@finvesco.com)

Password:
Admin@123

### Procurement

Email:
[proc@finvesco.com](mailto:proc@finvesco.com)

Password:
Proc@123

### Finance

Email:
[finance@finvesco.com](mailto:finance@finvesco.com)

Password:
Finance@123

---

## Modules Implemented

### Authentication

* Login
* Refresh Token
* Change Password
* Profile Management

### Dashboard

* KPI Summary
* Monthly Spending
* Alerts

### Vendor Management

* Create Vendor
* Edit Vendor
* Approve Vendor
* Status Change
* Soft Delete

### Contract Management

* Create Contract
* Edit Contract
* Approve Contract
* Terminate Contract

### Purchase Orders

* Create PO
* Edit PO
* Status Update
* Cancel PO

### Invoices

* Create Invoice
* Approve Invoice
* Mark Paid
* Dispute Invoice

### Users

* Create User
* Edit User
* View User

### Audit Logs

* View Logs
* Filter By Entity

### Notifications

* View Notifications
* Mark Read

---

## API Documentation

Postman Collection available under:

docs/postman_collection.json

---


---

## Author

Satish Kumar

