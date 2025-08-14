export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  avatar?: string
}

export interface CartItem {
  cartId: number
  id: string
  title?: string
  make?: string
  model?: string
  price: number
  image: string
  quantity: number
  category: "car" | "house" | "land" | "machine"
}

export interface Deal {
  id: string
  itemId: string
  item: Car | House | Land | Machine // Made item type more specific
  itemType: "car" | "house" | "land" | "machine" // Added itemType field
  userId: string
  userName: string
  userEmail: string
  userPhone?: string // Added optional user phone
  originalPrice: number
  userOfferPrice?: number
  message: string
  userMessage?: string
  status: "pending" | "accepted" | "completed" | "incomplete" | "rejected" // Updated status options to match requirements
  createdAt: string
  updatedAt: string
  chatHistory: ChatMessage[]
  adminInfo: {
    name: string
    email: string
    phone: string
    telegram?: string
    whatsapp?: string
  }
}

export interface ChatMessage {
  id: string
  sender: "user" | "admin"
  message: string
  timestamp: string
}

export interface Car {
  id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  condition: "new" | "used"
  location: string
  images: string[]
  status: "available" | "sold" | "pending"
  rating: number
  reviews: number
  description: string
  featured: boolean
  createdAt: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  bodyType: string
  color: string
  engine: string
  listingType: "sale" | "rent"
}

export interface House {
  id: string
  title: string
  
  price: number
  bedrooms: number
  bathrooms: number
  size: number
  location: string
  images: string[]
  status: "available" | "sold" | "pending"
  rating: number
  reviews: number
  description: string
  featured: boolean
  createdAt: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  propertyType: string
  listingType: "sale" | "rent"
  yearBuilt: number
  parking: number
  amenities: string[]
  agentName: string
  agentPhone: string
}

export interface Land {
  id: string
  title: string
  price: number
  size: number
  location: string
  images: string[]
  status: "available" | "sold" | "pending"
  rating: number
  reviews: number
  description: string
  featured: boolean
  createdAt: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  zoning: string
  listingType: "sale" | "rent" | "lease"
  soilType: string
  waterAccess: boolean
  roadAccess: boolean
  utilities: string[]
  developmentPotential: string
}

export interface Machine {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  condition: "new" | "used" | "refurbished"
  location: string
  images: string[]
  status: "available" | "sold" | "pending"
  rating: number
  reviews: number
  description: string
  featured: boolean
  createdAt: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  machineType: string
  power: string
  weight: number
  capacity: string
  hoursUsed: number
  warranty: string
  listingType: "sale" | "rent" | "lease"
}
