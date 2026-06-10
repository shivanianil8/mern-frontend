import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ProfileSetup from "./pages/ProfileSetup"
import Dashboard from "./pages/Dashboard"
import AddProduct from "./pages/AddProduct"
import ProductList from "./pages/ProductList"
import EditProduct from "./pages/EditProduct"
import Profile from "./pages/Profile"
import BecomeSeller from "./pages/BecomeSeller"
import SellerDashboard from "./pages/SellerDashboard"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

function PrivateRoute({ children }) {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                      element={<Home />} />
      <Route path="/signup"                element={<Signup />} />
      <Route path="/login"                 element={<Login />} />
      <Route path="/forgot-password"       element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile-setup"         element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
      <Route path="/dashboard"             element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/seller-dashboard"      element={<PrivateRoute><SellerDashboard /></PrivateRoute>} />
      <Route path="/become-seller"         element={<PrivateRoute><BecomeSeller /></PrivateRoute>} />
      <Route path="/profile"               element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/add-product"           element={<PrivateRoute><AddProduct /></PrivateRoute>} />
      <Route path="/products"              element={<PrivateRoute><ProductList /></PrivateRoute>} />
      <Route path="/edit-product/:id"      element={<PrivateRoute><EditProduct /></PrivateRoute>} />
      <Route path="*"                      element={<Navigate to="/" />} />
    </Routes>
  )
}