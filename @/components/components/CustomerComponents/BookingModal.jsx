"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { X, CalendarIcon, Plus, Minus } from "lucide-react"
import { format, differenceInDays } from "date-fns"

export default function BookingModal({ product, onClose, onAddToCart }) {
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [quantity, setQuantity] = useState(1)
  const [pricingType, setPricingType] = useState("daily")
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectingEndDate, setSelectingEndDate] = useState(false)

  const handleDateSelect = (date) => {
    if (!date) return

    if (!startDate || selectingEndDate) {
      if (selectingEndDate) {
        setEndDate(date)
        setSelectingEndDate(false)
        setShowCalendar(false)
      } else {
        setStartDate(date)
        setSelectingEndDate(true)
      }
    }
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0

    const days = differenceInDays(endDate, startDate) + 1
    const price = product.pricing[pricingType].price

    if (pricingType === "weekly") {
      const weeks = Math.ceil(days / 7)
      return quantity * price * weeks
    } else if (pricingType === "hourly") {
      // Assume 8 hours per day for hourly pricing
      return quantity * price * days * 8
    } else {
      return quantity * price * days
    }
  }

  const handleAddToCart = () => {
    if (!startDate || !endDate) return

    const days = differenceInDays(endDate, startDate) + 1
    const dates = { startDate, endDate, days }
    const pricing = { ...product.pricing[pricingType], type: pricingType }

    onAddToCart(product, quantity, dates, pricing)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="relative">
            <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <p className="text-slate-600">{product.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pricing Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pricing Type</label>
              <Select value={pricingType} onValueChange={setPricingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly - {product.pricing.hourly.label}</SelectItem>
                  <SelectItem value="daily">Daily - {product.pricing.daily.label}</SelectItem>
                  <SelectItem value="weekly">Weekly - {product.pricing.weekly.label}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rental Period</label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCalendar(true)
                    setSelectingEndDate(false)
                  }}
                  className="justify-start"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCalendar(true)
                    setSelectingEndDate(true)
                  }}
                  className="justify-start"
                  disabled={!startDate}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                </Button>
              </div>

              {showCalendar && (
                <div className="mt-4 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectingEndDate ? endDate : startDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                />
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Total Calculation */}
            {startDate && endDate && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Duration:</span>
                  <span>{differenceInDays(endDate, startDate) + 1} days</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Rate:</span>
                  <span>{product.pricing[pricingType].label}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-teal-600">${calculateTotal()}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!startDate || !endDate}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
