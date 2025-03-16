"use client"

import { useState, useEffect } from "react"
import "./App.css"
import logo from "./assets/-512x512.png"
import StudentDashboard from "./components/Dashboard"

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [rollNumber, setRollNumber] = useState(null)

  useEffect(() => {
    console.log("Attempting to connect to WebSocket server...")
    const ws = new WebSocket("ws://localhost:4000")

    ws.onopen = () => {
      console.log("✅ WebSocket connection established")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      console.log("📩 Received WebSocket message:", event.data)
      try {
        const data = JSON.parse(event.data)
        console.log("📋 Parsed message data:", data)
        
        // Check for rollUpdate message type
        if (data.type === "rollUpdate" && data.roll) {
          console.log("🎯 Roll number received:", data.roll)
          setRollNumber(data.roll)
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setIsConnected(false)
    }

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server")
      setIsConnected(false)
    }

    return () => {
      console.log("Cleaning up WebSocket connection...")
      if (ws) {
        ws.close()
      }
    }
  }, [])

  if (rollNumber) {
    return <StudentDashboard rollNumber={rollNumber} />
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0c1929] to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Logo container with improved animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full filter blur-xl opacity-20"></div>
          <img 
            src={logo} 
            alt="Skill Sage Logo" 
            className="relative w-24 h-24 mx-auto transform transition-transform hover:scale-105 animate-pulse"
          />
        </div>

        {/* Text content */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight animate-pulse">
            SKILL SAGE
          </h1>
          
          <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
          
          <p className="text-lg font-semibold text-gray-700">
            In partnership with KMIT
          </p>
        </div>

        {/* Connection status with enhanced styling */}
        <div className="flex justify-center">
          {isConnected ? (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-green-700 font-medium">Connected</span>
            </div>
          ) : (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 border border-red-200">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
              <span className="text-red-700 font-medium">Disconnected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

