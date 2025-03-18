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
    <div style={{
      minHeight: "100vh", 
      width: "100%", 
      background: "linear-gradient(to bottom, #0c1929, #1e293b)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem"
    }}>
      <div style={{
        maxWidth: "28rem", 
        width: "100%", 
        background: "white", 
        borderRadius: "1rem", 
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* Logo container with improved animation */}
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            filter: "blur(24px)",
            opacity: "0.2"
          }}></div>
          <img 
            src={logo} 
            alt="Skill Sage Logo" 
            style={{
              position: "relative",
              width: "6rem",
              height: "6rem",
              margin: "0 auto",
              transition: "transform 0.3s",
              animation: "pulse 2s infinite",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>

        {/* Text content */}
        <div style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <h1 style={{
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
            fontWeight: "bold",
            color: "#111827",
            letterSpacing: "-0.025em",
            animation: "pulse 2s infinite"
          }}>
            SKILL SAGE
          </h1>
          
          <div style={{
            height: "0.125rem",
            width: "4rem",
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            margin: "0 auto"
          }}></div>
          
          <p style={{
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            fontWeight: "600",
            color: "#374151"
          }}>
            In partnership with KMIT
          </p>
        </div>

        {/* Connection status with enhanced styling */}
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          {isConnected ? (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              borderRadius: "9999px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0"
            }}>
              <div style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: "#22c55e",
                marginRight: "0.5rem",
                animation: "pulse 2s infinite"
              }}></div>
              <span style={{
                color: "#15803d",
                fontWeight: "500"
              }}>Connected</span>
            </div>
          ) : (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              borderRadius: "9999px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca"
            }}>
              <div style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: "#ef4444",
                marginRight: "0.5rem"
              }}></div>
              <span style={{
                color: "#b91c1c",
                fontWeight: "500"
              }}>Disconnected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

