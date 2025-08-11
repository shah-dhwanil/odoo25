import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";

export default function CustomerProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: "123 Main St, City, State 12345",
  });

  const handleSave = () => {
    // Normally you’d save to a backend here
    setIsEditing(false);
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-md">
                      <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                      <span>{formData.address}</span>
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
