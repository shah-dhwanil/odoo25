import React, { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Star, ShoppingCart, Shield, Truck, Clock, Store, MapPin, CheckCircle, FileText } from "lucide-react";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { Badge } from "../../ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { TimePicker } from "../../ui/time-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { backendurl, fileUrl } from "../../../../src/App";
import axios from "axios";
import Cookies from "js-cookie";
export default function ProductDetailView({ product, onBack, onShopSelect, onAddToCart, onOrderComplete, backendurl }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [pricingType, setPricingType] = useState("daily");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [quantity, setQuantity] = useState(1);

  // Auth states
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userData: null,
    loading: true // Start with loading true
  });

  // Order flow states
  const [showRentPopup, setShowRentPopup] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Address states - using single string input with parsed output
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setformData] = useState({
    "product_id": product.id,
    "user_id": null,
    "quantity": 0,
    "rate": null,
    "rent_start_date": null,
    "rent_end_date": null,
    "delivery_location": {},
    "pickup_location": {},
    "delivery_date": {},
    "pickup_date": {},
    "order_status": "DRAFT",
    "payment_status": "NOT APPLICABLE"
  })

  const token = Cookies.get("token");

  // Parse address string into structured format
  const parseAddress = (addressString) => {
    if (!addressString || addressString.trim() === "") {
      return {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India" // Default country
      };
    }

    // Split by comma and clean up
    const parts = addressString.split(',').map(part => part.trim()).filter(part => part);

    // Try to extract pincode (assuming it's a 6-digit number)
    let pincode = "";
    let remainingParts = [...parts];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Check if this part contains a pincode (6 digits)
      const pincodeMatch = part.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        pincode = pincodeMatch[0];
        // Remove the pincode part and keep the rest
        remainingParts[i] = part.replace(pincodeMatch[0], '').trim();
        if (remainingParts[i] === '') {
          remainingParts.splice(i, 1);
        }
        break;
      }
    }

    // Assign remaining parts based on typical address structure
    // Last part is usually state, second last is city, rest is street
    const cleanParts = remainingParts.filter(part => part !== "");
    let street = "", city = "", state = "";

    if (cleanParts.length >= 3) {
      state = cleanParts[cleanParts.length - 1];
      city = cleanParts[cleanParts.length - 2];
      street = cleanParts.slice(0, -2).join(', ');
    } else if (cleanParts.length === 2) {
      state = cleanParts[1];
      city = cleanParts[0];
    } else if (cleanParts.length === 1) {
      street = cleanParts[0];
    }

    return {
      street: street || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      country: "India"
    };
  };

  // Validate parsed address
  const isValidAddress = (addressString) => {
    const parsed = parseAddress(addressString);
    return parsed.street && parsed.city && parsed.state && parsed.pincode;
  };

  // Check user authentication status
  const checkUserAuthAndVerification = async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.log("No token found - user not logged in");
      setAuthState({
        isLoggedIn: false,
        userData: null,
        loading: false
      });
      return { isLoggedIn: false };
    }

    try {
      console.log("Checking user authentication...");

      // Check user profile
      const response = await axios.get(`${backendurl}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data;
      console.log("User data:", userData);

      const authData = {
        isLoggedIn: true,
        userData: userData,
        loading: false
      };

      console.log("Auth state updated:", authData);
      setAuthState(authData);
      return { isLoggedIn: true };

    } catch (error) {
      console.error("Auth check failed:", error);

      // If token is invalid, clear it
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Invalid token, clearing cookies");
        Cookies.remove("token");
      }

      setAuthState({
        isLoggedIn: false,
        userData: null,
        loading: false
      });

      return { isLoggedIn: false };
    }
  };

  // Initial auth check on component mount
  useEffect(() => {
    console.log("Component mounted, checking auth...");
    checkUserAuthAndVerification();
  }, [backendurl]);

  // Shop owner data fetch (if needed)
  useEffect(() => {
    if (!product || !product.owner_id || !token) return;

    const fetchShopData = async () => {
      try {
        const { data } = await axios.get(
          `${backendurl}/shop-owners/${product.owner_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Shop owner data:", data);
      } catch (e) {
        console.error("Shop API fetch error:", e);
      }
    };

    fetchShopData();
  }, [product, token, backendurl]);

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;

    const days = differenceInDays(endDate, startDate) + 1;
    let price = 0;

    // Get the correct price based on pricing type
    if (pricingType === "hourly" && product?.price?.PER_HOUR) {
      price = product.price.PER_HOUR;
      // For hourly, assume 8 hours per day
      return quantity * price * days * 8;
    } else if (pricingType === "daily" && product?.price?.PER_DAY) {
      price = product.price.PER_DAY;
      return quantity * price * days;
    } else if (pricingType === "weekly" && product?.price?.PER_WEEK) {
      price = product.price.PER_WEEK;
      const weeks = Math.ceil(days / 7);
      return quantity * price * weeks;
    } else if (pricingType === "monthly" && product?.price?.PER_MONTH) {
      price = product.price.PER_MONTH;
      const months = Math.ceil(days / 30);
      return quantity * price * months;
    } else if (pricingType === "yearly" && product?.price?.PER_YEAR) {
      price = product.price.PER_YEAR;
      const years = Math.ceil(days / 365);
      return quantity * price * years;
    }

    // Fallback to daily pricing
    if (product?.price?.PER_DAY) {
      return quantity * product.price.PER_DAY * days;
    }

    return 0;
  };

  const formatDateTime = (date, time) => {
    const [hours, minutes] = time.split(':');
    const datetime = new Date(date);
    datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return datetime.toISOString();
  };

  const handleRentNow = async () => {
    console.log("Rent Now clicked - Current state:", {
      startDate,
      endDate,
      quantity,
      pricingType,
      authState
    });

    if (!startDate || !endDate) {
      setError("Please select rental dates");
      return;
    }

    // Re-check authentication before proceeding (ensure fresh check)
    console.log("Re-checking authentication before rent...");
    const rateMapping = {
      "hourly": "PER_HOUR",
      "daily": "PER_DAY",
      "weekly": "PER_WEEK",
      "monthly": "PER_MONTH",
      "yearly": "PER_YEAR"
    };
    setformData({
      ...formData,
      rent_start_date: startDate,
      rent_end_date: endDate,
      quantity: quantity,
      rate: rateMapping[pricingType]
    });
    const { isLoggedIn } = await checkUserAuthAndVerification();

    if (!isLoggedIn) {
      console.log("User not logged in, showing login prompt");
      setShowLoginPrompt(true);
      return;
    }
    console.log("User authenticated, proceeding to rent");
    setError("");
    console.log("Form DATA", formData);
    // Reset address fields when opening popup
    setPickupAddress("");
    setDeliveryAddress("");
    setPickupDate(endDate);
    setDeliveryDate(startDate);
    setShowRentPopup(true);
  };

  const handleAddToCart = async () => {
    if (!startDate || !endDate) {
      setError("Please select rental dates");
      return;
    }

    // Check authentication for add to cart as well
    const { isLoggedIn } = await checkUserAuthAndVerification();

    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (onAddToCart) {
      const days = differenceInDays(endDate, startDate) + 1;
      const dates = { startDate, endDate, days };
      const pricing = { ...product.pricing[pricingType], type: pricingType };
      onAddToCart(product, quantity, dates, pricing);
    }
  };

  // Step 1: Create order with product and location details
  const handleSaveAndContinue = async () => {
    console.log("form data from address", formData)
    console.log("Save and Continue clicked with addresses:", {
      pickupAddress,
      deliveryAddress,
      pickupDate,
      deliveryDate
    });
    console.log("user_state", authState);
    // Validate addresses
    // if (!pickupAddress.trim() || !deliveryAddress.trim()) {
    //   setError("Please provide both pickup and delivery addresses");
    //   return;
    // }

    // if (!isValidAddress(pickupAddress)) {
    //   setError("Please provide a complete pickup address with street, city, state, and pincode");
    //   return;
    // }

    // if (!isValidAddress(deliveryAddress)) {
    //   setError("Please provide a complete delivery address with street, city, state, and pincode");
    //   return;
    // }

    // if (!pickupDate || !deliveryDate) {
    //   setError("Please select both pickup and delivery dates");
    //   return;
    // }

    // Format dates properly for the API

    // Parse addresses into required format
    const parsedPickupLocation = parseAddress(pickupAddress);
    const parsedDeliveryLocation = parseAddress(deliveryAddress);

    // Convert pricing type to API format
    const rateMapping = {
      "hourly": "PER_HOUR",
      "daily": "PER_DAY",
      "weekly": "PER_WEEK",
      "monthly": "PER_MONTH",
      "yearly": "PER_YEAR"
    };
    const orderData = {
      product_id: product.id,
      quantity: quantity,
      user_id: localStorage.user_id,
      rate: rateMapping[pricingType] || "PER_DAY",
      rent_start_date: formatDateTime(startDate, startTime),
      rent_end_date: formatDateTime(endDate, endTime),
      delivery_location: parsedDeliveryLocation,
      pickup_location: parsedPickupLocation,
      delivery_date: formatDateTime(deliveryDate, endTime),
      pickup_date: formatDateTime(pickupDate, startTime),
      order_status: "DRAFT",
      payment_status: "NOT APPLICABLE"
    };
    console.log("logging from final stage:-", orderData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders/`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.status != 201){

        setError(response.data.detail || "Failed to create order. Please try again.");
        console.log("Order creation response:", response.data);
      }
      setCurrentOrder(response.data);
    } catch (e) {
      // console.error("Order creation error:", e);
      // console.error("Error response:", e.response?.data);
      // setError(e.response?.data?.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
    setShowRentPopup(false);
    setShowOrderStatus(true);
  };


  // Step 3: Confirm order and show invoice
  const handleConfirmOrder = async () => {
    if (!currentOrder) return;

    setLoading(true);
    try {
      // Update order status to confirmed
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${currentOrder.id}/status`,
        { order_status: "CONFIRMED" },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowOrderStatus(false);
      setShowInvoice(true);
    } catch (e) {
      console.error("Order confirmation error:", e);
      setError("Failed to confirm order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // // Step 4: Submit final order and redirect
  // const handleSubmitOrder = async () => {
  //   setLoading(true);
  //   try {
  //     const orderData = {
  //       product_id: product.id,
  //       quantity: quantity,
  //       rate: rateMapping[pricingType] || "PER_DAY",
  //       rent_start_date: formatDateTime(startDate, startTime),
  //       rent_end_date: formatDateTime(endDate, endTime),
  //       delivery_location: parsedDeliveryLocation,
  //       pickup_location: parsedPickupLocation,
  //       delivery_date: formatDateTime(deliveryDate, endTime),
  //       pickup_date: formatDateTime(pickupDate, startTime),
  //       order_status: "DRAFT",
  //       payment_status: "NOT APPLICABLE"
  //     };

  //     console.log("Sending order data:", orderData);
  //     const response = await axios.post(
  //       `${backendurl}/orders/`,
  //       orderData,
  //       {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }
  //     );

  //     console.log("Order creation response:", response.data);
  //     setCurrentOrder(response.data);
  //     setShowRentPopup(false);
  //     setShowOrderStatus(true);

  //     // Fetch order status
  //     if (response.data.id) {
  //       await fetchOrderStatus(response.data.id);
  //     }

  //   } catch (e) {
  //     console.error("Order submission error:", e);
  //     setError("Failed to submit order. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const resetOrderFlow = () => {
    setShowRentPopup(false);
    setShowOrderStatus(false);
    setShowInvoice(false);
    setShowLoginPrompt(false);
    setPickupAddress("");
    setDeliveryAddress("");
    setPickupDate(null);
    setDeliveryDate(null);
    setCurrentOrder(null);
    setOrderStatus(null);
    setError("");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Images */}
          <div className="lg:col-span-5">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={`${fileUrl}/products/${product.images_id[selectedImage]}`}
                  alt={`${product.name} ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                />
              </div>

              {/* Thumbnails */}
              {product.images_id?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images_id.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                        ? "border-teal-600"
                        : "border-slate-200 hover:border-teal-400"
                        }`}
                      aria-label={`Select image ${index + 1}`}
                    >
                      <img
                        src={`${fileUrl}/products/${image}`}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={150}
                        height={150}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="mb-4 bg-transparent"
                >
                  ← Back to Products
                </Button>
              )}
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-slate-600">
                    {product.rating || 0} ({product.reviews || 0} reviews)
                  </span>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {product.availability || "Available"}
                </Badge>
              </div>

              <button
                onClick={() =>
                  onShopSelect
                    ? onShopSelect(product.shop)
                    : (window.location.href = `/shop/${product.shop?.id}`)
                }
                className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-4 font-medium"
              >
                <Store className="w-4 h-4" />
                <span>{product.shop?.name || "Shop"}</span>
              </button>

              <section className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description || "No description available"}
                </p>
              </section>
            </div>
          </div>

          {/* Rental Options */}
          <div className="lg:col-span-3">
            <Card className="sticky top-4 shadow-md">
              <CardContent className="p-6 space-y-6">
                {/* Rental Period */}
                <div>
                  <label
                    htmlFor="rentalPeriod"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Rental Period
                  </label>
                  <Select
                    id="rentalPeriod"
                    value={pricingType}
                    onValueChange={setPricingType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product?.price?.PER_HOUR && (
                        <SelectItem value="hourly">
                          Hourly - ${product.price.PER_HOUR}
                        </SelectItem>
                      )}
                      {product?.price?.PER_DAY && (
                        <SelectItem value="daily">
                          Daily - ${product.price.PER_DAY}
                        </SelectItem>
                      )}
                      {product?.price?.PER_WEEK && (
                        <SelectItem value="weekly">
                          Weekly - ${product.price.PER_WEEK}
                        </SelectItem>
                      )}
                      {product?.price?.PER_MONTH && (
                        <SelectItem value="monthly">
                          Monthly - ${product.price.PER_MONTH}
                        </SelectItem>
                      )}
                      {product?.price?.PER_YEAR && (
                        <SelectItem value="yearly">
                          Yearly - ${product.price.PER_YEAR}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full p-3 text-left border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-[#00786f] focus:border-[#00786f]">
                          {startDate
                            ? startDate.toDateString()
                            : "Select start date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        side="bottom"
                        align="center"
                        sideOffset={8}
                      >
                        <Calendar
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      End Date *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full p-3 text-left border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-[#00786f] focus:border-[#00786f]">
                          {endDate
                            ? endDate.toDateString()
                            : "Select end date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        side="bottom"
                        align="center"
                        sideOffset={8}
                      >
                        <Calendar
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < (startDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <div className="border border-gray-300 rounded-md p-2">
                        <TimePicker
                          value={startTime}
                          onChange={setStartTime}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <div className="border border-gray-300 rounded-md p-2">
                        <TimePicker value={endTime} onChange={setEndTime} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <div className="flex items-center justify-center min-w-[60px]">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const newValue = Math.max(1, Math.min(product.availableQuantity || 99, parseInt(e.target.value) || 1));
                          setQuantity(newValue);
                        }}
                        className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-lg font-medium"
                        min="1"
                        max={product.availableQuantity || 99}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const maxQuantity = product.availableQuantity || 99;
                        const newQuantity = Math.min(maxQuantity, quantity + 1);
                        setQuantity(newQuantity);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {product.availableQuantity || 0} available out of{" "}
                    {product.totalQuantity || 0}
                  </p>
                </div>

                {/* Total */}
                {startDate && endDate && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>
                          {differenceInDays(endDate, startDate) + 1} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span>${pricingType === "hourly" ? product?.price?.PER_HOUR || 0 : product?.price?.PER_DAY || 0} per {pricingType.replace('ly', '')}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-teal-600">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleRentNow}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={!startDate || !endDate || authState.loading}
                  >
                    {authState.loading
                      ? "Checking..."
                      : `Rent Now - $${calculateTotal()}`
                    }
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full"
                    disabled={authState.loading}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  {/* Auth Status Indicator */}
                  {!authState.loading && (
                    <div className="text-xs text-center">
                      {authState.isLoggedIn ? (
                        <span className="text-green-600 flex items-center justify-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Logged In
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center justify-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Login Required
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Damage charge: ${product.damagePrice || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Late return: ${product.delayReturnPrice || 0}/day
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Free delivery within 10 miles</span>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Step 1: Address Details Popup */}
      <Dialog open={showRentPopup} onOpenChange={setShowRentPopup}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span>Address Details</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {/* Delivery Address */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">Delivery Address *</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  Include: Street, Area, City, State, Pincode
                </div>
                {deliveryAddress && (
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-xs text-blue-700">
                      <strong>Parsed Address:</strong>
                      <br />
                      {JSON.stringify(parseAddress(deliveryAddress), null, 2)}
                    </div>
                  </div>
                )}
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter complete delivery address (e.g., 456 Oak Avenue, Suburb, Delhi, Delhi, 110001)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500">
                Include: Street, Area, City, State, Pincode
              </div>
              {pickupAddress && (
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <div className="text-xs text-green-700">
                    <strong>Parsed Address:</strong>
                    <br />
                    {JSON.stringify(parseAddress(pickupAddress), null, 2)}
                  </div>
                </div>
              )}
              <h3 className="font-semibold text-lg mb-3 text-green-700">Pickup Address *</h3>
              <div className="space-y-2">
                <textarea
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter complete pickup address (e.g., 123 Main Street, Downtown, Mumbai, Maharashtra, 400001)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Delivery Date *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full p-3 text-left border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-teal-500">
                      {deliveryDate
                        ? deliveryDate.toDateString()
                        : "Select delivery date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      disabled={(date) => date < (pickupDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Pickup Date *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full p-3 text-left border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-teal-500">
                      {pickupDate
                        ? pickupDate.toDateString()
                        : "Select pickup date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

            </div>

            {/* Order Summary */}
            <div className="bg-slate-50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span>{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>{pricingType} - ${
                    pricingType === "hourly" ? product?.price?.PER_HOUR || 0 :
                      pricingType === "daily" ? product?.price?.PER_DAY || 0 :
                        pricingType === "weekly" ? product?.price?.PER_WEEK || 0 :
                          pricingType === "monthly" ? product?.price?.PER_MONTH || 0 :
                            product?.price?.PER_YEAR || 0
                  }</span>
                </div>
                <div className="flex justify-between font-bold text-teal-600">
                  <span>Total:</span>
                  <span>${currentOrder?.amount.total || calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetOrderFlow}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleSaveAndContinue}
              disabled={loading}
            >
              {loading ? "Processing..." : "Save & Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <span>Login Required</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You need to be logged in to rent this product.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Ready to rent?</h4>
                <p className="text-sm text-blue-700">
                  Sign in to your account or create a new one to get started with renting amazing products.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                console.log("Redirecting to login...");
                window.location.href = "/login";
              }}
            >
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Required Dialog */}

      {/* Step 2: Order Status Display */}
      <Dialog open={showOrderStatus} onOpenChange={setShowOrderStatus}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Order Status</span>
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Product:</span>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Quantity:</span>
                  <p className="font-medium">{quantity}</p>
                </div>
                <div>
                  <span className="text-slate-600">Duration:</span>
                  <p className="font-medium">
                    {startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0} days
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Total Amount:</span>
                  <p className="font-medium text-teal-600">${calculateTotal()}</p>
                </div>
                <div>
                  <span className="text-slate-600">Pickup:</span>
                  <p className="font-medium text-xs">{pickupAddress}</p>
                </div>
                <div>
                  <span className="text-slate-600">Delivery:</span>
                  <p className="font-medium text-xs">{deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            {orderStatus && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Current Status</h4>
                <p className="text-green-700">{orderStatus.status || "Order Created Successfully"}</p>
                <p className="text-sm text-green-600 mt-1">
                  Order ID: {currentOrder?.id || orderStatus.order_id}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetOrderFlow}>
              Cancel Order
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleConfirmOrder}
              disabled={loading}
            >
              {loading ? "Confirming..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 3: Invoice and Final Confirmation */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>Order Invoice & Quotation</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Invoice Header */}
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-slate-800">Invoice</h2>
              <div className="flex justify-between text-sm text-slate-600 mt-2">
                <span>Order ID: {currentOrder?.id}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Product Details</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={`${fileUrl}/products/${product.images_id[0]}`}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{product.name}</h4>
                  <p className="text-slate-600 text-sm">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <span>Quantity: {quantity}</span>
                    <span>Rate: ${
                      pricingType === "hourly" ? product?.price?.PER_HOUR || 0 :
                        pricingType === "daily" ? product?.price?.PER_DAY || 0 :
                          pricingType === "weekly" ? product?.price?.PER_WEEK || 0 :
                            pricingType === "monthly" ? product?.price?.PER_MONTH || 0 :
                              product?.price?.PER_YEAR || 0
                    } per {pricingType.replace('ly', '')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Rental Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Start Date:</span>
                  <p className="font-medium">{startDate?.toDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-600">End Date:</span>
                  <p className="font-medium">{endDate?.toDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-600">Start Time:</span>
                  <p className="font-medium">{startTime}</p>
                </div>
                <div>
                  <span className="text-slate-600">End Time:</span>
                  <p className="font-medium">{endTime}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Pickup Address:</span>
                  <p className="font-medium text-xs">{pickupAddress}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Delivery Address:</span>
                  <p className="font-medium text-xs">{deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price ({quantity} × ${
                    pricingType === "hourly" ? product?.price?.PER_HOUR || 0 :
                      pricingType === "daily" ? product?.price?.PER_DAY || 0 :
                        pricingType === "weekly" ? product?.price?.PER_WEEK || 0 :
                          pricingType === "monthly" ? product?.price?.PER_MONTH || 0 :
                            product?.price?.PER_YEAR || 0
                  } × {differenceInDays(endDate || new Date(), startDate || new Date()) + 1} days)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Damage Deposit</span>
                  <span>${product.damagePrice || 0}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-teal-600">${calculateTotal() + (product.damagePrice || 0)}</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-600">
              <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
              <ul className="space-y-1">
                <li>• Damage deposit will be refunded after inspection upon return</li>
                <li>• Late return charges: ${product.delayReturnPrice || 0}/day</li>
                <li>• Product must be returned in the same condition as received</li>
                <li>• Cancellation must be made 24 hours before rental start time</li>
                <li>• Customer is responsible for product safety during rental period</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {/* 
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowInvoice(false)}>
              Back to Edit
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleSubmitOrder}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Order & Continue"}
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
}