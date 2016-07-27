import React, { Component, PropTypes } from 'react';
import { Navbar, Button } from 'react-bootstrap';

//----------------------Navbar---------------------//
// Component for the top navbar, purely presentational
//-------------------------------------------------//

class SimulatorNavbar extends Component {
  constructor(props) {
    super(props);
    this.handleAdvancedClick = this.handleAdvancedClick.bind(this);
  }

  handleAdvancedClick() {
    this.props.setShowAdvanced(!this.props.showAdvanced);
  }

  render() {
    return (
      <Navbar fluid>
        <img
          className="tableau-logo"
          src="tableau_logo.png"
          style={{ height: 40, width: 40, margin: 10 }}
          role="presentation"
        />
        <h2 style={{ display: 'inline', verticalAlign: 'middle' }}>
          Web Data Connector Simulator 2.0
        </h2>
        <Navbar.Form
          style={{ borderStyle: 'none' }}
          pullRight
        >
          <Button
            className="advanced-btn"
            onClick={this.handleAdvancedClick}
            style={{ width: 125 }}
            pullRight
          >
            {this.props.showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
        </Navbar.Form>
      </Navbar>
    );
  }
}

SimulatorNavbar.prototypes = {
  showAdvanced: PropTypes.bool.isRequired,
  setShowAdvanced: PropTypes.func.isRequired,
};

export default SimulatorNavbar;
