"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Car,
  Home,
  MapPin,
  Wrench,
} from "lucide-react"
import { useApp } from "@/context/app-context"
import type { Deal } from "@/types"

export function UserDeals() {
  const { user, getUserDeals } = useApp()
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const userDeals = getUserDeals()

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

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsDetailModalOpen(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-responsive-2xl font-bold text-gray-900">Please Sign In</h1>
          <p className="text-responsive-base text-gray-600 mt-2">You need to be signed in to view your deals</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-responsive-3xl font-bold gradient-text-brand">My Deals</h1>
          <p className="text-responsive-base text-gray-600 mt-2">
            Track your inquiries and deal progress with our team
          </p>
        </div>

        {userDeals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-responsive-lg font-semibold text-gray-900">No Deals Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You haven't made any inquiries yet. Browse our listings and contact us about items you're interested
                  in.
                </p>
                <Button asChild className="mt-4">
                  <a href="/">Browse Listings</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userDeals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getItemIcon(deal.itemType)}
                      <CardTitle className="text-responsive-base truncate">{deal.item.title}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(deal.status)} flex items-center space-x-1`}>
                      {getStatusIcon(deal.status)}
                      <span className="capitalize text-xs">{deal.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img
                      src={deal.item.images[0] || "/placeholder.svg"}
                      alt={deal.item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-responsive-sm text-gray-600">Price:</span>
                      <span className="font-semibold text-responsive-sm">${deal.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-responsive-sm text-gray-600">Inquiry Date:</span>
                      <span className="text-responsive-sm">{new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-responsive-sm text-gray-600 line-clamp-2">{deal.message}</p>
                  </div>

                  <Button onClick={() => handleViewDeal(deal)} className="w-full mt-4" variant="outline">
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Deal Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedDeal && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    {getItemIcon(selectedDeal.itemType)}
                    <span>{selectedDeal.item.title}</span>
                    <Badge className={`${getStatusColor(selectedDeal.status)} flex items-center space-x-1 ml-auto`}>
                      {getStatusIcon(selectedDeal.status)}
                      <span className="capitalize">{selectedDeal.status}</span>
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Item Details */}
                  <div className="space-y-4">
                    <h3 className="text-responsive-lg font-semibold">Item Details</h3>

                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={selectedDeal.item.images[0] || "/placeholder.svg"}
                        alt={selectedDeal.item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold">${selectedDeal.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span>{selectedDeal.item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="capitalize">{selectedDeal.itemType}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-responsive-sm text-gray-600">{selectedDeal.item.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Your Message</h4>
                      <p className="text-responsive-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedDeal.message}
                      </p>
                    </div>
                  </div>

                  {/* Admin Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-responsive-lg font-semibold">Contact Information</h3>

                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="text-center">
                          <h4 className="font-semibold text-responsive-base">{selectedDeal.adminInfo.name}</h4>
                          <p className="text-responsive-sm text-gray-600">Your dedicated support agent</p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-brand-blue" />
                            <div>
                              <p className="font-medium text-responsive-sm">Email</p>
                              <a
                                href={`mailto:${selectedDeal.adminInfo.email}`}
                                className="text-brand-blue hover:underline text-responsive-sm"
                              >
                                {selectedDeal.adminInfo.email}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-brand-green" />
                            <div>
                              <p className="font-medium text-responsive-sm">Phone</p>
                              <a
                                href={`tel:${selectedDeal.adminInfo.phone}`}
                                className="text-brand-green hover:underline text-responsive-sm"
                              >
                                {selectedDeal.adminInfo.phone}
                              </a>
                            </div>
                          </div>

                          {selectedDeal.adminInfo.telegram && (
                            <div className="flex items-center space-x-3">
                              <MessageCircle className="w-5 h-5 text-brand-blue" />
                              <div>
                                <p className="font-medium text-responsive-sm">Telegram</p>
                                <a
                                  href={`https://t.me/${selectedDeal.adminInfo.telegram.replace("@", "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-blue hover:underline text-responsive-sm"
                                >
                                  {selectedDeal.adminInfo.telegram}
                                </a>
                              </div>
                            </div>
                          )}

                          {selectedDeal.adminInfo.whatsapp && (
                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-brand-green" />
                              <div>
                                <p className="font-medium text-responsive-sm">WhatsApp</p>
                                <a
                                  href={`https://wa.me/${selectedDeal.adminInfo.whatsapp.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-green hover:underline text-responsive-sm"
                                >
                                  {selectedDeal.adminInfo.whatsapp}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h5 className="font-medium text-responsive-sm">Deal Timeline</h5>
                          <div className="text-responsive-sm text-gray-600 space-y-1">
                            <p>Created: {new Date(selectedDeal.createdAt).toLocaleString()}</p>
                            <p>Last Updated: {new Date(selectedDeal.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <a href={`mailto:${selectedDeal.adminInfo.email}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <a href={`tel:${selectedDeal.adminInfo.phone}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </a>
                      </Button>
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
