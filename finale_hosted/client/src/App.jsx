import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State to track connection status
  const [isConnected, setIsConnected] = useState(false)
  // State to store received messages
  const [messages, setMessages] = useState([])
  // State to store client ID
  const [clientId, setClientId] = useState(null)
  // Reference to WebSocket instance
  const [socket, setSocket] = useState(null)

  // Connect to WebSocket server when component mounts
  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:4000')
    
    // Event handler for connection open
    ws.onopen = () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
    }
    
    // Event handler for receiving messages
    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        console.log('Message received:', parsedData)
        
        // Process message based on its type
        if (parsedData.type === 'connection') {
          // Store the client ID assigned by the server
          setClientId(parsedData.clientId)
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'system',
            content: `Connected with ID: ${parsedData.clientId}`,
            timestamp: new Date().toLocaleTimeString()
          }])
        } else if (parsedData.type === 'rollUpdate') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'rollUpdate',
            content: `Roll Number: ${parsedData.roll || 'N/A'}`,
            timestamp: new Date().toLocaleTimeString()
          }])
        } else if (parsedData.type === 'dataUpdate') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'dataUpdate',
            content: `Data: ${JSON.stringify(parsedData.data || {})}`,
            timestamp: new Date().toLocaleTimeString()
          }])
        } else if (parsedData.type === 'pong') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'system',
            content: 'Server pong received',
            timestamp: new Date().toLocaleTimeString()
          }])
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
    
    // Event handler for errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }
    
    // Event handler for connection close
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
      setClientId(null)
    }
    
    // Store WebSocket instance in state
    setSocket(ws)
    
    // Clean up function to close WebSocket when component unmounts
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, []) // Empty dependency array ensures this runs only on mount
  
  // Function to clear all messages
  const clearMessages = () => {
    setMessages([])
  }
  
  // Function to reconnect if connection is lost
  const reconnect = () => {
    if (socket) {
      socket.close()
    }
    const ws = new WebSocket('ws://localhost:4000')
    setSocket(ws)
    
    ws.onopen = () => {
      setIsConnected(true)
    }
    
    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        if (parsedData.type === 'connection') {
          setClientId(parsedData.clientId)
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'system',
            content: `Connected with ID: ${parsedData.clientId}`,
            timestamp: new Date().toLocaleTimeString()
          }])
        } else if (parsedData.type === 'rollUpdate') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'rollUpdate',
            content: `Roll Number: ${parsedData.roll || 'N/A'}`,
            timestamp: new Date().toLocaleTimeString()
          }])
        } else if (parsedData.type === 'dataUpdate') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'dataUpdate',
            content: `Data: ${JSON.stringify(parsedData.data || {})}`,
            timestamp: new Date().toLocaleTimeString()
          }])
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
    
    ws.onerror = () => setIsConnected(false)
    ws.onclose = () => {
      setIsConnected(false)
      setClientId(null)
    }
  }

  // Function to send a ping to the server
  const sendPing = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping', timestamp: new Date() }))
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: 'Ping sent to server',
        timestamp: new Date().toLocaleTimeString()
      }])
    }
  }

  return (
    <div className="app-container">
      <h1>LG TV WebSocket Client</h1>
      
      {/* Connection status indicator */}
      <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
        {clientId && <div className="client-id">Client ID: {clientId}</div>}
      </div>
      
      {/* Control buttons */}
      <div className="controls">
        <button onClick={reconnect} disabled={isConnected}>
          {isConnected ? 'Connected' : 'Reconnect'}
        </button>
        <button onClick={clearMessages}>Clear Messages</button>
        <button onClick={sendPing} disabled={!isConnected}>Ping Server</button>
      </div>
      
      {/* Messages display */}
      <div className="messages-container">
        <h2>Received Messages</h2>
        {messages.length === 0 ? (
          <p className="no-messages">No messages received yet</p>
        ) : (
          <ul className="message-list">
            {messages.map(message => (
              <li 
                key={message.id} 
                className={`message-item ${message.type}`}
              >
                <span className="message-time">[{message.timestamp}]</span>
                <span className="message-type">{message.type}:</span>
                <span className="message-content">{message.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
