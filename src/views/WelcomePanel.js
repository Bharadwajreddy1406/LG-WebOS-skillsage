import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import BodyText from '@enact/sandstone/BodyText';
import Heading from '@enact/sandstone/Heading';

import skillSageIcon from '../icons/-192x192.png';

const WelcomePanel = kind({
	name: 'WelcomePanel',
	
	render: ({connected, rollNumber, error, ...rest}) => {
		return (
			<Panel {...rest}>
				<Header
					style={{
						background: 'linear-gradient(to right, #1F1F1F, #000000)',
						padding: '0px 50px'
					}}
				>
					{/* Left side: Icon & Title */}
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
					{/* Right side: Connection Status */}
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
					</div>
				</Header>

				<Scroller>
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: 'calc(100vh - 120px)',
						padding: '20px'
					}}>
						{/* Error Display */}
						{error && (
							<BodyText style={{color: '#F44336', marginBottom: '20px', fontSize: '18px'}}>
								Error: {error}
							</BodyText>
						)}

						{/* Roll Number Display */}
						{rollNumber && (
							<BodyText style={{color: '#f1f5f9', fontSize: '24px', marginBottom: '20px'}}>
								Roll Number: {rollNumber}
							</BodyText>
						)}

						{/* Waiting message */}
						{!rollNumber && !error && (
							<div style={{textAlign: 'center'}}>
								<BodyText style={{color: '#f1f5f9', fontSize: '24px', marginBottom: '20px'}}>
									Waiting to receive roll number via MQTT...
								</BodyText>
								<div style={{
									width: '60px',
									height: '60px',
									border: '5px solid rgba(255, 255, 255, 0.3)',
									borderRadius: '50%',
									borderTopColor: '#f1f5f9',
									animation: 'spin 1s linear infinite',
									margin: '0 auto'
								}} />
								<style>
									{`@keyframes spin { to { transform: rotate(360deg); } }`}
								</style>
							</div>
						)}
					</div>
				</Scroller>
			</Panel>
		);
	}
});

export default WelcomePanel;
