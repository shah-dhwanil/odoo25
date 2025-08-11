import React from "react";
import { motion } from "framer-motion";
import { Calendar, Truck, FileText, BarChart3 } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Calendar,
      title: "Online Booking",
      description: "Easy scheduling and reservation management",
    },
    {
      icon: FileText,
      title: "Flexible Invoicing",
      description: "Automated billing and payment processing",
    },
    {
      icon: Truck,
      title: "Delivery Management",
      description: "Track and manage deliveries in real-time",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Comprehensive insights and performance metrics",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Why Choose RentalPro?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive rental management platform streamlines your
            entire operation, from booking to delivery, with powerful tools
            designed for modern businesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-teal-600 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
