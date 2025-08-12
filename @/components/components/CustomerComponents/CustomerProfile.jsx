import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Package, Calendar, LogOut, ShoppingCart } from "lucide-react"
import ProductsGrid from "../../components/CustomerComponents/ProductsGrid"
import CustomerProfile from "../../components/CustomerComponents/CustomerProfile"
import BookingHistory from "../../components/CustomerComponents/BookingHistory"
import Cart from "../CustomerComponents/Cart"
import ProductDetailView from "../../components/CustomerComponents/ProductDetailView"
import ShopDetailView from "../CustomerComponents/ShopDetailView"
import ProfileComponents from "./ProfileComponents"
import axios from "axios"
import { backendurl } from "../../../../src/App"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"

export default function CustomerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("products")
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const [AllProduct, setProduct] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: new Date().toISOString(),
    totalBookings: 0,
    activeBookings: 0
  });
  const token = Cookies.get('token');
  const userid = localStorage.getItem('user_id')
  const navigate = useNavigate();

  const addToCart = (product, quantity, dates, pricing) => {
    const cartItem = {
      id: Date.now(),
      product,
      quantity,
      dates,
      pricing,
      total: quantity * pricing.price * dates.days,
    }
    setCartItems((prev) => [...prev, cartItem])
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setActiveTab("product-detail")
  }

  const handleShopSelect = (shop) => {
    setSelectedShop(shop)
    setActiveTab("shop-detail")
  }

  const tabs = [
    { id: "products", label: "Browse Products", icon: Package },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const u_data = await axios.get(`${backendurl}/users/${userid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Extract and set complete user data
        const apiUserData = u_data.data;
        setUserData({
          name: apiUserData.name || apiUserData.username || 'User',
          email: apiUserData.email || '',
          phone: apiUserData.phone || apiUserData.phoneNumber || '',
          address: apiUserData.address || '123 Main St, City, State 12345',
          joinDate: apiUserData.joinDate || apiUserData.createdAt || new Date().toISOString(),
          totalBookings: apiUserData.totalBookings || 0,
          activeBookings: apiUserData.activeBookings || 0
        });

        // Fetch products data
        const data = await axios.get(`${backendurl}/products/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const result = data.data;
        setProduct(result.products)

        console.log('User data:', apiUserData);
      } catch (e) {
        console.log('Error:', e.response?.data || e.message);
        // Set default values if API fails
        setUserData({
          name: 'User',
          email: '',
          phone: '',
          address: '123 Main St, City, State 12345',
          joinDate: new Date().toISOString(),
          totalBookings: 0,
          activeBookings: 0
        });
      }
    }
    fetchData();
  }, [])

  console.log(AllProduct);
  
  const onLogout = () => {
    navigate('/')
    Cookies.remove("token");
    localStorage.removeItem("role")
    localStorage.removeItem("user_id")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="ml-2 text-xl font-bold text-slate-800">RentalPro</span>
              <span className="ml-4 text-sm text-slate-500">Customer Portal</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                    ? "bg-teal-100 text-teal-700"
                    : "text-slate-600 hover:text-slate-800 hover:bg-gray-100"
                    }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-semibold text-slate-800">{userData.name}</p>
                {userData.email && <p className="text-xs text-slate-500">{userData.email}</p>}
                {userData.phone && <p className="text-xs text-slate-500">{userData.phone}</p>}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 border rounded-md text-slate-600 hover:text-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden border-t pt-4 pb-2">
            <nav className="flex space-x-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? "bg-teal-100 text-teal-700"
                    : "text-slate-600 hover:text-slate-800 hover:bg-gray-100"
                    }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "products" && (
            <ProductsGrid onAddToCart={addToCart} onProductSelect={handleProductSelect} AllProduct={AllProduct} />
          )}
          {activeTab === "product-detail" && selectedProduct && (
            <ProductDetailView
              product={selectedProduct}
              onBack={() => setActiveTab("products")}
              onShopSelect={handleShopSelect}
              onAddToCart={addToCart}
            />
          )}
          {activeTab === "shop-detail" && selectedShop && (
            <ShopDetailView shop={selectedShop} onBack={() => setActiveTab("products")} />
          )}
          {activeTab === "profile" && <ProfileComponents user={userData} />}
          {activeTab === "bookings" && <BookingHistory user={userData} />}
          {activeTab === "cart" && <Cart items={cartItems} onRemoveItem={removeFromCart} user={userData} />}
        </motion.div>
      </div>
    </div>
  )
}