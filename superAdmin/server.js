const express = require('express');
const mqtt = require('mqtt');
const path = require('path');
const router = require('./routes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Updated MQTT connection options to match WebOS device
const mqttOptions = {
  clientId: 'admin_client_' + Math.random().toString(16).slice(2, 8),
  keepalive: 60,
  clean: true,
  reconnectPeriod: 1000, // Match WebOS device reconnection time
  connectTimeout: 30 * 1000, // 30 seconds timeout
  will: {
    topic: 'tv/001/status',
    payload: 'Admin Offline',
    qos: 0,
    retain: false
  }
};

// Connect to the same broker as the WebOS device
const mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt', mqttOptions);

// Handle MQTT connection events
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker successfully');
  
  // Subscribe to status updates from the TV
  mqttClient.subscribe('tv/001/status', (err) => {
    if (!err) {
      console.log('Subscribed to TV status updates');
    }
  });
});

// Keep existing MQTT event handlers
mqttClient.on('error', (err) => {
  console.error('MQTT connection error:', err.message);
  // Don't crash the server on MQTT errors
});

mqttClient.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT broker...');
});

mqttClient.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Listen for status messages from the TV
mqttClient.on('message', (topic, message) => {
  if (topic === 'tv/001/status') {
    console.log('TV Status Update:', message.toString());
  }
});

// Root route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route to publish roll number to MQTT broker
app.post('/publish', (req, res) => {
  const rollNumber = req.body.rollNumber;
  
  // Basic validation
  if (!rollNumber || rollNumber.trim() === '') {
    return res.status(400).send('Roll number is required');
  }

  // Define topic and publish message
  const topic = 'tv/001/rollUpdates';
  
  mqttClient.publish(topic, rollNumber, { qos: 1 }, (err) => {
    if (err) {
      console.error('Failed to publish message:', err);
      return res.status(500).send('Failed to publish roll number');
    }
    
    console.log(`Published roll number ${rollNumber} to topic: ${topic}`);
    res.send(`Successfully published roll number ${rollNumber} to topic: ${topic}`);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle process termination to close MQTT connection properly
process.on('SIGINT', () => {
  mqttClient.end();
  process.exit();
});
