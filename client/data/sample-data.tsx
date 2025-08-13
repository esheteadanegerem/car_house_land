export interface BaseItem {
  id: string
  title: string
  price: number
  location: string
  description: string
  images: string[]
  listingType: "sale" | "rent"
  status: "available" | "sold" | "rented"
  rating: number
  reviews: number
  sellerName: string
  sellerContact: string
  createdAt: string
  updatedAt: string
}

export interface Car extends BaseItem {
  make: string
  model: string
  year: number
  mileage: number
  fuelType: string
  transmission: string
  color: string
}

export interface House extends BaseItem {
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  yearBuilt: number
  parking: string
}

export interface Land extends BaseItem {
  acres: number
  zoning: string
  utilities: string[]
  soilType: string
  access: string
}

export interface Machine extends BaseItem {
  category: string
  condition: string
  hoursUsed: number
  manufacturer: string
  model: string
  yearManufactured: number
}

export const cars: Car[] = [
  {
    id: "car-1",
    title: "2022 Tesla Model S Plaid",
    price: 89999,
    location: "San Francisco, CA",
    description:
      "Pristine condition Tesla Model S Plaid with autopilot, premium interior, and all the latest features. Only 15,000 miles, garage kept, and meticulously maintained.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.9,
    reviews: 23,
    sellerName: "Michael Chen",
    sellerContact: "michael.chen@email.com",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2022,
    mileage: 15000,
    fuelType: "Electric",
    transmission: "Automatic",
    color: "Pearl White",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "car-2",
    title: "2021 BMW M4 Competition",
    price: 67500,
    location: "Los Angeles, CA",
    description:
      "Stunning BMW M4 Competition in Alpine White with carbon fiber accents. Twin-turbo inline-6 engine, premium sound system, and sport seats.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.7,
    reviews: 18,
    sellerName: "Sarah Johnson",
    sellerContact: "sarah.j@email.com",
    make: "BMW",
    model: "M4 Competition",
    year: 2021,
    mileage: 22000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    color: "Alpine White",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:20:00Z",
  },
  {
    id: "car-3",
    title: "2020 Porsche 911 Carrera S",
    price: 95000,
    location: "Miami, FL",
    description:
      "Exceptional Porsche 911 Carrera S with sport package, ceramic brakes, and premium leather interior. Perfect for weekend drives and track days.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.8,
    reviews: 31,
    sellerName: "David Rodriguez",
    sellerContact: "d.rodriguez@email.com",
    make: "Porsche",
    model: "911 Carrera S",
    year: 2020,
    mileage: 18500,
    fuelType: "Gasoline",
    transmission: "Manual",
    color: "Jet Black",
    createdAt: "2024-01-08T11:45:00Z",
    updatedAt: "2024-01-22T13:30:00Z",
  },
  {
    id: "car-4",
    title: "2023 Audi RS6 Avant",
    price: 78900,
    location: "Seattle, WA",
    description:
      "Brand new Audi RS6 Avant wagon with twin-turbo V8, quattro all-wheel drive, and premium plus package. Perfect blend of performance and practicality.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.9,
    reviews: 12,
    sellerName: "Emma Wilson",
    sellerContact: "emma.wilson@email.com",
    make: "Audi",
    model: "RS6 Avant",
    year: 2023,
    mileage: 8500,
    fuelType: "Gasoline",
    transmission: "Automatic",
    color: "Nardo Gray",
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-25T10:15:00Z",
  },
  {
    id: "car-5",
    title: "2019 Mercedes-AMG GT 63 S",
    price: 85000,
    location: "New York, NY",
    description:
      "Powerful Mercedes-AMG GT 63 S with handcrafted V8 biturbo engine, AMG performance seats, and premium sound system. Immaculate condition.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.6,
    reviews: 27,
    sellerName: "James Thompson",
    sellerContact: "j.thompson@email.com",
    make: "Mercedes-Benz",
    model: "AMG GT 63 S",
    year: 2019,
    mileage: 28000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    color: "Iridium Silver",
    createdAt: "2024-01-05T08:30:00Z",
    updatedAt: "2024-01-19T15:45:00Z",
  },
]

