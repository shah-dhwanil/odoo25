"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../ui/button"
import { Home, CheckCircle, Plus, CreditCard, LogOut } from "lucide-react"
import ShopOwnerDashboardHome from "./ShopOwnerDashboardHome"
import ConfirmOrders from "./ConfirmOrders"
import AddProducts from "./AddProducts"
import MonitorPayments from "./MonitorPayments"
import MyProducts from "./MyProducts"

export default function ShopOwnerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const dummyUser = {
    shopName: "HeavyRent Equipment Rentals",
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "+1 (555) 234-7890",
    address: "42 Industrial Road, Springfield, USA",
    gstNo: "GSTIN123456789",
    totalProducts: 120,
    totalRentals: 87,
    rating: 4.7,
    totalRevenue: 154300, // number so .toLocaleString() works
  };



  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "orders", label: "Orders", icon: CheckCircle },
    { id: "products", label: "Add Products", icon: Plus },
    { id: "payments", label: "Monitor Payments", icon: CreditCard },
    { id: "Product", label: "Product", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="ml-2 text-xl font-bold text-slate-800">RentalPro</span>
              <span className="ml-4 text-sm text-slate-500">Shop Owner Portal</span>
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
                <p className="text-sm text-slate-600">Tech Gear Rentals</p>
                <p className="font-semibold text-slate-800">John Doe</p>
              </div>
              <Button
                variant="outline"
                // onClick={onLogout}
                className="text-slate-600 hover:text-slate-800 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "dashboard" && <ShopOwnerDashboardHome user={dummyUser} />}
          {activeTab === "orders" && <ConfirmOrders user={user} />}
          {activeTab === "products" && <AddProducts user={dummyUser} />}
          {activeTab === "payments" && <MonitorPayments user={user} />}
          {activeTab === "Product" && <MyProducts user={user} />}
        </motion.div>
      </div>
    </div>
  )
}
