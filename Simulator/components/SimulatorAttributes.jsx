import React, { Component, PropTypes } from 'react';
import { FormGroup,
         FormControl,
         ControlLabel,
         PageHeader,
         OverlayTrigger,
         Popover,
         Glyphicon } from 'react-bootstrap';

//----------------------Simulator Attributes---------------------//
// Component which contains the UI element necessary to set the
// state of wdcAttrs (connectionName, connectionData, username
// password, and locale)
//--------------------------------------------------------------//

class SimulatorAttributes extends Component {
  constructor(props) {
    super(props);
    this.handleAttrChange = this.handleAttrChange.bind(this);
  }

  handleAttrChange(e) {
    const newAttrs = { ...this.props.wdcAttrs, [e.target.id]: e.target.value };
    this.props.setWdcAttrs(newAttrs);
  }

  render() {
    const tooltip = (
      <Popover
        id="tooltip"
        title="Platform Properties"
      >
        These are properties normally given to a web data connector by the Tableau platform itself.
        They can be helpful for advanced users who need to test authentication, localization, or
        across versions of the Tableau platform. You can set values through these inputs and then
        access the values in your WDC through the tableau object. See the WDC&nbsp;
        <a href="http://tableau.github.io/webdataconnector/ref/api_ref.html#webdataconnectorapi.tableau" target="_blank">
          documentation
        </a>
        &nbsp;for more details
      </Popover>
    );

    return (
      <div className="data-gather-properties">
        <FormGroup>
          <PageHeader> Web Data Connector Properties </PageHeader>
          <ControlLabel> Connection Name </ControlLabel>
          <FormControl
            type="text"
            disabled={this.props.disabled}
            id="connectionName"
            value={this.props.wdcAttrs.connectionName}
            onChange={this.handleAttrChange}
          />
          <ControlLabel> Connection Data </ControlLabel>
          <FormControl
            type="textarea"
            disabled={this.props.disabled}
            id="connectionData"
            value={this.props.wdcAttrs.connectionData}
            onChange={this.handleAttrChange}
          />
          <ControlLabel> Username </ControlLabel>
          <FormControl
            type="text"
            disabled={this.props.disabled}
            id="username"
            value={this.props.wdcAttrs.username}
            onChange={this.handleAttrChange}
          />
          <ControlLabel> Password </ControlLabel>
          <FormControl
            type="password"
            disabled={this.props.disabled}
            id="password"
            value={this.props.wdcAttrs.password}
            onChange={this.handleAttrChange}
          />
          <ControlLabel> Username Alias </ControlLabel>
          <FormControl
            type="text"
            disabled={this.props.disabled}
            id="usernameAlias"
            value={this.props.wdcAttrs.usernameAlias}
            onChange={this.handleAttrChange}
          />
          {this.props.showAdvanced ?
            <div className="advanced">
              <PageHeader>
                Tableau Platform Properties
                <OverlayTrigger trigger="click" rootClose placement="top" overlay={tooltip}>
                  <small style={{ marginLeft: 10 }}>
                    <Glyphicon glyph="glyphicon glyphicon-info-sign" />
                  </small>
                </OverlayTrigger>
              </PageHeader>
              <ControlLabel> Platform OS </ControlLabel>
              <FormControl
                type="text"
                disabled={this.props.disabled}
                id="platformOs"
                value={this.props.wdcAttrs.platformOs}
                onChange={this.handleAttrChange}
              />
              <ControlLabel> Platform Version </ControlLabel>
              <FormControl
                type="text"
                disabled={this.props.disabled}
                id="platformVersion"
                value={this.props.wdcAttrs.platformVersion}
                onChange={this.handleAttrChange}
              />
              <ControlLabel> Platform Edition </ControlLabel>
              <FormControl
                type="text"
                disabled={this.props.disabled}
                id="platformEdition"
                value={this.props.wdcAttrs.platformEdition}
                onChange={this.handleAttrChange}
              />
              <ControlLabel> Platform Build Number </ControlLabel>
              <FormControl
                type="text"
                disabled={this.props.disabled}
                id="platformBuildNumber"
                value={this.props.wdcAttrs.platformBuildNumber}
                onChange={this.handleAttrChange}
              />
              <ControlLabel> Auth Purpose</ControlLabel>
              <FormControl
                componentClass="select"
                disabled={this.props.disabled}
                id="authPurpose"
                value={this.props.wdcAttrs.authPurpose}
                onChange={this.handleAttrChange}
              >
                <option value="ephemeral"> Ephemeral </option>
                <option value="enduring"> Enduring </option>
              </FormControl>
              <ControlLabel> Locale </ControlLabel>
              <FormControl
                componentClass="select"
                disabled={this.props.disabled}
                label="Locale"
                id="locale"
                value={this.props.wdcAttrs.locale}
                onChange={this.handleAttrChange}
              >
                <option value="en-us"> English </option>
                <option value="zh-cn"> 中文 </option>
                <option value="de-de"> Deutsche </option>
                <option value="es-es"> Español </option>
                <option value="fr-fr"> Français </option>
                <option value="ja-jp"> 日本語 </option>
                <option value="ko-kr"> 한국어 </option>
                <option value="pt-br"> Português </option>
              </FormControl>
            </div>
            : null
          }
        </FormGroup>
      </div>
    );
  }
}

SimulatorAttributes.propTypes = {
  disabled: PropTypes.bool.isRequired,
  showAdvanced: PropTypes.bool.isRequired,
  wdcAttrs: PropTypes.shape({
    connectionName: PropTypes.string.isRequired,
    connectionData: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    usernameAlias: PropTypes.string.isRequired,
    authPurpose: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
  setWdcAttrs: PropTypes.func.isRequired,
};

export default SimulatorAttributes;
