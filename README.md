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
```
src/
├── auth/ # Authentication module (JWT, roles, guards)
├── config/ # Configuration files (database, environment variables)
├── documents/ # Document management module (upload, update, delete)
├── users/ # User management module (CRUD operations, role assignment)
├── app.module.ts # Root module
└── main.ts # Application entry point
```
[upload_file.py](https://github.com/architattrey/python-fastAPI/blob/main/upload_file.py)  # Python FastAPI server for file uploads
 

   
---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v23 or higher).
- Python (v3.8 or higher).
- PostgreSQL database.(v17.2 or higher)
- npm (Node package manager 11.1.0 or higher).
- pip (Python package manager 24.0 or higher).

---

### **1. Clone the Repository**
```bash
git clone https://github.com/architattrey/nestjs-backend.git
cd nestjs-backend
```

## **2. Set Up the NestJS Application**

### **Install Dependencies:**

```
npm install
```
### **Set Up Environment Variables:**
- Create a .env file in the root directory and add the following variables:
  ```
  PORT=3000
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name
  JWT_SECRET=your_jwt_secret
  UPLOADS_PATH=./uploads
  ```
### **Run the Application:**
```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
- The (development or watch mode) application will be available at http://localhost:3000.

## **Python FastAPI File Upload Server**

This repository contains a simple Python FastAPI server for handling file uploads. The server allows users to upload files, which are then saved to a specified directory on the server.

## **3. Set Up the Python FastAPI Server**

### **Install Dependencies:**
```
pip install fastapi uvicorn
```
### **Run the Server:**
```
uvicorn upload_file:app --reload
```
- The server will be available at http://127.0.0.1:8000.

## **Database Setup**
- Create a PostgreSQL database using the name specified in the .env file.
- Run the application, and TypeORM will automatically create the necessary tables.

---

## **API Documentation**

### **Authentication**
- **POST** /auth/register: Register a new user.
- **POST** /auth/login: Log in and receive a JWT token.
- **POST** /auth/logout: Log out and clear the JWT token.

### **Users**
- **GET** /users: Retrieve all users (admin only).
- **GET** /users/:id: Retrieve a specific user.
- **POST** /users: Create a new user (admin only).
- **PUT** /users/:id: Update a user.
- **DELETE** /users/:id: Delete a user (admin only).
- **POST** /users/roles/:id: Assign roles to a user (admin only).

### **Documents**
- **GET** /documents: Retrieve all documents for the logged-in user.
- **POST** /documents/upload: Upload a new document.
- **PATCH** /documents/:id: Update an existing document.
- **DELETE** /documents/:id: Delete a document.

---
## **Python FastAPI Server**
- The Python FastAPI server handles file uploads and enforces a maximum file size limit of 10MB.

 ### **Endpoints**
  - **POST**: /api/upload
   - **Description:** Uploads a file.
   - **Validation:** Rejects files larger than 10MB.
   - **Response:**
     ```
     {
        "status": "success",
        "filename": "Coding Exercise.pdf",
        "size": 158636
     }
     ```
---
## **Example Workflow**

1.  ### **Register a User:**
   ```
   POST /auth/register
   Body: { "username": "john_doe", "email": "john@example.com", "password": "password123" }
   ```

2.  ### **Log In:**
   ```
   POST /auth/login
   Body: { "email": "john@example.com", "password": "password123" }
   Response: { "access_token": "jwt_token" }
   ```

3.  ### **Upload a Document:**
   ```
   POST /documents/upload
   Headers: { "Authorization": "Bearer jwt_token" }
   Body: FormData with `file` and `title`
   ```

4. ### **Retrieve Documents:**
   ```
   GET /documents
   Headers: { "Authorization": "Bearer jwt_token" }
   ```
---
## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/your-feature).
5. Open a pull request.

---
## **License**
This project is licensed under the[MIT licensed](LICENSE). See the LICENSE file for details.

---
## **Acknowledgments**

- NestJS for the robust backend framework.
- FastAPI for the lightweight and fast file processing server.
- PostgreSQL for the reliable database system.

**Feel free to reach out if you have any questions or need further assistance!**