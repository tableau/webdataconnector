// Outside
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';

import { Grid,
         Col,
         PageHeader,
         Label } from 'react-bootstrap';

// Actions
import * as simulatorActions from '../actions/simulator_actions';
import * as messagingActions from '../actions/messaging_actions';

// Store
import store from '../store/store';

// Components
import SimulatorNavbar from './SimulatorNavbar';
import AddressBar from './AddressBar';
import StartConnectorGroup from './StartConnectorGroup';
import SimulatorAttributes from './SimulatorAttributes';
import DataTables from './DataTables';
import GatherDataFrame from './GatherDataFrame';

// Utilities
import * as consts from '../utils/consts';

//----------------------App---------------------//
// Main Component which is provided the state of
// the store acts as a container for the rest of
// the components
//----------------------------------------------//

class App extends Component {
  constructor(props) {
    super(props);
    const dispatch = this.props.dispatch;

    // Wire Up messageHandler
    window.addEventListener('message', (payload) => {
      dispatch(messagingActions.receiveMessage(payload));
    }, false);

    // Close other windows when component's window closes
    window.addEventListener('unload', () => {
      dispatch(simulatorActions.closeSimulatorWindow());
    }, false);

    // Dispatch Actions on Events and Bind This context
    // (in es6 classes the `this` context of event handlers is not
    // auto bound, it is done in the constructor using arrow functions
    // to minimize unnecessary rerenders)

    //Bind WDC Actions
    this.setAddressBarUrl = (url) =>
      dispatch(simulatorActions.setAddressBarUrl(url));
    this.setWdcShouldFetchAllTables = (should) =>
      dispatch(simulatorActions.setWdcShouldFetchAllTables(should));
    this.setWdcAttrs = (attrs) =>
      dispatch(simulatorActions.setWdcAttrs(attrs));

    // Bind Phase Actions
    this.cancelCurrentPhase = () =>
      dispatch(simulatorActions.setPhaseInProgress(false));
    this.startAuthPhase = () =>
      dispatch(simulatorActions.startConnector(consts.phases.AUTH));
    this.startInteractivePhase = () =>
      dispatch(simulatorActions.startConnector(consts.phases.INTERACTIVE));
    this.sendGetData = (tablesAndIncValues, isFreshFetch) =>
      dispatch(messagingActions.sendGetData(tablesAndIncValues, isFreshFetch));

    // Show Advanced Actions
    this.setShowAdvanced = (show) =>
      dispatch(simulatorActions.setShowAdvanced(show));
    // Bind Window Actions
    this.setWindowAsGatherFrame = (frame) =>
      dispatch(simulatorActions.setWindowAsGatherFrame(frame));

    // Bind Reset Action
    this.resetSimulator = () =>
      dispatch(simulatorActions.resetState());
  }

  render() {
    // compute variables needed for render
    const interactivePhaseInProgress = this.props.phaseInProgress &&
                                       this.props.currentPhase === consts.phases.INTERACTIVE;
    const dataGatheringPhaseInProgress = this.props.phaseInProgress &&
                                         this.props.currentPhase === consts.phases.GATHER_DATA;

    const hasData = !!this.props.tables && Object.keys(this.props.tables).length > 0;
    const isAddressBarEmpty = (this.props.addressBarUrll === '');

    return (
      <div className="simulator-app">
        <SimulatorNavbar
          showAdvanced={this.props.showAdvanced}
          setShowAdvanced={this.setShowAdvanced}
        />
        <Grid fluid>
          <Col md={12} className="address-bar">
            <AddressBar
              addressBarUrl={this.props.addressBarUrl}
              mostRecentUrls={this.props.mostRecentUrls}
              setAddressBarUrl={this.setAddressBarUrl}
            />
          </Col>
          <Col md={6} className="run-connector">
            <StartConnectorGroup
              isInProgress={this.props.phaseInProgress}
              showAdvanced={this.props.showAdvanced}
              interactivePhaseInProgress={interactivePhaseInProgress}
              isAddressBarEmpty={isAddressBarEmpty}
              startInteractivePhase={this.startInteractivePhase}
              startAuthPhase={this.startAuthPhase}
              cancelCurrentPhase={this.cancelCurrentPhase}
              wdcShouldFetchAll={this.props.wdcShouldFetchAllTables}
              setWdcShouldFetchAllTables={this.setWdcShouldFetchAllTables}
            />
          </Col>
          <Col md={6} className="interactive-phase">
            <SimulatorAttributes
              disabled={this.props.phaseInProgress}
              showAdvanced={this.props.showAdvanced}
              wdcAttrs={this.props.wdcAttrs}
              setWdcAttrs={this.setWdcAttrs}
            />
          </Col>
          <Col md={12} className="table-header" >
            <PageHeader> Tables </PageHeader>
          </Col>
          {hasData ?
            <Col md={12} className="results-tables">
              <DataTables
                tables={this.props.tables}
                getTableDataCallback={this.sendGetData}
                fetchInProgress={dataGatheringPhaseInProgress}
              />
            </Col>
            :
            <Col
              md={12}
              className="no-results-label"
              style={{ paddingBottom: 10 }}
            >
              <Label> No Data Gathered </Label>
            </Col>
          }
          {this.props.shouldHaveGatherDataFrame ?
            <GatherDataFrame
              wdcUrl={this.props.wdcUrl}
              setWindowAsGatherFrame={this.setWindowAsGatherFrame}
            />
            : null
          }
        </Grid>
      </div>
    );
  }
}

// connect App to the store with out performing any state transformations
const ConnectedApp = connect(state => state)(App);
export default ConnectedApp;

// attach App to DOM and wrap it in a redux provider when the document is loaded
function run() {
  render(
    (<Provider store={store}>
      <ConnectedApp />
    </Provider>),
    document.getElementById('simulatorRoot'));
}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}
