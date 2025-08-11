"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Plus, Package, DollarSign, X } from "lucide-react"

export default function AddProducts({ user }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    totalQuantity: "",
    hourlyPrice: "",
    dailyPrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    yearlyPrice: "",
    damagePrice: "",
    dueReturnPercentage: "",
    images: [],
  })
  console.log(formData);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Construction Equipment",
    "Event Furniture",
    "Audio Visual",
    "Party Supplies",
    "Sports Equipment",
    "Camping Gear",
    "Transportation",
    "Entertainment",
    "Catering Equipment",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Product added:", formData)
    resetForm()
    setIsSubmitting(false)
    alert("Product added successfully!")
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFilesChange = (files) => {
    const fileArray = Array.from(files)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      totalQuantity: "",
      hourlyPrice: "",
      dailyPrice: "",
      weeklyPrice: "",
      monthlyPrice: "",
      yearlyPrice: "",
      damagePrice: "",
      dueReturnPercentage: "",
      images: [],
    })
  }

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
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                value={formData.totalQuantity}
                onChange={(e) => handleInputChange("totalQuantity", e.target.value)}
                placeholder="Enter total quantity available"
                min="1"
                required
              />
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Pricing (per unit)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Hourly", "Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
                  <div key={period}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {period} Rate *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        $
                      </span>
                      <Input
                        type="number"
                        value={formData[`${period.toLowerCase()}Price`]}
                        onChange={(e) =>
                          handleInputChange(`${period.toLowerCase()}Price`, e.target.value)
                        }
                        placeholder="0.00"
                        className="pl-8"
                        step="0.01"
                        min="0"
                        required
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
                      value={formData.damagePrice}
                      onChange={(e) => handleInputChange("damagePrice", e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Charge for damages to the product
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Return Percentage *
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      %
                    </span>
                    <Input
                      type="number"
                      value={formData.dueReturnPercentage}
                      onChange={(e) =>
                        handleInputChange("dueReturnPercentage", e.target.value)
                      }
                      placeholder="0"
                      className="pr-8"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Percentage charge for late returns
                  </p>
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
                    if (e.target.files?.length) {
                      handleFilesChange(e.target.files)
                    }
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
