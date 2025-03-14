import React, {useState} from 'react';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import BodyText from '@enact/sandstone/BodyText';
import Heading from '@enact/sandstone/Heading';
import Button from '@enact/sandstone/Button';

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

const ProjectsPanel = kind({
	name: 'ProjectsPanel',
	
	render: ({rollNumber, studentData, onShowSkills, ...rest}) => {
		return (
			<Panel {...rest}>
				<Header
					style={{
						background: 'linear-gradient(to right, #1F1F1F, #000000)',
						padding: '0 30px'
					}}
				>
					{/* Left side: Icon, Title & Roll Number */}
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
								Student Projects
							</Heading>
							{rollNumber && (
								<BodyText style={{margin: '4px 0 0 0', color: '#f1f5f9'}}>
									Roll Number: {rollNumber}
								</BodyText>
							)}
						</div>
					</div>
					{/* Right side: Next button */}
					<Button 
						size="small" 
						onClick={onShowSkills}
						style={{marginLeft: 'auto'}}
					>
						Next: View Skills
					</Button>
				</Header>

				<Scroller>
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

					{/* No projects message */}
					{(!studentData || studentData.length === 0) && (
						<div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: 'calc(100vh - 120px)'
						}}>
							<BodyText style={{color: '#f1f5f9', fontSize: '20px'}}>
								No projects found for this student.
							</BodyText>
						</div>
					)}
				</Scroller>
			</Panel>
		);
	}
});

export default ProjectsPanel;
