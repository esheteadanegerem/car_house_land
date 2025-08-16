import type React from "react"
import type { Metadata } from "next"
import { GeistSans, GeistMono } from "geist/font"
import "./globals.css"
import { AppProvider } from "@/context/app-context"
import { LayoutContent } from "@/components/layout/layout-content"

export const metadata: Metadata = {
  title: "🚗 🏠 መስገበያ - የኢትዮጵያ መኪና እና ንብረት መድረክ | Ethiopian Cars & Properties Platform",
  description:
    "በሺዎች የሚቆጠሩ ጥራት ያላቸው ተሽከርካሪዎች፣ ፕሪሚየም ንብረቶች፣ ከባድ ማሽነሪዎች እና ዋና የመሬት እድሎችን ያግኙ። በቀጥታ ከአከፋፋዮች እና ወኪሎች ጋር ይገናኙ።",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="am" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body style={{ fontFamily: GeistSans.style.fontFamily }}>
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  )
}
