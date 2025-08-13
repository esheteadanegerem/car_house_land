"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, MapPin, Calendar, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/app-context"
import { CARS_DATA } from "@/lib/data/cars"

interface CarDetailProps {
  carId: string
}

export function CarDetail({ carId }: CarDetailProps) {
  const router = useRouter()
  const { addToCart, contactDealer, user, setIsAuthModalOpen, soldItems } = useApp()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const car = CARS_DATA.find((c) => c.id === carId)
  const isSold = soldItems.has(carId)

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Car Not Found</h1>
          <Button onClick={() => router.push("/cars")} className="text-sm sm:text-base">
            Back to Cars
          </Button>
        </div>
      </div>
    )
  }

  const specifications = [
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Year", value: car.year.toString() },
    { label: "Mileage", value: `${car.mileage.toLocaleString()} km` },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Transmission", value: car.transmission },
    { label: "Condition", value: car.condition },
    { label: "Location", value: car.location },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Button variant="ghost" onClick={() => router.push("/cars")} className="mb-4 sm:mb-6 text-sm sm:text-base">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Back to Cars
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <img
                src={car.images[selectedImageIndex] || "/placeholder.svg"}
                alt={`${car.make} ${car.model}`}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
              />
              {isSold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Badge
                    variant="destructive"
                    className="text-lg sm:text-xl md:text-2xl px-3 sm:px-4 md:px-6 py-1 sm:py-2"
                  >
                    SOLD
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
                <Badge
                  variant={car.condition === "new" ? "default" : "secondary"}
                  className="shadow-md text-xs sm:text-sm"
                >
                  {car.condition}
                </Badge>
              </div>
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="bg-white/90 hover:bg-white p-1.5 sm:p-2"
                >
                  <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white p-1.5 sm:p-2">
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {car.make} {car.model}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground mb-3 sm:mb-4">
                <div className="flex items-center">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current text-yellow-400" />
                  <span className="text-sm sm:text-base">{car.rating}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-sm sm:text-base">{car.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-sm sm:text-base">{car.year}</span>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3 sm:mb-4">
                ETB {car.price.toLocaleString()}
              </div>
            </div>

            {!isSold && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="flex-1 text-sm sm:text-base py-2.5 sm:py-3"
                  onClick={() => {
                    if (user) {
                      addToCart("car", car)
                    } else {
                      setIsAuthModalOpen(true)
                    }
                  }}
                  disabled={!user}
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 text-sm sm:text-base py-2.5 sm:py-3 bg-transparent"
                  onClick={() => (user ? contactDealer(car) : setIsAuthModalOpen(true))}
                >
                  Contact Dealer
                </Button>
              </div>
            )}

            {/* Specifications */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-1 sm:py-0">
                      <span className="text-muted-foreground text-sm sm:text-base">{spec.label}:</span>
                      <span className="font-medium text-sm sm:text-base">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{car.description}</p>
              </CardContent>
            </Card>

            {/* Dealer Info */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Dealer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">{car.dealer}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Authorized Dealer</p>
                  </div>
                  {!isSold && user && user.role !== "admin" && (
                    <Button variant="outline" onClick={() => contactDealer(car)} className="text-sm sm:text-base">
                      Contact Dealer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