export const houses: House[] = [
  {
    id: "house-1",
    title: "Modern Luxury Villa with Ocean View",
    price: 2850000,
    location: "Malibu, CA",
    description:
      "Stunning contemporary villa with panoramic ocean views, infinity pool, and high-end finishes throughout. Open floor plan perfect for entertaining.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.9,
    reviews: 45,
    sellerName: "Patricia Davis",
    sellerContact: "patricia.davis@email.com",
    bedrooms: 5,
    bathrooms: 6,
    squareFeet: 4200,
    propertyType: "Single Family",
    yearBuilt: 2021,
    parking: "3-car garage",
    createdAt: "2024-01-14T12:00:00Z",
    updatedAt: "2024-01-28T09:30:00Z",
  },
  {
    id: "house-2",
    title: "Historic Brownstone in Prime Location",
    price: 1950000,
    location: "Brooklyn, NY",
    description:
      "Beautifully restored 19th-century brownstone with original details, modern amenities, and private garden. Located in coveted Park Slope neighborhood.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.7,
    reviews: 32,
    sellerName: "Robert Martinez",
    sellerContact: "r.martinez@email.com",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3100,
    propertyType: "Townhouse",
    yearBuilt: 1895,
    parking: "Street parking",
    createdAt: "2024-01-11T15:45:00Z",
    updatedAt: "2024-01-24T11:20:00Z",
  },
  {
    id: "house-3",
    title: "Contemporary Penthouse with City Views",
    price: 3200000,
    location: "Chicago, IL",
    description:
      "Spectacular penthouse with floor-to-ceiling windows, private terrace, and breathtaking city skyline views. Premium building amenities included.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.8,
    reviews: 28,
    sellerName: "Lisa Anderson",
    sellerContact: "lisa.anderson@email.com",
    bedrooms: 3,
    bathrooms: 4,
    squareFeet: 2800,
    propertyType: "Condominium",
    yearBuilt: 2019,
    parking: "2 assigned spaces",
    createdAt: "2024-01-09T10:15:00Z",
    updatedAt: "2024-01-26T14:50:00Z",
  },
  {
    id: "house-4",
    title: "Charming Craftsman Bungalow",
    price: 875000,
    location: "Portland, OR",
    description:
      "Beautifully maintained Craftsman bungalow with original hardwood floors, built-in cabinetry, and mature landscaping. Move-in ready.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.6,
    reviews: 19,
    sellerName: "Mark Johnson",
    sellerContact: "mark.johnson@email.com",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    propertyType: "Single Family",
    yearBuilt: 1924,
    parking: "Detached garage",
    createdAt: "2024-01-07T13:30:00Z",
    updatedAt: "2024-01-21T16:45:00Z",
  },
  {
    id: "house-5",
    title: "Luxury Ranch Estate with Acreage",
    price: 1650000,
    location: "Austin, TX",
    description:
      "Expansive ranch-style home on 5 acres with pool, guest house, and horse facilities. Perfect for those seeking privacy and luxury.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.9,
    reviews: 37,
    sellerName: "Jennifer Brown",
    sellerContact: "jennifer.brown@email.com",
    bedrooms: 4,
    bathrooms: 5,
    squareFeet: 3600,
    propertyType: "Ranch",
    yearBuilt: 2018,
    parking: "4-car garage",
    createdAt: "2024-01-13T11:00:00Z",
    updatedAt: "2024-01-27T12:15:00Z",
  },
]

export const lands: Land[] = [
  {
    id: "land-1",
    title: "Prime Commercial Development Land",
    price: 1250000,
    location: "Phoenix, AZ",
    description:
      "Exceptional commercial development opportunity on major thoroughfare. Zoned for mixed-use development with high traffic counts and excellent visibility.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.5,
    reviews: 14,
    sellerName: "Thomas Wilson",
    sellerContact: "thomas.wilson@email.com",
    acres: 8.5,
    zoning: "Commercial Mixed-Use",
    utilities: ["Water", "Sewer", "Electric", "Gas", "Fiber"],
    soilType: "Sandy loam",
    access: "Paved road frontage",
    createdAt: "2024-01-16T09:45:00Z",
    updatedAt: "2024-01-29T13:20:00Z",
  },
  {
    id: "land-2",
    title: "Scenic Mountain View Acreage",
    price: 485000,
    location: "Asheville, NC",
    description:
      "Beautiful 12-acre parcel with stunning mountain views, creek frontage, and mature hardwood trees. Perfect for custom home or retreat.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.8,
    reviews: 22,
    sellerName: "Nancy Garcia",
    sellerContact: "nancy.garcia@email.com",
    acres: 12.3,
    zoning: "Residential Rural",
    utilities: ["Well water", "Septic approved", "Electric nearby"],
    soilType: "Clay loam",
    access: "Gravel road",
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-25T10:45:00Z",
  },
  {
    id: "land-3",
    title: "Agricultural Farmland with Water Rights",
    price: 750000,
    location: "Fresno, CA",
    description:
      "Productive agricultural land with established irrigation, water rights, and fertile soil. Currently planted with almonds and generating income.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.7,
    reviews: 18,
    sellerName: "Carlos Mendez",
    sellerContact: "carlos.mendez@email.com",
    acres: 25.0,
    zoning: "Agricultural",
    utilities: ["Irrigation water", "Electric", "Equipment barn"],
    soilType: "Fertile alluvial",
    access: "County road",
    createdAt: "2024-01-10T11:15:00Z",
    updatedAt: "2024-01-23T15:30:00Z",
  },
  {
    id: "land-4",
    title: "Waterfront Development Opportunity",
    price: 2100000,
    location: "Lake Tahoe, CA",
    description:
      "Rare waterfront development opportunity with 300 feet of lake frontage. Approved for luxury residential development with stunning lake views.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.9,
    reviews: 31,
    sellerName: "Michelle Taylor",
    sellerContact: "michelle.taylor@email.com",
    acres: 4.2,
    zoning: "Residential Waterfront",
    utilities: ["Water", "Sewer", "Electric", "Cable"],
    soilType: "Rocky with sand",
    access: "Private paved road",
    createdAt: "2024-01-08T16:00:00Z",
    updatedAt: "2024-01-26T12:45:00Z",
  },
  {
    id: "land-5",
    title: "Industrial Zoned Land Near Airport",
    price: 950000,
    location: "Denver, CO",
    description:
      "Strategic industrial land near Denver International Airport. Perfect for logistics, warehousing, or manufacturing. Rail access available.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.4,
    reviews: 12,
    sellerName: "Kevin O'Brien",
    sellerContact: "kevin.obrien@email.com",
    acres: 15.8,
    zoning: "Industrial Heavy",
    utilities: ["Water", "Sewer", "Electric", "Gas", "Rail spur"],
    soilType: "Compacted fill",
    access: "Highway frontage",
    createdAt: "2024-01-15T13:45:00Z",
    updatedAt: "2024-01-28T11:30:00Z",
  },
]

