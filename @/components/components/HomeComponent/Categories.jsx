import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hammer,
  PartyPopper,
  Camera,
  Tent,
  Dumbbell,
  Truck,
  Music,
  Utensils
} from "lucide-react";

export default function Categories() {
  const categories = [
    {
      name: "Construction Equipment",
      icon: Hammer,
      count: "150+ items",
      color: "from-blue-500 to-blue-600",
      description: "Heavy machinery & tools",
    },
    {
      name: "Event Furniture",
      icon: PartyPopper,
      count: "200+ items",
      color: "from-teal-500 to-teal-600",
      description: "Tables, chairs & decor",
    },
    {
      name: "Audio Visual",
      icon: Camera,
      count: "80+ items",
      color: "from-purple-500 to-purple-600",
      description: "Sound & projection systems",
    },
    {
      name: "Party Supplies",
      icon: Tent,
      count: "120+ items",
      color: "from-pink-500 to-pink-600",
      description: "Tents, decorations & games",
    },
    {
      name: "Sports Equipment",
      icon: Dumbbell,
      count: "90+ items",
      color: "from-green-500 to-green-600",
      description: "Sports gear & accessories",
    },
    {
      name: "Transportation",
      icon: Truck,
      count: "45+ items",
      color: "from-orange-500 to-orange-600",
      description: "Vehicles & moving equipment",
    },
    {
      name: "Entertainment",
      icon: Music,
      count: "60+ items",
      color: "from-indigo-500 to-indigo-600",
      description: "DJ equipment & entertainment",
    },
    {
      name: "Catering Equipment",
      icon: Utensils,
      count: "75+ items",
      color: "from-red-500 to-red-600",
      description: "Kitchen & serving equipment",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Browse by Category
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Find exactly what you need from our comprehensive collection of rental equipment and supplies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <a href="/products">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 hover:border-teal-300">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">{category.description}</p>
                    <p className="text-sm font-semibold text-teal-600">{category.count}</p>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
