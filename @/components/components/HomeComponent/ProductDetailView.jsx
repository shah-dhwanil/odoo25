import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Star, ShoppingCart, Shield, Truck, Clock, Check, Store } from "lucide-react";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { Badge } from "../../ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { TimePicker } from "../../ui/time-picker";

export default function ProductDetailView({ product, onBack, onShopSelect, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [pricingType, setPricingType] = useState("daily");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [quantity, setQuantity] = useState(1);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;

    const days = differenceInDays(endDate, startDate) + 1;
    const price = product.pricing[pricingType].price;

    if (pricingType === "yearly") {
      const years = Math.ceil(days / 365);
      return quantity * price * years;
    } else if (pricingType === "monthly") {
      const months = Math.ceil(days / 30);
      return quantity * price * months;
    } else if (pricingType === "weekly") {
      const weeks = Math.ceil(days / 7);
      return quantity * price * weeks;
    } else if (pricingType === "hourly") {
      return quantity * price * days * 8;
    } else {
      return quantity * price * days;
    }
  };

  const handleRentNow = () => {
    if (!startDate || !endDate) {
      alert("Please select rental dates");
      return;
    }
    alert(`Renting ${quantity} units for total $${calculateTotal()}`);
  };

  const handleAddToCart = () => {
    if (!startDate || !endDate) return;

    if (onAddToCart) {
      const days = differenceInDays(endDate, startDate) + 1;
      const dates = { startDate, endDate, days };
      const pricing = { ...product.pricing[pricingType], type: pricingType };
      onAddToCart(product, quantity, dates, pricing);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Images */}
        <div className="lg:col-span-5">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-slate-200">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                width={600}
                height={600}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-teal-600" : "border-slate-200 hover:border-teal-400"
                  }`}
                  aria-label={`Select image ${index + 1}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={150}
                    height={150}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-4">
          <div className="space-y-6">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
                ← Back to Products
              </Button>
            )}
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-slate-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <Badge className="bg-green-100 text-green-800">{product.availability}</Badge>
            </div>

            <button
              onClick={() => (onShopSelect ? onShopSelect(product.shop) : (window.location.href = `/shop/${product.shop.id}`))}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-4 font-medium"
            >
              <Store className="w-4 h-4" />
              <span>{product.shop.name}</span>
            </button>

            <section className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </section>

            <section className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 gap-2 list-none">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Specifications</h3>
              <dl className="grid grid-cols-1 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <dt className="text-slate-600">{key}:</dt>
                    <dd className="font-medium text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* Rental Options */}
        <div className="lg:col-span-3">
          <Card className="sticky top-4 shadow-md">
            <CardContent className="p-6 space-y-6">
              {/* Rental Period */}
              <div>
                <label htmlFor="rentalPeriod" className="block text-sm font-medium text-slate-700 mb-2">
                  Rental Period
                </label>
                <Select id="rentalPeriod" value={pricingType} onValueChange={setPricingType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly - {product.pricing.hourly.label}</SelectItem>
                    <SelectItem value="daily">Daily - {product.pricing.daily.label}</SelectItem>
                    <SelectItem value="weekly">Weekly - {product.pricing.weekly.label}</SelectItem>
                    <SelectItem value="monthly">Monthly - {product.pricing.monthly.label}</SelectItem>
                    <SelectItem value="yearly">Yearly - {product.pricing.yearly.label}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full p-3 text-left border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-[#00786f] focus:border-[#00786f]">
                        {startDate ? startDate.toDateString() : "Select start date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" side="bottom" align="center" sideOffset={8}>
                      <Calendar
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full p-3 text-left border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-[#00786f] focus:border-[#00786f]">
                        {endDate ? endDate.toDateString() : "Select end date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" side="bottom" align="center" sideOffset={8}>
                      <Calendar
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection (separate fields, stacked) */}
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                    <div className="border border-gray-300 rounded-md p-2">
                      <TimePicker value={startTime} onChange={setStartTime} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Time</label>
                    <div className="border border-gray-300 rounded-md p-2">
                      <TimePicker value={endTime} onChange={setEndTime} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </Button>
                  <span className="font-medium text-lg px-4">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {product.availableQuantity} available out of {product.totalQuantity}
                </p>
              </div>

              {/* Total Calculation */}
              {startDate && endDate && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{differenceInDays(endDate, startDate) + 1} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>{product.pricing[pricingType].label}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-teal-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleRentNow}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!startDate || !endDate}
                >
                  Rent Now - ${calculateTotal()}
                </Button>
                <Button onClick={handleAddToCart} variant="outline" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>


              {/* Additional Info */}
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Damage charge: ${product.damagePrice}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Late return: ${product.delayReturnPrice}/day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery within 10 miles</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
