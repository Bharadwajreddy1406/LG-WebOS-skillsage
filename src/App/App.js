import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import WelcomePanel from '../views/WelcomePanel';
import ProjectsPanel from '../views/ProjectsPanel';
import SkillsPanel from '../views/SkillsPanel';
import css from './App.module.less';
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

// Create a React functional component to use hooks
const App = (props) => {
  const [connected, setConnected] = useState(false);
  const [rollNum, setRollNum] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentPanel, setCurrentPanel] = useState('welcome');
  
  // Function to fetch student data
  const fetchStudentData = async (roll) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:4000/projects`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched student data:', data);
      setStudentData(data);
      setErrorMsg(null);
      
      // Once data is fetched, move to projects panel
      setCurrentPanel('projects');
    } catch (err) {
      console.error('Error fetching student data:', err);
      setErrorMsg('Failed to fetch student data');
      setStudentData(null);
    }
  };

  useEffect(() => {
    // MQTT client setup with more reliable broker and options
    const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
    const options = {
      clientId: 'webos_client_' + Math.random().toString(16).substring(2, 8),
      keepalive: 120,
      clean: true,
      reconnectPeriod: 1000, // Auto reconnect every 1 second
      connectTimeout: 30 * 1000, // 30 seconds
      will: {
        topic: 'tv/001/status',
        payload: 'Offline',
        qos: 0,
        retain: false
      }
    };
    
    console.log('Connecting to MQTT broker...');
    const client = mqtt.connect(brokerUrl, options);
    
    // MQTT connection event handlers
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      setConnected(true);
      setErrorMsg(null);
      
      // Subscribe to the topic
      client.subscribe('tv/001/rollUpdates', { qos: 1 }, (err) => {
        if (!err) {
          console.log('Successfully subscribed to tv/001/rollUpdates');
          // Send a test message to confirm working connection
          client.publish('tv/001/status', 'Online', { qos: 0, retain: false });
        } else {
          console.error('Subscription error:', err);
          setErrorMsg('Failed to subscribe to MQTT topic');
        }
      });
    });
    
    // MQTT message handler
    client.on('message', (topic, message) => {
      if (topic === 'tv/001/rollUpdates') {
        try {
          const roll = message.toString();
          console.log('Received roll number:', roll);
          setRollNum(roll);
          
          // Fetch student data based on roll number
          fetchStudentData(roll);
        } catch (err) {
          console.error('Error processing message:', err);
          setErrorMsg('Failed to process MQTT message');
        }
      }
    });
    
    // MQTT reconnect handler
    client.on('reconnect', () => {
      console.log('Attempting to reconnect to MQTT broker...');
      setErrorMsg('Reconnecting to MQTT broker...');
    });
    
    // MQTT error handler
    client.on('error', (err) => {
      console.error('MQTT connection error:', err);
      setErrorMsg(`MQTT connection error: ${err.message}`);
    });
    
    // MQTT disconnection handler
    client.on('close', () => {
      console.log('Disconnected from MQTT broker');
      setConnected(false);
    });
    
    // Cleanup on component unmount
    return () => {
      if (client) {
        console.log('Cleaning up MQTT connection');
        client.end();
      }
    };
  }, []);

  // Panel navigation handlers
  const showSkillsPanel = () => {
    setCurrentPanel('skills');
  };

  const showProjectsPanel = () => {
    setCurrentPanel('projects');
  };
  
  // Skills data 
  const skillsData = {
    evaluationMetrics: [
      {
        skills: [
          { skill: "JavaScript", value: "85" },
          { skill: "React", value: "78" },
          { skill: "TypeScript", value: "65" },
          { skill: "HTML/CSS", value: "92" },
          { skill: "API Design", value: "70" },
          { skill: "State Management", value: "75" },
          { skill: "Testing", value: "60" }
        ]
      }
    ]
  };
  
  return (
    <div {...props}>
      <Panels noCloseButton index={
        currentPanel === 'welcome' ? 0 : 
        currentPanel === 'projects' ? 1 : 2
      }>
        <WelcomePanel 
          connected={connected}
          rollNumber={rollNum}
          error={errorMsg}
        />
        <ProjectsPanel 
          rollNumber={rollNum}
          studentData={studentData}
          onShowSkills={showSkillsPanel}
        />
        <SkillsPanel 
          skillsData={skillsData}
          rollNumber={rollNum}
          onBack={showProjectsPanel}
        />
      </Panels>
    </div>
  );
};

// Use kind to create the Enact component
const AppBase = kind({
  name: 'App',
  
  styles: {
    css,
    className: 'app'
  },
  
  render: (props) => <App {...props} />
});

export default ThemeDecorator(AppBase);
