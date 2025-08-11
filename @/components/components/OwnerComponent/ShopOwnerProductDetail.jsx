"use client"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { ArrowLeft, Package, DollarSign, Clock, Calendar } from "lucide-react"

export default function ShopOwnerProductDetail({ product, onBack }) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Sample additional images - in real app this would come from product data
  const productImages = [
    product.image,
    "/placeholder.svg?height=400&width=600&text=Image+2",
    "/placeholder.svg?height=400&width=600&text=Image+3",
  ]

  const getAvailabilityColor = (availability) => {
    return availability === "Available"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
          <p className="text-slate-600">Product ID: {product.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
            <img
              src={productImages[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-teal-500"
                    : "border-slate-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Product Information
                </h2>
                <Badge className={getAvailabilityColor(product.availability)}>
                  {product.availability}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Category:</span>
                  <span className="font-semibold text-slate-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Available Quantity:</span>
                  <span className="font-semibold text-slate-800">
                    {product.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Due Return Fee:</span>
                  <span className="font-semibold text-slate-800">
                    {product.dueReturnPercentage}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing Structure
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Hourly</p>
                  <p className="text-lg font-bold text-teal-600">
                    ${product.pricing.hourly}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Daily</p>
                  <p className="text-lg font-bold text-teal-600">
                    ${product.pricing.daily}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Weekly</p>
                  <p className="text-lg font-bold text-teal-600">
                    ${product.pricing.weekly}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Monthly</p>
                  <p className="text-lg font-bold text-teal-600">
                    ${product.pricing.monthly}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center p-3 bg-teal-50 rounded-lg">
                <p className="text-sm text-slate-600">Yearly</p>
                <p className="text-xl font-bold text-teal-600">
                  ${product.pricing.yearly}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Specifications
              </h2>

              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
