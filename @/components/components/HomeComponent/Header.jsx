import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Menu, X, LogIn } from "lucide-react";
import LoginPopup from "../LoginComponents/LoginPopup"; 
import { useNavigate } from "react-router-dom";



export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Products", href: "products" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLogin = (userData) => {
    console.log("Logged in user:", userData);
    setShowLogin(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center cursor-pointer" onClick={()=>navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="ml-2 text-xl font-bold text-slate-800">RentalPro</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => setShowLogin(true)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 hover:text-teal-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white w-fit"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLogin(true);
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Login Popup */}
      {showLogin && (
        <LoginPopup onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </header>
  );
}
