import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, MapPin, Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import ReviewModal from "../CustomerComponents/ReviewModal";

export default function BookingHistory({ user }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = [
    {
      id: 1,
      product: {
        name: "Excavator CAT 320",
        image: "/construction-excavator.png",
      },
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-01-20"),
      status: "completed",
      total: 900,
      quantity: 1,
      address: "123 Construction Site, City, State",
      canReview: true,
      hasReviewed: false,
    },
    {
      id: 2,
      product: {
        name: "Wedding Banquet Tables",
        image: "/elegant-event-furniture.png",
      },
      startDate: new Date("2024-02-10"),
      endDate: new Date("2024-02-12"),
      status: "completed",
      total: 450,
      quantity: 10,
      address: "456 Event Hall, City, State",
      canReview: true,
      hasReviewed: true,
    },
    {
      id: 3,
      product: {
        name: "Party Tent 20x30",
        image: "/party-tent-decorations.png",
      },
      startDate: new Date("2024-03-05"),
      endDate: new Date("2024-03-07"),
      status: "active",
      total: 360,
      quantity: 1,
      address: "789 Park Avenue, City, State",
      canReview: false,
      hasReviewed: false,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Bookings</h1>
        <p className="text-slate-600">
          Track your rental history and current bookings
        </p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={booking.product.image || "/placeholder.svg"}
                    alt={booking.product.name}
                    width={120}
                    height={90}
                    className="w-32 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {booking.product.name}
                      </h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {format(booking.startDate, "MMM dd")} -{" "}
                          {format(booking.endDate, "MMM dd, yyyy")}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{booking.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        <span>Quantity: {booking.quantity}</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold text-teal-600">
                          Total: ${booking.total}
                        </span>
                      </div>

                      {booking.canReview &&
                        !booking.hasReviewed &&
                        booking.status === "completed" && (
                          <Button
                            onClick={() => setSelectedBooking(booking)}
                            variant="outline"
                            size="sm"
                            className="text-teal-600 hover:text-teal-700"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Write Review
                          </Button>
                        )}

                      {booking.hasReviewed && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Reviewed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No bookings yet
          </h3>
          <p className="text-slate-500">Your rental history will appear here</p>
        </div>
      )}

      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
