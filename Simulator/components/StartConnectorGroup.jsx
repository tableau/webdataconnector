import React, { Component, PropTypes } from 'react';
import { Button, Checkbox } from 'react-bootstrap';

//----------------------Start Connector Group---------------------//
// Component which Buttons to Start Both the Interactive
// and Auth Phases of the WDC.
//---------------------------------------------------------------//

class StartConnectorGroup extends Component {
  constructor(props) {
    super(props);
    this.handleShouldFetchAllChange = this.handleShouldFetchAllChange.bind(this);
  }

  handleShouldFetchAllChange(e) {
    this.props.setWdcShouldFetchAllTables(e.target.checked);
  }

  render() {
    return (
      <div>
        <div>
          <h2
            style={{ verticalAlign: 'middle', display: 'inline-block' }}
          >
            Run Connector
          </h2>
        </div>
        <div>
          <Button
            id="interactive-btn"
            onClick={this.props.startInteractivePhase}
            bsStyle="success"
            disabled={this.props.isInProgress || this.props.isWDCUrlEmpty}
          >
            Start Interactive Phase
          </Button>
          <Button
            id="auth-btn"
            onClick={this.props.startAuthPhase}
            bsStyle="success"
            style={{ marginLeft: '4px' }}
            disabled={this.props.isInProgress || this.props.isWDCUrlEmpty}
          >
            Start Auth Phase
          </Button>
          {this.props.interactivePhaseInProgress ?
            <Button
              onClick={this.props.cancelCurrentPhase}
              style={{ marginLeft: '4px' }}
            >
              Abort
            </Button>
            : null
          }
        </div>
        <Checkbox
          checked={this.props.wdcShouldFetchAll}
          onChange={this.handleShouldFetchAllChange}
        >
            Automatically fetch data for all tables
        </Checkbox>
      </div>
    );
  }
}

StartConnectorGroup.proptypes = {
  isInProgress: PropTypes.bool.isRequired,
  interactivePhaseInProgress: PropTypes.bool.isRequired,
  isWDCUrlEmpty: PropTypes.bool.isRequired,
  wdcShouldFetchAll: PropTypes.bool.isRequired,
  startAuthPhase: PropTypes.func.isRequired,
  startInteractivePhase: PropTypes.func.isRequired,
  cancelCurrentPhase: PropTypes.func.isRequired,
  setWdcShouldFetchAllTables: PropTypes.func.isRequired,
};

export default StartConnectorGroup;
