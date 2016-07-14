import React, { Component, PropTypes } from 'react';
import { Navbar } from 'react-bootstrap';

//----------------------Navbar---------------------//
// Component for the top navbar, purely presentational
//-------------------------------------------------//

class SimulatorNavbar extends Component {
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
      </Navbar>
    );
  }
}

SimulatorNavbar.prototypes = {
  resetSimulator: PropTypes.func.isRequired,
};

export default SimulatorNavbar;
