import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, MapPin, Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import ReviewModal from "../CustomerComponents/ReviewModal";
import axios from "axios";
import { backendurl } from "../../../../src/App";
import Cookies from 'js-cookie'

export default function BookingHistory({ user }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const userId = localStorage.getItem('user_id')
  const token = Cookies.get("token");
  const [Booking, setBooking] = useState([]); // Initialize as empty array instead of object

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const resp = await axios.get(
  //         `${backendurl}/orders/users/${userId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       const result = resp.data;
  //       console.log("res", result);
  //       result.orders.forEach(async (value) => {
  //         const resp = await axios.get(
  //           `${backendurl}/products/${value.product_id}`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         value["name"]=resp.data.name;
  //       })
  //       console.log("result orders ", result.orders);
  //       setBooking(result.orders);

  //     } catch (e) {
  //       console.error("API fetch error:", e);
  //       // Set empty array on error
  //       setBooking([]);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `${backendurl}/orders/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = resp.data;
        console.log("res", result);
        
        // Use Promise.all to wait for all async operations to complete
        const ordersWithNames = await Promise.all(
          result.orders.map(async (order) => {
            try {
              const productResp = await axios.get(
                `${backendurl}/products/${order.product_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...order,
                name: productResp.data.name
              };
            } catch (error) {
              console.error(`Error fetching product ${order.product_id}:`, error);
              return {
                ...order,
                name: "Product name unavailable"
              };
            }
          })
        );
        
        console.log("result orders with names: ", ordersWithNames);
        setBooking(ordersWithNames);

      } catch (e) {
        console.error("API fetch error:", e);
        // Set empty array on error
        setBooking([]);
      }
    };

    fetchData();
  }, []);
  console.log("final:- ",Booking);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Bookings</h1>
        <p className="text-slate-600">
          Track your rental history and current bookings
        </p>
      </div>

      <div className="space-y-6">
        {Booking && Booking.length > 0 ? (
          Booking.map((booking, index) => (
            <motion.div
              key={booking.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.product?.image || "/public/camping-gear-setup.png"}
                      alt={booking.product?.name || booking.name || "Product"}
                      width={120}
                      height={90}
                      className="w-32 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">
                          {booking.name}
                        </h3>
                        <Badge className={getStatusColor(booking.order_status || booking.status)}>
                          {(booking.order_status || booking.status || 'pending').charAt(0).toUpperCase() +
                            (booking.order_status || booking.status || 'pending').slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-slate-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {booking.rent_start_date && booking.rent_end_date ? (
                              <>
                                {format(new Date(booking.rent_start_date), "MMM dd")} -{" "}
                                {format(new Date(booking.rent_end_date), "MMM dd, yyyy")}
                                {typeof(booking)}
                              </>
                            ) : (
                              "Date not available"
                            )}
                          </span>
                        </div>

                        <div className="flex items-center text-slate-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {booking.delivery_location?.street + "," + booking.delivery_location?.city + "," + booking.delivery_location?.pincode
                            }
                          </span>
                          <br></br>
                          <span className="text-sm">
                            {booking.delivery_location?.state + "," + booking.delivery_location?.country}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          <span>Quantity: {booking.quantity || 1}</span>
                          <span className="mx-2">•</span>
                          <span className="font-semibold text-teal-600">
                            Total: ${booking.amount.total || booking.total_price || 0}
                          </span>
                        </div>

                        {booking.canReview &&
                          !booking.hasReviewed &&
                          (booking.order_status || booking.status) === "completed" && (
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
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No bookings yet
            </h3>
            <p className="text-slate-500">Your rental history will appear here</p>
          </div>
        )}
      </div>

      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}