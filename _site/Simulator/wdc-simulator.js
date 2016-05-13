(function(_, React, ReactBootstrap) {

  var NOOP = function(){};
  var ALLOWED_WDC_API_VERSION = "1.1.1";

  function verifyCanRunWdcVersion(wdcApiVersion) {
    if(wdcApiVersion !== ALLOWED_WDC_API_VERSION) {
      throw new Error('Simulator version "' + ALLOWED_WDC_API_VERSION + '" does not match connector version "' + wdcApiVersion + '".');
    }
  }

  // Private static functions
  function convertTableDataToMatrix(tableData, headerTitles) {
    return tableData.map(function(tableDataRow) {
      return headerTitles.map(function(title, index) {
        var cellVal = tableDataRow[title];
        if(typeof cellVal === 'undefined') {
          cellVal = tableDataRow[index];
        }
        return cellVal;
      });
    });
  }

  /*
  interface ISendPostMessage {
   (messagePayload: string): any;
  }
   */

  /*
  interface IPhaseChangeHandler {
    //WdcCommandSimulator.Phase
    (previousPhase: string, currentPhase: string, data: any): any;
  }
   */

  /*
  interface IEventHandler {
    //messageDirection: WdcCommandSimulator.MessageDirection, eventType: WdcCommandSimulator.EventName
    (messageDirection: string, eventType: string, data: any): any;
  }
   */

  /*
  interface ILogger {
    log(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
  }
   */

  function WdcCommandSimulator(/*ISendPostMessage*/ sendPostMessage, /*IPhaseChangeHandler*/ onPhaseChange, /*IEventHandler*/ onEvent, /*ILogger*/ logger) {

    // Properties that are exposed to the user on the tableau object in the WDC
    // These are usually defined in the interactive phase
    this.resetProps();

    // Internal state of the WDC.  This may be referenced  but should not be set directly outside of this class.
    // This state may be across multiple phases and will simulate persisted information
    this.resetState();

    this.resetPhaseState();

    this.resetTableData();

    this.currentPhase = WdcCommandSimulator.Phase.INTERACTIVE;

    this.sendPostMessage = sendPostMessage || NOOP;
    this.onEvent = onEvent || NOOP;
    this.onPhaseChange = onPhaseChange || NOOP;
    this.logger = logger || window.console;
  }

  WdcCommandSimulator.MAX_DATA_REQUEST_CALLS = 100;

  WdcCommandSimulator.EventName = {
    LOADED:       "loaded",
    LOG:          "log",
    INIT:         "init",
    INIT_CB:      "initCallback",
    SUBMIT:       "submit",
    HEADERS_GET:  "getColumnHeaders",
    HEADERS_CB:   "headersCallback",
    DATA_GET:     "getTableData",
    DATA_CB:      "dataCallback",
    SHUTDOWN:     "shutdown",
    SHUTDOWN_CB:  "shutdownCallback",
    ABORT:        "abortWithError"
  };

  WdcCommandSimulator.Phase = {
    INTERACTIVE: "interactive",
    AUTH: "auth",
    GATHER_DATA: "gatherData"
  };

  WdcCommandSimulator.MessageDirection = {
    SENT: 'sent',
    RECEIVED: 'received'
  };

  // Instance methods
  _.extend(WdcCommandSimulator.prototype, {

    resetProps: function() {
      this.props ={};
      this.applyProps({
        connectionName: '',
        connectionData: '',
        username: '',
        password: '',
        incrementalExtractColumn: ''
      });
    },

    resetState: function() {
      this.state = {
        currentPhase: WdcCommandSimulator.Phase.INTERACTIVE
      };
    },

    resetPhaseState: function() {
      this.phaseState = {
        inProgress: false,
        submitWasCalled: false,
        initCallbackWasCalled: false,
        numberOfGetDataCallbackCalls: 0
      };
    },

    resetTableData: function() {
      this.tableData = {
        headerTitles: null,
        headerTypes: null,
        lastIncrementalExtractColumnValue: undefined,
        table: []
      };
    },

    receivePostMessage: function(payload) {
      var postedData;
      try {
        postedData = this.parseMessageData(payload);
      } catch(e) {
        // The message was not for the simulator, ignore it.
        return;
      }

      var msgName = postedData.name;
      var msgData = postedData.data;

      this.applyProps(postedData.props);
      this.phaseState.inProgress = true;

      switch(msgName) {
        case WdcCommandSimulator.EventName.LOG:
          this.handleLog(msgData.logMsg);
          break;

        case WdcCommandSimulator.EventName.LOADED:
          this.handleLoaded(postedData.version);
          break;

        case WdcCommandSimulator.EventName.INIT_CB:
          this.handleInit();
          break;

        case WdcCommandSimulator.EventName.SUBMIT:
          this.handleSubmit();
          break;

        case WdcCommandSimulator.EventName.HEADERS_CB:
          var fieldNames = msgData.fieldNames;
          var fieldTypes = msgData.types;
          this.handleHeadersCallback(fieldNames, fieldTypes);
          break;

        case WdcCommandSimulator.EventName.DATA_CB:
          var data =            msgData.data;
          var lastRecordToken = msgData.lastRecordToken;
          var moreData =        msgData.moreData;
          this.handleDataCallback(data, lastRecordToken, moreData);
          break;

        case WdcCommandSimulator.EventName.SHUTDOWN_CB:
          this.handleShutdownCallback();
          break;

        case WdcCommandSimulator.EventName.ABORT:
          var errorMsg = msgData.errorMsg;
          this.handleAbort(errorMsg);
          break;
      }

      this.onEvent(WdcCommandSimulator.MessageDirection.RECEIVED, msgName, msgData);
    },

    sendMessage: function(messageName, messageData) {
      var messagePayload = JSON.stringify({
        msgName: messageName,
        msgData: messageData,
        props:   this.props
      });

      this.sendPostMessage(messagePayload);

      this.onEvent(WdcCommandSimulator.MessageDirection.SENT, messageName, messageData);
    },

    parseMessageData: function(messageDataString) {
      var messageData = JSON.parse(messageDataString);

      return {
        data:     messageData.msgData,
        props:    messageData.props,
        name:     messageData.msgName,
        version:  messageData.version || (messageData.props && messageData.props.versionNumber)
      }
    },

    applyProps: function(props) {
      if(!this.isValidProps(props)) return;

      this.props.connectionName = props.connectionName;
      this.props.connectionData = props.connectionData;
      this.props.username = props.username;
      this.props.password = props.password;
      this.props.incrementalExtractColumn = props.incrementalExtractColumn;
    },

    // TODO: Verify props passed in are acceptable
    // currently only returns true if something is passed in, may need to do more like check if the value is a string
    isValidProps: function(props) {
      return !!props && !_.isEmpty(props);
    },

    // POSTED METHOD HANDLERS

    handleLog: function(msg) {
      this.logger.log(msg)
    },

    handleLoaded: function(version) {
      verifyCanRunWdcVersion(version);
      this.sendInit();
    },

    handleInit: function() {
      this.phaseState.initCallbackWasCalled = true;
      if(this.state.currentPhase === WdcCommandSimulator.Phase.GATHER_DATA) {
        this.sendGetHeaders();
      } else {
        this.tryToCompleteCurrentPhase();
      }
    },

    handleSubmit: function() {
      this.phaseState.submitWasCalled = true;
      this.tryToCompleteCurrentPhase();
    },

    handleHeadersCallback: function(headerTitles, headerTypes) {
      this.verifyHeaders(headerTitles, headerTypes);

      this.tableData.headerTitles = headerTitles;
      this.tableData.headerTypes = headerTypes;

      this.sendGetData(this.tableData.lastIncrementalExtractColumnValue);
    },

    handleDataCallback: function(tableData, lastRecordToken, moreData) {
      this.verifyDataTableCallback(tableData, lastRecordToken, moreData);

      // Count the number of times the getDataCallback is called in an interactive phase so it can be limited
      this.state.numberOfGetDataCallbackCalls++;
      if(this.state.numberOfGetDataCallbackCalls > WdcCommandSimulator.MAX_DATA_REQUEST_CALLS) {
        this.logger.warn('Maximum Number of getDataTable() Requests ('+WdcCommandSimulator.MAX_DATA_REQUEST_CALLS+') Reached.');
        this.sendShutdown();
        return;
      }

      var table = convertTableDataToMatrix(tableData, this.tableData.headerTitles);
      this.tableData.table = this.tableData.table.concat(table);

      // Set the last value from the incrementalExtractColumn as the saved lastRecordToken used the first time
      // the getTableData method is called during the incremental refresh
      var lastRow = this.tableData.table[this.tableData.table.length - 1];
      var incrementalExtractColumnRowIndex = this.tableData.headerTitles.indexOf(this.props.incrementalExtractColumn);
      if(incrementalExtractColumnRowIndex >= 0) {
        this.tableData.lastIncrementalExtractColumnValue = lastRow[incrementalExtractColumnRowIndex];
      }

      // Once we have a value from the incremental extract column then we can enable incremental refresh

      if(moreData) {
        this.sendGetData(lastRecordToken);
      } else {
        this.logger.log('No More Data');
        this.sendShutdown();
      }
    },

    handleShutdownCallback: function() {
      this.phaseState.inProgress = false;
    },

    handleAbort: function(errMsg) {
      this.phaseState.inProgress = false;
      this.logger.error(errMsg);
    },

    // MESSAGES TO SEND TO CLIENT

    sendInit: function() {
      this.sendMessage(WdcCommandSimulator.EventName.INIT, { phase: this.state.currentPhase });
    },

    sendGetHeaders: function() {
      this.sendMessage(WdcCommandSimulator.EventName.HEADERS_GET);
    },

    sendGetData: function(lastRecordToken) {
      this.sendMessage(WdcCommandSimulator.EventName.DATA_GET, { lastRecordToken: lastRecordToken });
    },

    sendShutdown: function() {
      this.sendMessage(WdcCommandSimulator.EventName.SHUTDOWN);
    },

    tryToCompleteCurrentPhase: function() {
      if(this.phaseState.submitWasCalled && this.phaseState.initCallbackWasCalled) {
        // TODO: Is this correct? Should this.sendShutdown(); be called instead?
        this.phaseState.inProgress = false;
      }
    },

    verifyHeaders: function(headerTitles, headerTypes) {
      if(!headerTitles || !headerTypes) {
        throw new Error('tableau.headersCallback(titles, types) must be passed the header titles and types');
      }

      if(headerTitles.length != headerTypes.length) {
        this.logger.warn('header titles and types must be the same length');
      }

      if (this.props.incrementalExtractColumn && headerTitles.indexOf(this.props.incrementalExtractColumn) == -1) {
        this.logger.warn('Incremental refresh column is set but is not a column returned to Tableau, IncrementalExtractColumn: "' + this.props.incrementalExtractColumn + '"');
      }
    },

    verifyDataTableCallback: function(tableData, lastRecordToken, moreData) {
      // TODO: Add verify logic here
    },

    setCurrentPhase: function(phase) {
      if(!_.contains(WdcCommandSimulator.Phase, phase)) return;

      var previousPhase = this.state.currentPhase;
      this.state.currentPhase = phase;

      this.resetPhaseState();

      this.onPhaseChange(previousPhase, phase);
    },

    //////////// External methods ///////////
    setInteractivePhase: function() {
      this.setCurrentPhase(WdcCommandSimulator.Phase.INTERACTIVE);
    },

    setGatherDataPhase: function() {
      this.setCurrentPhase(WdcCommandSimulator.Phase.GATHER_DATA);
    },

    canDoAnIncrementalRefresh: function() {
      return this.hasData() && !_.isUndefined(this.tableData.lastIncrementalExtractColumnValue);
    },

    hasData: function() {
      return !!this.tableData.table && this.tableData.table.length > 0;
    },

    setInProgress: function() {
      this.phaseState.inProgress = true;
    }
  });

  ////////////////////////// REACT COMPONENTS ////////////////////////////

  _.forEach(ReactBootstrap, function(reactClass) {
    reactClass.element = React.createFactory(reactClass);
  });

  var DOM = React.DOM;
  var Button = ReactBootstrap.Button;
  var Input = ReactBootstrap.Input;
  var Grid = ReactBootstrap.Grid;
  var Col = ReactBootstrap.Col;
  var Table = ReactBootstrap.Table;
  var Label = ReactBootstrap.Label;


  var SimulatorApp = React.createClass({
    getInitialState: function () {
      var wdcCommandSimulator = this.initializeWdcCommandSimulator();

      return {
        wdcUrl: '../Examples/StockQuoteConnector_final.html',
        wdcUrlDisabled: false,
        wdcCommandSimulator: wdcCommandSimulator,
        wdcContinueInteractiveToDataGatherPhase: true,
        openWindow: null,
        simulatorFrame: null,
        shouldHaveGatherDataFrame: false
      };
    },
    render: function () {
      var wdcCommandSim = this.state.wdcCommandSimulator;

      var clearButton = Button.element({ onClick: this.clearAddressBar }, 'Clear');
      var inProgressLabel = Label.element({ bsStyle: 'info' }, 'In Progress');

      var isInProgress = wdcCommandSim.phaseState.inProgress;

      var interactiveStateInProgress = isInProgress
                                    && wdcCommandSim.state.currentPhase === WdcCommandSimulator.Phase.INTERACTIVE;

      var dataGatheringStateInProgress = isInProgress
                                      && wdcCommandSim.state.currentPhase === WdcCommandSimulator.Phase.GATHER_DATA;

      var isWDCUrlEmpty = (this.state.wdcUrl === '');

      return (
        DOM.div({ className: 'simulator-app' },
          DOM.div({ className: 'navbar navbar-default' },
            DOM.img({ className: 'tableau-logo', src: 'tableau_logo.png', style: { height: 40, width: 40, margin: 10 } }),
            DOM.h2({ style: { display: 'inline', verticalAlign: 'middle' } }, 'Web Data Connector Simulator')
          ),
          Grid.element({ fluid: true },

            Col.element({ md: 12, className: 'address-bar' },
              Input.element({
                type: 'text', disabled: isInProgress, label: 'WDC URL',
                value: this.state.wdcUrl, onChange: this.setWdcUrl, buttonAfter: clearButton
              })
            ),

            Col.element({ md: 6, className: 'data-gather-phase' },
              PhaseTitle.element({ title: 'Phase 1: Interactive', isInProgress: interactiveStateInProgress }),
              DOM.div({},
                Button.element({ onClick: this.startInteractivePhase, disabled: isInProgress || isWDCUrlEmpty }, 'Run Interactive Phase'),
                interactiveStateInProgress ? Button.element({ onClick: this.cancelCurrentPhase }, 'Cancel Interactive Phase') : null
              ),
              Input.element({
                type: 'checkbox', label: 'Automatically continue To data gather phase (to simulate normal WDC behavior).',
                checked: this.state.wdcContinueInteractiveToDataGatherPhase,
                onChange: this.setWdcContinueToDataGatherPhase
              }),

              PhaseTitle.element({ title: 'Phase 2: Data Gathering', isInProgress: dataGatheringStateInProgress }),
              Button.element({ onClick: this.gatherData, disabled: isInProgress || isWDCUrlEmpty }, 'Run Gather Data'),
              dataGatheringStateInProgress ? Button.element({ onClick: this.cancelCurrentPhase }, 'Cancel Gather Data Phase') : null,

              wdcCommandSim.canDoAnIncrementalRefresh()
                ? Button.element({ onClick: this.incrementalRefresh, disabled: isInProgress }, 'Run Incremental Refresh')
                : null
            ),

            Col.element({ md: 6, className: 'interactive-phase' },
              DOM.h2({}, 'Web Data Connector Properties'),

              SimulatorProperties.element({
                disabled: isInProgress,
                wdcProps: this.state.wdcCommandSimulator.props,
                onPropsChange: this.onWdcPropsModelChange
              })
            ),

            Col.element({ md: 12, className: 'hr-col' },
              DOM.hr({})
            ),

            wdcCommandSim.hasData()
              ? Col.element({ md: 12, className: 'results-table' },
                  TablePreview.element(this.state.wdcCommandSimulator.tableData)
                )
              : Col.element({ md: 12, className: 'no-results-label' },
                  dataGatheringStateInProgress ? Label.element({}, 'Data Gather in Progress')
                    : Label.element({}, ' No Data Gathered')
                )
          ),

          // Add the gather data iframe
          this.state.shouldHaveGatherDataFrame
            ? DOM.iframe({ style: {display: 'none'}, src: this.state.wdcUrl, ref: this.gatherDataFrameMounted })
            : null
        )
      );
    },
    componentDidMount: function() {
      var _this = this;
      window.addEventListener('unload', function() {
        if(_this.state.openWindow) _this.state.openWindow.close();
      }, false);
    },

    // Non-react methods

    // SIMULATOR COMMAND BINDINGS

    initializeWdcCommandSimulator: function() {
      var wdcCommandSimulator = new WdcCommandSimulator();

      // Link up postMessage bindings
      wdcCommandSimulator.sendPostMessage = this.sendPostMessage;
      window.addEventListener('message', this.onPostMessage, false);

      // Link up state change listeners
      wdcCommandSimulator.onEvent = this.onSimulatorCommandEvent;
      wdcCommandSimulator.onPhaseChange = this.onSimulatorCommandPhaseChange;

      return wdcCommandSimulator;
    },

    sendPostMessage: function(payload) {
      var simWindow = this.getSimulatorWindow();
      if(!simWindow) return;

      simWindow.postMessage(payload, '*');
    },

    onPostMessage: function(evt) {
      this.state.wdcCommandSimulator.receivePostMessage(evt.data);
    },

    onSimulatorCommandEvent: function(direction, eventName, eventData) {
      //console.log(arguments);

      var wdcSim = this.state.wdcCommandSimulator;

      // Close down the simulator windows if wdcCommandSimulator is no longer in progress after this event
      if(!wdcSim.phaseState.inProgress) {
        this.closeSimulatorWindowAndGatherDataFrame();

        if(wdcSim.state.currentPhase === WdcCommandSimulator.Phase.INTERACTIVE
          && this.state.wdcContinueInteractiveToDataGatherPhase)
        {
          this.gatherData();
        }
      }

      // Reassign wdcCommandSimulator to trigger state updates after events complete
      this.setState({ wdcCommandSimulator: this.state.wdcCommandSimulator });
    },

    onSimulatorCommandPhaseChange: function(previousPhase, currentPhase) {
      this.closeSimulatorWindowAndGatherDataFrame();
    },

    // SIMULATOR WINDOW METHODS

    applyWdcCommandSimulatorChanges: function(cb) {
      this.setState({ wdcCommandSimulator: this.state.wdcCommandSimulator }, cb || NOOP);
    },

    getSimulatorWindow: function() {
      return this.state.openWindow
        || (this.state.simulatorFrame && this.state.simulatorFrame.contentWindow)
        || null;
    },

    closeSimulatorWindowAndGatherDataFrame: function(complete) {
      if(!_.isFunction(complete)) complete = NOOP;

      if(this.state.openWindow) this.state.openWindow.close();
      this.setState({ shouldHaveGatherDataFrame: false, openWindow: null }, complete.bind(this));
    },

    // URL AND SIMULATOR COMMAND STATE METHODS
    setWdcUrl: function(e) {
      this.setState({ wdcUrl: e.target.value });
    },

    setWdcContinueToDataGatherPhase: function(e) {
      this.setState({ wdcContinueInteractiveToDataGatherPhase: e.target.checked });
    },

    clearAddressBar: function() {
      this.state.wdcCommandSimulator.resetProps();
      this.setState({ wdcUrlDisabled: false, wdcUrl: '' });
    },

    unlockWdcProperties: function() {
      this.setState({ wdcUrlDisabled: false });
    },

    lockWdcProperties: function() {
      this.setState({ wdcUrlDisabled: true });
    },

    cancelCurrentPhase: function() {
      this.closeSimulatorWindowAndGatherDataFrame(function() {
        this.state.wdcCommandSimulator.resetPhaseState();
        this.applyWdcCommandSimulatorChanges();
      });
    },

    startInteractivePhase: function() {
      this.setState({ wdcUrlDisabled: true });

      var wdcSim = this.state.wdcCommandSimulator;

      wdcSim.resetTableData();
      wdcSim.setInteractivePhase();
      wdcSim.setInProgress();

      this.closeSimulatorWindowAndGatherDataFrame(function() {
        var windowProps = 'height=500,width=800';
        var openWindow = window.open(this.state.wdcUrl, 'simulator', SimulatorApp.WINDOW_PROPS);
        this.setState({ openWindow: openWindow });
      });
    },

    // WDC USER PROPERTIES METHODS

    onWdcPropsModelChange: function(newPropsModel) {
      this.state.wdcCommandSimulator.applyProps(newPropsModel);
      this.applyWdcCommandSimulatorChanges();
    },

    // GATHER DATA PHASE METHODS

    gatherData: function() {
      this.state.wdcCommandSimulator.resetTableData();
      this.startGatherDataPhase();
    },

    incrementalRefresh: function() {
      this.startGatherDataPhase();
    },

    startGatherDataPhase: function() {
      this.state.wdcCommandSimulator.setGatherDataPhase();
      this.state.wdcCommandSimulator.setInProgress();

      this.setState({ wdcUrlDisabled: true, wdcCommandSimulator: this.state.wdcCommandSimulator }, function() {
        this.closeSimulatorWindowAndGatherDataFrame(function() {
          this.setState({ shouldHaveGatherDataFrame: true });
        });
      });
    },

    gatherDataFrameMounted: function(iframe) {
      this.setState({ simulatorFrame: iframe });
    }
  });
  SimulatorApp.element = React.createFactory(SimulatorApp);
  SimulatorApp.WINDOW_PROPS = 'height=500,width=800';



  var PhaseTitle = React.createClass({
    render: function() {
      var inProgressStyle = {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: 10,
        marginTop: 20, // Needed to match h2
        marginBottom: 10 // Needed to match h2
      };

      return (
        DOM.div({},
          DOM.h2({ style: { verticalAlign: 'middle', display: 'inline-block' }}, this.props.title),
          this.props.isInProgress ? Label.element({ bsStyle: 'info', style: inProgressStyle }, 'In Progress') : null
        )
      )
    }
  });
  PhaseTitle.element = React.createFactory(PhaseTitle);


  var SimulatorProperties = React.createClass({
    getInitialState: function () {
      return this.propsToState(this.props);
    },
    render: function () {
      var key = SimulatorProperties.PropertyKey;

      return (
        DOM.div({ className: 'data-gather-properties' },
          DOM.div({style: { marginBottom: '8px' }},
            Button.element({ onClick: this.clearProperties, disabled: this.props.disabled }, 'Clear Properties')
          ),

          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Connection Name', valueLink: this.linkState(key.CONNECTION_NAME) }),
          Input.element({ type: 'textarea', disabled: this.props.disabled, label: 'Connection Data', valueLink: this.linkState(key.CONNECTION_DATA) }),
          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Username',        valueLink: this.linkState(key.USERNAME) }),
          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Password',        valueLink: this.linkState(key.PASSWORD) }),
          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Incremental Refresh Column', valueLink: this.linkState(key.INCREMENTAL_EXTRACT_COLUMN) })
        )
      );
    },
    componentWillReceiveProps: function(nextProps) {
      var newState = this.propsToState(nextProps);

      if(!_.isEqual(this.state, newState)) { // Prevents infinite loop by only setting state on changes
        this.setStateAndNotify(newState);
      }
    },
    linkState: function(key) {
      var _this = this;
      return {
        value: this.state[key],
        requestChange: function(newValue) {
          var stateChanges = _.object([[key, newValue]]);
          _this.setStateAndNotify(stateChanges);
        }
      }
    },

    // Non-react methods
    propsToState: function(props) {
      var state = {};
      var previousState = this.state || {};
      _.forEach(SimulatorProperties.PropertyKey, function(propKey) {
        var newPropValue = props.wdcProps && props.wdcProps[propKey];

        if(!_(newPropValue).isString()) {
          newPropValue = previousState[propKey];
        }

        state[propKey] = newPropValue || '';
      });
      return state;
    },

    getProperties: function() {
      var wdcProps = {};
      var state = this.state;

      // Initialize properties to state
      _.forEach(SimulatorProperties.PropertyKey, function(propKey) { wdcProps[propKey] = state[propKey]; });

      return wdcProps;
    },
    setStateAndNotify: function(newState) {
      this.setState(newState, function() {
        this.props.onPropsChange(this.state);
      });
    },

    clearProperties: function() {
      var newState = {};
      _.forEach(SimulatorProperties.PropertyKey, function(propKey) { newState[propKey] = ''; });
      this.setStateAndNotify(newState);
    }
  });
  SimulatorProperties.element = React.createFactory(SimulatorProperties);

  SimulatorProperties.PropertyKey = {
    CONNECTION_NAME: 'connectionName',
    CONNECTION_DATA: 'connectionData',
    USERNAME: 'username',
    PASSWORD: 'password',
    INCREMENTAL_EXTRACT_COLUMN: 'incrementalExtractColumn'
  };

  var tableRowKey = 1;
  var TablePreview = React.createClass({
    render: function () {
      if(!this.props || !this.props.headerTitles || this.props.headerTitles.length === 0) return null;

      var props = this.props;
      var tableHeader = this.props.headerTitles;
      var tableMatrix = this.props.table;

      var tableElements = tableMatrix.slice(0, TablePreview.MAX_ROWS).map(function(row) {
        return DOM.tr({ key: tableRowKey++ },
          row.map(function(cellVal) {
            return DOM.td({ key: tableRowKey++ }, cellVal);
          })
        )
      });

      if(tableMatrix.length > tableElements.length) {
        tableElement.push(
          DOM.tr({ key: tableRowKey++ },
            DOM.td({ colSpan: tableHeader.length }, 'Not all data displayed.  Only displaying the first ' + TablePreview.MAX_ROWS + ' rows for performance.')
          )
        );
      }

      return (
        Table.element({ bordered: true, condensed: true },
          DOM.thead(null,
            DOM.tr(null,
              tableHeader.map(function(headerName) {
                return DOM.th({ key: tableRowKey++ }, headerName);
              })
            )
          ),
          DOM.tbody(null, tableElements)
        )
      );
    }
  });

  TablePreview.element = React.createFactory(TablePreview);
  TablePreview.MAX_ROWS = Infinity; //5000;


  window.Tableau = {
    WdcCommandSimulator: WdcCommandSimulator,
    TablePreview: TablePreview,
    SimulatorProperties: SimulatorProperties,
    SimulatorApp: SimulatorApp
  };

})(_, React, ReactBootstrap);
