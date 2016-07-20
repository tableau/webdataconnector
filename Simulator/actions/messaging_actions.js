import { eventNames, phases } from '../utils/consts';
import { validateData, validateSchema } from '../utils/validation.js';
import * as simulatorActions from './simulator_actions';

// Receiving Message Thunks
export function receiveMessage(payload) {
  // Routes received messages to other thunks as necessary
  return (dispatch, getState) => {
    try {
      const { msgData, msgName, props: attrs, version } = JSON.parse(payload.data);

      if (version === '1.1.0' || version === '1.1.1') {
        const errmsg = 'this simulator only supports wdcs that are ' +
                       'using version 2.0 of the api or later, your ' +
                       `wdc\'s version is: ${version}`;
        toastr.error(errmsg, 'unsupported wdc version error:');
      }

      const { wdcAttrs } = getState();
      if (attrs) {
        // Merge new attributes into old to deal with various versions of the shim and simulator
        // exposing different attributes
        dispatch(simulatorActions.setWdcAttrs({ ...wdcAttrs, ...attrs }));
      }

      switch (msgName) {
        case eventNames.LOG: {
          dispatch(handleLog(msgData.logMsg));
          break;
        }

        case eventNames.LOADED: {
          dispatch(handleLoaded(version));
          handleLoaded();
          break;
        }

        case eventNames.INIT_CB: {
          dispatch(handleInit());
          break;
        }

        case eventNames.SUBMIT: {
          dispatch(handleSubmit());
          break;
        }

        case eventNames.SCHEMA_CB: {
          const schema = msgData.schema;
          dispatch(handleSchemaCallback(schema));
          break;
        }

        case eventNames.DATA_CB: {
          const tableName = msgData.tableName;
          const data = msgData.data;
          dispatch(handleDataCallback(tableName, data));
          break;
        }

        case eventNames.SHUTDOWN_CB: {
          dispatch(handleShutdownCallback());
          break;
        }

        case eventNames.ABORT: {
          const errorMsg = msgData.errorMsg;
          dispatch(handleAbort(errorMsg));
          break;
        }

        case eventNames.DATA_DONE_CB: {
          dispatch(handleDataDoneCallback());
          break;
        }

        case eventNames.ABORT_AUTH: {
          const errorMsg = msgData.errorMsg;
          dispatch(handleAbortForAuth(errorMsg));
          break;
        }
        default: {
          // The message was not for the simulator, ignore it.
          break;
        }
      }
    } catch (e) {
      // The message was not for the simulator, ignore it.
      return;
    }
  };
}

export function handleLog(msg) {
  return () => {
    /* eslint-disable no-console */
    console.log(msg);
    /* eslint-enable no-console */
  };
}

export function handleLoaded() {
  return (dispatch) => {
    dispatch(sendInit());
  };
}

export function handleInit() {
  return (dispatch, getState) => {
    const { currentPhase } = getState();
    dispatch(simulatorActions.setPhaseInitCallbackCalled(true));
    dispatch(simulatorActions.setPhaseInProgress(true));
    // If we are in the Gather Data Phase, ask wdc for headers
    if (currentPhase === phases.GATHER_DATA) {
      dispatch(sendGetHeaders());
    }
  };
}

export function handleSubmit() {
  return (dispatch, getState) => {
    const { currentPhase } = getState();
    // Clean up simulator and start Data Gather Phase unless we are
    // already in it
    if (currentPhase !== phases.GATHER_DATA) {
      dispatch(simulatorActions.setPhaseSubmitCalled(true));
      dispatch(simulatorActions.setPhaseInProgress(false));
      dispatch(simulatorActions.closeSimulatorWindow());
      dispatch(simulatorActions.resetTables());
      dispatch(simulatorActions.startGatherDataPhase());
    }
  };
}

