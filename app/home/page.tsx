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
    <div className="flex flex-col h-screen w-full p-4 bg-[#fafafa]">
      <Navigation username={username} />
      <div className="flex flex-col items-center w-full h-2/6 mt-12">
          <div className="flex justify-between w-4/6">
              <span className="text-3xl font-semibold">Email Analytics</span>
          </div>
          <div className="flex w-4/6 mt-6 bg-[#ffffff] rounded-xl p-8 border border-[#e6e6e6]">
              asd
          </div>
      </div>
    </div>
  )
}
