"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Gauge,
  Weight,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { useApp } from "@/context/app-context"

interface MachineDetailProps {
  machineId: string
}

export function MachineDetail({ machineId }: MachineDetailProps) {
  const { machines, dispatch } = useApp()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const machine = machines?.find((m) => m.id === machineId || m.id === String(machineId) || String(m.id) === machineId)

  if (!machines) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Machine not found</h1>
          <Link href="/machines">
            <Button className="mt-4">Back to Machines</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { type: "machine", item: machine } })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/machines"
          className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Machines</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg">
                  <Image
                    src={machine.images?.[selectedImageIndex] || "/placeholder.svg"}
                    alt={machine.title || "Machine"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-orange-500 text-white">
                      {machine.status || "Available"}
                    </Badge>
                  </div>
                  {machine.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-purple-500 text-white">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                {machine.images && machine.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {machine.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-orange-500" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${machine.title || "Machine"} ${index + 1}`}
                          width={80}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Machine Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Machine Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-semibold">{machine.year || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Power</p>
                      <p className="font-semibold">{machine.power || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Weight className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-semibold">{(machine.weight || 0).toLocaleString()} lbs</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{machine.description || "No description available"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">{machine.brand || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model</span>
                        <span className="font-medium">{machine.model || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity</span>
                        <span className="font-medium">{machine.capacity || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hours Used</span>
                        <span className="font-medium">{(machine.hoursUsed || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Condition & Warranty</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition</span>
                        <span className="font-medium capitalize">{machine.condition || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Machine Type</span>
                        <span className="font-medium capitalize">{machine.machineType || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Warranty</span>
                        <span className="font-medium">{machine.warranty || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and Actions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-gray-900">{(machine.price || 0).toLocaleString()} ETB</div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{machine.rating || "0"}</span>
                    <span className="text-gray-500">({machine.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{machine.location || "Location not specified"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Machine
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dealer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Dealer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-orange-600">
                      {machine.sellerName
                        ? machine.sellerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "NA"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{machine.sellerName || "No Dealer Assigned"}</p>
                    <p className="text-sm text-gray-600">Certified Equipment Dealer</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{machine.sellerPhone || "No phone available"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{machine.sellerEmail || "No email available"}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Dealer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
