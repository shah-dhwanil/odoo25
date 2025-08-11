"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Upload, X } from "lucide-react"

export default function EditProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    description: product.description,
    pricing: { ...product.pricing },
    dueReturnPercentage: product.dueReturnPercentage,
    specifications: { ...product.specifications },
  })

  const [uploadedImages, setUploadedImages] = useState([])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePricingChange = (period, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [period]: parseFloat(value) || 0,
      },
    }))
  }

  const handleSpecificationChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...product, ...formData, uploadedImages })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Construction Equipment">
                    Construction Equipment
                  </SelectItem>
                  <SelectItem value="Event Equipment">Event Equipment</SelectItem>
                  <SelectItem value="Photography Equipment">
                    Photography Equipment
                  </SelectItem>
                  <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                  <SelectItem value="Camping Gear">Camping Gear</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value, 10))}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueReturn">Due Return Percentage (%)</Label>
              <Input
                id="dueReturn"
                type="number"
                value={formData.dueReturnPercentage}
                onChange={(e) =>
                  handleInputChange("dueReturnPercentage", parseFloat(e.target.value))
                }
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <Label className="text-base font-semibold">Pricing Structure</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {["hourly", "daily", "weekly", "monthly", "yearly"].map((period) => (
                <div key={period}>
                  <Label htmlFor={period}>{period.charAt(0).toUpperCase() + period.slice(1)} Rate ($)</Label>
                  <Input
                    id={period}
                    type="number"
                    step="0.01"
                    value={formData.pricing[period]}
                    onChange={(e) => handlePricingChange(period, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-base font-semibold">Product Images</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 mb-2">Upload product images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  Choose Files
                </Button>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <Label className="text-base font-semibold">Specifications</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
