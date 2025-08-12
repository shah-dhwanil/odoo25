import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./main";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AllProduct from "./pages/CustomerPage/AllProduct";
import ShopOwnerDashboard from "../@/components/components/OwnerComponent/ShopOwnerDashboardProps";



export const backendurl = import.meta.env.VITE_BACKEND_URL
export const fileUrl = import.meta.env.VITE_FILE_URL

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />


        {/* customer */}
        <Route path="/Customer" element={<AllProduct />} />
        <Route path="/Customer-products/:id" element={<ProductDetailPage />} />


        {/* Delivery */}
         <Route path="/shop-owner" element={<ShopOwnerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
