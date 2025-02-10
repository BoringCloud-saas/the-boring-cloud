"use client"

import { useEffect } from "react"

interface NavigationProps {
  username: string
}

export default function Navigation({ username }: NavigationProps) {
  return (
      <div className="flex justify-between items-center p-2 bg-[#f86c71] rounded-md">
          <div className="flex items-center ml-[10%]">
              <h1 className="text-2xl font-semibold text-[#ffffff] mr-1">Boring</h1>
              <h1 className="text-2xl font-semibold">Cloud</h1>
          </div>

          <div className="flex p-2 items-center mr-[10%]">
                <button
                    className="font-semibold
                bg-[#fecbca] p-2 px-4 rounded-md"
                >{username}</button>
          </div>
      </div>
  )
}
