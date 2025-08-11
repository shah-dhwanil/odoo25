import React from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";

export default function FeaturedProducts() {
  const featuredProducts = [
    {
      id: 1,
      name: "Excavator CAT 320",
      price: 180,
      category: "Construction Equipment",
      description: "Heavy-duty excavator perfect for large construction projects and earthmoving.",
      image: "/construction-excavator.png",
      rating: 4.8,
      reviews: 124,
      availability: "Available",
      features: ["GPS Tracking", "Fuel Efficient", "Operator Training"],
    },
    {
      id: 2,
      name: "Wedding Banquet Tables",
      price: 15,
      category: "Event Furniture",
      description: "Elegant round tables perfect for weddings and formal events, seats 8-10 people.",
      image: "/elegant-event-furniture.png",
      rating: 4.9,
      reviews: 89,
      availability: "Available",
      features: ["Premium Linens", "Various Sizes", "Setup Service"],
    },
    {
      id: 3,
      name: "Party Tent 20x30",
      price: 120,
      category: "Party Supplies",
      description: "Large outdoor tent perfect for parties, weddings, and corporate events.",
      image: "/party-tent-decorations.png",
      rating: 4.6,
      reviews: 203,
      availability: "Limited",
      features: ["Weather Resistant", "Setup Included", "Lighting Options"],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Featured Products</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover our most popular rental items, trusted by thousands of customers for their quality and reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="/products">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4">
              View All Products
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
