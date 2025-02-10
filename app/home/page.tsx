"use client"

import { useState, useEffect, useRef } from "react"
import useAuth from "../hooks/proveAuth"
import Navigation from "./components/Navigation"
import SideNavigation from "./components/SideNavigation"

export default function Page() {
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState<"Editor" | "Logs">("Editor")
  const { proveAuth, status } = useAuth()
  
  // Mouse drag variables
  const dragRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [offsetX, setOffsetX] = useState<number | null>(null)
  const [offsetY, setOffsetY] = useState<number | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const response = await proveAuth()
      setUsername(response)
    }   
    fetch()
  }, [])
    
  useEffect(() => {
    // Beim Laden der Seite die gespeicherten Koordinaten abrufen
    const storedPosition = localStorage.getItem("dragPosition")
    if (storedPosition) {
      const { x, y } = JSON.parse(storedPosition)
      setOffsetX(x)
      setOffsetY(y)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (offsetX === null || offsetY === null) return // Verhindert das Draggen, bevor die Position geladen ist
    setIsDragging(true)
    setStartX(e.clientX - offsetX)
    setStartY(e.clientY - offsetY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const newOffsetX = e.clientX - startX
    const newOffsetY = e.clientY - startY

    // Begrenze das Div innerhalb des Containers
    const containerRect = containerRef.current.getBoundingClientRect()
    const maxX = containerRect.width - dragRef.current!.offsetWidth
    const maxY = containerRect.height - dragRef.current!.offsetHeight

    // Begrenze den Offset, sodass das Div innerhalb des Containers bleibt
    setOffsetX(Math.min(Math.max(newOffsetX, 0), maxX))
    setOffsetY(Math.min(Math.max(newOffsetY, 0), maxY))
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    // Beim Loslassen die aktuelle Position im LocalStorage speichern
    if (offsetX !== null && offsetY !== null) {
      localStorage.setItem("dragPosition", JSON.stringify({ x: offsetX, y: offsetY }))
    }
  }

  if (offsetX === null || offsetY === null) {
    // Verzögert das Rendern des Divs, bis die Position aus dem LocalStorage geladen ist
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen w-full p-4">
      <Navigation username={username} />

      <div className="flex w-full h-full mt-4">
        <div className="flex justify-center items-center w-1/6">
          <SideNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div
          ref={containerRef}
          className={`w-5/6 relative h-full ${activeTab === "Editor" ? "bg-[url('/path-to-grid-pattern.png')] bg-repeat" : ""}`}
          style={{
            background: activeTab === "Editor" ? "radial-gradient(circle, black 5%, transparent 6%)" : "",
            backgroundSize: activeTab === "Editor" ? "20px 20px" : "",
          }}
        >
          {activeTab === "Editor" && (
            <div
              ref={dragRef}
              className="absolute w-96 h-52 bg-[#F7F7F7] border-2 border-[#fecbca] rounded-xl"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                left: `${offsetX}px`,
                top: `${offsetY}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} // Um Drag zu stoppen, wenn die Maus den Bereich verlässt
            >
              {/* Weißes Div */}
            </div>
          )}

          {activeTab === "Logs" && (
            <div>
              <span>Logs</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
