// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../@/components/components/HomeComponent/Header";
import Footer from "../../@/components/components/HomeComponent/Footer";
import ProductDetailView from "../../@/components/components/HomeComponent/ProductDetailView";
import Cookies from 'js-cookie'
import axios from "axios";
import { backendurl } from "../App";

// Mock product data - in real app, this would come from API
const productData = {
  1: {
    id: 1,
    name: "Excavator CAT 320",
    category: "Construction Equipment",
    description:
      "Heavy-duty excavator perfect for large construction projects and earthmoving. This professional-grade equipment features advanced hydraulic systems, GPS tracking, and fuel-efficient operation.",
    images: [
      "/construction-excavator.png",
      "/placeholder.svg?height=400&width=600&text=Excavator+Side+View",
      "/placeholder.svg?height=400&width=600&text=Excavator+Interior",
      "/placeholder.svg?height=400&width=600&text=Excavator+Controls",
    ],
    rating: 4.8,
    reviews: 124,
    availability: "Available",
    specifications: {
      "Operating Weight": "20,000 kg",
      "Engine Power": "122 kW",
      "Bucket Capacity": "1.2 m³",
      "Max Digging Depth": "6.5 m",
      "Max Reach": "9.8 m",
      "Fuel Tank": "400 L",
    },
    features: [
      "GPS Tracking System",
      "Fuel Efficient Engine",
      "Advanced Hydraulics",
      "Operator Training Included",
      "24/7 Technical Support",
      "Insurance Coverage Available",
    ],
    pricing: {
      hourly: { price: 25, label: "$25/hour" },
      daily: { price: 180, label: "$180/day" },
      weekly: { price: 1100, label: "$1,100/week" },
      monthly: { price: 4200, label: "$4,200/month" },
      yearly: { price: 45000, label: "$45,000/year" },
    },
    shop: {
      id: 1,
      name: "Premium Construction Rentals",
      owner: "John Smith",
      phone: "+1 (555) 987-6543",
      email: "john@premiumrentals.com",
      address: "456 Industrial Ave, Construction City, State 12345",
      rating: 4.7,
      totalProducts: 45,
      yearsInBusiness: 8,
    },
    damagePrice: 500,
    delayReturnPrice: 50,
    totalQuantity: 5,
    availableQuantity: 3,
  },
  2: {
    id: 2,
    name: "Wedding Banquet Tables",
    category: "Event Furniture",
    description:
      "Elegant round tables perfect for weddings and formal events. Each table seats 8-10 people comfortably and comes with premium linens and setup service.",
    images: [
      "/elegant-event-furniture.png",
      "/placeholder.svg?height=400&width=600&text=Table+Setup",
      "/placeholder.svg?height=400&width=600&text=Table+Details",
      "/placeholder.svg?height=400&width=600&text=Event+Setup",
    ],
    rating: 4.9,
    reviews: 89,
    availability: "Available",
    specifications: {
      "Table Diameter": "60 inches",
      "Seating Capacity": "8-10 people",
      Material: "Premium Wood",
      Height: "30 inches",
      Weight: "45 kg",
      "Setup Time": "15 minutes",
    },
    features: [
      "Premium Linens Included",
      "Various Sizes Available",
      "Professional Setup Service",
      "Elegant Design",
      "Easy Assembly",
      "Bulk Discounts Available",
    ],
    pricing: {
      hourly: { price: 3, label: "$3/hour" },
      daily: { price: 15, label: "$15/day" },
      weekly: { price: 85, label: "$85/week" },
      monthly: { price: 300, label: "$300/month" },
      yearly: { price: 3200, label: "$3,200/year" },
    },
    shop: {
      id: 2,
      name: "Elegant Events Co.",
      owner: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah@elegantevents.com",
      address: "789 Event Plaza, Wedding City, State 54321",
      rating: 4.9,
      totalProducts: 120,
      yearsInBusiness: 12,
    },
    damagePrice: 100,
    delayReturnPrice: 10,
    totalQuantity: 50,
    availableQuantity: 35,
  },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [AllProduct, setAllProduct] = useState([]);
  const [product, setProduct] = useState()
  const token = Cookies.get('token');
  console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`${backendurl}/products/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const result = data.data;
        setAllProduct(result.products)
      } catch (e) {
        console.log(e);
      }

    }
    fetchData();
  }, [])
  useEffect(() => {
    if (AllProduct.length > 0) {
      const found = AllProduct.find(val => String(val.id) === String(id));
      setProduct(found || null);
    }
  }, [AllProduct, id]);
  console.log("data", product);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Product not found</h1>
          <p className="text-slate-600 mt-2">
            The product you're looking for doesn't exist.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetailView product={product} />
      <Footer />
    </div>
  );
}
