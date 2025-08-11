import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { X, Mail, Lock, User, Phone, Building } from "lucide-react";

const listA=["shop owner","customer","delivery partner"]


function LoginPopup({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    let userData;

    if (formData.role === "shop_owner") {
      userData = {
        id: 1,
        name: isLogin ? "John Smith" : formData.name,
        email: formData.email,
        phone: isLogin ? "+1 (555) 987-6543" : formData.phone,
        role: "shop_owner",
        shopName: isLogin ? "Premium Rentals Co." : formData.shopName,
        address: isLogin
          ? "456 Business Ave, Suite 200, City, State 12345"
          : formData.address,
        gstNo: isLogin ? "GST123456789" : formData.gstNo,
        joinDate: "2023-03-15",
        totalProducts: 45,
        totalRentals: 234,
        rating: 4.7,
        totalRevenue: 125000,
      };
    } else {
      userData = {
        id: 2,
        name: isLogin ? "Jane Doe" : formData.name,
        email: formData.email,
        phone: isLogin ? "+1 (555) 123-4567" : formData.phone,
        role: "customer",
        joinDate: "2024-01-15",
        totalBookings: 12,
        activeBookings: 2,
        address: "123 Main St, City, State 12345",
      };
    }

    onLogin(userData);
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="shop_owner">Shop Owner</SelectItem>
                    <SelectItem value="delivery_partner">Delivery Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
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
