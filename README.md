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

### Endpoints

#### POST `/auth/login`
**Overview**: Authenticates a user and returns a JWT access token.
**Request**:
```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```
**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Errors**:
- `401 Unauthorized`: Invalid credentials.

#### POST `/auth/seller`
**Overview**: Registers a new seller and creates an associated user account.
**Request**:
```json
{
  "user": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "password": "StrongPassword123",
    "roles": ["seller"]
  },
  "businessName": "Jane's Crafts",
  "businessType": "Handmade Goods",
  "phoneNumber": "08012345678",
  "addresses": [
    {
      "houseNumber": "10",
      "street": "Market Lane",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria"
    }
  ]
}
```
**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Errors**:
- `400 Bad Request`: Invalid input data, e.g., phone number format, missing fields.
- `404 Not Found`: Email already exists.

#### POST `/auth/buyer`
**Overview**: Registers a new buyer and creates an associated user account.
**Request**:
```json
{
  "user": {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "password": "SecurePassword456",
    "roles": ["buyer"]
  },
  "phoneNumber": "07011223344"
}
```
**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Errors**:
- `400 Bad Request`: Invalid input data.
- `404 Not Found`: Email already exists.

#### POST `/auth/admin`
**Overview**: Registers a new admin and creates an associated user account.
**Request**:
```json
{
  "user": {
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "AdminPassword789",
    "roles": ["admin"]
  },
  "phoneNumber": "09055667788"
}
```
**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Errors**:
- `400 Bad Request`: Invalid input data.
- `404 Not Found`: Email already exists.

