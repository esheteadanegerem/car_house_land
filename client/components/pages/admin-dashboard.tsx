"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  PieChart,
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  X,
  ImageIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  Home,
  MapPin,
  Wrench,
  Mail,
  Phone,
  BarChart3,
  Target,
  Globe,
  ShoppingCart,
  Star,
  ArrowUpRight,
  Download,
  RefreshCw,
} from "lucide-react"
import { cars, houses, lands, machines } from "@/data/sample-data"
import type { Deal } from "@/types"

export function AdminDashboard() {
  const { user, deals, updateDealStatus, getPendingDealsCount } = useApp()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState("cars")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isDealDetailOpen, setIsDealDetailOpen] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)
  const [viewingItem, setViewingItem] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-responsive-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-responsive-base text-gray-600 mt-2">You need admin privileges to access this page</p>
        </div>
      </div>
    )
  }

  const totalListings = cars.length + houses.length + lands.length + machines.length
  const totalRevenue = 2450000
  const activeUsers = 1250
  const pendingDeals = getPendingDealsCount()

  const categoryData = [
    {
      name: "Cars",
      value: cars.length,
      color: "var(--color-cars-primary)",
      percentage: Math.round((cars.length / totalListings) * 100),
    },
    {
      name: "Houses",
      value: houses.length,
      color: "var(--color-houses-primary)",
      percentage: Math.round((houses.length / totalListings) * 100),
    },
    {
      name: "Lands",
      value: lands.length,
      color: "var(--color-lands-primary)",
      percentage: Math.round((lands.length / totalListings) * 100),
    },
    {
      name: "Machines",
      value: machines.length,
      color: "var(--color-machines-primary)",
      percentage: Math.round((machines.length / totalListings) * 100),
    },
  ]

  const revenueData = [
    { month: "Jan", revenue: 180000, listings: 45, users: 120, deals: 8 },
    { month: "Feb", revenue: 220000, listings: 52, users: 145, deals: 12 },
    { month: "Mar", revenue: 280000, listings: 68, users: 180, deals: 15 },
    { month: "Apr", revenue: 320000, listings: 75, users: 210, deals: 18 },
    { month: "May", revenue: 380000, listings: 89, users: 250, deals: 22 },
    { month: "Jun", revenue: 420000, listings: 95, users: 280, deals: 25 },
  ]

  const performanceData = [
    { name: "Conversion Rate", value: 68, color: "#10b981" },
    { name: "User Satisfaction", value: 85, color: "#3b82f6" },
    { name: "Platform Uptime", value: 99.8, color: "#8b5cf6" },
    { name: "Response Time", value: 92, color: "#f97316" },
  ]

  const trafficData = [
    { time: "00:00", visitors: 120, pageViews: 340 },
    { time: "04:00", visitors: 80, pageViews: 220 },
    { time: "08:00", visitors: 280, pageViews: 680 },
    { time: "12:00", visitors: 450, pageViews: 1200 },
    { time: "16:00", visitors: 380, pageViews: 950 },
    { time: "20:00", visitors: 320, pageViews: 780 },
  ]

  const topPerformingItems = [
    { name: "Luxury Sedan", category: "Cars", views: 1250, inquiries: 45, revenue: 85000 },
    { name: "Modern Villa", category: "Houses", views: 980, inquiries: 32, revenue: 120000 },
    { name: "Industrial Plot", category: "Lands", views: 750, inquiries: 28, revenue: 65000 },
    { name: "Excavator Pro", category: "Machines", views: 650, inquiries: 22, revenue: 45000 },
  ]

  const getCurrentData = () => {
    switch (selectedCategory) {
      case "cars":
        return cars
      case "houses":
        return houses
      case "lands":
        return lands
      case "machines":
        return machines
      default:
        return cars
    }
  }

  const handleView = (item: any) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setUploadedImages(item.images || [])
    setIsDialogOpen(true)
  }

  const handleDelete = (item: any) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log(`Deleting item with id: ${deletingItem.id}`)
    setDataVersion((prev) => prev + 1)
    setIsDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  const handleSave = () => {
    const itemWithImages = { ...editingItem, images: uploadedImages }
    console.log("Saving item:", itemWithImages)
    setIsDialogOpen(false)
    setEditingItem(null)
    setUploadedImages([])
    setDataVersion((prev) => prev + 1)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImages((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsDealDetailOpen(true)
  }

  const handleAcceptDeal = (dealId: string) => {
    updateDealStatus(dealId, "accepted")
  }

  const handleRejectDeal = (dealId: string) => {
    if (confirm("Are you sure you want to reject this deal?")) {
      updateDealStatus(dealId, "rejected")
    }
  }

  const handleCompleteDeal = (dealId: string) => {
    updateDealStatus(dealId, "completed")
  }

  const handleIncompleteDeal = (dealId: string) => {
    if (confirm("Mark this deal as incomplete? This indicates the deal did not go through.")) {
      updateDealStatus(dealId, "incomplete")
    }
  }

  const getStatusIcon = (status: Deal["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "incomplete":
        return <AlertCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Deal["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "incomplete":
        return "bg-red-100 text-red-800 border-red-200"
      case "rejected":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getItemIcon = (itemType: Deal["itemType"]) => {
    switch (itemType) {
      case "car":
        return <Car className="w-5 h-5" />
      case "house":
        return <Home className="w-5 h-5" />
      case "land":
        return <MapPin className="w-5 h-5" />
      case "machine":
        return <Wrench className="w-5 h-5" />
      default:
        return <Car className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-brand">Admin Insights</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Your business at a glance - data-driven decisions made simple
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              {pendingDeals > 0 && (
                <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-lg px-3 sm:px-4 py-2 animate-pulse">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  <span className="text-xs sm:text-sm font-medium text-amber-800">
                    {pendingDeals} new deal{pendingDeals > 1 ? "s" : ""} pending
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-l-4 border-l-brand-blue hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                    {totalListings}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Listings</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="text-xs font-medium">+12% from last month</span>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-brand-purple hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                    {activeUsers}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Active Users</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="text-xs font-medium">+8% from last month</span>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-purple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-brand-orange hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-brand-orange transition-colors">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Revenue</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="text-xs font-medium">+15% from last month</span>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {pendingDeals}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Pending Deals</div>
                  <div className="flex items-center mt-2 text-amber-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="text-xs font-medium">Requires attention</span>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6 sm:mb-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              <TabsList className="grid grid-cols-5 w-full min-w-max sm:min-w-0">
                <TabsTrigger
                  value="overview"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Overview</span>
                  <span className="sm:hidden">Over</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger
                  value="listings"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Listings</span>
                  <span className="sm:hidden">List</span>
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Users</span>
                  <span className="sm:hidden">User</span>
                </TabsTrigger>
                <TabsTrigger
                  value="deals"
                  className="relative flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Deals</span>
                  <span className="sm:hidden">Deal</span>
                  {pendingDeals > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white border-0">
                      {pendingDeals}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <PieChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-blue" />
                    Listings Distribution
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      cars: { label: "Cars", color: "var(--color-cars-primary)" },
                      houses: { label: "Houses", color: "var(--color-houses-primary)" },
                      lands: { label: "Lands", color: "var(--color-lands-primary)" },
                      machines: { label: "Machines", color: "var(--color-machines-primary)" },
                    }}
                    className="h-[200px] sm:h-[250px] md:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          dataKey="value"
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-purple" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {performanceData.map((metric, index) => (
                      <div key={index} className="text-center">
                        <ChartContainer
                          config={{
                            value: { label: metric.name, color: metric.color },
                          }}
                          className="h-[80px] sm:h-[100px] md:h-[120px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[metric]}>
                              <RadialBar dataKey="value" cornerRadius={10} fill={metric.color} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-2">
                          <div className="text-xl sm:text-2xl font-bold" style={{ color: metric.color }}>
                            {metric.value}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">{metric.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-orange" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Latest platform updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { type: "user", message: "New user registration", time: "2 hours ago", color: "bg-blue-500" },
                      { type: "listing", message: "Car listing approved", time: "4 hours ago", color: "bg-green-500" },
                      {
                        type: "deal",
                        message: "Deal completed successfully",
                        time: "6 hours ago",
                        color: "bg-purple-500",
                      },
                      {
                        type: "system",
                        message: "System maintenance completed",
                        time: "8 hours ago",
                        color: "bg-orange-500",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${activity.color}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
                    Top Performing Items
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Most viewed and inquired items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {topPerformingItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-xs sm:text-sm truncate">{item.name}</span>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-4 mt-1 text-xs text-gray-600">
                            <span>{item.views} views</span>
                            <span>{item.inquiries} inquiries</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-semibold text-brand-blue text-xs sm:text-sm">
                            ${item.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-blue" />
                    Revenue Trends
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Monthly revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: { label: "Revenue", color: "var(--color-brand-blue)" },
                    }}
                    className="h-[200px] sm:h-[250px] md:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-brand-blue)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-brand-blue)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-brand-blue)"
                          strokeWidth={3}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-purple" />
                    User Growth
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Monthly active users</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      users: { label: "Users", color: "var(--color-brand-purple)" },
                    }}
                    className="h-[200px] sm:h-[250px] md:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="users" fill="var(--color-brand-purple)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-orange" />
                    Daily Traffic
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Visitors and page views throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      visitors: { label: "Visitors", color: "var(--color-brand-orange)" },
                      pageViews: { label: "Page Views", color: "var(--color-brand-blue)" },
                    }}
                    className="h-[200px] sm:h-[250px] md:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="visitors" stroke="var(--color-brand-orange)" strokeWidth={3} />
                        <Line type="monotone" dataKey="pageViews" stroke="var(--color-brand-blue)" strokeWidth={3} />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                    Deal Completion Rate
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Monthly deal success metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      deals: { label: "Completed Deals", color: "#10b981" },
                    }}
                    className="h-[200px] sm:h-[250px] md:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="deals" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ... existing code for other tabs ... */}
          <TabsContent value="listings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 sm:pb-4">
                <CardTitle className="text-sm sm:text-base">Manage Listings</CardTitle>
                <div className="flex items-stretch justify-start flex-wrap gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32 sm:w-40 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cars">Cars</SelectItem>
                      <SelectItem value="houses">Houses</SelectItem>
                      <SelectItem value="lands">Lands</SelectItem>
                      <SelectItem value="machines">Machines</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-brand-blue hover:bg-brand-blue/90 text-xs sm:text-sm">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    {/* Made dialog responsive */}
                    <DialogContent className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                      <DialogHeader>
                        <DialogTitle className="text-sm sm:text-base">
                          {editingItem ? "Edit" : "Add New"} {selectedCategory.slice(0, -1)}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium">Title</label>
                              <Input
                                value={editingItem?.title || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium">Price</label>
                              <Input
                                type="number"
                                value={editingItem?.price || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium">Location</label>
                              <Input
                                value={editingItem?.location || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium">Listing Type</label>
                              <Select
                                value={editingItem?.listingType || "sale"}
                                onValueChange={(value) => setEditingItem({ ...editingItem, listingType: value })}
                              >
                                <SelectTrigger className="text-xs sm:text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sale">For Sale</SelectItem>
                                  <SelectItem value="rent">For Rent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Description</label>
                            <Textarea
                              value={editingItem?.description || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                              rows={4}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Images</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-5 md:p-6 text-center hover:border-gray-400 transition-colors">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload" className="cursor-pointer">
                                <div className="space-y-2">
                                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400 mx-auto" />
                                  <div className="text-xs sm:text-sm text-gray-600">
                                    <span className="font-medium text-brand-blue hover:text-brand-blue/80">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </div>
                                  <div className="text-xxs sm:text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</div>
                                </div>
                              </label>
                            </div>
                          </div>

                          {uploadedImages.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium">
                                Uploaded Images ({uploadedImages.length})
                              </label>
                              <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-40 sm:max-h-52 md:max-h-64 overflow-y-auto">
                                {uploadedImages.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                                      <img
                                        src={image || "/placeholder.svg"}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="absolute top-1 right-1 h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                      >
                                        <X className="w-2 h-2 sm:w-3 sm:h-3" />
                                      </Button>
                                    </div>
                                    {index === 0 && (
                                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                                        <Badge className="text-xxs sm:text-xs bg-brand-blue text-white">Main</Badge>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {uploadedImages.length === 0 && (
                                <div className="text-center py-4 sm:py-6 text-gray-500">
                                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-300" />
                                  <p className="text-xs sm:text-sm">No images uploaded yet</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
                        <Button
                          variant="outline"
                          className="text-xs sm:text-sm bg-transparent"
                          onClick={() => {
                            setIsDialogOpen(false)
                            setUploadedImages([])
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="bg-brand-blue hover:bg-brand-blue/90 text-xs sm:text-sm"
                        >
                          Save
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Title</TableHead>
                      <TableHead className="text-xs sm:text-sm">Price</TableHead>
                      <TableHead className="text-xs sm:text-sm">Location</TableHead>
                      <TableHead className="text-xs sm:text-sm">Type</TableHead>
                      <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCurrentData()
                      .slice(0, 10)
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{item.title}</TableCell>
                          <TableCell className="text-xs sm:text-sm">${item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{item.location}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <Badge variant={item.listingType === "sale" ? "default" : "secondary"}>
                              {item.listingType === "sale" ? "For Sale" : "For Rent"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs sm:text-sm bg-transparent"
                                onClick={() => handleView(item)}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs sm:text-sm bg-transparent"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs sm:text-sm bg-transparent"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-purple" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Email</TableHead>
                      <TableHead className="text-xs sm:text-sm">Role</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs sm:text-sm">John Doe</TableCell>
                      <TableCell className="text-xs sm:text-sm">john@example.com</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Badge>User</Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Badge variant="secondary">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs sm:text-sm bg-transparent">
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs sm:text-sm bg-transparent">
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 sm:pb-4">
                <CardTitle className="flex items-center justify-between w-full text-sm sm:text-base">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-orange" />
                    Deal Management
                  </div>
                  {pendingDeals > 0 && <Badge className="bg-yellow-100 text-yellow-800">{pendingDeals} Pending</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 sm:space-y-4">
                  {deals.length > 0 ? (
                    deals.map((deal) => (
                      <Card key={deal.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">{getItemIcon(deal.itemType)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-xs sm:text-sm truncate">{deal.item.title}</p>
                                  <Badge className={`${getStatusColor(deal.status)} flex items-center space-x-1`}>
                                    {getStatusIcon(deal.status)}
                                    <span className="capitalize text-xxs sm:text-xs">{deal.status}</span>
                                  </Badge>
                                </div>
                                <p className="text-xxs sm:text-xs text-gray-600">by {deal.userName}</p>
                                <p className="text-xxs text-gray-500">
                                  {new Date(deal.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-xs sm:text-sm">${deal.originalPrice.toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs sm:text-sm bg-transparent"
                                onClick={() => handleViewDeal(deal)}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              {deal.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent text-xs sm:text-sm"
                                    onClick={() => handleAcceptDeal(deal.id)}
                                  >
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent text-xs sm:text-sm"
                                    onClick={() => handleRejectDeal(deal.id)}
                                  >
                                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                </>
                              )}
                              {deal.status === "accepted" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent text-xs sm:text-sm"
                                    onClick={() => handleCompleteDeal(deal.id)}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent text-xs sm:text-sm"
                                    onClick={() => handleIncompleteDeal(deal.id)}
                                  >
                                    Incomplete
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm">No deals to manage</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ... existing code for dialogs ... */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            {viewingItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-sm sm:text-base">
                    <span>{viewingItem.title}</span>
                    <Badge variant={viewingItem.listingType === "sale" ? "default" : "secondary"}>
                      {viewingItem.listingType === "sale" ? "For Sale" : "For Rent"}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={viewingItem.images[0] || "/placeholder.svg"}
                        alt={viewingItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {viewingItem.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {viewingItem.images.slice(1, 4).map((image: string, index: number) => (
                          <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${viewingItem.title} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="text-xl font-bold text-brand-blue">${viewingItem.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{viewingItem.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={viewingItem.status === "available" ? "default" : "secondary"}>
                          {viewingItem.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">
                          {viewingItem.rating}/5 ({viewingItem.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Description</h4>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{viewingItem.description}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Seller Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Seller:</span>
                          <span className="font-medium">{viewingItem.sellerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{viewingItem.sellerContact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm bg-transparent"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleEdit(viewingItem)
                    }}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-xs sm:text-sm"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Edit Item
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-md mx-4">
            {deletingItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-red-600 text-sm sm:text-base">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Delete Item</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-600 text-sm">
                    Are you sure you want to delete <strong>"{deletingItem.title}"</strong>? This action cannot be
                    undone.
                  </p>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      <span className="text-xs sm:text-sm text-red-800 font-medium">Warning</span>
                    </div>
                    <p className="text-xxs sm:text-xs text-red-700 mt-1">
                      This will permanently remove the item from all listings and cannot be recovered.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm bg-transparent"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Delete Item
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDealDetailOpen} onOpenChange={setIsDealDetailOpen}>
          <DialogContent className="max-w-md md:max-w-3xl lg:max-w-5xl max-h-[90vh] overflow-y-auto mx-4">
            {selectedDeal && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between text-sm sm:text-base">
                    <div className="flex items-center space-x-2">
                      {getItemIcon(selectedDeal.itemType)}
                      <span>{selectedDeal.item.title}</span>
                    </div>
                    <Badge className={`${getStatusColor(selectedDeal.status)} flex items-center space-x-1`}>
                      {getStatusIcon(selectedDeal.status)}
                      <span className="capitalize">{selectedDeal.status}</span>
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold">Item Details</h3>

                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={selectedDeal.item.images[0] || "/placeholder.svg"}
                        alt={selectedDeal.item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold">${selectedDeal.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="truncate ml-2">{selectedDeal.item.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="capitalize">{selectedDeal.itemType}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">Description</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{selectedDeal.item.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">User Message</h4>
                      <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedDeal.message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold">Customer Information</h3>

                    <Card>
                      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div className="text-center">
                          <h4 className="font-semibold text-sm sm:text-base">{selectedDeal.userName}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Customer</p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue" />
                            <div>
                              <p className="font-medium text-xs sm:text-sm">Email</p>
                              <a
                                href={`mailto:${selectedDeal.userEmail}`}
                                className="text-brand-blue hover:underline text-xs sm:text-sm"
                              >
                                {selectedDeal.userEmail}
                              </a>
                            </div>
                          </div>

                          {selectedDeal.userPhone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                              <div>
                                <p className="font-medium text-xs sm:text-sm">Phone</p>
                                <a
                                  href={`tel:${selectedDeal.userPhone}`}
                                  className="text-emerald-600 hover:underline text-xs sm:text-sm"
                                >
                                  {selectedDeal.userPhone}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="text-base sm:text-lg font-semibold">Seller Information</h3>

                    <Card>
                      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div className="text-center">
                          <h4 className="font-semibold text-sm sm:text-base">{selectedDeal.item.sellerName}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">Item Owner</p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-purple" />
                            <div>
                              <p className="font-medium text-xs sm:text-sm">Email</p>
                              <a
                                href={`mailto:${selectedDeal.item.sellerEmail}`}
                                className="text-brand-purple hover:underline text-xs sm:text-sm"
                              >
                                {selectedDeal.item.sellerEmail}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                            <div>
                              <p className="font-medium text-xs sm:text-sm">Phone</p>
                              <a
                                href={`tel:${selectedDeal.item.sellerPhone}`}
                                className="text-brand-orange hover:underline text-xs sm:text-sm"
                              >
                                {selectedDeal.item.sellerPhone}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">ID</span>
                            </div>
                            <div>
                              <p className="font-medium text-xs sm:text-sm">Seller ID</p>
                              <span className="text-xs sm:text-sm text-gray-600">{selectedDeal.item.sellerId}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <h5 className="font-medium text-xs sm:text-sm">Deal Timeline</h5>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <p>Created: {new Date(selectedDeal.createdAt).toLocaleString()}</p>
                        <p>Last Updated: {new Date(selectedDeal.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedDeal.status === "pending" && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={() => {
                              handleAcceptDeal(selectedDeal.id)
                              setIsDealDetailOpen(false)
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Accept Deal
                          </Button>
                          <Button
                            onClick={() => {
                              handleRejectDeal(selectedDeal.id)
                              setIsDealDetailOpen(false)
                            }}
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                          >
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Reject Deal
                          </Button>
                        </div>
                      )}

                      {selectedDeal.status === "accepted" && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={() => {
                              handleCompleteDeal(selectedDeal.id)
                              setIsDealDetailOpen(false)
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Mark Complete
                          </Button>
                          <Button
                            onClick={() => {
                              handleIncompleteDeal(selectedDeal.id)
                              setIsDealDetailOpen(false)
                            }}
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                          >
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Mark Incomplete
                          </Button>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline" className="w-full bg-transparent text-xs sm:text-sm">
                          <a href={`mailto:${selectedDeal.userEmail}`}>
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Email Customer
                          </a>
                        </Button>
                        {selectedDeal.userPhone && (
                          <Button asChild variant="outline" className="w-full bg-transparent text-xs sm:text-sm">
                            <a href={`tel:${selectedDeal.userPhone}`}>
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Call Customer
                            </a>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline" className="w-full bg-transparent text-xs sm:text-sm">
                          <a href={`mailto:${selectedDeal.item.sellerEmail}`}>
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Email Seller
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full bg-transparent text-xs sm:text-sm">
                          <a href={`tel:${selectedDeal.item.sellerPhone}`}>
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Call Seller
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
