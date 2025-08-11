import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./main";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";



export const backendurl=import.meta.env.VITE_BACKEND_URL

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};  

export default App;
