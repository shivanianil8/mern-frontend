import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ProfileSetup from "./pages/ProfileSetup"
import Dashboard from "./pages/Dashboard"
import AddProduct from "./pages/AddProduct"
import ProductList from "./pages/ProductList"
import EditProduct from "./pages/EditProduct"
import ProductDetail from "./pages/ProductDetail"
import Wishlist from "./pages/Wishlist"
import Profile from "./pages/Profile"
import BecomeSeller from "./pages/BecomeSeller"
import SellerDashboard from "./pages/SellerDashboard"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    return null
  }
}

function PrivateRoute({ children }) {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  return localStorage.getItem("token")
    ? <Navigate to="/" replace />
    : children
}

function SellerRoute({ children }) {
  const user = getUser()

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isSeller) {
    return <Navigate to="/become-seller" replace />
  }

  return children
}

function BuyerOnlyRoute({ children }) {
  const user = getUser()

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />
  }

  if (user?.isSeller) {
    return <Navigate to="/seller-dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      {/* Public only */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* Buyer only */}
      <Route
        path="/become-seller"
        element={
          <BuyerOnlyRoute>
            <BecomeSeller />
          </BuyerOnlyRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/profile-setup"
        element={
          <PrivateRoute>
            <ProfileSetup />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/add-product"
        element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        }
      />

      <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductList />
          </PrivateRoute>
        }
      />

<Route
  path="/wishlist"
  element={
    <PrivateRoute>
      <Wishlist />
    </PrivateRoute>
  }
/>
      <Route
        path="/edit-product/:id"
        element={
          <PrivateRoute>
            <EditProduct />
          </PrivateRoute>
        }
      />

      {/* Seller only */}
      <Route
        path="/seller-dashboard"
        element={
          <SellerRoute>
            <SellerDashboard />
          </SellerRoute>
        }
      />

      {/* Product Details */}
      <Route
        path="/product/:id"
        element={<ProductDetail />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}