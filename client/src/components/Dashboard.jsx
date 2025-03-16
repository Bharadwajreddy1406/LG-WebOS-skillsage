import { useState, useEffect } from "react"
import { X, Menu, User } from "lucide-react"
import logo from "../assets/-512x512.png"

function StudentDashboard({ rollNumber }) {
  console.log("🎓 Dashboard rendered with roll number:", rollNumber)
  
  const [isConnected, setIsConnected] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Sample student data
  const studentData = {
    name: "John Doe",
    rollNo: rollNumber, // Use the received roll number
    branch: "CSE (AIML)",
    cgpa: "9.14",
  }

  useEffect(() => {
    console.log("📊 Dashboard mounting with student data:", studentData)
    const ws = new WebSocket("ws://localhost:4000")

    ws.onopen = () => {
      console.log("✅ Dashboard WebSocket connected")
      setIsConnected(true)
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
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <header className="w-full bg-[#0c1929] text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="SkillSage Logo" className="w-16 h-16" />
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">SKILLSAGE</h1>
            <div className="w-48 h-0.5 bg-white my-1"></div>
            <p className="text-sm">In partnership with KMIT</p>
          </div>
        </div>

        {/* Connection status indicator */}
        {isConnected ? (
          <div className="bg-green-200 text-green-700 px-4 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            connected
          </div>
        ) : (
          <div className="bg-red-200 text-red-700 px-4 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            disconnected
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex flex-1 w-full bg-[#0c1929] p-4">
        {/* Sidebar */}
        <aside
          className={`bg-[#1e2a3a] rounded-lg transition-all duration-300 ease-in-out flex flex-col fixed lg:relative h-[calc(100vh-6rem)] ${
            isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-16 lg:translate-x-0"
          }`}
        >
          {/* Toggle button */}
          <button 
            onClick={toggleSidebar} 
            className="text-white absolute right-4 top-4 hover:bg-[#2a3a4a] p-1 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Profile section */}
          <div className="flex flex-col items-center mt-8 space-y-4">
            <div className="bg-white rounded-full p-1 w-16 h-16 flex items-center justify-center">
              <User className="text-gray-600" size={40} />
            </div>
            
            {/* Student info with fade animation */}
            <div className={`text-white space-y-3 w-full px-4 transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">Name</p>
                <p className="font-medium">{studentData.name}</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">Roll Number</p>
                <p className="font-medium">{studentData.rollNo}</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">Branch</p>
                <p className="font-medium">{studentData.branch}</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">CGPA</p>
                <p className="font-medium">{studentData.cgpa}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 bg-[#1e2a3a] rounded-lg ml-4 p-4">
          <h2 className="text-white text-xl font-bold underline mb-4">SKILLS OVERVIEW</h2>
          {/* Skills content would go here */}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard

