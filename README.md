 # **NestJS File Upload System with Python FastAPI Integration**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white)

This project is a **NestJS-based file upload system** integrated with a **Python FastAPI server** for file processing. It allows users to upload, update, and delete documents, with role-based access control and JWT authentication. The Python FastAPI server handles file uploads and enforces a maximum file size limit of 10MB.

---

## **Features**
- **User Management**:
  - Create, update, delete, and retrieve users.
  - Assign roles to users (e.g., `admin`, `editor`, `viewer`).
- **Authentication**:
  - JWT-based authentication for secure access.
  - Role-based access control (RBAC).
- **Document Management**:
  - Upload, update, and delete documents.
  - Store document metadata in a PostgreSQL database.
- **File Processing**:
  - Integrates with a Python FastAPI server for file uploads.
  - Enforces a maximum file size limit of 10MB.

---

## **Technologies Used**
- **Backend**:
  - NestJS (Node.js framework).
  - TypeORM (ORM for database operations).
  - PostgreSQL (Relational database).
  - JWT (JSON Web Tokens for authentication).
- **File Processing**:
  - Python FastAPI (Handles file uploads and validation).
- **Tools**:
  - bcrypt (Password hashing).
  - class-validator (Input validation).
  - Multer (File upload handling in NestJS).

---

## **Project Structure**
```src/
├── auth/ # Authentication module (JWT, roles, guards)
├── config/ # Configuration files (database, environment variables)
├── documents/ # Document management module (upload, update, delete)
├── users/ # User management module (CRUD operations, role assignment)
├── app.module.ts # Root module
└── main.ts # Application entry point
upload_file.py # Python FastAPI server for file uploads```