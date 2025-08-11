
import { motion } from "framer-motion";
import { Users, Package, Star, Clock } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Happy Customers",
      color: "text-blue-600",
    },
    {
      icon: Package,
      number: "5,000+",
      label: "Products Available",
      color: "text-teal-600",
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Average Rating",
      color: "text-yellow-500",
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Customer Support",
      color: "text-green-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Thousands</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join the growing community of businesses and individuals who trust RentalPro for their rental needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`w-16 h-16 ${stat.color} bg-white/10 rounded-xl flex items-center justify-center mb-4 mx-auto`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-slate-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
