"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { CheckCircle, XCircle, Eye, Calendar, User, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import OrderDetailModal from "../../components/OwnerComponent/OrderDetailModalProps";

export default function ConfirmOrders({ user }) {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
      },
      product: {
        name: "Excavator CAT 320",
        image: "/construction-excavator.png",
      },
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-03-20"),
      quantity: 1,
      total: 900,
      status: "pending",
      address: "123 Construction Site, City, State 12345",
      orderDate: new Date("2024-03-10"),
    },
    {
      id: 2,
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (555) 987-6543",
      },
      product: {
        name: "Party Tent 20x30",
        image: "/party-tent-decorations.png",
      },
      startDate: new Date("2024-03-18"),
      endDate: new Date("2024-03-20"),
      quantity: 1,
      total: 360,
      status: "pending",
      address: "456 Event Venue, City, State 12345",
      orderDate: new Date("2024-03-12"),
    },
    {
      id: 3,
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1 (555) 456-7890",
      },
      product: {
        name: "Sound System Pro",
        image: "/placeholder.svg?height=300&width=400&text=Sound+System",
      },
      startDate: new Date("2024-03-22"),
      endDate: new Date("2024-03-24"),
      quantity: 1,
      total: 285,
      status: "confirmed",
      address: "789 Wedding Hall, City, State 12345",
      orderDate: new Date("2024-03-08"),
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const handleConfirmOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "confirmed" } : order
      )
    );
  };

  const handleRejectOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "rejected" } : order
      )
    );
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const confirmedOrders = orders.filter((order) => order.status === "confirmed");
  const rejectedOrders = orders.filter((order) => order.status === "rejected");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Confirm Orders</h1>
        <p className="text-slate-600">Review and manage incoming rental orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Confirmed Orders</p>
                <p className="text-2xl font-bold text-green-600">{confirmedOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Rejected Orders</p>
                <p className="text-2xl font-bold text-red-600">{rejectedOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={order.product.image || "/placeholder.svg"}
                      alt={order.product.name}
                      width={80}
                      height={60}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{order.product.name}</h3>
                      <p className="text-slate-600">Order #{order.id}</p>
                      <p className="text-sm text-slate-500">Ordered on {format(order.orderDate, "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Customer</p>
                      <p className="font-semibold text-slate-800">{order.customer.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p className="font-semibold text-slate-800">{order.customer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Rental Period</p>
                      <p className="font-semibold text-slate-800">
                        {format(order.startDate, "MMM dd")} - {format(order.endDate, "MMM dd")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="text-sm text-slate-600">Total Amount</p>
                      <p className="font-semibold text-teal-600 text-lg">${order.total}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-600">{order.address}</p>
                </div>

                {order.status === "pending" && (
                  <div className="flex space-x-3">
                    
                    <Button onClick={() => handleViewOrderDetail(order)} variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No orders yet</h3>
              <p className="text-slate-500">New rental orders will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
