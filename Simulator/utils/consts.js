import Cookie from 'js-cookie';
import queryString from 'querystring';

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

export const defaultWdcAttrs = {
  connectionName: '',
  connectionData: '',
  username: '',
  password: '',
  platformOS: '',
  platformEdition: '',
  platformVersion: '',
  platformBuildNumber: '',
  authPurpose: 'ephemeral',
  locale: 'en-us',
};

export const defaultShowAdvanced = Cookie.getJSON('showAdvanced') || false;

export const samples = [
  '../Examples/html/earthquakeUSGS.html',
  '../Examples/html/earthquakeMultitable.html',
  '../Examples/html/earthquakeMultilingual.html',
  '../Examples/html/IncrementalRefreshConnector.html',
  '../Examples/html/MadMoneyScraper.html',
];

export const defaultMostRecentUrls = Cookie.getJSON('mostRecentUrls') || [...samples];
// if a src query was specified, use it, else use the first MRU


// use a src query if one exists
const srcQuery = typeof location !== 'undefined' ? queryString.parse(location.search.slice(1)).src : null;
export const defaultUrl =  srcQuery || [...defaultMostRecentUrls][0];

export const WINDOW_PROPS = 'height=500,width=800';

export const defaultState = {
  // Originally wdcProps, renamed to avoid confusion with component props
  wdcAttrs: defaultWdcAttrs,
  addressBarUrl: defaultUrl,
  wdcUrl: defaultUrl,
  mostRecentUrls: defaultMostRecentUrls,
  showAdvanced: defaultShowAdvanced,
  wdcShouldFetchAllTables: false,
  shouldHaveGatherDataFrame: false,
  currentPhase: phases.INTERACTIVE,
  phaseInProgress: false,
  phaseSubmitCalled: false,
  phaseInitCallbackCalled: false,
  simulatorWindow: null,
  tables: {},
};
