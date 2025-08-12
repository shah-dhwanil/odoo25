"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Textarea } from "../../ui/textarea"
import { X, MapPin, Plus, CreditCard, Check } from "lucide-react"
import { format } from "date-fns"

export default function RentalPaymentModal({
  product,
  quantity,
  startDate,
  endDate,
  pricingType,
  total,
  onClose,
}) {
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirmation
  const [selectedAddress, setSelectedAddress] = useState("")
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    instructions: "",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    paymentMethod: "credit_card",
  })

  // Mock saved addresses
  const savedAddresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Main Street, Apt 4B, New York, NY 10001",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Office",
      address: "456 Business Ave, Suite 200, New York, NY 10002",
      phone: "+1 (555) 987-6543",
    },
  ]

  const handleAddressSubmit = () => {
    if (!selectedAddress && !showAddAddress) {
      alert("Please select an address or add a new one")
      return
    }
    setStep(2)
  }

  const handlePaymentSubmit = () => {
    setStep(3)
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const handleAddNewAddress = () => {
    // Add new address logic here
    setShowAddAddress(false)
    setSelectedAddress("new")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="relative">
            <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <CardTitle className="text-2xl">
              {step === 1 && "Delivery Address"}
              {step === 2 && "Payment Details"}
              {step === 3 && "Booking Confirmed"}
            </CardTitle>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-4 mt-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNum ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-1 mx-2 ${step > stepNum ? "bg-teal-600" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary - Always visible */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-800">{product.name}</h4>
                        <p className="text-sm text-slate-600">{product.shop.name}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rental Period:</span>
                        <span>
                          {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span>{product.pricing[pricingType].label}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-teal-600">${total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step Content */}
              <div className="lg:col-span-2">
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Delivery Address</h3>

                      {/* Saved Addresses */}
                      <div className="space-y-3 mb-6">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedAddress === address.id.toString()
                                ? "border-teal-600 bg-teal-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setSelectedAddress(address.id.toString())}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-slate-800">{address.name}</h4>
                                <p className="text-slate-600 text-sm">{address.address}</p>
                                <p className="text-slate-500 text-sm">{address.phone}</p>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  selectedAddress === address.id.toString()
                                    ? "border-teal-600 bg-teal-600"
                                    : "border-slate-300"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Address */}
                      <Button
                        variant="outline"
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className="w-full mb-4 bg-transparent"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                      </Button>

                      {showAddAddress && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">Add New Address</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                placeholder="Full Name"
                                value={newAddress.name}
                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                              />
                              <Input
                                placeholder="Phone Number"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              />
                            </div>
                            <Input
                              placeholder="Street Address"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              />
                              <Input
                                placeholder="State"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              />
                              <Input
                                placeholder="ZIP Code"
                                value={newAddress.zipCode}
                                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                              />
                            </div>
                            <Textarea
                              placeholder="Delivery Instructions (Optional)"
                              value={newAddress.instructions}
                              onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })}
                              rows={2}
                            />
                            <div className="flex space-x-3">
                              <Button onClick={handleAddNewAddress} className="bg-teal-600 hover:bg-teal-700">
                                Save Address
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setShowAddAddress(false)}
                                className="bg-transparent"
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <Button
                      onClick={handleAddressSubmit}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={!selectedAddress && !showAddAddress}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Continue to Payment
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Method</h3>

                      <div className="space-y-4">
                        <Select
                          value={paymentData.paymentMethod}
                          onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="debit_card">Debit Card</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>

                        {(paymentData.paymentMethod === "credit_card" ||
                          paymentData.paymentMethod === "debit_card") && (
                          <div className="space-y-4">
                            <Input
                              placeholder="Cardholder Name"
                              value={paymentData.cardholderName}
                              onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                            />
                            <Input
                              placeholder="Card Number"
                              value={paymentData.cardNumber}
                              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                placeholder="MM/YY"
                                value={paymentData.expiryDate}
                                onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                              />
                              <Input
                                placeholder="CVV"
                                value={paymentData.cvv}
                                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button onClick={handlePaymentSubmit} className="w-full bg-teal-600 hover:bg-teal-700">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Payment - ${total}
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h3>
                    <p className="text-slate-600 mb-4">
                      Your rental has been successfully booked. You will receive a confirmation email shortly.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg text-left max-w-md mx-auto">
                      <h4 className="font-semibold mb-2">Booking Details:</h4>
                      <p className="text-sm text-slate-600">Booking ID: #RNT-{Date.now()}</p>
                      <p className="text-sm text-slate-600">Product: {product.name}</p>
                      <p className="text-sm text-slate-600">Total: ${total}</p>
                      <p className="text-sm text-slate-600">
                        Dates: {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
