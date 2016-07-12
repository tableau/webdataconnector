import React, { Component } from 'react';

//----------------------Navbar---------------------//
// Component for the top navbar, purely presentational
//-------------------------------------------------//

class Navbar extends Component {
  render() {
    return (
      <div className="navbar navbar-default">
        <img
          className="tableau-logo"
          src="tableau_logo.png"
          style={{ height: 40, width: 40, margin: 10 }}
          role="presentation"
        />
        <h2 style={{ display: 'inline', verticalAlign: 'middle' }}>
          Web Data Connector Simulator 2.0
        </h2>
      </div>
    );
  }
}

export default Navbar;
