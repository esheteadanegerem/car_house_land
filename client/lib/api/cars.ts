import type { Car } from "@/types"

const API_BASE_URL = "https://car-house-land.onrender.com/api"

// Map API response to our Car interface
function mapApiCarToLocal(apiCar: any): Car {
  return {
    id: apiCar._id || apiCar.id,
    title: apiCar.title,
    make: apiCar.make,
    model: apiCar.model,
    year: apiCar.year,
    price: apiCar.price,
    mileage: apiCar.mileage || 0,
    fuelType: apiCar.fuelType,
    transmission: apiCar.transmission,
    condition: apiCar.condition,
    location: `${apiCar.city || ""}, ${apiCar.region || ""}`.replace(/^,\s*|,\s*$/g, "") || "Location not specified",
    city: apiCar.city || "Unknown City",
    region: apiCar.region || "Unknown Region",
    address: apiCar.address || "Address not specified",
    kebele: apiCar.kebele,
    images: apiCar.images?.map((img: any) => img.url) || ["/classic-red-convertible.png"],
    status: apiCar.status === "available" ? "available" : apiCar.status === "sold" ? "sold" : "pending",
    rating: 4.5, // Default rating since API doesn't provide this
    reviews: Math.floor(Math.random() * 50) + 1, // Random reviews count
    description: apiCar.description,
    featured: Math.random() > 0.7, // Random featured status
    createdAt: apiCar.createdAt || new Date().toISOString(),
    sellerId: apiCar.owner || "unknown",
    sellerName: "Car Dealer", // Default seller name
    sellerPhone: "+251911234567", // Default phone
    sellerEmail: "dealer@example.com", // Default email
    bodyType: apiCar.bodyType || "sedan",
    color: apiCar.color || "Unknown",
    engine: "2.0L", // Default engine since API doesn't provide this
    listingType: apiCar.type === "sale" ? "sale" : "rent",
  }
}

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response structures
    const cars = Array.isArray(data) ? data : data.cars || data.data || []

    return cars.map(mapApiCarToLocal)
  } catch (error) {
    console.error("Error fetching cars:", error)
    // Return empty array on error to prevent app crash
    return []
  }
}

export async function fetchCarById(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response structures
    const car = data.car || data.data || data

    return mapApiCarToLocal(car)
  } catch (error) {
    console.error("Error fetching car by ID:", error)
    return null
  }
}
