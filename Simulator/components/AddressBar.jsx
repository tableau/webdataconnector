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
// state of addressBarUrl
//------------------------------------------------------//

class AddressBar extends Component {
  constructor(props) {
    super(props);
    this.handleAddressBarUrlInput = this.handleAddressBarUrlInput.bind(this);
    this.handleAddressBarUrlSelect = this.handleAddressBarUrlSelect.bind(this);
  }

  handleAddressBarUrlInput(e) {
    this.props.setAddressBarUrl(e.target.value);
  }

  handleAddressBarUrlSelect(eventKey) {
    this.props.setAddressBarUrl(eventKey);
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
            label="WDC URL"
            value={this.props.addressBarUrl}
            onChange={this.handleAddressBarUrlInput}
          />
          <DropdownButton
            id="most-recent-urls"
            title="Recent"
            componentClass={InputGroup.Button}
            onSelect={this.handleAddressBarUrlSelect}
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
  addressBarUrl: PropTypes.string.isRequired,
  mostRecentUrl: PropTypes.arrayOf(PropTypes.string).isRequired,
  setAddressBarUrl: PropTypes.func.isRequired,
};

export default AddressBar;
