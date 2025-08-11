import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Star } from "lucide-react";

function ProductCard({ product, viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200">
        <div className="flex">
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={200}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-slate-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm text-slate-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
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
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-600 mb-3">${product.price}/day</p>
                <Button className="bg-slate-800 hover:bg-slate-900 text-white">Book Now</Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group border-slate-200">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
        <p className="text-2xl font-bold text-teal-600 mb-2">${product.price}/day</p>
        <p className="text-slate-600 text-sm mb-3">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm text-slate-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">Book Now</Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
