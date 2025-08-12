import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { X, Mail, Lock, User, Phone, Building } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { backendurl } from "../../../../src/App";
import { useNavigate } from "react-router-dom";

function LoginPopup({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "customer",
    shopName: "",
    address: "",
    gstNo: "",
  });

  const storeAuthData = (access_token, user_id, role) => {
    Cookies.set("token", access_token, { expires: 7 });
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("role", role);
    if(role=="CUSTOMER"){
        navigate('/Customer')
    }
    else if(role=="SHOP_OWNER"){
      navigate('/shop-owner')
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login API call
        console.log("Making login request to:", `${backendurl}/users/login`);
        console.log("Login payload:", {
          email_id: formData.email,
          password: formData.password,
        });

        const response = await axios.post(`${backendurl}/users/login`, {
          email_id: formData.email,
          password: formData.password,
        });

        console.log("Login response:", response);
        console.log("Login response data:", response.data);

        // Store auth data if available
        if (response.data.access_token) {
          storeAuthData(response.data.access_token, response.data.user_id, response.data.role);
          console.log("Auth data stored successfully");
        }

        // Call onLogin callback
        onLogin({
          id: response.data.user_id,
          email: formData.email,
          role: response.data.role,
        });

      } else {
        // Signup API call
        const userTypeMap = {
          customer: "CUSTOMER",
          shop_owner: "SHOP_OWNER",
          delivery_partner: "DELIVERY_PARTNER",
        };

        const signupPayload = {
          email_id: formData.email,
          mobile_no: formData.phone,
          user_type: userTypeMap[formData.role],
          name: formData.name,
          password: formData.password,
        };

        console.log("Making signup request to:", `${backendurl}/users/`);
        console.log("Signup payload:", signupPayload);

        const signupResponse = await axios.post(`${backendurl}/users/`, signupPayload);
        
        console.log("Signup response:", signupResponse);
        console.log("Signup response data:", signupResponse.data);

        // Auto-login after successful signup
        console.log("Auto-login after signup...");
        const loginPayload = {
          email_id: formData.email,
          password: formData.password,
        };

        console.log("Making auto-login request to:", `${backendurl}/users/login`);
        console.log("Auto-login payload:", loginPayload);

        const loginResponse = await axios.post(`${backendurl}/users/login`, loginPayload);
        
        console.log("Auto-login response:", loginResponse);
        console.log("Auto-login response data:", loginResponse.data);

        // Store auth data if available
        if (loginResponse.data.access_token) {
          storeAuthData(loginResponse.data.access_token, loginResponse.data.user_id, loginResponse.data.role);
          console.log("Auth data stored successfully after signup");
        }

        // Call onLogin callback
        onLogin({
          id: loginResponse.data.user_id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          role: loginResponse.data.role,
        });
      }
    } catch (err) {
      console.error("API Error:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      if(err.status_code==404){
        alert("");
      }
      
      setError(err.response?.data?.detail );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Login as
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="shop_owner">Shop Owner</SelectItem>
                    <SelectItem value="delivery_partner">Delivery Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Extra fields for signup */}
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>

                  {formData.role === "shop_owner" && (
                    <>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Shop Name"
                          value={formData.shopName}
                          onChange={(e) =>
                            setFormData({ ...formData, shopName: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>

                      <Input
                        type="text"
                        placeholder="Shop Address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                      />

                      <Input
                        type="text"
                        placeholder="GST Number"
                        value={formData.gstNo}
                        onChange={(e) =>
                          setFormData({ ...formData, gstNo: e.target.value })
                        }
                        required
                      />
                    </>
                  )}
                </>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={loading}
              >
                {loading
                  ? (isLogin ? "Signing in..." : "Creating account...")
                  : (isLogin ? "Sign In" : "Create Account")}
              </Button>

              {error && (
                <div className="text-red-600 text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-teal-600 hover:text-teal-700 text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default LoginPopup;