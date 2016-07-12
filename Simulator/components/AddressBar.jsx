import React, { Component, PropTypes } from 'react';
import {
  FormGroup,
  FormControl,
  InputGroup,
  ControlLabel,
  Button } from 'react-bootstrap';

//----------------------Address Bar---------------------//
// Component with the UI elements necessary to update the
// state of wdcUrl and reset the state of the simulator
//------------------------------------------------------//

class AddressBar extends Component {
  constructor(props) {
    super(props);
    this.handleWdcUrlChange = this.handleWdcUrlChange.bind(this);
  }

  handleWdcUrlChange(e) {
    this.props.setWdcUrl(e.target.value);
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel> Connector URL </ControlLabel>
        <InputGroup>
          <FormControl
            id="address-input"
            type="text"
            disabled={this.props.disabled}
            label="WDC URL"
            value={this.props.wdcUrl}
            onChange={this.handleWdcUrlChange}
          />
          <InputGroup.Button>
            <Button id="reset-btn" onClick={this.props.resetSimulator}> Reset </Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }
}

AddressBar.prototypes = {
  wdcUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  setWdcUrl: PropTypes.func.isRequired,
  resetSimulator: PropTypes.func.isRequired,
};

export default AddressBar;
