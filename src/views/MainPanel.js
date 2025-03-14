import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Item from '@enact/sandstone/Item';
import BodyText from '@enact/sandstone/BodyText';
import Icon from '@enact/sandstone/Icon';
import Heading from '@enact/sandstone/Heading';

import skillSageIcon from '../icons/-192x192.png';

const MainPanel = kind({
  name: 'MainPanel',

  render: ({connected, rollNumber, studentData, error, ...rest}) => {
    return (
      <Panel {...rest}>
        <Header
          // Give the header a nice gradient background
          style={{
            background: 'linear-gradient(to right, #1F1F1F, #000000)',
            padding: '0 30px'
          }}
        >
          {/* Left side: Icon + Title + Tagline */}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img
              src={skillSageIcon}
              alt="Skill Sage Icon"
              style={{
                height: '100px',
                marginRight: '20px'
              }}
            />
            <div>
              <Heading showLine style={{margin: 0}}>
                Skill Sage
              </Heading>
              {/* Optional tagline under main title */}
              <BodyText style={{margin: '4px 0 0 0', opacity: 0.8}}>
                Empowering students and educators 
              </BodyText>
            </div>
          </div>

          {/* Right side: Connection status */}
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
              {/* Try removing "Status:" if it still shows "wi Connected" */}
              Status: {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </Header>

        {/* Main content in a Scroller */}
        <Scroller>
          {error && (
            <Item style={{color: 'red'}}>
              Error: {error}
            </Item>
          )}

          {rollNumber && (
            <Item>
              Roll Number: {rollNumber}
            </Item>
          )}

          {studentData && (
            <div>
              <Item>Student Information:</Item>
              <BodyText>{studentData}</BodyText>
            </div>
          )}

          {!rollNumber && !error && (
            <BodyText>Waiting to receive roll number via MQTT...</BodyText>
          )}
        </Scroller>
      </Panel>
    );
  }
});

export default MainPanel;
