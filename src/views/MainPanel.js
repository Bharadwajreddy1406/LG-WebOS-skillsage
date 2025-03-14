import React, {useState} from 'react';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Item from '@enact/sandstone/Item';
import BodyText from '@enact/sandstone/BodyText';
import Icon from '@enact/sandstone/Icon';
import Heading from '@enact/sandstone/Heading';
import Button from '@enact/sandstone/Button';
import SkillsPanel from './SkillsPanel';

import skillSageIcon from '../icons/-192x192.png';

// Custom ProjectCard component to simulate a card layout
const ProjectCard = ({repoName, description, languages, repoUrl}) => {
	const [hover, setHover] = useState(false);

	const baseStyle = {
		background: '#161b22', // GitHub dark theme background
		borderRadius: '8px',
		boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
		padding: '16px',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		color: '#f1f5f9', // slate-100 text color
		transition: 'transform 0.3s ease, box-shadow 0.3s ease'
	};

	const hoverStyle = hover
		? {
				transform: 'translateY(-4px)',
				boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
			}
		: {};

	return (
		<div
			style={{...baseStyle, ...hoverStyle}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div style={{marginBottom: '12px'}}>
				<Heading style={{margin: 0, fontSize: '18px', color: '#f1f5f9'}}>
					{repoName}
				</Heading>
				<BodyText style={{margin: '4px 0 0 0', fontSize: '14px', color: '#cbd5e1'}}>
					{languages.join(', ')}
				</BodyText>
			</div>
			<BodyText style={{flexGrow: 1, marginBottom: '12px', fontSize: '14px', color: '#f1f5f9'}}>
				{description}
			</BodyText>
			<div style={{textAlign: 'right'}}>
				<Button size="small" onClick={() => window.open(repoUrl, '_blank')}>
					Open Repo
				</Button>
			</div>
		</div>
	);
};

// The skills data that will be used for the polar chart
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

// Define MainPanel as a React component using kind properly
const MainPanel = kind({
	name: 'MainPanel',
	
	defaultProps: {
		currentPanel: 'projects'
	},
	
	render: ({connected, rollNumber, studentData, error, currentPanel, onShowSkills, onShowProjects, ...rest}) => {
		if (currentPanel === 'skills') {
			return (
				<SkillsPanel
					skillsData={skillsData}
					onBack={onShowProjects}
					{...rest}
				/>
			);
		}

		return (
			<Panel {...rest} noCloseButton={true}>
				<Header
					style={{
						background: 'linear-gradient(to right, #1F1F1F, #000000)',
						padding: '0 30px'
					}}
				>
					{/* Left side: Icon, Title & Tagline */}
					<div style={{display: 'flex', alignItems: 'center'}}>
						<img
							src={skillSageIcon}
							alt="Skill Sage Icon"
							style={{
								height: '60px',
								marginRight: '20px'
							}}
						/>
						<div>
							<Heading showLine style={{margin: 0, color: '#f1f5f9'}}>
								Skill Sage
							</Heading>
							<BodyText style={{margin: '4px 0 0 0', opacity: 0.8, color: '#f1f5f9'}}>
								in partnership with KMIT 
							</BodyText>
						</div>
					</div>
					{/* Right side: Connection Status and Skills Button */}
					<div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
						<span
							style={{
								color: connected ? '#4CAF50' : '#F44336',
								fontWeight: 'bold',
								marginRight: '10px',
								fontSize: '18px',
								fontFamily: 'Arial, sans-serif'
							}}
						>
						Status: {connected ? 'Connected' : 'Disconnected'}
						</span>
						{studentData && studentData.length > 0 && (
							<Button size="small" onClick={onShowSkills}>
								View Skills
							</Button>
						)}
					</div>
				</Header>

				<Scroller>
					{/* Error Display */}
					{error && (
						<Item style={{color: '#F44336'}}>
							Error: {error}
						</Item>
					)}

					{/* Roll Number Display */}
					{rollNumber && (
						<Item style={{color: '#f1f5f9'}}>
							Roll Number: {rollNumber}
						</Item>
					)}

					{/* Render each project as a custom card */}
					{studentData && studentData.length > 0 && (
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
								gap: '1rem',
								padding: '1rem'
							}}
						>
							{studentData.map((project, index) => (
								<ProjectCard
									key={index}
									repoName={project.repoName}
									description={project.description}
									languages={project.languages}
									repoUrl={project.repoUrl}
								/>
							))}
						</div>
					)}

					{/* Initial state - no data received yet */}
					{!rollNumber && !error && !studentData && (
						<BodyText style={{color: '#f1f5f9'}}>
							Waiting to receive roll number via MQTT...
						</BodyText>
					)}
				</Scroller>
			</Panel>
		);
	}
});

// Create a wrapper component that manages the state and passes props to MainPanel
const MainPanelWrapper = (props) => {
	const [currentPanel, setCurrentPanel] = useState('projects');
	
	const showSkillsPanel = () => {
		setCurrentPanel('skills');
	};

	const showProjectsPanel = () => {
		setCurrentPanel('projects');
	};
	
	return (
		<MainPanel
			{...props}
			currentPanel={currentPanel}
			onShowSkills={showSkillsPanel}
			onShowProjects={showProjectsPanel}
		/>
	);
};

export default MainPanelWrapper;