export const machines: Machine[] = [
  {
    id: "machine-1",
    title: "CAT 320 Hydraulic Excavator",
    price: 185000,
    location: "Houston, TX",
    description:
      "Well-maintained Caterpillar 320 hydraulic excavator with low hours. Includes multiple buckets, hydraulic hammer, and recent service records.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.6,
    reviews: 15,
    sellerName: "Construction Solutions LLC",
    sellerContact: "sales@constructionsolutions.com",
    category: "Construction Equipment",
    condition: "Excellent",
    hoursUsed: 2850,
    manufacturer: "Caterpillar",
    model: "320",
    yearManufactured: 2021,
    createdAt: "2024-01-14T10:30:00Z",
    updatedAt: "2024-01-27T14:15:00Z",
  },
  {
    id: "machine-2",
    title: "John Deere 6155R Tractor",
    price: 145000,
    location: "Des Moines, IA",
    description:
      "Powerful John Deere 6155R tractor with front loader, GPS guidance, and premium cab. Perfect for large farming operations.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.8,
    reviews: 23,
    sellerName: "Midwest Farm Equipment",
    sellerContact: "info@midwestfarm.com",
    category: "Agricultural Equipment",
    condition: "Very Good",
    hoursUsed: 1650,
    manufacturer: "John Deere",
    model: "6155R",
    yearManufactured: 2020,
    createdAt: "2024-01-11T12:45:00Z",
    updatedAt: "2024-01-24T09:20:00Z",
  },
  {
    id: "machine-3",
    title: "Bobcat S770 Skid Steer Loader",
    price: 68000,
    location: "Atlanta, GA",
    description:
      "Versatile Bobcat S770 skid steer loader with multiple attachments. Low hours, well-maintained, and ready for immediate use.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.5,
    reviews: 18,
    sellerName: "Southern Equipment Co.",
    sellerContact: "sales@southernequip.com",
    category: "Construction Equipment",
    condition: "Good",
    hoursUsed: 3200,
    manufacturer: "Bobcat",
    model: "S770",
    yearManufactured: 2019,
    createdAt: "2024-01-09T15:20:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
  },
  {
    id: "machine-4",
    title: "Komatsu PC210LC-11 Excavator",
    price: 195000,
    location: "Las Vegas, NV",
    description:
      "Advanced Komatsu PC210LC-11 excavator with intelligent machine control, fuel-efficient engine, and spacious operator cab.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.7,
    reviews: 21,
    sellerName: "Desert Heavy Equipment",
    sellerContact: "contact@desertheavy.com",
    category: "Construction Equipment",
    condition: "Excellent",
    hoursUsed: 1950,
    manufacturer: "Komatsu",
    model: "PC210LC-11",
    yearManufactured: 2022,
    createdAt: "2024-01-13T11:00:00Z",
    updatedAt: "2024-01-26T16:30:00Z",
  },
  {
    id: "machine-5",
    title: "Case IH Magnum 380 CVT Tractor",
    price: 285000,
    location: "Omaha, NE",
    description:
      "High-performance Case IH Magnum 380 CVT tractor with advanced technology, comfortable cab, and exceptional fuel efficiency.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    listingType: "sale",
    status: "available",
    rating: 4.9,
    reviews: 16,
    sellerName: "Great Plains Ag Equipment",
    sellerContact: "sales@greatplainsag.com",
    category: "Agricultural Equipment",
    condition: "Like New",
    hoursUsed: 850,
    manufacturer: "Case IH",
    model: "Magnum 380 CVT",
    yearManufactured: 2023,
    createdAt: "2024-01-17T14:15:00Z",
    updatedAt: "2024-01-29T10:00:00Z",
  },
]
