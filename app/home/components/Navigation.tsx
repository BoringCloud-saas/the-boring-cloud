"use client"

interface NavigationProps {
  username: string
}

export default function Navigation({ username }: NavigationProps) {
  return (
      <div className="flex justify-between items-center p-2 rounded-md bg-[#fafafa]">
          <div className="flex items-center ml-[10%]">
              <h1 className="text-2xl font-semibold text-[#000000] mr-1">Logic Mail</h1>
          </div>

          <div className="flex p-2 items-center mr-[10%]">
                <button
                    className="font-semibold
                  bg-[#ffffff] p-2 px-4 rounded-md shadow-xl border-2 border-[#e6e6e6]"
                >{username}</button>
          </div>
      </div>
  )
}
