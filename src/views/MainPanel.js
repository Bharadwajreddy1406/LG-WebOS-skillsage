import kind from '@enact/core/kind';
import { Panel, Header } from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Item from '@enact/sandstone/Item';
import BodyText from '@enact/sandstone/BodyText';
import Icon from '@enact/sandstone/Icon';

const MainPanel = kind({
  name: 'MainPanel',

  propTypes: {
    // Props defined in the parent component
  },

  render: ({ connected, rollNumber, studentData, error, ...rest }) => {
    return (
      <Panel {...rest}>
        <Header title="Student Information System">
          <Icon>
            {connected ? 'connection' : 'notification'}
          </Icon>
        </Header>
        
        <Scroller>
          {/* Connection Status */}
          <Item>
            Connection Status: {connected ? 'Connected to MQTT Broker' : 'Disconnected'}
          </Item>
          
          {/* Error Display */}
          {error && (
            <Item style={{ color: 'red' }}>
              Error: {error}
            </Item>
          )}
          
          {/* Roll Number Display */}
          {rollNumber && (
            <Item>
              Roll Number: {rollNumber}
            </Item>
          )}
          
          {/* Student Data Display */}
          {studentData && (
            <div>
              <Item>Student Information:</Item>
              <BodyText>{studentData}</BodyText>
            </div>
          )}
          
          {/* Initial state - no data received yet */}
          {!rollNumber && !error && (
            <BodyText>Waiting to receive roll number via MQTT...</BodyText>
          )}
        </Scroller>
      </Panel>
    );
  }
});

export default MainPanel;
