"use client"

import Navigation from "./components/Navigation"

export default function Home() {
  return (
      <div className="flex flex-col h-screen w-full p-4">
          <Navigation />
          <h1>The Boring Cloud Landing Page</h1>
      </div>
  );
}
