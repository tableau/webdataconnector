import React, { Component, PropTypes } from 'react';
import {
  FormGroup,
  FormControl,
  InputGroup,
  MenuItem,
  DropdownButton,
  ControlLabel } from 'react-bootstrap';

//----------------------Address Bar---------------------//
// Component with the UI elements necessary to update the
// state of wdcUrl and reset the state of the simulator
//------------------------------------------------------//

class AddressBar extends Component {
  constructor(props) {
    super(props);
    this.handleWdcUrlInput = this.handleWdcUrlInput.bind(this);
    this.handleWdcUrlSelect = this.handleWdcUrlSelect.bind(this);
  }

  handleWdcUrlInput(e) {
    this.props.setWdcUrl(e.target.value);
  }

  handleWdcUrlSelect(eventKey) {
    this.props.setWdcUrl(eventKey);
  }

  render() {
    const menuItems = this.props.mostRecentUrls.map((url, idx) =>
      <MenuItem
        eventKey={url}
        key={idx}
      >
        {url}
      </MenuItem>
    );

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
            onChange={this.handleWdcUrlInput}
          />
          <DropdownButton
            id="most-recent-urls"
            title="Recent"
            disabled={this.props.disabled}
            componentClass={InputGroup.Button}
            onSelect={this.handleWdcUrlSelect}
            pullRight
          >
            {menuItems}
          </DropdownButton>
        </InputGroup>
      </FormGroup>
    );
  }
}

AddressBar.prototypes = {
  wdcUrl: PropTypes.string.isRequired,
  mostRecentUrl: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool.isRequired,
  setWdcUrl: PropTypes.func.isRequired,
};

export default AddressBar;
