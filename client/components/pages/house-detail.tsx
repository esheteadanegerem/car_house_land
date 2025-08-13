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
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { houses } from "@/lib/data"
import { useApp } from "@/context/app-context"

interface HouseDetailProps {
  houseId: string
}

export function HouseDetail({ houseId }: HouseDetailProps) {
  const { dispatch } = useApp()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const house = houses.find((h) => h.id === houseId)

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Property not found</h1>
          <Link href="/houses">
            <Button className="mt-4 text-sm sm:text-base">Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { type: "house", item: house } })
  }

  const formatPrice = (price: number) => {
    if (house.listingType === "rent") {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <Link
          href="/houses"
          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Back to Properties</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg">
                  <Image
                    src={house.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={house.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <Badge variant="secondary" className="bg-green-500 text-white text-xs sm:text-sm">
                      {house.status}
                    </Badge>
                  </div>
                  {house.featured && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <Badge variant="secondary" className="bg-purple-500 text-white text-xs sm:text-sm">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                {house.images.length > 1 && (
                  <div className="p-2 sm:p-4 flex space-x-1.5 sm:space-x-2 overflow-x-auto">
                    {house.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-green-500" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${house.title} ${index + 1}`}
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

            {/* Property Details */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Bedrooms</p>
                      <p className="font-semibold text-sm sm:text-base">{house.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Bathrooms</p>
                      <p className="font-semibold text-sm sm:text-base">{house.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Size</p>
                      <p className="font-semibold text-sm sm:text-base">{house.size.toLocaleString()} sq ft</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Built</p>
                      <p className="font-semibold text-sm sm:text-base">{house.yearBuilt}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{house.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Amenities</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {house.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Price and Actions */}
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{formatPrice(house.price)}</div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm sm:text-base">{house.rating}</span>
                    <span className="text-gray-500 text-xs sm:text-sm">({house.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">{house.location}</span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button className="w-full text-sm sm:text-base py-2.5 sm:py-3" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent text-sm sm:text-base py-2.5 sm:py-3">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Save Property
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Information */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Real Estate Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-green-600 text-sm sm:text-base">
                      {house.agentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{house.agentName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Licensed Real Estate Agent</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm">{house.agentPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm">{house.sellerEmail}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent text-sm sm:text-base">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Contact Agent
                </Button>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Property Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">{house.propertyType}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Listing Type</span>
                  <span className="font-medium capitalize">{house.listingType}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Parking Spaces</span>
                  <span className="font-medium">{house.parking}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{house.yearBuilt}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