export function handleSchemaCallback(schema) {
  return (dispatch, getState) => {
    // Validate schema, and populate store with new table objects
    // using the schema info
    const { wdcShouldFetchAllTables } = getState();
    if (validateSchema(schema)) {
      const newTables = schema.reduce((tables, tableInfo) => {
        const newTable = {
          schema: tableInfo,
          data: [],
        };

        return { ...tables, [tableInfo.id]: newTable };
      }, {});
      dispatch(simulatorActions.addTables(newTables));

      // if we are supposed to automatically fetch the tables, do it
      if (wdcShouldFetchAllTables) {
        dispatch(fetchAllData());
      } else {
        // We we aren't going to fetch immediately
        // consider the phase paused until the getGeta
        // message is sent. This is so we can properly
        // disable the Fetch Data button
        dispatch(simulatorActions.setPhaseInProgress(false));
      }
    } else {
      toastr.error('Please see debug console for details.', 'WDC Validation Error');
    }
  };
}

export function handleDataCallback(tableName, data) {
  return (dispatch, getState) => {
    // if data is valid, add it to the appropriate tables object in the store
    if (validateData(data)) {
      const { tables } = getState();
      const newTables = Object.assign({}, tables);
      newTables[tableName].data = newTables[tableName].data.concat(data);
      dispatch(simulatorActions.setTables(newTables));
    } else {
      toastr.error('Please see debug console for details.', 'WDC Validation Error');
    }
  };
}

export function handleDataDoneCallback() {
  return (dispatch) => {
    // Tell the wdc to shutdown now that we have our data
    dispatch(sendShutdown());
  };
}

export function handleShutdownCallback() {
  return (dispatch) => {
    // Wdc has told us it's shutdown, end our phase
    dispatch(simulatorActions.setPhaseInProgress(false));
  };
}

export function handleAbort(errMsg) {
  return (dispatch) => {
    // Something went wrong, end phase, alert user
    dispatch(simulatorActions.setPhaseInProgress(false));
    console.error(errMsg);
    toastr.error(errMsg, 'The WDC reported an error:');
  };
}

export function handleAbortForAuth(errMsg) {
  return (dispatch) => {
    // Need auth, close the simulator, tell the user
    const toastTitle = 'The WDC has been aborted for auth, ' +
                     'use the "Start Auth Phase" to test ' +
                     'your WDC Auth Mode:';
    dispatch(simulatorActions.setPhaseInProgress(false));
    dispatch(simulatorActions.closeSimulatorWindow());
    toastr.error(errMsg, toastTitle);
  };
}

// Send message thunks
export function sendMessage(messageName, payload = {}) {
  return (dispatch, getState) => {
    // Construct payload and send info to whichever
    // window we are posting too
    const { simulatorWindow, wdcAttrs } = getState();
    const messagePayload = JSON.stringify({
      msgName: messageName,
      msgData: payload,
      props: wdcAttrs,
    });
    simulatorWindow.postMessage(messagePayload, '*');
  };
}

export function sendInit() {
  return (dispatch, getState) => {
    const { currentPhase } = getState();
    dispatch(sendMessage(eventNames.INIT, { phase: currentPhase }));
  };
}

export function sendGetHeaders() {
  return (dispatch) => {
    dispatch(sendMessage(eventNames.SCHEMA_GET));
  };
}

// Takes an array of tableuInfo/incValue pairs
export function sendGetData(tablesAndIncrementValues, isFreshFetch) {
  return (dispatch) => {
    if (isFreshFetch) {
      const tableKey = tablesAndIncrementValues[0].tableInfo.id;
      dispatch(simulatorActions.resetTableData(tableKey));
    }

    dispatch(sendMessage(eventNames.DATA_GET, { tablesAndIncrementValues }));
    dispatch(simulatorActions.setPhaseInProgress(true));
  };
}

export function sendShutdown() {
  return (dispatch) => {
    dispatch(sendMessage(eventNames.SHUTDOWN));
  };
}

export function fetchAllData() {
  return (dispatch, getState) => {
    // Loop through our tables and tell the wdc to give us the data
    // for each of them
    const { tables } = getState();
    Object.keys(tables).forEach(key => {
      dispatch(sendGetData([{ tableInfo: tables[key].schema }]));
    });
  };
}
