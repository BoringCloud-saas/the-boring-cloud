"use client"

import { useState, useEffect } from "react"

import useAuth from "../hooks/proveAuth"
import useEmail from "../hooks/proveEmail"

import useGmail from "../hooks/watchRequest"

import Navigation from "./components/Navigation"

import { GrDeploy } from "react-icons/gr";
import { MdOutlineOpenInFull } from "react-icons/md";
import { BiSolidSquareRounded } from "react-icons/bi";

export default function Page() {
  // UI Code
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false)

  // Logik code

  const [username, setUsername] = useState("")

  const { proveAuth } = useAuth()
  const { proveEmail } = useEmail()
  const { watchRequest } = useGmail()

  const [connectionStatus, setConnectionStatus] = useState<string>("Warte auf Verbindung...");

  useEffect(() => {
    const createEventSource = () => {
      const eventSource = new EventSource("/api");

      eventSource.onopen = () => {
        console.log("Verbindung geöffnet");
        setConnectionStatus("200 OK");
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);  // Parsen der JSON-Daten
        console.log(data.historyID);
        let ID: string | null = null;  // Deklariere ID außerhalb des Blocks

        if (data && data.historyID) {
          ID = String(data.historyID);
        }

        if (ID !== null) {
          // send ID to custom hook
          const fetch = async () => {
            const response = await proveEmail(ID);
            if (response?.data.status == 200) {
              if (response.data.message === "initialization") {
                
                console.log("Hello World SaaS is initialization phase !")
              }
              if (response?.data.message === "SaaS fully ready") {
                
              }
            } else {

            }
          };
          fetch();
        }
      };

      eventSource.onerror = () => {
        console.error("Verbindung fehlgeschlagen");
        setConnectionStatus("400 Verbindung fehlgeschlagen");
        setIsConnected(false);
        eventSource.close();  // Schließe die Verbindung bei Fehler

        // Versuche, die Verbindung nach 5 Sekunden wieder aufzubauen
        setTimeout(createEventSource, 5000);  // Wiederverbindung nach 5 Sekunden
      };

      return eventSource;
    };

    const eventSource = createEventSource();

    return () => {
      eventSource.close();  // Schließe die Verbindung, wenn die Komponente unmountet
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

      <div className="flex flex-col items-center w-full mt-6">
        <div className="flex justify-between w-4/6 relative">
            <span className="text-3xl font-semibold">Email Analytics</span>
            <div className="relative">
              <button
                onMouseEnter={() => setIsHovered(true)} // Tooltip anzeigen
                onMouseLeave={() => setIsHovered(false)} // Tooltip ausblenden
                className="flex items-center font-semibold bg-[#ffffff] p-2 px-4 rounded-md shadow-xl border-2 border-[#e6e6e6]"
              >
                <GrDeploy className={`mr-4 ${isDeployed ? "text-[#6a09ed]" : "text-black"}`} />
                {isDeployed ? "System" : "System"}
              </button>

              {isHovered && (
                <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="absolute left-[-400px] w-96 top-1/2 -translate-y-1/2 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg flex items-center justify-center">
                  <div className="flex flex-col p-4 w-full">
                    <span>SaaS gets automatically deployed as soon as you receive a new Email</span>
                  </div>
                </div>
              )}
            </div>
        </div>

        <div className="flex items-center w-4/6 mt-4 bg-[#ffffff] rounded-xl p-10 border border-[#e6e6e6] h-16">
          <div className="flex items-center">
            <p>{connectionStatus}</p>
            <BiSolidSquareRounded className={`ml-2 ${isConnected ? "text-[#57e909]" : "text-red-500"}`} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full mt-2 h-3/6">
        <div className={`relative w-4/6 bg-[#ffffff] border border-[#e6e6e6] rounded-xl p-8 transition-all duration-300 ${isExpanded ? "h-full" : "h-12"}`}>
          <div className="absolute w-full p-2 top-2 left-8 flex items-center space-x-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center w-full mt-1.5">
              <MdOutlineOpenInFull className="text-xl" />
              <span className="font-semibold ml-2">Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
