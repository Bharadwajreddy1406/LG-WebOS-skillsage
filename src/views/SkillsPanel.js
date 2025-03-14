import React from 'react';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Heading from '@enact/sandstone/Heading';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import {PolarArea} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// Define custom colors for the chart
const COLORS = [
  '#C94C4C', // Warm Brick Red  
  '#D3756B', // Muted Coral  
  '#DC8850', // Deep Sunset Orange  
  '#E3A857', // Rich Goldenrod  
  '#A9845C', // Earthy Sandstone  
  '#7D9D72', // Soft Olive Green  
  '#5F8575', // Muted Teal  
  '#4F759B', // Dusty Blue  
  '#4464AD', // Royal Blue  
  '#7158A1', // Deep Lavender  
  '#9A4785', // Muted Plum  
];

// Create a custom plugin for extending path labels
const extendedPathLabelsPlugin = {
  id: 'extendedPathLabels',
  afterDatasetDraw: (chart) => {
    const { ctx, data, chartArea, scales } = chart;
    
    // Save the original state
    ctx.save();
    
    // Get the center of the chart
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    
    // Extract skill labels and values
    const labels = data.labels;
    const dataset = data.datasets[0];
    const total = dataset.data.reduce((sum, value) => sum + value, 0);
    
    // Loop through each data point
    labels.forEach((label, index) => {
      // Calculate the angle for this data point (midpoint of the sector)
      const numItems = labels.length;
      const angleSize = (Math.PI * 2) / numItems;
      const midAngle = index * angleSize - Math.PI / 2 + (angleSize / 2);
      
      // Calculate the value and percentage
      const value = dataset.data[index];
      const percent = (value / total * 100).toFixed(1);
      
      // Calculate positions for the path
      const outerRadius = scales.r.end;
      
      // Start point of line (at the outer edge of the sector)
      const sx = centerX + (outerRadius) * Math.cos(midAngle);
      const sy = centerY + (outerRadius) * Math.sin(midAngle);
      
      // Mid point of line (first bend)
      const mx = centerX + (outerRadius + 30) * Math.cos(midAngle);
      const my = centerY + (outerRadius + 30) * Math.sin(midAngle);
      
      // End point of line (where the text will be placed)
      // Align all labels on the left or right side based on position
      const ex = mx + (Math.cos(midAngle) >= 0 ? 1 : -1) * 22;
      const ey = my;
      
      // Text anchor based on which side of the chart
      const textAnchor = Math.cos(midAngle) >= 0 ? 'start' : 'end';
      
      // Get the color for this data point
      const color = COLORS[index % COLORS.length];
      
      // Draw the connecting path
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(mx, my);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw a circle at the end point
      ctx.beginPath();
      ctx.arc(ex, ey, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Set text styles
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = textAnchor;
      
      // Draw skill name and value
      ctx.fillText(label, ex + (Math.cos(midAngle) >= 0 ? 8 : -8), ey);
      
      // Draw the value below the skill name
      ctx.font = '12px Arial';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`${value}/100 (${percent}%)`, ex + (Math.cos(midAngle) >= 0 ? 8 : -8), ey + 20);
    });
    
    // Restore the original state
    ctx.restore();
  }
};

// Register the custom plugin
ChartJS.register(extendedPathLabelsPlugin);

// Helper function to prepare chart data and options
const prepareChartData = (skills) => {
  return {
    labels: skills.map(item => item.skill),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map(item => parseInt(item.value, 10)),
        backgroundColor: COLORS.map(color => `${color}dd`), // Less transparency
        borderColor: COLORS,
        borderWidth: 1,
      }
    ]
  };
};

const chartOptions = {
  plugins: {
    legend: {
      display: false, // Hide the legend since we're using our custom labels
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.label}: ${context.raw}/100`;
        }
      }
    }
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        display: false, // Hide the radial ticks
        backdropColor: 'transparent'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      pointLabels: {
        display: false, // Hide the default point labels
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
};

const SkillsPanel = kind({
  name: 'SkillsPanel',

  render: ({skillsData, rollNumber, onBack, ...rest}) => {
    // Default data if none provided
    const defaultSkillsData = {
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
    
    // Use provided data or default
    const data = skillsData || defaultSkillsData;
    const skills = data.evaluationMetrics[0].skills;
    
    // Prepare chart data using helper function
    const chartData = prepareChartData(skills);

    return (
      <Panel {...rest}>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <Heading showLine style={{margin: 0, color: '#f1f5f9'}}>
              Student Skills Assessment
            </Heading>
            {rollNumber && (
              <BodyText style={{margin: '0 0 0 20px', color: '#f1f5f9'}}>
                Roll Number: {rollNumber}
              </BodyText>
            )}
          </div>
          <Button 
            size="small" 
            onClick={onBack}
            style={{marginLeft: 'auto'}}
          >
            Back to Projects
          </Button>

        <Scroller>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            height: 'calc(100vh - 120px)'
          }}>
            <BodyText style={{
              marginBottom: '20px', 
              color: '#f1f5f9',
              fontSize: '16px',
              textAlign: 'center'
            }}>
              Skills assessment based on project contributions and code analysis
            </BodyText>
            
            <div style={{
              width: '100%',
              height: '70vh',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '20px',
              background: 'rgba(22, 27, 34, 0.8)', 
              borderRadius: '8px'
            }}>
              <PolarArea data={chartData} options={chartOptions} />
            </div>
          </div>
        </Scroller>
      </Panel>
    );
  }
});

export default SkillsPanel;
