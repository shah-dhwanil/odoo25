import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { backendurl } from "../../../../src/App";

export default function ProfileComponents({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    addressString: "street city pincode state country", // one editable string
  });

  const userid = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      try {
        const u_data = await axios.get(`${backendurl}/users/${userid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const c_data = await axios.get(`${backendurl}/customers/${userid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = c_data.data;

        const addr = res.address?.address?.additionalProp1 || {};

        // join into one editable string
        const addressString = `${addr.street || ""} ${addr.city || ""} ${addr.pincode || ""} ${addr.state || ""} ${addr.country || ""}`.trim();

        setFormData({
          name: res.name || "",
          email: u_data.data.email_id || "",
          phone: u_data.data.mobile_no || "",
          addressString,
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [userid]);

const handleSave = async () => {
  const token = Cookies.get("token");

  // Safely split address string
  const parts = formData.addressString.trim().split(/\s+/);
  const [street = "", city = "", pincode = "", state = "", country = ""] = parts;

  const payload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    loyalty_points: formData.loyalty_points || 0,
    address: {
      address: {
        additionalProp1: {
          street,
          city,
          pincode,
          state,
          country,
        },
      },
    },
  };

  try {
    await axios.put(`${backendurl}/customers/${userid}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsEditing(false);
  } catch (e) {
    console.log("Save error:", e.response?.data || e.message);
  }
};


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-md">
                      <User className="w-5 h-5 text-slate-400 mr-3" />
                      <span>{formData.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                    disabled
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-md">
                      <Mail className="w-5 h-5 text-slate-400 mr-3" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                    disabled
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-md">
                      <Phone className="w-5 h-5 text-slate-400 mr-3" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.addressString}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          addressString: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-md">
                      <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                      <span>{formData.addressString}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">
                  {user.totalBookings}
                </div>
                <div className="text-sm text-slate-600">Total Bookings</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {user.activeBookings}
                </div>
                <div className="text-sm text-slate-600">Active Rentals</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.8</div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date().getFullYear() -
                    new Date(user.joinDate).getFullYear()}
                </div>
                <div className="text-sm text-slate-600">Years Member</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
