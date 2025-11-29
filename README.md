# Marketplace API 🛒

## Overview
This is a robust and scalable e-commerce backend API built with **TypeScript**, **NestJS**, and **TypeORM**. It facilitates a comprehensive marketplace experience, connecting buyers and sellers with features including user authentication, product management, shopping cart functionality, order processing, and payment integration. Data is persisted using **PostgreSQL**, and images are managed via **Cloudinary**.

## Features
- **User Management**: Secure authentication and authorization for Admin, Buyer, and Seller roles.
- **Product Catalog**: Create, list, search, filter, and manage products with image uploads to Cloudinary.
- **Category Management**: Organize products with hierarchical categories.
- **Shopping Cart**: Add, update, and remove items from a dynamic shopping cart.
- **Order Processing**: Convert carts into orders and manage their lifecycle.
- **Payment Integration**: Secure payment processing via Paystack webhook and verification.
- **Role-Based Access Control (RBAC)**: Fine-grained access control ensuring secure operations for different user types.
- **Data Persistence**: Reliable data storage using PostgreSQL with TypeORM.
- **Input Validation**: Robust data validation using `class-validator` and `class-transformer`.
- **API Documentation**: Interactive API documentation generated using Swagger.

## Getting Started
To get this project up and running on your local machine, follow these steps.

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/Abdulsamad1109/marketplace-API.git
cd marketplace-API
npm install
# or yarn install
```

### Environment Variables
Create a `.env` file in the root directory and populate it with the following required environment variables:

```plaintext
# Database Configuration
DB_URL="postgresql://user:password@host:port/database"

# JWT Authentication
JWT_SECRET="your_jwt_secret_key"

# Application Port
PORT=3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Paystack Configuration
PAYSTACK_SECRET_KEY="your_paystack_secret_key"
APP_URL="http://localhost:3000" # Or your deployment URL for Paystack webhooks
```

### Running the Application
To run the application in development mode:

```bash
npm run start:dev
# or yarn start:dev
```

For production:

```bash
npm run build
npm run start:prod
# or yarn build && yarn start:prod
```

The API will be available at `http://localhost:3000` (or your specified PORT).
Swagger UI documentation will be available at `http://localhost:3000/marketplace-api`.

## API Documentation
The API follows a RESTful architecture and provides endpoints for various marketplace operations.

### Base URL
`http://localhost:3000` (or your configured `APP_URL`)

### Authentication
All protected endpoints require a JWT Bearer Token in the `Authorization` header.
Example: `Authorization: Bearer <your_jwt_token>`

## Usage
Once the API is running, you can interact with it using tools like Postman, Insomnia, or by integrating it with a frontend application.

1.  **Register as a Seller, Buyer, or Admin** using the `/auth` endpoints.
2.  **Log in** with your registered credentials to obtain a JWT.
3.  **For Sellers**:
    *   Create product categories (if you are also an admin or an admin creates them).
    *   Create new products using `POST /product` (ensure you attach image files).
    *   Manage your products.
4.  **For Buyers**:
    *   Browse products using `GET /product`.
    *   Add products to your cart using `POST /cart-item/add-to-cart`.
    *   View your cart with `GET /cart/my-cart`.
    *   Proceed to checkout with `POST /payment/checkout` and complete the payment via the provided Paystack authorization URL.
    *   View your orders using `GET /order/my-orders`.
5.  **For Admins**:
    *   Manage all users (buyers, sellers, admins) via their respective endpoints.
    *   Manage product categories.
    *   View all products, carts, and orders for monitoring.

## Technologies Used
| Technology       | Description                                                 | Link                                                         |
| :--------------- | :---------------------------------------------------------- | :----------------------------------------------------------- |
| **NestJS**       | A progressive Node.js framework for building efficient, reliable, and scalable server-side applications. | [NestJS](https://nestjs.com/)                                |
| **TypeScript**   | A strongly typed superset of JavaScript that compiles to plain JavaScript. | [TypeScript](https://www.typescriptlang.org/)                |
| **TypeORM**      | An ORM that can run in NodeJS, Browser, React Native, Expo, and Electron platforms and supports PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server, Oracle, SAP Hana, WebSQL databases. | [TypeORM](https://typeorm.io/)                               |
| **PostgreSQL**   | A powerful, open-source object-relational database system. | [PostgreSQL](https://www.postgresql.org/)                    |
| **JWT**          | JSON Web Tokens for secure API authentication.              | [JWT.io](https://jwt.io/)                                    |
| **Passport.js**  | Simple, unobtrusive authentication for Node.js.             | [Passport.js](http://www.passportjs.org/)                    |
| **Bcrypt**       | A library for hashing passwords securely.                   | [Bcrypt](https://www.npmjs.com/package/bcrypt)               |
| **Cloudinary**   | Cloud-based image and video management service.             | [Cloudinary](https://cloudinary.com/)                        |
| **Paystack**     | Online payment gateway for African businesses.              | [Paystack](https://paystack.com/)                            |
| **Swagger (OpenAPI)** | A set of open-source tools built around the OpenAPI Specification that can help you design, build, document, and consume REST APIs. | [Swagger](https://swagger.io/)                               |
| **Class Validator** | Decorator-based validation for TypeScript classes.          | [Class Validator](https://github.com/typestack/class-validator) |
| **Class Transformer** | Decorator-based transformation for TypeScript classes.      | [Class Transformer](https://github.com/typestack/class-transformer) |
| **Axios**        | Promise based HTTP client for the browser and node.js.      | [Axios](https://axios-http.com/)                             |

## Contributing
We welcome contributions to enhance this Marketplace API! If you're interested in improving the project, please follow these guidelines:

*   ✨ **Fork the repository** to your GitHub account.
*   🌿 **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
*   🚀 **Implement your changes**, ensuring that your code adheres to the project's coding standards.
*   ✅ **Write tests** for your changes to maintain robust functionality.
*   📝 **Update documentation** as necessary to reflect your modifications.
*   📦 **Commit your changes** with a clear and concise message: `git commit -m "feat: Add new product search functionality"`.
*   ⬆️ **Push your branch** to your forked repository: `git push origin feature/your-feature-name`.
*   ➡️ **Open a Pull Request** against the `main` branch of this repository. Describe your changes thoroughly in the PR description.

## License
This project is currently **UNLICENSED**. For more details, refer to the `package.json` file.

## Author Info
Developed with precision and passion by:

- **LinkedIn**: [Connect on linkedIn](https://linkedin.com/in/ade-gbadebo-3749b3303)
- **Twitter**: [Connect on X (Formerly twitter)](https://twitter.com/adeAdeGbadebo)

---
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)