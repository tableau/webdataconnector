import { handleActions } from 'redux-actions';
import { defaultWdcAttrs } from '../utils/consts';

// The redux reducers, which create the next state object
// from the payload of any given action.
// More info can be found here:
// http://redux.js.org/docs/basics/Reducers.html
// info on the spread operator used can be found here:
// http://redux.js.org/docs/recipes/UsingObjectSpreadOperator.html

export default handleActions({
  SET_WDC_ATTRS: (state, action) =>
    ({ ...state, wdcAttrs: action.payload }),
  SET_WDC_URL: (state, action) =>
    ({ ...state, wdcUrl: action.payload }),
  SET_ADDRESS_BAR_URL: (state, action) =>
    ({ ...state, addressBarUrl: action.payload }),
  SET_MOST_RECENT_URLS: (state, action) =>
    ({ ...state, mostRecentUrls: action.payload }),
  SET_WDC_SHOULD_FETCH_ALL_TABLES: (state, action) =>
    ({ ...state, wdcShouldFetchAllTables: action.payload }),
  SET_CURRENT_PHASE: (state, action) =>
    ({ ...state, currentPhase: action.payload }),
  SET_PHASE_IN_PROGRESS: (state, action) =>
    ({ ...state, phaseInProgress: action.payload }),
  SET_PHASE_INIT_CALLBACK_CALLED: (state, action) =>
    ({ ...state, phaseInitCallbackCalled: action.payload }),
  SET_PHASE_SUBMIT_CALLED: (state, action) =>
    ({ ...state, phaseSubmitCalled: action.payload }),
  SET_SHOW_ADVANCED: (state, action) =>
    ({ ...state, showAdvanced: action.payload }),
  SET_SHOULD_HAVE_GATHER_DATA_FRAME: (state, action) =>
    ({ ...state, shouldHaveGatherDataFrame: action.payload }),
  SET_SIMULATOR_WINDOW: (state, action) =>
    ({ ...state, simulatorWindow: action.payload }),
  SET_TABLES: (state, action) =>
    ({ ...state, tables: action.payload }),
  ADD_TABLES: (state, action) =>
    ({ ...state, tables: { ...state.tables, ...action.payload } }),
  RESET_STATE: (state, action) => action.payload,
  RESET_PHASE_STATE: (state) => ({
    ...state,
    phaseInProgress: false,
    phaseSubmitCalled: false,
    phaseInitCallbackCalled: false,
  }),
  RESET_WDC_ATTRS: (state) => ({ ...state, wdcAttrs: defaultWdcAttrs }),
  RESET_TABLES: (state) => ({ ...state, tables: {} }),
  RESET_TABLE_DATA: (state, action) => {
    const { tables } = state;
    tables[action.payload].data = [];
    return { ...state, tables };
  },
}, {});
