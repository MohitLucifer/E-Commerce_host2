# E-Commerce Full Stack Application

A modern full-stack E-Commerce application built with React.js frontend and Node.js backend with MongoDB database.

## 🚀 Features

- **User Authentication**: Register, Login, and Password Reset functionality
- **Product Management**: Browse products by categories, search functionality
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Place orders, view order history
- **Admin Dashboard**: Product management, user management, order tracking
- **Payment Integration**: Braintree payment gateway integration
- **Responsive Design**: Mobile-friendly UI with modern design

## 🛠️ Tech Stack

### Frontend
- **React.js** - Frontend framework
- **Ant Design** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Braintree** - Payment gateway
- **Multer** - File uploads

## 📁 Project Structure

```
E-Commerce/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   └── styles/        # CSS files
│   └── package.json
├── config/                # Database configuration
├── controllers/           # Route controllers
├── middlewares/           # Custom middlewares
├── models/               # MongoDB models
├── routes/               # API routes
├── server.js             # Express server
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd E-Commerce
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=8080
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   DEV_MODE=development
   BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
   BRAINTREE_PUBLIC_KEY=your_braintree_public_key
   BRAINTREE_PRIVATE_KEY=your_braintree_private_key
   ```

5. **Run the application**

   **Development mode (both frontend and backend):**
   ```bash
   npm run dev
   ```

   **Or run separately:**
   
   Backend only:
   ```bash
   npm run server
   ```
   
   Frontend only:
   ```bash
   npm run client
   ```

## 📱 Available Scripts

- `npm run dev` - Run both frontend and backend in development mode
- `npm run server` - Run only the backend server
- `npm run client` - Run only the React frontend
- `npm start` - Start the production server

## 🔧 Configuration

### Database Configuration
The application uses MongoDB. Make sure to:
1. Set up a MongoDB database (local or cloud)
2. Update the `MONGO_URL` in your `.env` file

### Payment Gateway
The app uses Braintree for payments. To set up:
1. Create a Braintree account
2. Get your merchant credentials
3. Update the Braintree environment variables in `.env`

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset

### Products
- `GET /api/v1/product/get-product` - Get all products
- `GET /api/v1/product/get-product/:slug` - Get single product
- `POST /api/v1/product/create-product` - Create product (Admin)
- `PUT /api/v1/product/update-product/:pid` - Update product (Admin)
- `DELETE /api/v1/product/delete-product/:pid` - Delete product (Admin)

### Categories
- `GET /api/v1/category/get-category` - Get all categories
- `POST /api/v1/category/create-category` - Create category (Admin)

## 👥 User Roles

- **User**: Can browse products, add to cart, place orders
- **Admin**: Can manage products, categories, users, and orders

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for admin functionality
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Render
- Railway
- DigitalOcean

### Frontend Deployment
The React frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Ant Design for the UI components
- React community for the amazing ecosystem
- MongoDB for the database solution
