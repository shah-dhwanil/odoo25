import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./main";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";



export const backendurl=import.meta.env.VITE_BACKEND_URL

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage/>}/>
         <Route path="/products/:id" element={<ProductDetailPage />} />



      </Routes>
    </Router>
  );
};  

export default App;
