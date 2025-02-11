"use client"

import { useState, useEffect } from "react"
import useAuth from "../hooks/proveAuth"
import Navigation from "./components/Navigation"

export default function Page() {
  const [username, setUsername] = useState("")
  
  const { proveAuth } = useAuth()

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await proveAuth()
      setUsername(response)
    }
    fetchAuth()
  }, [])

  return (
    <div className="flex flex-col h-screen w-full p-4">
      <Navigation username={username} />
    </div>
  )
}
