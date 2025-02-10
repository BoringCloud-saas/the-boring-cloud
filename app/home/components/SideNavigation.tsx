import { useState } from "react"

export default function SideNavigation({ activeTab, setActiveTab }: { activeTab: "Editor" | "Logs"; setActiveTab: (tab: "Editor" | "Logs") => void }) {
  return (
    <div className="flex flex-col justify-center items-center p-4 w-3/6 h-3/6 bg-[#f86c71] rounded-2xl">
      {/* Editor Tab */}
      <div
        onClick={() => setActiveTab("Editor")}
        className={`cursor-pointer flex justify-center items-center font-semibold p-4 py-8 w-5/6 mb-4 ${
          activeTab === "Editor" ? "bg-[#fecbca] font-semibold rounded-t-2xl" : "bg-transparent"
        }`}
      >
        <span>Editor</span>
      </div>

      {/* Logs Tab */}
      <div
        onClick={() => setActiveTab("Logs")}
        className={`cursor-pointer flex justify-center items-center p-4 py-8 w-5/6 ${
          activeTab === "Logs" ? "bg-[#fecbca] font-semibold rounded-b-2xl" : "bg-transparent rounded-b-2xl"
        }`}
      >
        <span>Logs</span>
      </div>
    </div>
  )
}
