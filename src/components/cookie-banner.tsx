"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-zinc-300 text-sm">
          We use cookies to improve your experience on our site. By using our site, you consent to our cookies.
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={acceptCookies} className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
            Decline
          </Button>
          <Button size="sm" onClick={acceptCookies} className="bg-gym-red hover:bg-red-700 text-white">
            Accept All
          </Button>
        </div>
      </div>
    </div>
  )
}
