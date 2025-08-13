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
  Square,
  Droplets,
  Zap,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { lands } from "@/lib/data"
import { useApp } from "@/context/app-context"

interface LandDetailProps {
  landId: string
}

export function LandDetail({ landId }: LandDetailProps) {
  const { dispatch } = useApp()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const land = lands.find((l) => l.id === landId)

  if (!land) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Land not found</h1>
          <Link href="/lands">
            <Button className="mt-4">Back to Lands</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { type: "land", item: land } })
  }

  const formatPrice = (price: number) => {
    if (land.listingType === "rent") {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/lands" className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lands</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg">
                  <Image
                    src={land.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={land.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-yellow-500 text-white">
                      {land.status}
                    </Badge>
                  </div>
                  {land.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-purple-500 text-white">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                {land.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {land.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-yellow-500" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${land.title} ${index + 1}`}
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

            {/* Land Details */}
            <Card>
              <CardHeader>
                <CardTitle>Land Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Square className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="font-semibold">{land.size} acres</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Zoning</p>
                      <p className="font-semibold capitalize">{land.zoning}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Water Access</p>
                      <p className="font-semibold">{land.waterAccess ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{land.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Soil Type</h3>
                  <p className="text-gray-600">{land.soilType}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Development Potential</h3>
                  <p className="text-gray-600">{land.developmentPotential}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Available Utilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {land.utilities.map((utility, index) => (
                      <Badge key={index} variant="outline">
                        {utility}
                      </Badge>
                    ))}
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
                  <div className="text-3xl font-bold text-gray-900">{formatPrice(land.price)}</div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{land.rating}</span>
                    <span className="text-gray-500">({land.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{land.location}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Land
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Information */}
            <Card>
              <CardHeader>
                <CardTitle>Land Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-yellow-600">
                      {land.sellerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{land.sellerName}</p>
                    <p className="text-sm text-gray-600">Licensed Land Agent</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{land.sellerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{land.sellerEmail}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Agent
                </Button>
              </CardContent>
            </Card>

            {/* Land Features */}
            <Card>
              <CardHeader>
                <CardTitle>Land Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing Type</span>
                  <span className="font-medium capitalize">{land.listingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Road Access</span>
                  <span className="font-medium">{land.roadAccess ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Access</span>
                  <span className="font-medium">{land.waterAccess ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zoning</span>
                  <span className="font-medium capitalize">{land.zoning}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
