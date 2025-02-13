"use client"

import { useState, useEffect } from "react"

import useAuth from "../hooks/proveAuth"
import useGmail from "../hooks/watchRequest"

import Navigation from "./components/Navigation"

export default function Page() {
  const [username, setUsername] = useState("")

  const { proveAuth } = useAuth()
  const { watchRequest } = useGmail()

  const [connectionStatus, setConnectionStatus] = useState<string>("Warte auf Verbindung...");

  useEffect(() => {
    const eventSource = new EventSource("/api");

    eventSource.onopen = () => {
      console.log("Verbindung geöffnet");
      setConnectionStatus("200 OK");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);  // Parsen der JSON-Daten
      console.log(data.historyID);          // Gibt nur den Wert von historyID aus
    };

    eventSource.onerror = () => {
      console.error("Verbindung fehlgeschlagen");
      setConnectionStatus("400 Fail: Verbindung fehlgeschlagen");
      eventSource.close(); // Schließe die Verbindung bei Fehler
    };

    return () => {
      eventSource.close(); // Schließe die Verbindung, wenn die Komponente unmountet
    };
  }, []);

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await proveAuth()
      setUsername(response)
    }
    fetchAuth()
  }, [])

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await watchRequest()
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
            <p>{connectionStatus}</p>
          </div>
      </div>
    </div>
  )
}
