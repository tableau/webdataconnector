import Cookie from 'js-cookie';

// Set Class Constants
export const eventNames = {
  LOADED: 'loaded',
  LOG: 'log',
  INIT: 'init',
  INIT_CB: 'initCallback',
  SUBMIT: 'submit',
  SCHEMA_GET: 'getSchema',
  SCHEMA_CB: '_schemaCallback',
  DATA_GET: 'getData',
  DATA_CB: '_tableDataCallback',
  DATA_DONE_CB: '_dataDoneCallback',
  SHUTDOWN: 'shutdown',
  SHUTDOWN_CB: 'shutdownCallback',
  ABORT: 'abortWithError',
  ABORT_AUTH: 'abortForAuth',
};

export const phases = {
  INTERACTIVE: 'interactive',
  AUTH: 'auth',
  GATHER_DATA: 'gatherData',
};

export const defaultUrl = Cookie.get('lastUrl') || '../Examples/html/earthquakeUSGS.html';
export const WINDOW_PROPS = 'height=500,width=800';

export const defaultState = {
  // Originally wdcProps, renamed to avoid confusion with component props
  wdcAttrs: {
    connectionName: '',
    connectionData: '',
    username: '',
    password: '',
    locale: 'en-us',
  },
  wdcUrl: defaultUrl,
  wdcShouldFetchAllTables: false,
  shouldHaveGatherDataFrame: false,
  currentPhase: phases.INTERACTIVE,
  phaseInProgress: false,
  phaseSubmitCalled: false,
  phaseInitCallbackCalled: false,
  simulatorWindow: null,
  tables: {},
};