#### GET `/user/profile`
**Overview**: Retrieves the profile of the authenticated user.
**Authentication**: JWT required.
**Request**: No body.
**Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "roles": ["buyer"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.

#### PATCH `/user/me`
**Overview**: Updates the profile of the authenticated user.
**Authentication**: JWT required.
**Request**:
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe"
}
```
**Response**:
```json
{
  "message": "user updated succesfully"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `404 Not Found`: User not found.

#### GET `/user`
**Overview**: Retrieves a list of all users.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "roles": ["buyer"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/user/:id`
**Overview**: Retrieves a single user by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: User UUID (e.g., `123e4567-e89b-12d3-a456-426614174000`)
**Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "roles": ["buyer"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `400 Bad Request`: Invalid UUID format.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: User not found.

#### DELETE `/user/:id`
**Overview**: Deletes a user by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: User UUID (e.g., `123e4567-e89b-12d3-a456-426614174000`)
**Response**:
```json
"user deleted successfully"
```
**Errors**:
- `400 Bad Request`: Invalid UUID format.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: User not found.

#### GET `/seller/profile`
**Overview**: Retrieves the profile of the authenticated seller.
**Authentication**: JWT required, Role: `SELLER`.
**Request**: No body.
**Response**:
```json
{
  "id": "uuid-of-seller",
  "businessName": "GreenTech Solutions",
  "businessType": "Renewable Energy",
  "phoneNumber": "08098765432",
  "user": {
    "id": "uuid-of-user",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "roles": ["seller"]
  },
  "addresses": [
    {
      "id": "uuid-of-address",
      "houseNumber": "10",
      "street": "Market Lane",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `SELLER` role.

#### PATCH `/seller/me`
**Overview**: Updates the profile of the authenticated seller.
**Authentication**: JWT required, Role: `SELLER`.
**Request**:
```json
{
  "businessName": "New Business Name",
  "phoneNumber": "09011122334"
}
```
**Response**:
```json
{
  "message": "Seller profile updated successfully"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `SELLER` role.
- `404 Not Found`: Seller profile not found for this user.

#### GET `/seller`
**Overview**: Retrieves a list of all sellers.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-seller",
    "businessName": "GreenTech Solutions",
    "businessType": "Renewable Energy",
    "phoneNumber": "08098765432",
    "user": {
      "id": "uuid-of-user",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "roles": ["seller"]
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/seller/:id`
**Overview**: Retrieves a single seller by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Seller UUID (e.g., `d27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17`)
**Response**:
```json
{
  "id": "uuid-of-seller",
  "businessName": "GreenTech Solutions",
  "businessType": "Renewable Energy",
  "phoneNumber": "08098765432",
  "user": {
    "id": "uuid-of-user",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "roles": ["seller"]
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `400 Bad Request`: Seller ID is required.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Seller not found.

#### DELETE `/seller/:id`
**Overview**: Deletes a seller by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Seller UUID (e.g., `d27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17`)
**Response**:
```json
"seller deleted successfully"
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Seller not found.

#### GET `/buyer/profile`
**Overview**: Retrieves the profile of the authenticated buyer.
**Authentication**: JWT required, Role: `BUYER`.
**Request**: No body.
**Response**:
```json
{
  "id": "uuid-of-buyer",
  "phoneNumber": "07011223344",
  "user": {
    "id": "uuid-of-user",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "roles": ["buyer"]
  },
  "addresses": [],
  "carts": [],
  "transactions": [],
  "orders": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: Buyer not found.

#### GET `/buyer`
**Overview**: Retrieves a list of all buyers.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-buyer",
    "phoneNumber": "07011223344",
    "user": {
      "id": "uuid-of-user",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "roles": ["buyer"]
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/buyer/:id`
**Overview**: Retrieves a single buyer by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Buyer UUID (e.g., `c56a4180-65aa-42ec-a945-5fd21dec0538`)
**Response**:
```json
{
  "id": "uuid-of-buyer",
  "phoneNumber": "07011223344",
  "user": {
    "id": "uuid-of-user",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "roles": ["buyer"]
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Buyer not found.

#### DELETE `/buyer/:id`
**Overview**: Deletes a buyer by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Buyer UUID (e.g., `c56a4180-65aa-42ec-a945-5fd21dec0538`)
**Response**:
```json
"buyer deleted successfully"
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Buyer not found.

#### GET `/admin/profile`
**Overview**: Retrieves the profile of the authenticated admin.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
{
  "id": "uuid-of-admin",
  "phoneNumber": "09055667788",
  "user": {
    "id": "uuid-of-user",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "roles": ["admin"]
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/admin`
**Overview**: Retrieves a list of all admins.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-admin",
    "phoneNumber": "09055667788",
    "user": {
      "id": "uuid-of-user",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "roles": ["admin"]
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/admin/:id`
**Overview**: Retrieves a single admin by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Admin UUID (e.g., `d27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17`)
**Response**:
```json
{
  "id": "uuid-of-admin",
  "phoneNumber": "09055667788",
  "user": {
    "id": "uuid-of-user",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "roles": ["admin"]
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `400 Bad Request`: Admin ID is required.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Admin not found.

#### PATCH `/admin/me`
**Overview**: Updates the profile of the authenticated admin.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**:
```json
{
  "phoneNumber": "08011122334"
}
```
**Response**:
```json
{
  "message": "Admin profile updated successfully"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Admin profile not found for this user.

#### DELETE `/admin/:id`
**Overview**: Deletes an admin by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Admin UUID (e.g., `d27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17`)
**Response**:
```json
"admin deleted successfully"
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Admin not found.

#### GET `/address`
**Overview**: Retrieves a list of all addresses.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-address",
    "houseNumber": "4B",
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "country": "NIGERIA",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### POST `/category`
**Overview**: Creates a new product category.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**:
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "image": "https://example.com/images/electronics.jpg",
  "parentId": null,
  "isActive": true
}
```
**Response**:
```json
"category created successfully"
```
**Errors**:
- `400 Bad Request`: Invalid input data, e.g., parent category not found.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `409 Conflict`: Category with this name already exists.

#### GET `/category`
**Overview**: Retrieves all categories with optional pagination and filtering.
**Authentication**: JWT required, Role: `ADMIN`.
**Query Parameters**:
- `search` (optional): Search by category name (e.g., `Electronics`)
- `isActive` (optional): Filter by active status (e.g., `true`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
**Request**: No body.
**Response**:
```json
{
  "data": [
    {
      "id": "uuid-of-category",
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      "image": "https://example.com/images/electronics.jpg",
      "isActive": true,
      "parentId": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/category/:id`
**Overview**: Retrieves a single category by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Category UUID (e.g., `uuid-string-here`)
**Response**:
```json
{
  "id": "uuid-of-category",
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "image": "https://example.com/images/electronics.jpg",
  "isActive": true,
  "parentId": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "products": []
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Category not found.

#### PATCH `/category/:id`
**Overview**: Updates an existing category.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**:
```json
{
  "name": "Updated Electronics",
  "description": "Updated description for electronics",
  "isActive": false
}
```
**Path Parameters**:
- `id`: Category UUID (e.g., `uuid-string-here`)
**Response**:
```json
"category updated successfully"
```
**Errors**:
- `400 Bad Request`: Invalid parent category ID, category cannot be its own parent.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Category not found.
- `409 Conflict`: Category with this name already exists.

#### DELETE `/category/:id`
**Overview**: Deletes a category.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Category UUID (e.g., `uuid-string-here`)
**Response**:
```json
"Category deleted successfully"
```
**Errors**:
- `400 Bad Request`: Cannot delete category with associated products or subcategories.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Category not found.

#### POST `/product`
**Overview**: Creates a new product.
**Authentication**: JWT required, Role: `SELLER`.
**Request**:
```json
{
  "name": "Samsung Galaxy S23",
  "description": "Latest Samsung flagship smartphone",
  "price": 1200,
  "stock": 50,
  "categoryId": "8d4f28e2-f45b-4e17-a2a8-40b0b1e2a589",
  "images": [
    "<file_upload_1>",
    "<file_upload_2>"
  ]
}
```
**Request Type**: `multipart/form-data`
**Response**:
```json
"Product created successfully"
```
**Errors**:
- `400 Bad Request`: Invalid input data, at least one image is required, invalid category, invalid seller.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `SELLER` role.

#### GET `/product/all-my-products`
**Overview**: Retrieves all products belonging to the authenticated seller.
**Authentication**: JWT required, Role: `SELLER`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-product",
    "name": "Samsung Galaxy S23",
    "description": "Latest Samsung flagship smartphone",
    "price": 1200,
    "stock": 50,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "category": { /* ... */ },
    "images": [ { /* ... */ } ],
    "seller": { /* ... */ }
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `SELLER` role.
- `400 Bad Request`: Invalid seller.

#### GET `/product`
**Overview**: Retrieves all products with optional filters and pagination.
**Query Parameters**:
- `search` (optional): Search by product name (e.g., `phone`)
- `category` (optional): Filter by category name (e.g., `Electronics`)
- `minPrice` (optional): Minimum price filter (e.g., `5000`)
- `maxPrice` (optional): Maximum price filter (e.g., `50000`)
- `sortBy` (optional): Sort products by `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest` (default: `newest`)
- `page` (optional): Page number (starts from 0, default: 0)
- `size` (optional): Number of items per page (max 10, default: 10)
**Request**: No body.
**Response**:
```json
{
  "totalItems": 150,
  "items": [
    {
      "id": "uuid-of-product",
      "name": "Samsung Galaxy S23",
      "description": "Latest Samsung flagship smartphone",
      "price": 1200,
      "stock": 50,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "category": { /* ... */ },
      "images": [ { /* ... */ } ],
      "seller": { /* ... */ }
    }
  ],
  "page": 0,
  "size": 10,
  "totalPages": 8,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```
**Errors**:
- `400 Bad Request`: Invalid query parameters.

#### GET `/product/:id`
**Overview**: Retrieves a single product by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Product UUID (e.g., `uuid-of-product`)
**Response**:
```json
{
  "id": "uuid-of-product",
  "name": "Samsung Galaxy S23",
  "description": "Latest Samsung flagship smartphone",
  "price": 1200,
  "stock": 50,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "category": { /* ... */ },
  "images": [ { /* ... */ } ],
  "seller": { /* ... */ }
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Product not found.

#### PATCH `/product/:id`
**Overview**: Updates an existing product. Only the authenticated seller can update their own products.
**Authentication**: JWT required, Role: `SELLER`.
**Request**:
```json
{
  "description": "Updated description for the S23",
  "price": 1150
}
```
**Path Parameters**:
- `id`: Product UUID (e.g., `uuid-of-product`)
**Response**:
```json
"Product updated successfully"
```
**Errors**:
- `400 Bad Request`: Invalid seller.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `SELLER` role.
- `404 Not Found`: Invalid product.

#### DELETE `/product/:id`
**Overview**: Deletes a product. Sellers can only delete their own products, while Admins can delete any product.
**Authentication**: JWT required, Role: `SELLER` or `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Product UUID (e.g., `uuid-of-product`)
**Response**:
```json
"Product deleted successfully"
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User is not allowed to delete this product (either not owner or not admin).
- `404 Not Found`: Product not found.

#### POST `/cart-item/add-to-cart`
**Overview**: Adds a product to the authenticated buyer's cart. If an active cart doesn't exist, one will be created. If the product is already in the cart, its quantity will be incremented.
**Authentication**: JWT required, Role: `BUYER`.
**Request**:
```json
{
  "productId": "bfa3e7ad-74d4-4e7e-8f4b-74b122a6c6f9",
  "priceAtTime": 15000
}
```
**Response**:
```json
{
  "id": "uuid-of-cart-item",
  "quantity": 1,
  "priceAtTime": 15000,
  "total": 15000,
  "product": {
    "id": "bfa3e7ad-74d4-4e7e-8f4b-74b122a6c6f9",
    "name": "Sample Product",
    "description": "A great product",
    "price": 15000,
    "stock": 9
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `400 Bad Request`: Invalid product or request data, out of stock, insufficient stock, price mismatch.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: Buyer or product not found.

#### GET `/cart-item`
**Overview**: Retrieves a list of all cart items across all carts.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-cart-item",
    "quantity": 1,
    "priceAtTime": 15000,
    "total": 15000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "product": { /* ... */ },
    "cart": { /* ... */ }
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Admin not found.

#### GET `/cart-item/:id`
**Overview**: Retrieves a single cart item by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Cart item UUID (e.g., `d3f9c17c-872b-4d6c-b45a-0cdd229b23d9`)
**Response**:
```json
{
  "id": "uuid-of-cart-item",
  "quantity": 1,
  "priceAtTime": 15000,
  "total": 15000,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "product": { /* ... */ },
  "cart": { /* ... */ }
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Admin or cart item not found.

#### PATCH `/cart-item/:id`
**Overview**: Increases or decreases the quantity of a cart item in the authenticated buyer's cart.
**Authentication**: JWT required, Role: `BUYER`.
**Request**:
```json
{
  "action": "increase"
}
```
**Path Parameters**:
- `id`: Cart item UUID (e.g., `d3f9c17c-872b-4d6c-b45a-0cdd229b23d9`)
**Response**:
```json
{
  "id": "uuid-of-cart-item",
  "quantity": 2,
  "priceAtTime": 15000,
  "total": 30000,
  "product": { /* ... */ },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
**Errors**:
- `400 Bad Request`: Quantity cannot be less than 1, insufficient stock.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: Buyer or cart item not found.

#### DELETE `/cart-item/:id`
**Overview**: Removes a cart item from the authenticated buyer's cart.
**Authentication**: JWT required, Role: `BUYER`.
**Request**: No body.
**Path Parameters**:
- `id`: Cart item UUID (e.g., `d3f9c17c-872b-4d6c-b45a-0cdd229b23d9`)
**Response**:
```json
{
  "message": "Cart item deleted successfully"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: Buyer or cart item not found.

#### GET `/cart`
**Overview**: Retrieves all carts in the system.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "uuid-of-cart",
    "status": "active",
    "totalAmount": 15000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "buyer": { /* ... */ },
    "cartItems": [ { /* ... */ } ]
  }
]
```
**Errors**:
- `400 Bad Request`: Invalid admin.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.

#### GET `/cart/my-cart`
**Overview**: Retrieves the active cart for the authenticated buyer.
**Authentication**: JWT required, Role: `BUYER`.
**Request**: No body.
**Response**:
```json
{
  "id": "uuid-of-cart",
  "status": "active",
  "totalAmount": 15000,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "buyer": { /* ... */ },
  "cartItems": [
    {
      "id": "uuid-of-cart-item",
      "quantity": 1,
      "priceAtTime": 15000,
      "total": 15000,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "product": { /* ... */ }
    }
  ]
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: No active cart found.

#### POST `/payment/checkout`
**Overview**: Initializes a new payment transaction for the authenticated buyer's cart. Creates an order and redirects to Paystack for payment.
**Authentication**: JWT required, Role: `BUYER`.
**Request**:
```json
{
  "cartId": "123e4567-e89b-12d3-a456-426614174000"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Checkout successful, proceed to payment",
  "data": {
    "order_id": "uuid-of-order",
    "authorization_url": "https://checkout.paystack.com/...",
    "reference": "TXN_16789012345_abc123"
  }
}
```
**Errors**:
- `400 Bad Request`: Cart not found.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: Buyer not found.
- `500 Internal Server Error`: Failed to initialize payment (Paystack error).

#### POST `/payment/ps-webhook`
**Overview**: Paystack webhook handler to update transaction and order status. This endpoint is called by Paystack.
**Request**: Paystack webhook payload.
**Headers**: `x-paystack-signature` for verification.
**Response**:
```json
{
  "success": true
}
```
**Errors**:
- `400 Bad Request`: Invalid signature.

#### GET `/payment/verify/:reference`
**Overview**: Verifies a payment transaction using its reference.
**Request**: No body.
**Path Parameters**:
- `reference`: Paystack transaction reference (e.g., `TXN_16789012345_abc123`)
**Response**:
```json
{
  "success": true,
  "message": "Payment verification completed",
  "data": {
    "reference": "TXN_16789012345_abc123",
    "amount": 15000,
    "status": "success",
    "paid_at": "2024-01-15T10:35:00.000Z",
    "channel": "card"
  }
}
```
**Errors**:
- `400 Bad Request`: Payment verification failed (Paystack error).
- `404 Not Found`: Transaction not found.

#### GET `/order/my-orders`
**Overview**: Retrieves all orders placed by the authenticated buyer.
**Authentication**: JWT required, Role: `BUYER`.
**Request**: No body.
**Response**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "buyer": { /* ... */ },
    "totalAmount": 299.99,
    "status": "paid",
    "paymentReference": "TXN_16789012345_abc123",
    "orderItems": [
      {
        "id": "uuid-of-order-item",
        "price": 149.99,
        "quantity": 2,
        "total": 299.98,
        "product": { /* ... */ },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `BUYER` role.
- `404 Not Found`: Buyer not found.

#### GET `/order/:id`
**Overview**: Retrieves a specific order by ID.
**Authentication**: JWT required, Role: `ADMIN`.
**Request**: No body.
**Path Parameters**:
- `id`: Order UUID (e.g., `123e4567-e89b-12d3-a456-426614174000`)
**Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "buyer": { /* ... */ },
  "totalAmount": 299.99,
  "status": "paid",
  "paymentReference": "TXN_16789012345_abc123",
  "orderItems": [
    {
      "id": "uuid-of-order-item",
      "price": 149.99,
      "quantity": 2,
      "total": 299.98,
      "product": { /* ... */ },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```
**Errors**:
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not have `ADMIN` role.
- `404 Not Found`: Admin or order not found.

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