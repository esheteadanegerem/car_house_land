"use client"

import { useEffect } from "react"
import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { User, Car, House, Land, Machine, Deal } from "@/types"

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
  })

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
        name: "Admin Support",
        email: "admin@massgebeya.com",
        phone: "+1 (555) 123-4567",
        telegram: "@massgebeya_admin",
        whatsapp: "+1-555-123-4567",
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

  // Load data from localStorage on mount
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
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  // Save to localStorage when data changes
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
