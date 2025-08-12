"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Eye, Edit, Package, DollarSign, Calendar } from "lucide-react"
import ShopOwnerProductDetail from "./ShopOwnerProductDetail"
import EditProductModal from "./EditProductModal"
import Cookies from 'js-cookie'
import axios from "axios"
import { backendurl, fileUrl } from "../../../../src/App"

export default function MyProducts({ user }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductDetail, setShowProductDetail] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [Product, setProduct] = useState([]);
  const userid = localStorage.getItem("user_id");
  const token = Cookies.get("token");

  const [products] = useState([
    {
      id: 1,
      name: "Excavator CAT 320",
      image: "/construction-excavator.png",
      quantity: 3,
      category: "Construction Equipment",
      pricing: {
        hourly: 45,
        daily: 180,
        weekly: 1050,
        monthly: 4200,
        yearly: 45000,
      },
      dueReturnPercentage: 15,
      specifications: {
        weight: "20 tons",
        engine: "Cat C7.1 ACERT",
        bucket: "1.2 cubic meters",
      },
      description: "Heavy-duty excavator perfect for construction and demolition projects.",
      availability: "Available",
    },
    {
      id: 2,
      name: "Party Tent 20x30",
      image: "/party-tent-decorations.png",
      quantity: 5,
      category: "Event Equipment",
      pricing: {
        hourly: 25,
        daily: 120,
        weekly: 700,
        monthly: 2800,
        yearly: 30000,
      },
      dueReturnPercentage: 10,
      specifications: {
        size: "20x30 feet",
        capacity: "150 people",
        material: "Waterproof vinyl",
      },
      description: "Large event tent suitable for weddings, parties, and outdoor events.",
      availability: "Available",
    },
    {
      id: 3,
      name: "Professional Camera Kit",
      image: "/placeholder.svg?height=300&width=400&text=Camera+Kit",
      quantity: 2,
      category: "Photography Equipment",
      pricing: {
        hourly: 35,
        daily: 150,
        weekly: 900,
        monthly: 3600,
        yearly: 40000,
      },
      dueReturnPercentage: 20,
      specifications: {
        camera: "Canon EOS R5",
        lenses: "24-70mm, 70-200mm",
        accessories: "Tripod, Flash, Batteries",
      },
      description: "Complete professional photography kit for events and shoots.",
      availability: "Rented",
    },
  ])

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setShowProductDetail(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  const getAvailabilityColor = (availability) => {
    return availability === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  if (showProductDetail && selectedProduct) {
    return (
      <ShopOwnerProductDetail
        product={selectedProduct}
        onBack={() => {
          setShowProductDetail(false)
          setSelectedProduct(null)
        }}
      />
    )
  }


  useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get(
        `${backendurl}/products/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            owner_id: userid
          }
        }
      );
      const result = resp.data;
      console.log("resdcfv", result);

      // Use Promise.all to wait for all async operations to complete
      const ordersWithNames = await Promise.all(
        result.products.map(async (order) => {
          try {
            const productResp = await axios.get(
              `${backendurl}/categories/${order.category_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...order,
              Cat_name: productResp.data.name
            };
          } catch (error) {
            console.error(`Error fetching product ${order.product_id}:`, error);
            return {
              ...order,
              name: "Product name unavailable"
            };
          }
        })
      );

      // console.log("result orders with names: ", ordersWithNames);
      setProduct(ordersWithNames)

    }
    fetchData();
  }, [])

  console.log(Product);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Products</h1>
        <p className="text-slate-600">Manage your rental inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Products</p>
                <p className="text-2xl font-bold text-slate-800">{Product.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter((p) => p.availability === "Available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Currently Rented</p>
                <p className="text-2xl font-bold text-orange-600">
                  {products.filter((p) => p.availability === "Rented").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Total Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Available Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Rented Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Product.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`${fileUrl}/products/${product.images_id[0]}`}
                          alt={product.name}
                          width={60}
                          height={45}
                          className="w-15 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{product.name}</p>
                          <p className="text-sm text-slate-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{product.Cat_name}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{product.total_quantity}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{product.available_quantity}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{product.rented_quantity}</span>
                    </td>
                   
                    <td className="py-4 px-4">
                      <Badge className={getAvailabilityColor("Available")}>Available</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewProduct(product)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No products yet</h3>
              <p className="text-slate-500">Add your first product to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
          onSave={(updatedProduct) => {
            console.log("Updated product:", updatedProduct)
            setShowEditModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
