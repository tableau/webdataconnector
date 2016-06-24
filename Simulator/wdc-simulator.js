(function(_, React, ReactBootstrap) {
  var NOOP = function(){};

  function verifyCanRunWdcVersion(wdcApiVersion) {
    if(wdcApiVersion === "1.1.0" || wdcApiVersion === "1.1.1") {
      var errMsg = 'This simulator only supports WDCs that are using version 2.0 of the API or later, your WDC\'s version is: ' + wdcApiVersion;
      toastr.error(errMsg, 'Unsupported WDC Version Error:')
    }
  }
   
  function getConnectorURL() {
    try {
      // build an anchor object out of the url so it is easy to parse
      var docLink = $('<a>', { href:document.URL } )[0];
      var q = docLink.search.substring(1);
      if (q) {
        // use some regexes to turn the query into json, then parse the json
        var params = JSON.parse('{"' + decodeURI(q).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        var src = params.src;
        if (src && src.length > 0) {
          return src;
        }
      }
    } catch (err) {
      var msg =
      msg += "Error description: " + err.message + "\n\n";
      msg += "Please specify the connector on url line: e.g.\n\n";
      msg += "Simulator.html?src=ExampleConnector.html.\n\n";
      console.log(msg);
    }

    // Set the default connector here
    return "../Examples/html/earthquakeUSGS.html";
  }
  
  function WdcCommandSimulator(/*ISendPostMessage*/ sendPostMessage, /*IPhaseChangeHandler*/ onPhaseChange, /*IEventHandler*/ onEvent, /*ILogger*/ logger) {

    // Properties that are exposed to the user on the tableau object in the WDC
    // These are usually defined in the interactive phase
    this.resetProps();

    // Internal state of the WDC.  This may be referenced  but should not be set directly outside of this class.
    // This state may be across multiple phases and will simulate persisted information
    this.resetState();

    this.resetPhaseState();

    this.resetTables();

    this.currentPhase = WdcCommandSimulator.Phase.INTERACTIVE;

    this.sendPostMessage = sendPostMessage || NOOP;
    this.onEvent = onEvent || NOOP;
    this.onPhaseChange = onPhaseChange || NOOP;
    this.logger = logger || window.console;
  }

  WdcCommandSimulator.EventName = {
    LOADED:       "loaded",
    LOG:          "log",
    INIT:         "init",
    INIT_CB:      "initCallback",
    SUBMIT:       "submit",
    SCHEMA_GET:   "getSchema",
    SCHEMA_CB:    "_schemaCallback",
    DATA_GET:     "getData",
    DATA_CB:      "_tableDataCallback",
    DATA_DONE_CB: "_dataDoneCallback",
    SHUTDOWN:     "shutdown",
    SHUTDOWN_CB:  "shutdownCallback",
    ABORT:        "abortWithError",
    ABORT_AUTH:   "abortForAuth"
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
  
  function TableObject() {
    this.schema = [];
    this.data = [];
  }
  
  // Instance methods
  _.extend(WdcCommandSimulator.prototype, {

    resetProps: function() {
      this.props ={};
      this.applyProps({
        connectionName: '',
        connectionData: '',
        username: '',
        password: ''
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
        initCallbackWasCalled: false
      };
    },

    // Tables is the main data structure for the the simulator
    // Tables is a dictonary with the following structure:
    //      key: wdc table id
    //      value: tableObject
    resetTables: function() {
      this.tables = {};
    },
    
    resetTableData: function(tableKey) {
      this.tables[tableKey].data = [];
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

        case WdcCommandSimulator.EventName.SCHEMA_CB:
          var schema = msgData.schema;
          this.handleSchemaCallback(schema);
          break;

        case WdcCommandSimulator.EventName.DATA_CB:
          var tableName =    msgData.tableName;
          var data =         msgData.data;
          this.handleDataCallback(tableName, data);
          break;

        case WdcCommandSimulator.EventName.SHUTDOWN_CB:
          this.handleShutdownCallback();
          break;

        case WdcCommandSimulator.EventName.ABORT:
          var errorMsg = msgData.errorMsg;
          this.handleAbort(errorMsg);
          break;
          
        case WdcCommandSimulator.EventName.DATA_DONE_CB:
          this.handleDataDoneCallback();
          break;

        case WdcCommandSimulator.EventName.ABORT_AUTH:
          var errorMsg = msgData.errorMsg;
          this.handleAbortForAuth(errorMsg);
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
      };
    },

    applyProps: function(props) {
      if(!this.isValidProps(props)) return;

      this.props.connectionName = props.connectionName;
      this.props.connectionData = props.connectionData;
      this.props.username = props.username;
      this.props.password = props.password;
    },

    // TODO: Verify props passed in are acceptable
    // currently only returns true if something is passed in, may need to do more like check if the value is a string
    isValidProps: function(props) {
      return !!props && !_.isEmpty(props);
    },

    // POSTED METHOD HANDLERS

    handleLog: function(msg) {
      this.logger.log(msg);
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

    handleSchemaCallback: function(schema) {
      var schemaValid = this.validateSchema(schema)
      
      if (schemaValid) {   
        var tables = this.tables;
        _.forEach(schema, function(tableInfo) {
            var table = new TableObject();
            table.schema = tableInfo;
        
            tables[tableInfo.id] = table;
        });
      } else {
        toastr.error("Please see debug console for details.", 'WDC Validation Error')
      }
      
      this.phaseState.inProgress = false;
    },

    handleDataCallback: function(tableName, data) {
      var dataValid = this.validateData(data)

      if (dataValid) {
        this.tables[tableName].data = this.tables[tableName].data.concat(data);
      } else {
        toastr.error("Please see debug console for details.", 'WDC Validation Error')
      }
    },
    
    handleDataDoneCallback: function() {
        this.phaseState.inProgress = false;
        this.logger.log('No More Data');
        this.sendShutdown();
    },

    handleShutdownCallback: function() {
      this.phaseState.inProgress = false;
    },

    handleAbort: function(errMsg) {
      this.phaseState.inProgress = false;
      this.logger.error(errMsg);
      toastr.error(errMsg, 'The WDC reported an error:')
    },

    handleAbortForAuth: function(errMsg) {
      this.phaseState.submitWasCalled = true;
      toastr.error(errMsg, 'The WDC has been aborted for auth, use the "Start Auth Phase" to test your WDC Auth Mode:')
    },

    // MESSAGES TO SEND TO CLIENT
    sendInit: function() {
      this.sendMessage(WdcCommandSimulator.EventName.INIT, { phase: this.state.currentPhase });
    },

    sendGetHeaders: function() {
      this.sendMessage(WdcCommandSimulator.EventName.SCHEMA_GET);
    },

    // Takes an array of tableuInfo/incValue paris
    sendGetData: function(tablesAndIncrementValues, isFreshFetch) {
      if (isFreshFetch) {
        tableKey = tablesAndIncrementValues[0].tableInfo.id;
        this.resetTableData(tableKey);
      }
      
      this.sendMessage(WdcCommandSimulator.EventName.DATA_GET, { tablesAndIncrementValues: tablesAndIncrementValues });
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
    
    setCurrentPhase: function(phase) {
      if(!_.contains(WdcCommandSimulator.Phase, phase)) return;

      var previousPhase = this.state.currentPhase;
      this.state.currentPhase = phase;

      this.resetPhaseState();

      this.onPhaseChange(previousPhase, phase);
    },

    validateData: function(data) {
      var i;
      var entry;
      
      if (validate.isArray(data)) {
        for (i = 0; i < data.length; i++) {
          entry = data[i];
          if ( !(validate.isArray(entry) || validate.isObject(entry)) ) {
            console.error("Each entry within the array passed through table.appendRows must be an array or object.");
            return false;
          }
        }
      } else {
        console.error("table.appendRows must be passed an array.");
        return false;
      }
   
      return true;
    },
    
    validateSchema: function(schema) {
      var errors;
      var hasTableErrors = false;
      var hasColumnErrors = false;
      
      var tableConstraints = {
        id: {
          presence: true
        },
        columns: {
          presence: true
        }
      };
      
      var columnConstraints = {
        id: {
          presence: true
        },
        dataType: {
          presence: true
        }
      };
      
      _.forEach(schema, function(table) {
        errors = validate(table, tableConstraints);
        hasTableErrors = (errors !== undefined);
        
        if (!hasTableErrors) {
          // table is valid, now check each column
          _.forEach(table.columns, function(column) {
            errors = validate(column, columnConstraints);
          });
          
          hasColumnErrors = (errors !== undefined);
        }
        
        if (hasTableErrors || hasColumnErrors) {
          // If there were errors in either table of column validation, log them all
          _.forEach(Object.keys(errors), function(key) {
            _.forEach(errors[key], function(error) {
              console.error(error); 
            });
          });
        }
      });  
      
      // Errors will be undefined if all validation checks passed
      return (errors === undefined);
    },
    
    //////////// External methods ///////////
    setInteractivePhase: function() {
      this.setCurrentPhase(WdcCommandSimulator.Phase.INTERACTIVE);
    },

    setGatherDataPhase: function() {
      this.setCurrentPhase(WdcCommandSimulator.Phase.GATHER_DATA);
    },

    setAuthPhase: function() {
      this.setCurrentPhase(WdcCommandSimulator.Phase.AUTH);
    },

    hasData: function() {
      return !!this.tables && Object.keys(this.tables).length > 0;
    },

    setInProgress: function() {
      this.phaseState.inProgress = true;
    },
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
  var Collapse = ReactBootstrap.Collapse;

  var SimulatorApp = React.createClass({
    getInitialState: function () {
      var wdcCommandSimulator = this.initializeWdcCommandSimulator();

      return {
        wdcUrl: getConnectorURL(),
        wdcUrlDisabled: false,
        wdcCommandSimulator: wdcCommandSimulator,
        wdcShouldFetchAllTables: false,
        openWindow: null,
        simulatorFrame: null,
        shouldHaveGatherDataFrame: false
      };
    },
    render: function () {
      var wdcCommandSim = this.state.wdcCommandSimulator;

      var resetButton = Button.element({ onClick: this.resetSimulator }, 'Reset');

      var isInProgress = wdcCommandSim.phaseState.inProgress;

      var interactiveStateInProgress = isInProgress && wdcCommandSim.state.currentPhase === WdcCommandSimulator.Phase.INTERACTIVE;

      var dataGatheringStateInProgress = isInProgress && wdcCommandSim.state.currentPhase === WdcCommandSimulator.Phase.GATHER_DATA;

      var inDataGatherPhase = wdcCommandSim.state.currentPhase === WdcCommandSimulator.Phase.GATHER_DATA;

      var isWDCUrlEmpty = (this.state.wdcUrl === '');

      var startAuthPhase = this.startPhase.bind(this, WdcCommandSimulator.Phase.AUTH);

      var startInteractivePhase = this.startPhase.bind(this, WdcCommandSimulator.Phase.INTERACTIVE);
      return (
        DOM.div({ className: 'simulator-app' },
          DOM.div({ className: 'navbar navbar-default' },
            DOM.img({ className: 'tableau-logo', src: 'tableau_logo.png', style: { height: 40, width: 40, margin: 10 } }),
            DOM.h2({ style: { display: 'inline', verticalAlign: 'middle' } }, 'Web Data Connector Simulator 2.0')
          ),
          Grid.element({ fluid: true },

            Col.element({ md: 12, className: 'address-bar' },
              Input.element({
                type: 'text', disabled: inDataGatherPhase, label: 'WDC URL',
                value: this.state.wdcUrl, onChange: this.setWdcUrl, buttonAfter: resetButton
              })
            ),

            Col.element({ md: 6, className: 'run-connector' },
              PhaseTitle.element({ title: 'Run Connector', isInProgress: interactiveStateInProgress }),
              DOM.div({},
                Button.element({ onClick: startInteractivePhase, bsStyle: 'success', disabled: isInProgress || isWDCUrlEmpty }, 'Start Interactive Phase'),
                Button.element({ onClick: startAuthPhase, bsStyle: 'success', style: { marginLeft: '4px' }, disabled: isInProgress || isWDCUrlEmpty }, 'Start Auth Phase'),
                interactiveStateInProgress ? Button.element({ onClick: this.cancelCurrentPhase,
                                                              style: { marginLeft: '4px' } }, 'Abort') : null
              ),
              Input.element({
                type: 'checkbox', label: 'Automatically fetch data for all tables.',
                checked: this.state.wdcShouldFetchAllTables,
                onChange: this.setWdcShouldFetchAllTables
              })
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

            Col.element({ md: 12, className: 'table-header' },
              DOM.h2({}, 'Tables')
            ),

            wdcCommandSim.hasData() ?
                Col.element({ md: 12, className: 'results-tables' },
                    TableSection.element({ 
                        tables: this.state.wdcCommandSimulator.tables, 
                        getTableDataCallback: this.state.wdcCommandSimulator.sendGetData.bind(this.state.wdcCommandSimulator),
                        fetchInProgress: dataGatheringStateInProgress })
                )
              : Col.element({ md: 12, className: 'no-results-label' },
                  Label.element({}, ' No Data Gathered')
                )
             ),
            

          // Add the gather data iframe
          this.state.shouldHaveGatherDataFrame ? 
            DOM.iframe({ style: {display: 'none'}, src: this.state.wdcUrl, ref: this.gatherDataFrameMounted })
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
      var wdcSim = this.state.wdcCommandSimulator;
      
      switch(eventName) {
        case WdcCommandSimulator.EventName.SUBMIT:
          this.closeSimulatorWindowAndGatherDataFrame();
          this.gatherSchemaData();
          break;
        case WdcCommandSimulator.EventName.DATA_GET:
          if (!wdcSim.phaseState.inProgress) { 
            this.state.wdcCommandSimulator.setInProgress();
          } 
          break;
        case WdcCommandSimulator.EventName.SCHEMA_CB:
          if (this.state.wdcShouldFetchAllTables) {
            this.state.wdcCommandSimulator.setInProgress();
            this.fetchAllData(); 
          }
          break;
        case WdcCommandSimulator.EventName.ABORT_AUTH:
          this.closeSimulatorWindowAndGatherDataFrame();
          break;
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
      return this.state.openWindow || (this.state.simulatorFrame && this.state.simulatorFrame.contentWindow) || null;
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

    setWdcShouldFetchAllTables: function(e) {
      this.setState({ wdcShouldFetchAllTables: e.target.checked });
    },

    resetSimulator: function() {
      this.state.wdcCommandSimulator.resetState();
      this.state.wdcCommandSimulator.resetTables();
      this.state.wdcCommandSimulator.resetProps();
      
      this.setState({});
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

    startPhase: function(phaseName, e) {
      this.setState({ wdcUrlDisabled: true});

      var wdcSim = this.state.wdcCommandSimulator;

      wdcSim.resetTables();
      console.log(phaseName)
      if(phaseName === WdcCommandSimulator.Phase.INTERACTIVE) {
        wdcSim.setInteractivePhase();
      } 
      if(phaseName === WdcCommandSimulator.Phase.AUTH) {
        wdcSim.setAuthPhase();
      }
      wdcSim.setInProgress();

      this.closeSimulatorWindowAndGatherDataFrame(function() {
        var openWindow = window.open(this.state.wdcUrl, 'simulator', SimulatorApp.WINDOW_PROPS);
        this.setState({ openWindow: openWindow });
      });
    },
    
    fetchAllData: function() {
      var wdcSim = this.state.wdcCommandSimulator;
      _.forEach(Object.keys(wdcSim.tables), function(key) {
        wdcSim.sendGetData([{ tableInfo: wdcSim.tables[key].schema }]);
      });
    },

    // WDC USER PROPERTIES METHODS

    onWdcPropsModelChange: function(newPropsModel) {
      this.state.wdcCommandSimulator.applyProps(newPropsModel);
      this.applyWdcCommandSimulatorChanges();
    },

    // GATHER DATA PHASE METHODS
    gatherSchemaData: function() {
      this.state.wdcCommandSimulator.resetTables();
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
    propTypes: {
      title: React.PropTypes.string.isRequired
    },
    
    render: function() {
      return (
        DOM.div({},
          DOM.h2({ style: { verticalAlign: 'middle', display: 'inline-block' }}, this.props.title)
        )
      );
    }
  });
  PhaseTitle.element = React.createFactory(PhaseTitle);

  var SimulatorProperties = React.createClass({
    propTypes: {
      disabled: React.PropTypes.bool.isRequired,
      wdcProps: React.PropTypes.object.isRequired,
      onPropsChange: React.PropTypes.func.isRequired,
    },
    
    getInitialState: function () {
      return this.propsToState(this.props);
    },
    
    render: function () {
      var key = SimulatorProperties.PropertyKey;

      return (
        DOM.div({ className: 'data-gather-properties' },
          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Connection Name', valueLink: this.linkState(key.CONNECTION_NAME) }),
          Input.element({ type: 'textarea', disabled: this.props.disabled, label: 'Connection Data', valueLink: this.linkState(key.CONNECTION_DATA) }),
          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Username',        valueLink: this.linkState(key.USERNAME) }),
          Input.element({ type: 'text',     disabled: this.props.disabled, label: 'Password',        valueLink: this.linkState(key.PASSWORD) })
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
      };
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
    }
  });
  SimulatorProperties.element = React.createFactory(SimulatorProperties);
  SimulatorProperties.PropertyKey = {
    CONNECTION_NAME: 'connectionName',
    CONNECTION_DATA: 'connectionData',
    USERNAME: 'username',
    PASSWORD: 'password'
  };

  var TableSection = React.createClass({
    propTypes: {
      tables: React.PropTypes.object.isRequired,
      getTableDataCallback: React.PropTypes.func.isRequired,
      fetchInProgress: React.PropTypes.bool.isRequired
    },
 
    render: function () {
      var tablePreviewElements = [];
      var tables = this.props.tables;
      var fetchInProgress = this.props.fetchInProgress;
      var getTableDataCallback = this.props.getTableDataCallback;
      
      _.forEach(Object.keys(tables), function(key) {
        tablePreviewElements.push(TablePreview.element( { 
          key: key,
          tableInfo: tables[key].schema,
          tableData: tables[key].data,
          getTableDataCallback: getTableDataCallback,
          fetchInProgress: fetchInProgress
        }));
      });

      return (
        DOM.div({ className: 'table-section' },
          tablePreviewElements
        )
      );
    }      
  });
  TableSection.element = React.createFactory(TableSection);

  var TablePreview = React.createClass({    
    propTypes: {
      tableInfo: React.PropTypes.object.isRequired,
      tableData: React.PropTypes.array.isRequired,
      getTableDataCallback: React.PropTypes.func.isRequired,
      fetchInProgress: React.PropTypes.bool.isRequired
    },

    render: function () {
      if(!this.props || !this.props.tableInfo) return null;
      
      var tableInfo = this.props.tableInfo;
      var tableData = this.props.tableData;
      var hasData = tableData.length > 0;
      var canIncrementalUpdate = hasData && (tableInfo.incrementColumnId);
   
      var incColumn = (tableInfo.incrementColumnId) ?
        tableInfo.incrementColumnId : 'None';

      // Prep table of columnInfos for this TablePreview       
      var columnTableHeader = this.getMetadataHeader();
      var columnElements = this.getMetadataElements(tableInfo);
      
      // Prep table of actual data for this TableuPreview      
      var dataTableHeader = this.getDataHeader(tableInfo);
      var dataElements = this.getDataElements(tableData, dataTableHeader);
            
      return ( 
        DOM.div({ className: 'table-preview-' + tableInfo.id},
          DOM.h4({}, ['[',tableInfo.id,'].[',tableInfo.alias,']'].join('')),
            (tableInfo.incrementColumnId) ?
              DOM.p({}, tableInfo.description)
              : null,
            (tableInfo.incrementColumnId) ?
              DOM.p({}, 'Incremental Refresh Column: ' + incColumn) 
              : null,
            CollapsibleTable.element({ 
              name: "Column Metadata",
              header: columnTableHeader,
              elements: columnElements
            }),
            (hasData) ?
              CollapsibleTable.element({ 
                name: "Table Data",
                header: dataTableHeader,
                elements: dataElements
              })
            : null,
            (!this.props.fetchInProgress) ?
              Button.element({ onClick: this.freshFetch, bsStyle: 'success'}, 'Fetch Table Data') :
              Button.element({ disabled: true, bsStyle: 'success'}, 'Fetching Table Data...'),
            canIncrementalUpdate ? Button.element({ onClick: this.incrementalRefresh,
                                                    style: { marginLeft: '4px' } }, 'Incremental Update') : null,

            DOM.hr({})
        )
      );
    },
    
    // Non-react methods
    incrementalRefresh() {
      this.fetchData(true);  
    },
    
    freshFetch() {
      this.fetchData(false);
    },
    
    fetchData: function(isIncremental) {            
      var tableInfo = this.props.tableInfo;
      var tableData = this.props.tableData;
      var tablesAndIncValues = [];
      
      var lastElement = tableData[tableData.length - 1];
      
      var incrementValue;
      if (isIncremental && lastElement) {
        incrementValue = lastElement[tableInfo.incrementColumnId];
      }
      
      tablesAndIncValues.push({ tableInfo: tableInfo, 
                                incrementValue: incrementValue });

      // getTableCallback takes (tablesAndIncValues, isFreshFetch)
      this.props.getTableDataCallback(tablesAndIncValues, !isIncremental);
    }, 
    
    getMetadataHeader() {
      var key = TablePreview.PropertyKey;
      var columnTableHeader = [];
      
      columnTableHeader.push(key.ID_HEADER);
      columnTableHeader.push(key.TYPE_HEADER);
      columnTableHeader.push(key.ALIAS_HEADER);
      columnTableHeader.push(key.DESCRIPTION_HEADER);
      
      return columnTableHeader;
    },
    
    getMetadataElements(tableInfo) {
      var columnTableRowKey = 1;    
      var columnElements = tableInfo.columns.map(function(columnInfo) {
        var row = [];
        row[0] = columnInfo.id;
        row[1] = columnInfo.dataType;
        row[2] = (columnInfo.alias) ? columnInfo.alias : '-';
        row[3] = (columnInfo.description) ? columnInfo.description : '-';
        
        return DOM.tr({ key: columnTableRowKey++ },
          row.map(function(cellVal) {
            return DOM.td({ key: columnTableRowKey++ }, cellVal);
          })
        );
      });
      
      return columnElements;
    },
    
    getDataHeader(tableInfo) {
      var dataTableHeader = [];
      _.forEach(tableInfo.columns, function(column) {
          dataTableHeader.push(column.id);
      });
      
      return dataTableHeader;  
    },
    
    getDataElements(tableData, schema) {
      var dataTableRowKey = 0;
      var dataTableColKey = 0;
      var dataElements = [];
      var cellValue;

      if (tableData) { // We may not fetched any data yet
        dataElements = tableData.slice(0, TablePreview.MAX_ROWS).map(function(row) {
          dataTableColKey = 0;
          return DOM.tr({ key: dataTableRowKey++ },
            schema.map(function(header) {
              // We can accept either an array of objects or an array of arrays
              // First we check for the object case
              if (_.isUndefined(row[header])) {
                if (_.isUndefined(row[dataTableColKey])) {
                  // If it's not an object, and there is no value in the array for this index, use a placeholder
                  cellValue = "-";
                } else {
                  // This is an array and there is a value
                  cellValue = row[dataTableColKey];
                }
              } else {
                // This is the object condition, just grab the value from the map.
                cellValue = row[header];
              }

              return DOM.td({ key: dataTableColKey++ }, String(cellValue));
            })
          );
        });
      }
      
      return dataElements;
    }
  });
  TablePreview.element = React.createFactory(TablePreview);
  TablePreview.MAX_ROWS = Infinity; //5000;
  TablePreview.PropertyKey = {
    ID_HEADER: 'ID',
    TYPE_HEADER: 'Type',
    ALIAS_HEADER: 'Alias',
    DESCRIPTION_HEADER: 'Description'
  };

  var CollapsibleTable = React.createClass({ 
    propTypes: {
      name: React.PropTypes.string.isRequired,
      header: React.PropTypes.array.isRequired,
      elements: React.PropTypes.array.isRequired
    },
       
    getInitialState: function () {
        return {
          collapsed: false,
        };
    },

    toggleCollapse: function() {
       this.setState({ collapsed: !this.state.collapsed });
    },
    
    render: function () {
      var incRowKey = 1;
      return (
        DOM.div({ className: 'table-preview-' + this.props.name},
          DOM.h5({}, this.props.name),
          Button.element({ onClick: this.toggleCollapse }, 
            (this.state.collapsed) ? 'Show' : 'Hide'),
            
          Collapse.element({ in: !this.state.collapsed }, 
            DOM.div({},
              Table.element({ bordered: true, condensed: true, striped: true },
              DOM.thead(null,
                DOM.tr(null,
                  this.props.header.map(function(headerName) {
                    return DOM.th({ key: incRowKey++ }, headerName);
                  })
                )
              ),
              DOM.tbody(null, this.props.elements)
              )
            )
          )
        )
      );
    }
  });
  CollapsibleTable.element = React.createFactory(CollapsibleTable);

  window.Tableau = {
    WdcCommandSimulator: WdcCommandSimulator,
    TableSection: TableSection,
    TablePreview: TablePreview,
    SimulatorProperties: SimulatorProperties,
    SimulatorApp: SimulatorApp
  };
})(_, React, ReactBootstrap);
