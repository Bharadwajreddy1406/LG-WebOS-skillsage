import React, {useState} from 'react';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import BodyText from '@enact/sandstone/BodyText';
import Heading from '@enact/sandstone/Heading';
import Button from '@enact/sandstone/Button';
import Image from '@enact/sandstone/Image';
import Icon from '@enact/sandstone/Icon';

import skillSageIcon from '../icons/-192x192.png';

// Hardcoded student profile data
const studentProfileData = {
	studentProfile: {
		avatar: "https://cdn.jsdelivr.net/gh/alohe/memojis/png/notion_10.png",
		name: "Sarah Johnson",
		rollNumber: "21BCE1045",
		cgpa: 9.2
	}
};

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
		transition: 'transform 0.3s ease, box-shadow 0.3s ease',
		fontFamily: 'Helvetica, sans-serif'
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
			<BodyText style={{flexGrow: 1, marginBottom: '0px', fontSize: '14px', color: '#f1f5f9'}}>
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

// Student Profile Component
const StudentProfile = ({isCollapsed, toggleCollapse, rollNumber}) => {
	const { studentProfile } = studentProfileData;
	
	return (
		<div style={{
			background: '#161b22',
			borderRadius: '8px',
			boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
			padding: '16px',
			color: '#f1f5f9',
			height: isCollapsed ? '60px' : 'auto',
			overflow: 'hidden',
			transition: 'height 0.3s ease',
			position: 'relative',
			marginBottom: '16px'
		}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? '0' : '16px'}}>
				<Heading size="small" style={{margin: 0}}>Student Profile</Heading>
				<Button size="small" icon={isCollapsed ? 'arrowdown' : 'arrowup'} onClick={toggleCollapse} />
			</div>
			
			{!isCollapsed && (
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px'}}>
					<Image 
						src={studentProfile.avatar} 
						style={{width: '100px', height: '100px', borderRadius: '50%', marginBottom: '16px'}}
					/>
					<Heading size="small" style={{margin: '0 0 8px 0'}}>{studentProfile.name}</Heading>
					<BodyText style={{margin: '0 0 4px 0'}}>Roll Number: {rollNumber || studentProfile.rollNumber}</BodyText>
					<BodyText style={{margin: '0 0 16px 0'}}>CGPA: {studentProfile.cgpa}</BodyText>
				</div>
			)}
		</div>
	);
};

// The kind component without state management in the render method
const ProjectsPanelBase = kind({
	name: 'ProjectsPanel',
	
	render: ({rollNumber, studentData, onShowSkills, isProfileCollapsed, toggleProfileCollapse, ...rest}) => {
		return (
			<Panel {...rest}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px'}}>
					<div style={{display: 'flex', alignItems: 'center'}}>
						<img
							src={skillSageIcon}
							alt="Skill Sage Icon"
							style={{
								height: '60px',
								marginRight: '20px'
							}}
						/>
						<div style={{fontFamily: 'Helvetica, sans-serif'}}>
							<Heading showLine style={{margin: 0, color: '#f1f5f9'}}>
								Student Projects
							</Heading>
							<BodyText style={{margin: '4px 0 0 0', color: '#f1f5f9'}}>
								Roll Number: {rollNumber || 'Not available'}
							</BodyText>
						</div>
					</div>
					<Button 
						size="small" 
						onClick={onShowSkills}
					>
						Next: View Skills
					</Button>
				</div>

				<div style={{display: 'flex', height: 'calc(100vh - 120px)'}}>
					{/* Main content area (70%) */}
					<div style={{width: '70%', padding: '0 16px 0 0'}}>
						<Scroller style={{height: '100%'}}>
							{/* Render each project as a custom card */}
							{studentData && studentData.length > 0 && (
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
										gap: '1rem',
										padding: '1rem',
										fontFamily: 'Helvetica, sans-serif'
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

							{/* No projects message */}
							{(!studentData || studentData.length === 0) && (
								<div style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '100%',
									fontFamily: 'Helvetica, sans-serif'
								}}>
									<BodyText style={{color: '#f1f5f9', fontSize: '20px'}}>
										No projects found for this student.
									</BodyText>
								</div>
							)}
						</Scroller>
					</div>
					
					{/* Student profile area (30%) */}
					<div style={{width: '30%', padding: '16px'}}>
						<StudentProfile 
							isCollapsed={isProfileCollapsed} 
							toggleCollapse={toggleProfileCollapse}
							rollNumber={rollNumber}
						/>
					</div>
				</div>
			</Panel>
		);
	}
});

// Wrapper component to handle state
const ProjectsPanel = (props) => {
	const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
	
	const toggleProfileCollapse = () => {
		setIsProfileCollapsed(!isProfileCollapsed);
	};
	
	return (
		<ProjectsPanelBase
			{...props}
			isProfileCollapsed={isProfileCollapsed}
			toggleProfileCollapse={toggleProfileCollapse}
		/>
	);
};

export default ProjectsPanel;
