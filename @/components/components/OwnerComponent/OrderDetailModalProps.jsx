import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { User, Phone, Mail, MapPin, Calendar, Package, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function OrderDetailModal({ order, onClose }) {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order Details - #{order.id}</DialogTitle>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={order.product.image || "/placeholder.svg"}
                  alt={order.product.name}
                  width={120}
                  height={90}
                  className="w-30 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{order.product.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Quantity</p>
                        <p className="font-semibold text-slate-800">{order.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Start Date</p>
                        <p className="font-semibold text-slate-800">
                          {format(new Date(order.startDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">End Date</p>
                        <p className="font-semibold text-slate-800">
                          {format(new Date(order.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="font-semibold text-teal-600 text-lg">${order.total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Full Name</p>
                      <p className="font-semibold text-slate-800">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Phone Number</p>
                      <p className="font-semibold text-slate-800">{order.customer.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Email Address</p>
                      <p className="font-semibold text-slate-800">{order.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Order Date</p>
                      <p className="font-semibold text-slate-800">
                        {format(new Date(order.orderDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Information
              </h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-800">{order.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-slate-800">Order Placed</p>
                    <p className="text-sm text-slate-600">
                      {format(new Date(order.orderDate), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                {order.status === "confirmed" && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-slate-800">Order Confirmed</p>
                      <p className="text-sm text-slate-600">Ready for pickup/delivery</p>
                    </div>
                  </div>
                )}
                {order.status === "rejected" && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-slate-800">Order Rejected</p>
                      <p className="text-sm text-slate-600">Order could not be fulfilled</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
