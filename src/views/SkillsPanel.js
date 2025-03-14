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

// Create a custom plugin for labels positioned above each sector
const centerLabelsPlugin = {
  id: 'centerLabels',
  afterDatasetDraw: (chart) => {
    const { ctx, data, chartArea, scales } = chart;
    
    // Save the original state
    ctx.save();
    
    // Get the center of the chart
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    
    // Extract skill labels
    const labels = data.labels;
    const dataset = data.datasets[0];
    
    // Loop through each data point
    labels.forEach((label, index) => {
      // Calculate position for the label
      const numItems = labels.length;
      const angleSize = (Math.PI * 2) / numItems;
      const angle = index * angleSize - Math.PI / 2 + (angleSize / 2); // Center in the segment
      
      // Get the value to determine how far out to place the label
      const value = dataset.data[index];
      const maxValue = Math.max(...dataset.data);
      
      // Calculate radius based on the data value plus a small offset (5-15%)
      const valueRadius = (value / 100) * scales.r.end;
      const labelRadius = valueRadius + (scales.r.end * 0.08); // Position slightly outside the sector
      
      // Calculate the x and y position for the label
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      // Styling for the labels - adjust based on text length
      const fontSize = label.length > 10 ? '11px' : '13px';
      ctx.font = `bold ${fontSize} Arial`;
      ctx.fillStyle = 'white';
      
      // Adjust text alignment based on position around the circle
      // This makes text more naturally positioned relative to the sectors
      if (x < centerX - 5) {
        ctx.textAlign = 'right';
      } else if (x > centerX + 5) {
        ctx.textAlign = 'left';
      } else {
        ctx.textAlign = 'center';
      }
      
      if (y < centerY) {
        ctx.textBaseline = 'bottom';
      } else {
        ctx.textBaseline = 'top';
      }
      
      // Draw background for better readability
      const textWidth = ctx.measureText(label).width;
      const padding = 4;
      const bgHeight = parseInt(fontSize) + (padding * 2);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        x - (textWidth / 2) - padding, 
        y - (bgHeight / 2), 
        textWidth + (padding * 2), 
        bgHeight
      );
      
      // Draw shadow to improve readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Draw the skill name label
      ctx.fillStyle = 'white';
      ctx.fillText(label, x, y);
      
      // Reset shadow effect after drawing
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    });
    
    // Restore the original state
    ctx.restore();
  }
};

// Register the custom plugin
ChartJS.register(centerLabelsPlugin);

// Helper function to prepare chart data and options
const prepareChartData = (skills) => {
  return {
    labels: skills.map(item => item.skill),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map(item => parseInt(item.value, 10)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(199, 199, 199, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };
};

const chartOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#f1f5f9',
        font: {
          size: 14
        }
      }
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
        color: '#f1f5f9',
        backdropColor: 'transparent'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      pointLabels: {
        color: '#f1f5f9',
        font: {
          size: 14
        }
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
};

const SkillsPanel = kind({
  name: 'SkillsPanel',

  render: ({skillsData, onBack, ...rest}) => {
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
        <Header
          style={{
            background: 'linear-gradient(to right, #1F1F1F, #000000)',
            padding: '0 30px'
          }}
        >
          <Heading showLine style={{margin: 0, color: '#f1f5f9'}}>
            Student Skills Assessment
          </Heading>
          <Button 
            size="small" 
            icon="arrowleft" 
            onClick={onBack}
            style={{marginLeft: 'auto'}}
          >
            Back to Projects
          </Button>
        </Header>

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
