import React, { Component, PropTypes } from 'react';
import { Navbar, Button } from 'react-bootstrap';

//----------------------Navbar---------------------//
// Component for the top navbar, purely presentational
//-------------------------------------------------//

class SimulatorNavbar extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Brand>
          <img
            className="tableau-logo"
            src="tableau_logo.png"
            role="presentation"
          />
        </Navbar.Brand>
        <Navbar.Brand>
          Web Data Connector Simulator 2.0
        </Navbar.Brand>
        <Navbar.Form pullRight>
          <Button
            id="reset-btn"
            onClick={this.props.resetSimulator}
          >
            Reset
          </Button>
        </Navbar.Form>
      </Navbar>
    );
  }
}

SimulatorNavbar.prototypes = {
  resetSimulator: PropTypes.func.isRequired,
};

export default SimulatorNavbar;
