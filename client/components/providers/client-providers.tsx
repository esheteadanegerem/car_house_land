"use client"

import type React from "react"

import { Suspense } from "react"
import { AppProvider } from "@/context/app-context"

function AppProviderWithSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppProvider>{children}</AppProvider>
    </Suspense>
  )
}

export { AppProviderWithSuspense as AppProvider }
