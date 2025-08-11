"use client";
import { useState } from "react";
import Header from "../../@/components/components/HomeComponent/Header";
import Hero from "../../@/components/components/HomeComponent/Hero";
import Categories from "../../@/components/components/HomeComponent/Categories";
import About from "../../@/components/components/HomeComponent/About";
import FeaturedProducts from "../../@/components/components/HomeComponent/FeaturedProducts";
import Stats from "../../@/components/components/HomeComponent/Stats";
import Reviews from "../../@/components/components/HomeComponent/Reviews";
import Footer from "../../@/components/components/HomeComponent/Footer";
import CustomerDashboard from "../../@/components/components/CustomerComponents/CustomerDashboard";
// import ShopOwnerDashboard from "../../@/components/components/HomeComponent/ShopOwnerDashboard";
import DeliveryPartnerDashboard from "../../@/components/components/CustomerComponents/CustomerDashboard";
import LoginPopup from "../../@/components/components/LoginComponents/LoginPopup";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoggedIn && user) {
    if (user.role === "shop_owner") {
      return <ShopOwnerDashboard user={user} onLogout={handleLogout} />;
    } else if (user.role === "delivery_partner") {
      return <DeliveryPartnerDashboard user={user} onLogout={handleLogout} />;
    } else {
      return <CustomerDashboard user={user} onLogout={handleLogout} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLoginClick={() => setShowLoginModal(true)} />
      <main>
        <Hero />
        <Categories />
        <About />
        <FeaturedProducts />
        <Stats />
        <Reviews />
      </main>
      <Footer />

      {showLoginModal && (
        <LoginPopup
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
