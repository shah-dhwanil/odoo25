import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Trash2, ShoppingCart, CreditCard } from "lucide-react";
import { format } from "date-fns";
// import PaymentModal from "./components/payment-modal";

export default function Cart({ items, onRemoveItem, user }) {
  const [showPayment, setShowPayment] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Your cart is empty</h3>
        <p className="text-slate-500">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Shopping Cart</h1>
        <p className="text-slate-600">{items.length} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      width={100}
                      height={80}
                      className="w-24 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{item.product.name}</h3>
                      <p className="text-slate-600 text-sm mb-2">
                        {format(new Date(item.dates.startDate), "MMM dd")} -{" "}
                        {format(new Date(item.dates.endDate), "MMM dd, yyyy")}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>{item.dates.days} days</span>
                        <span>•</span>
                        <span>{item.pricing.label}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-teal-600 mb-2">${item.total}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate mr-2">{item.product.name}</span>
                    <span>${item.total}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>${totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax (8%)</span>
                  <span>${Math.round(totalAmount * 0.08)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-teal-600">${Math.round(totalAmount * 1.08)}</span>
                </div>
              </div>

              <Button
                onClick={() => setShowPayment(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* {showPayment && (
        <PaymentModal
          items={items}
          total={Math.round(totalAmount * 1.08)}
          user={user}
          onClose={() => setShowPayment(false)}
        />
      )} */}
    </div>
  );
}
