import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { Search, Star } from "lucide-react";
import BookingModal from "../CustomerComponents/BookingHistory";
import { useNavigate } from "react-router-dom";
import { fileUrl } from "../../../../src/App"

const categories = [
  "All Categories",
  "Construction Equipment",
  "Event Furniture",
  "Audio Visual",
  "Party Supplies",
  "Sports Equipment",
  "Camping Gear",
];

export default function ProductsGrid({ onAddToCart, onProductSelect, AllProduct = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [pricingFilter, setPricingFilter] = useState("PER_HOUR");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    const filtered = AllProduct.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category_name === selectedCategory ||
        product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price?.[pricingFilter] || 0) - (b.price?.[pricingFilter] || 0);
        case "price-high":
          return (b.price?.[pricingFilter] || 0) - (a.price?.[pricingFilter] || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "popular":
          return (b.reviews || 0) - (a.reviews || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [AllProduct, searchTerm, selectedCategory, pricingFilter, sortBy]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Browse Products</h1>
        <p className="text-slate-600">Find the perfect equipment for your needs</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Pricing filter from API rental_units */}
            <Select value={pricingFilter} onValueChange={setPricingFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  new Set(AllProduct.flatMap((p) => p.rental_units || []))
                ).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit.replace("PER_", "")} Rates
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort by */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* Count */}
            <div className="text-sm text-slate-600 flex items-center">
              {filteredProducts.length} products found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              onClick={() => navigate(`/Customer-products/${product.id}`)}
            >
              {/* Product image */}
              <div className="relative overflow-hidden">
                <img
                  src={`${fileUrl}/products/${product.images_id[0]}`}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.available_quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.available_quantity > 0 ? "Available" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Product details */}
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-teal-600 mb-2">
                  ${product.price?.[pricingFilter] || 0} / {pricingFilter.replace("PER_", "").toLowerCase()}
                </p>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm text-slate-600">
                      {product.rating || "N/A"} ({product.reviews || 0})
                    </span>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductSelect ? onProductSelect(product) : setSelectedProduct(product);
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={product.available_quantity === 0}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No products */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Booking modal */}
      {selectedProduct && (
        <BookingModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}
