"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Plus, Package, DollarSign, X } from "lucide-react"
import { backendurl } from "../../../../src/App"
import axios from "axios"
import Cookies from 'js-cookie'

export default function AddProducts({ user }) {
  const userid = localStorage.user_id;
  const token = Cookies.get('token');

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    owner_id: userid,
    rental_units: ["PER_HOUR", "PER_WEEK", "PER_DAY", "PER_YEAR", "PER_MONTH"],
    price: {
      // "PER_HOUR": 0,
      // "PER_WEEK": 0,
      // "PER_DAY": 0,
      // "PER_YEAR": 0,
      // "PER_MONTH": 0
    },
    total_quantity: 0,
    defect_charges: 0.0,
    security_deposit: 0.0,
    care_instruction: "",
    images: [],
  })

  console.log(formData);

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map between form field names and backend keys
  const pricingMap = {
    hourlyPrice: "PER_HOUR",
    dailyPrice: "PER_DAY",
    weeklyPrice: "PER_WEEK",
    monthlyPrice: "PER_MONTH",
    yearlyPrice: "PER_YEAR"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`${backendurl}/categories/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCategories(data.data.categories)
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [])

  const handleInputChange = (field, value) => {
    if (pricingMap[field]) {
      const rentalKey = pricingMap[field];
      setFormData((prev) => {
        const updatedPrice = { ...prev.price, [rentalKey]: Number(value) };

        const updatedRentalUnits = Object.keys(updatedPrice).filter(
          (unit) => updatedPrice[unit] > 0
        );

        return {
          ...prev,
          price: updatedPrice,
          rental_units: updatedRentalUnits,
          [field]: value
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // const handleFilesChange = (files) => {
  //   const fileArray = Array.from(files);
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: [...prev.images, ...fileArray],
  //   }));
  // };

  const handleFilesChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const uploadedFileIds = [];

    for (const file of fileArray) {
      const fileData = new FormData();
      fileData.append("file", file);

      try {
        const response = await axios.post(
          `${backendurl}/products/upload_images`,
          fileData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log(response.data);
        uploadedFileIds.push(response.data.id);
      } catch (error) {
        console.error(`Upload failed for ${file.name}`, error);
      }
    }

    setFormData((prev)=>({
        ...prev,images:[...prev.images,...uploadedFileIds]
    }))


    // Update form state after all uploads
    // setFormData((prev) => ({
    //   ...prev,
    //   images: [...prev.images],       // Store file objects locally
    //   uploadedFileIds: [...(prev.uploadedFileIds || []), ...uploadedFileIds], // Store uploaded IDs
    // }));
  };

console.log(formData);
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: "",
      owner_id: userid,
      rental_units: [],
      price: {
        "PER_HOUR": 0,
        "PER_WEEK": 0,
        "PER_DAY": 0,
        "PER_YEAR": 0,
        "PER_MONTH": 0
      },
      total_quantity: "",
      defect_charges: "",
      security_deposit: 0,
      care_instruction: "",
      images: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await axios.post(`${backendurl}/products/`,
        {
          "name": formData.name,
          "description": formData.description,
          "category_id": formData.category_id,
          "owner_id": formData.owner_id,
          "rental_units": formData.rental_units,
          "price": formData.price,
          "security_deposit": formData.security_deposit,
          "defect_charges": formData.defect_charges,
          "care_instruction": formData.care_instruction,
          "total_quantity": formData.total_quantity,
          "images_id": formData.images
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Product added:", data);
      resetForm();
      alert("Product added successfully!");
    } catch (e) {
      console.log(e);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Add Products</h1>
        <p className="text-slate-600">Add new rental products to your inventory</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Products</p>
                <p className="text-2xl font-bold text-slate-800">{user.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Products Rented</p>
                <p className="text-2xl font-bold text-teal-600">{user.totalRentals}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Available Stock</p>
                <p className="text-2xl font-bold text-green-600">89%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total Quantity *
              </label>
              <Input
                type="number"
                value={formData.total_quantity}
                onChange={(e) => handleInputChange("total_quantity", e.target.value)}
                placeholder="Enter total quantity available"
                min="1"
                required
              />
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Pricing (per unit)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Hourly", field: "hourlyPrice" },
                  { label: "Daily", field: "dailyPrice" },
                  { label: "Weekly", field: "weeklyPrice" },
                  { label: "Monthly", field: "monthlyPrice" },
                  { label: "Yearly", field: "yearlyPrice" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {label} Rate *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        $
                      </span>
                      <Input
                        type="number"
                        value={formData[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Charges */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Damage Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.defect_charges}
                      onChange={(e) => handleInputChange("defect_charges", e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      step="1.0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Security Deposit *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.security_deposit}
                      onChange={(e) => handleInputChange("security_deposit", e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      step="1"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Multi Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Images *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                      handleFilesChange(e);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                      <Plus className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-600">Click to upload product images</p>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                </label>

                {formData.images.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded"
                      >
                        <span className="text-sm text-slate-700">{img.name}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Clear Form
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
