# Automated Inventory Management System

![NodeJS Logo](images/nodejsDark.svg)
![ExpressJS Logo](images/expressjs.svg)
![MongoDB Logo](images/mongodb.svg)

## Project Overview

This project implements a fully functional Automated Inventory Management System designed to help businesses efficiently track and manage their stock. The system provides real-time inventory updates, automates stock level monitoring, and generates reports to assist in decision-making. It also incorporates role-based access control to manage user permissions.

## Features

-   **Real-time Inventory Tracking:** Automatically updates stock levels based on transactions.
-   **Automated Stock Monitoring:** Alerts for low stock levels and tracks stock movements.
-   **Role-Based Access Control:** Different user roles (Admin, Manager, Sales Person) with specific access permissions.
-   **Transaction Management:** Records and manages stock-up and sell-out transactions.
-   **User Management:** Handles user accounts, roles, and status (active/disabled).
-   **Product Management:** Manages product details, including name, description, price, and quantity.
-   **Reporting:** Generates reports for inventory analysis and decision-making (to be implemented).
-   **API Documentation:** Comprehensive API documentation using Swagger/OpenAPI 3.0.0.
-   **Pagination:** Implemented pagination for efficient data retrieval.
-   **Soft Delete:** Products and users can be soft deleted(disabled) rather than permanently deleted.

## Tech Stack

-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB (with Mongoose)
-   **Authentication:**
    -   JSON Web Tokens (JWT)
-   **API Documentation:**
    -   Swagger/OpenAPI 3.0.0
-   **Database:**
    -   MongoDB

## Architecture

-   **RESTful API:** The backend is built using a RESTful API architecture.
-   **MVC (Model-View-Controller):** The Express.js application follows an MVC-like structure for better organization and maintainability.
-   **Middleware:** Utilizes middleware for authentication, authorization, and request handling.
-   **Modular Design:** Routes and controllers are organized into separate modules for better code organization.

## Dependencies

-   `express`: Web framework for Node.js
-   `mongoose`: MongoDB object modeling tool
-   `jsonwebtoken`: JSON Web Token implementation
-   `validator`: String validators and sanitizers
-   `bcrypt`: Password hashing
-   `dotenv`: Loads environment variables from a `.env` file
-   `swagger-ui-express`: Serves Swagger UI for API documentation

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone [repository-url]
    cd [project-directory]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    -   Create a `.env` file in the root directory.
    -   Add the following environment variables:

        ```
        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/inventory-management
        JWT_SECRET=your-secret-key
        ```

    -   Replace `your-secret-key` and `mongodb://localhost:27017/inventory-management` with your actual values.

4.  **Start the server:**

    ```bash
    npm start
    ```

5.  **Access the API documentation:**

    -   Open your browser and navigate to `http://localhost:3000/api-docs`.

## API Endpoints

-   **User Management:**
    -   `GET /users`: Get all users (Admin only).
    -   `GET /users/active-users`: Get all active users (Admin only).
    -   `GET /users/{id}`: Get user by ID.
    -   `PATCH /users/update`: Update user information.
    -   `PATCH /users/update-role`: Update user role (Admin only).
    -   `PATCH /users/disable/{id}`: Disable user (Admin only).
    -   `PATCH /users/enable/{id}`: Enable user (Admin only).
    -   `DELETE /users/delete/{id}`: Delete user (Admin only).
-   **Product Management:**
    -   `GET /products`: Get all products.
    -   `GET /products/{id}`: Get product by ID.
    -   `PUT /products/update/{id}`: Update product (Admin or Manager only).
    -   `DELETE /products/delete/{id}`: Delete product (Admin or Manager only).
-   **Transaction Management:**
    -   `POST /transactions/stock-up`: Stock up inventory (Admin and Manager only).
    -   `POST /transactions/sell-out`: Sell out product (Admin and Sales Person only).
    -   `GET /transactions`: Get all transactions (Admin only).
    -   `GET /transactions/get-by-id/{id}`: Get transaction by ID (Admin and Manager only).
    -   `GET /transactions/get-by-type/{type}`: Get transactions by type (Admin and Manager only).
-   **Authentication:**
    -   `POST /auth/register`: Register a new user.
    -   `POST /auth/login`: Log in a user.

## User Roles and Access Control

-   **Admin:** Has full access to all features, including user management, product management, and transaction management.
-   **Manager:** Can manage products and view transactions.
-   **Sales Person:** Can sell products.

## Future Enhancements

-   Implement reporting functionality.
-   Add more robust error handling and validation.
-   Implement search and filtering for products and transactions.
-   Add unit and integration tests.
-   Implement email notifications for low stock levels.
-   Add a frontend interface.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes.
4.  Push to the branch.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).