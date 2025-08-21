"use client"

import { useEffect } from "react"
import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { User, Car, House, Land, Machine, Deal } from "@/types"
import { fetchCars } from "@/lib/api/cars"
import { houses } from "@/lib/data"
import { MACHINES_DATA } from "@/lib/data/machines"
import { LANDS_DATA } from "@/lib/data/lands"

interface AppState {
  user: User | null
  cart: Array<{
    id: string
    type: "car" | "house" | "land" | "machine"
    item: Car | House | Land | Machine
    quantity: number
  }>
  favorites: Array<{
    id: string
    type: "car" | "house" | "land" | "machine"
    item: Car | House | Land | Machine
  }>
  deals: Deal[]
  soldItems: Set<string>
  isAuthModalOpen: boolean
  cars: Car[]
  houses: House[]
  machines: Machine[]
  lands: Land[]
  carsLoading: boolean
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_TO_CART"; payload: { type: "car" | "house" | "land" | "machine"; item: Car | House | Land | Machine } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | {
      type: "ADD_TO_FAVORITES"
      payload: { type: "car" | "house" | "land" | "machine"; item: Car | House | Land | Machine }
    }
  | { type: "REMOVE_FROM_FAVORITES"; payload: string }
  | { type: "SET_AUTH_MODAL"; payload: boolean }
  | { type: "SET_DEALS"; payload: Deal[] }
  | { type: "ADD_DEAL"; payload: Deal }
  | { type: "UPDATE_DEAL"; payload: { id: string; updates: Partial<Deal> } }
  | {
      type: "SET_CART"
      payload: Array<{
        id: string
        type: "car" | "house" | "land" | "machine"
        item: Car | House | Land | Machine
        quantity: number
      }>
    }
  | {
      type: "SET_FAVORITES"
      payload: Array<{
        id: string
        type: "car" | "house" | "land" | "machine"
        item: Car | House | Land | Machine
      }>
    }
  | { type: "SET_CARS"; payload: Car[] }
  | { type: "ADD_CAR"; payload: Car }
  | { type: "UPDATE_CAR"; payload: { id: string; updates: Partial<Car> } }
  | { type: "DELETE_CAR"; payload: string }
  | { type: "SET_HOUSES"; payload: House[] }
  | { type: "ADD_HOUSE"; payload: House }
  | { type: "UPDATE_HOUSE"; payload: { id: string; updates: Partial<House> } }
  | { type: "DELETE_HOUSE"; payload: string }
  | { type: "SET_MACHINES"; payload: Machine[] }
  | { type: "ADD_MACHINE"; payload: Machine }
  | { type: "UPDATE_MACHINE"; payload: { id: string; updates: Partial<Machine> } }
  | { type: "DELETE_MACHINE"; payload: string }
  | { type: "SET_LANDS"; payload: Land[] }
  | { type: "ADD_LAND"; payload: Land }
  | { type: "UPDATE_LAND"; payload: { id: string; updates: Partial<Land> } }
  | { type: "DELETE_LAND"; payload: string }
  | { type: "SET_CARS_LOADING"; payload: boolean }

interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>
  addToCart: (type: "car" | "house" | "land" | "machine", item: Car | House | Land | Machine) => void
  removeFromCart: (id: string) => void
  updateCartQuantity: (id: string, quantity: number) => void
  addToFavorites: (type: "car" | "house" | "land" | "machine", item: Car | House | Land | Machine) => void
  removeFromFavorites: (id: string) => void
  toggleFavorite: (type: "car" | "house" | "land" | "machine", item: Car | House | Land | Machine) => void
  isFavorite: (itemId: string) => boolean
  setIsAuthModalOpen: (open: boolean) => void
  handleLogin: (email: string, password: string) => Promise<boolean>
  handleRegister: (name: string, email: string, password: string) => Promise<boolean>
  handleLogout: () => void
  handleAuth: (user: User) => void
  createDeal: (
    itemType: "car" | "house" | "land" | "machine",
    item: Car | House | Land | Machine,
    message: string,
  ) => void
  updateDealStatus: (dealId: string, status: Deal["status"]) => void
  getPendingDealsCount: () => number
  getUserDeals: () => Deal[]
  getAdminDeals: () => Deal[]
  addCar: (car: Car) => void
  updateCar: (id: string, updates: Partial<Car>) => void
  deleteCar: (id: string) => void
  addHouse: (house: House) => void
  updateHouse: (id: string, updates: Partial<House>) => void
  deleteHouse: (id: string) => void
  addMachine: (machine: Machine) => void
  updateMachine: (id: string, updates: Partial<Machine>) => void
  deleteMachine: (id: string) => void
  addLand: (land: Land) => void
  updateLand: (id: string, updates: Partial<Land>) => void
  deleteLand: (id: string) => void
  refreshCars: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }
    case "SET_CART":
      return { ...state, cart: action.payload || [] }
    case "ADD_TO_CART":
      const existingCartItem = state.cart.find(
        (item) => item.type === action.payload.type && item.item.id === action.payload.item.id,
      )
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === existingCartItem.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      const newCartItem = {
        id: `${action.payload.type}-${action.payload.item.id}-${Date.now()}`,
        type: action.payload.type,
        item: action.payload.item,
        quantity: 1,
      }
      return { ...state, cart: [...(state.cart || []), newCartItem] }
    case "REMOVE_FROM_CART":
      return { ...state, cart: (state.cart || []).filter((item) => item.id !== action.payload) }
    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: (state.cart || []).map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload || [] }
    case "ADD_TO_FAVORITES":
      const existingFavorite = state.favorites.find(
        (item) => item.type === action.payload.type && item.item.id === action.payload.item.id,
      )
      if (existingFavorite) return state
      const newFavorite = {
        id: `${action.payload.type}-${action.payload.item.id}`,
        type: action.payload.type,
        item: action.payload.item,
      }
      return { ...state, favorites: [...(state.favorites || []), newFavorite] }
    case "REMOVE_FROM_FAVORITES":
      return { ...state, favorites: (state.favorites || []).filter((item) => item.id !== action.payload) }
    case "SET_AUTH_MODAL":
      return { ...state, isAuthModalOpen: action.payload }
    case "SET_DEALS":
      return { ...state, deals: action.payload || [] }
    case "ADD_DEAL":
      return { ...state, deals: [...(state.deals || []), action.payload] }
    case "UPDATE_DEAL":
      return {
        ...state,
        deals: (state.deals || []).map((deal) =>
          deal.id === action.payload.id ? { ...deal, ...action.payload.updates } : deal,
        ),
      }
    case "SET_CARS":
      return { ...state, cars: action.payload }
    case "ADD_CAR":
      return { ...state, cars: [...state.cars, action.payload] }
    case "UPDATE_CAR":
      return {
        ...state,
        cars: state.cars.map((car) => (car.id === action.payload.id ? { ...car, ...action.payload.updates } : car)),
      }
    case "DELETE_CAR":
      return { ...state, cars: state.cars.filter((car) => car.id !== action.payload) }
    case "SET_HOUSES":
      return { ...state, houses: action.payload }
    case "ADD_HOUSE":
      return { ...state, houses: [...state.houses, action.payload] }
    case "UPDATE_HOUSE":
      return {
        ...state,
        houses: state.houses.map((house) =>
          house.id === action.payload.id ? { ...house, ...action.payload.updates } : house,
        ),
      }
    case "DELETE_HOUSE":
      return { ...state, houses: state.houses.filter((house) => house.id !== action.payload) }
    case "SET_MACHINES":
      return { ...state, machines: action.payload }
    case "ADD_MACHINE":
      return { ...state, machines: [...state.machines, action.payload] }
    case "UPDATE_MACHINE":
      return {
        ...state,
        machines: state.machines.map((machine) =>
          machine.id === action.payload.id ? { ...machine, ...action.payload.updates } : machine,
        ),
      }
    case "DELETE_MACHINE":
      return { ...state, machines: state.machines.filter((machine) => machine.id !== action.payload) }
    case "SET_LANDS":
      return { ...state, lands: action.payload }
    case "ADD_LAND":
      return { ...state, lands: [...state.lands, action.payload] }
    case "UPDATE_LAND":
      return {
        ...state,
        lands: state.lands.map((land) =>
          land.id === action.payload.id ? { ...land, ...action.payload.updates } : land,
        ),
      }
    case "DELETE_LAND":
      return { ...state, lands: state.lands.filter((land) => land.id !== action.payload) }
    case "SET_CARS_LOADING":
      return { ...state, carsLoading: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    cart: [],
    favorites: [],
    deals: [],
    soldItems: new Set(),
    isAuthModalOpen: false,
    cars: [],
    houses: houses,
    machines: MACHINES_DATA,
    lands: LANDS_DATA,
    carsLoading: false,
  })

  const loadCarsFromAPI = async () => {
    dispatch({ type: "SET_CARS_LOADING", payload: true })
    try {
      const apiCars = await fetchCars()

      const savedCars = localStorage.getItem("carsData")
      let adminCars: Car[] = []
      if (savedCars) {
        try {
          const parsedCars = JSON.parse(savedCars)
          if (Array.isArray(parsedCars)) {
            adminCars = parsedCars
          }
        } catch (error) {
          console.error("Error parsing saved cars:", error)
        }
      }

      const allCars = [...apiCars]
      adminCars.forEach((adminCar) => {
        if (!allCars.find((car) => car.id === adminCar.id)) {
          allCars.push(adminCar)
        }
      })

      dispatch({ type: "SET_CARS", payload: allCars })
    } catch (error) {
      console.error("Error loading cars from API:", error)
      const savedCars = localStorage.getItem("carsData")
      if (savedCars) {
        try {
          const parsedCars = JSON.parse(savedCars)
          if (Array.isArray(parsedCars)) {
            dispatch({ type: "SET_CARS", payload: parsedCars })
          }
        } catch (error) {
          console.error("Error parsing saved cars:", error)
        }
      }
    } finally {
      dispatch({ type: "SET_CARS_LOADING", payload: false })
    }
  }

  const refreshCars = async () => {
    await loadCarsFromAPI()
  }

  const addToCart = (type: "car" | "house" | "land" | "machine", item: Car | House | Land | Machine) => {
    dispatch({ type: "ADD_TO_CART", payload: { type, item } })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id, quantity } })
  }

  const addToFavorites = (type: "car" | "house" | "land" | "machine", item: Car | House | Land | Machine) => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: { type, item } })
  }

  const removeFromFavorites = (id: string) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: id })
  }

  const toggleFavorite = (type: "car" | "house" | "land" | "machine", item: Car | House | Land | Machine) => {
    const favoriteId = `${type}-${item.id}`
    const isFav = state.favorites.some((fav) => fav.id === favoriteId)
    if (isFav) {
      removeFromFavorites(favoriteId)
    } else {
      addToFavorites(type, item)
    }
  }

  const isFavorite = (itemId: string) => {
    return state.favorites.some((fav) => fav.item.id === itemId)
  }

  const setIsAuthModalOpen = (open: boolean) => {
    dispatch({ type: "SET_AUTH_MODAL", payload: open })
  }

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email && password) {
        const mockUser: User = {
          id: "1",
          name: email.split("@")[0],
          email,
          role: email.includes("admin") ? "admin" : "user",
          avatar: "/placeholder.svg?height=40&width=40",
        }
        dispatch({ type: "SET_USER", payload: mockUser })
        localStorage.setItem("mockUser", JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const handleRegister = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      if (name && email && password) {
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: "user",
          avatar: "/placeholder.svg?height=40&width=40",
        }
        dispatch({ type: "SET_USER", payload: mockUser })
        localStorage.setItem("mockUser", JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const handleLogout = () => {
    dispatch({ type: "SET_USER", payload: null })
    localStorage.removeItem("mockUser")
  }

  const handleAuth = (user: User) => {
    dispatch({ type: "SET_USER", payload: user })
    localStorage.setItem("mockUser", JSON.stringify(user))
    setIsAuthModalOpen(false)
  }

  const createDeal = (
    itemType: "car" | "house" | "land" | "machine",
    item: Car | House | Land | Machine,
    message: string,
  ) => {
    if (!state.user) return

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      itemId: item.id,
      item,
      itemType,
      userId: state.user.id,
      userName: state.user.name,
      userEmail: state.user.email,
      originalPrice: item.price,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatHistory: [],
      adminInfo: {
        name: "Alemayehu Bekele",
        email: "admin@ethiopiapropertyauto.com",
        phone: "+251 911 123 456",
        telegram: "@ethiopiapropertyauto_admin",
        whatsapp: "+251-911-123-456",
      },
    }

    dispatch({ type: "ADD_DEAL", payload: newDeal })
  }

  const updateDealStatus = (dealId: string, status: Deal["status"]) => {
    dispatch({
      type: "UPDATE_DEAL",
      payload: {
        id: dealId,
        updates: {
          status,
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  const getPendingDealsCount = () => {
    return state.deals.filter((deal) => deal.status === "pending").length
  }

  const getUserDeals = () => {
    if (!state.user) return []
    return state.deals.filter((deal) => deal.userId === state.user.id)
  }

  const getAdminDeals = () => {
    return state.deals
  }

  useEffect(() => {
    try {
      const mockUser = localStorage.getItem("mockUser")
      if (mockUser) {
        dispatch({ type: "SET_USER", payload: JSON.parse(mockUser) })
      }

      const savedCart = localStorage.getItem("userCart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: "SET_CART", payload: parsedCart })
        }
      }

      const savedFavorites = localStorage.getItem("userFavorites")
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        if (Array.isArray(parsedFavorites)) {
          dispatch({ type: "SET_FAVORITES", payload: parsedFavorites })
        }
      }

      const savedDeals = localStorage.getItem("deals")
      if (savedDeals) {
        const parsedDeals = JSON.parse(savedDeals)
        if (Array.isArray(parsedDeals)) {
          dispatch({ type: "SET_DEALS", payload: parsedDeals })
        }
      }

      loadCarsFromAPI()

      const savedHouses = localStorage.getItem("housesData")
      if (savedHouses) {
        const parsedHouses = JSON.parse(savedHouses)
        if (Array.isArray(parsedHouses)) {
          const mergedHouses = [...houses]
          parsedHouses.forEach((savedHouse: House) => {
            if (!mergedHouses.find((house) => house.id === savedHouse.id)) {
              mergedHouses.push(savedHouse)
            }
          })
          dispatch({ type: "SET_HOUSES", payload: mergedHouses })
        }
      }

      const savedMachines = localStorage.getItem("machinesData")
      if (savedMachines) {
        const parsedMachines = JSON.parse(savedMachines)
        if (Array.isArray(parsedMachines)) {
          const mergedMachines = [...MACHINES_DATA]
          parsedMachines.forEach((savedMachine: Machine) => {
            if (!mergedMachines.find((machine) => machine.id === savedMachine.id)) {
              mergedMachines.push(savedMachine)
            }
          })
          dispatch({ type: "SET_MACHINES", payload: mergedMachines })
        }
      }

      const savedLands = localStorage.getItem("landsData")
      if (savedLands) {
        const parsedLands = JSON.parse(savedLands)
        if (Array.isArray(parsedLands)) {
          const mergedLands = [...LANDS_DATA]
          parsedLands.forEach((savedLand: Land) => {
            if (!mergedLands.find((land) => land.id === savedLand.id)) {
              mergedLands.push(savedLand)
            }
          })
          dispatch({ type: "SET_LANDS", payload: mergedLands })
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    try {
      const adminCars = state.cars.filter((car) => car.id.toString().startsWith("car-"))
      if (adminCars.length > 0) {
        localStorage.setItem("carsData", JSON.stringify(adminCars))
      }
    } catch (error) {
      console.error("Error saving cars to localStorage:", error)
    }
  }, [state.cars])

  useEffect(() => {
    try {
      localStorage.setItem("userCart", JSON.stringify(state.cart || []))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state.cart])

  useEffect(() => {
    try {
      localStorage.setItem("userFavorites", JSON.stringify(state.favorites || []))
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error)
    }
  }, [state.favorites])

  useEffect(() => {
    try {
      localStorage.setItem("deals", JSON.stringify(state.deals || []))
    } catch (error) {
      console.error("Error saving deals to localStorage:", error)
    }
  }, [state.deals])

  useEffect(() => {
    try {
      const dynamicMachines = state.machines.filter(
        (machine) => !MACHINES_DATA.find((staticMachine) => staticMachine.id === machine.id),
      )
      localStorage.setItem("machinesData", JSON.stringify(dynamicMachines))
    } catch (error) {
      console.error("Error saving machines to localStorage:", error)
    }
  }, [state.machines])

  useEffect(() => {
    try {
      const dynamicLands = state.lands.filter((land) => !LANDS_DATA.find((staticLand) => staticLand.id === land.id))
      localStorage.setItem("landsData", JSON.stringify(dynamicLands))
    } catch (error) {
      console.error("Error saving lands to localStorage:", error)
    }
  }, [state.lands])

  const addCar = (car: Car) => {
    dispatch({ type: "ADD_CAR", payload: car })
  }

  const updateCar = (id: string, updates: Partial<Car>) => {
    dispatch({ type: "UPDATE_CAR", payload: { id, updates } })
  }

  const deleteCar = (id: string) => {
    dispatch({ type: "DELETE_CAR", payload: id })
  }

  const addHouse = (house: House) => {
    dispatch({ type: "ADD_HOUSE", payload: house })
  }

  const updateHouse = (id: string, updates: Partial<House>) => {
    dispatch({ type: "UPDATE_HOUSE", payload: { id, updates } })
  }

  const deleteHouse = (id: string) => {
    dispatch({ type: "DELETE_HOUSE", payload: id })
  }

  const addMachine = (machine: Machine) => {
    dispatch({ type: "ADD_MACHINE", payload: machine })
  }

  const updateMachine = (id: string, updates: Partial<Machine>) => {
    dispatch({ type: "UPDATE_MACHINE", payload: { id, updates } })
  }

  const deleteMachine = (id: string) => {
    dispatch({ type: "DELETE_MACHINE", payload: id })
  }

  const addLand = (land: Land) => {
    dispatch({ type: "ADD_LAND", payload: land })
  }

  const updateLand = (id: string, updates: Partial<Land>) => {
    dispatch({ type: "UPDATE_LAND", payload: { id, updates } })
  }

  const deleteLand = (id: string) => {
    dispatch({ type: "DELETE_LAND", payload: id })
  }

  const value: AppContextType = {
    ...state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    setIsAuthModalOpen,
    handleLogin,
    handleRegister,
    handleLogout,
    handleAuth,
    createDeal,
    updateDealStatus,
    getPendingDealsCount,
    getUserDeals,
    getAdminDeals,
    addCar,
    updateCar,
    deleteCar,
    addHouse,
    updateHouse,
    deleteHouse,
    addMachine,
    updateMachine,
    deleteMachine,
    addLand,
    updateLand,
    deleteLand,
    refreshCars,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
