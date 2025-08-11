import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const allProducts = [
  {
    id: 1,
    name: "Excavator CAT 320",
    category: "Construction Equipment",
    description: "Heavy-duty excavator perfect for large construction projects and earthmoving.",
    image: "/construction-excavator.png",
    rating: 4.8,
    reviews: 124,
    availability: "Available",
    pricing: {
      hourly: { price: 25, label: "$25/hour" },
      daily: { price: 180, label: "$180/day" },
      weekly: { price: 1100, label: "$1,100/week" },
    },
  },
  {
    id: 2,
    name: "Wedding Banquet Tables",
    category: "Event Furniture",
    description: "Elegant round tables perfect for weddings and formal events, seats 8-10 people.",
    image: "/elegant-event-furniture.png",
    rating: 4.9,
    reviews: 89,
    availability: "Available",
    pricing: {
      hourly: { price: 3, label: "$3/hour" },
      daily: { price: 15, label: "$15/day" },
      weekly: { price: 85, label: "$85/week" },
    },
  },
  {
    id: 3,
    name: "Professional Sound System",
    category: "Audio Visual",
    description: "Complete PA system with wireless microphones and mixing console.",
    image: "/placeholder.svg?height=300&width=400&text=Sound+System",
    rating: 4.7,
    reviews: 156,
    availability: "Available",
    pricing: {
      hourly: { price: 15, label: "$15/hour" },
      daily: { price: 95, label: "$95/day" },
      weekly: { price: 550, label: "$550/week" },
    },
  },
  {
    id: 4,
    name: "Party Tent 20x30",
    category: "Party Supplies",
    description: "Large outdoor tent perfect for parties, weddings, and corporate events.",
    image: "/party-tent-decorations.png",
    rating: 4.6,
    reviews: 203,
    availability: "Limited",
    pricing: {
      hourly: { price: 20, label: "$20/hour" },
      daily: { price: 120, label: "$120/day" },
      weekly: { price: 700, label: "$700/week" },
    },
  },
  {
    id: 5,
    name: "Soccer Goal Set",
    category: "Sports Equipment",
    description: "Professional soccer goals with nets, perfect for tournaments and training.",
    image: "/sports-equipment-soccer-basketball.png",
    rating: 4.5,
    reviews: 67,
    availability: "Available",
    pricing: {
      hourly: { price: 5, label: "$5/hour" },
      daily: { price: 25, label: "$25/day" },
      weekly: { price: 140, label: "$140/week" },
    },
  },
  {
    id: 6,
    name: "Camping Package Deluxe",
    category: "Camping Gear",
    description: "Complete camping setup including tent, sleeping bags, and cooking equipment.",
    image: "/camping-gear-setup.png",
    rating: 4.8,
    reviews: 145,
    availability: "Available",
    pricing: {
      hourly: { price: 8, label: "$8/hour" },
      daily: { price: 65, label: "$65/day" },
      weekly: { price: 380, label: "$380/week" },
    },
  },
];

const categories = [
  "All Categories",
  "Construction Equipment",
  "Event Furniture",
  "Audio Visual",
  "Party Supplies",
  "Sports Equipment",
  "Camping Gear",
];

export default function ProductsGrid({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [pricingFilter, setPricingFilter] = useState("daily");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate=useNavigate();

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricing[pricingFilter].price - b.pricing[pricingFilter].price;
        case "price-high":
          return b.pricing[pricingFilter].price - a.pricing[pricingFilter].price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviews - a.reviews;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, pricingFilter, sortBy]);

  return (
    <div className="p-4 w-[80%] m-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Browse Products</h1>
        <p className="text-slate-600">Find the perfect equipment for your needs</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border rounded p-2"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded p-2"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <select
            value={pricingFilter}
            onChange={(e) => setPricingFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="hourly">Hourly Rates</option>
            <option value="daily">Daily Rates</option>
            <option value="weekly">Weekly Rates</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2"
          >
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
          <div className="text-sm text-slate-600 flex items-center">
            {filteredProducts.length} products found
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300" onClick={()=>navigate(`/products/${product.id}`)}>
              <div className="relative">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.availability === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.availability}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-teal-600 mb-2">
                  {product.pricing[pricingFilter].label}
                </p>
                <p className="text-slate-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm text-slate-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
                  disabled={product.availability !== "Available"}
                >
                  Rent Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>
            <p className="mb-4">{selectedProduct.description}</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  onAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="bg-teal-600 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
