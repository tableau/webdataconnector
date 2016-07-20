import should from 'should';
import * as consts from '../../utils/consts.js'
import reducer from '../../reducers/reducers.js';

// Validation Function Tests
describe("Reducer", function() {
  const state = consts.defaultState;
  describe("SET_WDC_ATTRS", function() {
    it("Should Set wdcAttrs", function () {
      const newAttrs = {
        connectionName: 'connectionName',
        connectionData: 'connectionData',
        username: 'username',
        password: 'password',
        platformOS: "platformOs",
        platformVersion: "platformVersion",
        platformBuildNumber: "platformBuildNumber",
        authPurpose: "authPurpose",
        locale: "en-us",
      };

      const action = {
        type: "SET_WDC_ATTRS",
        payload: newAttrs
      };

      const output = reducer(state, action);
      output.wdcAttrs.should.deepEqual(newAttrs);
    });
  });

  describe("SET_WDC_URL", function() {
    it("Should Set wdcUrl", function () {
      const newUrl = 'url';
      const action = {
        type: "SET_WDC_URL",
        payload: newUrl
      };

      const output = reducer(state, action);
      output.wdcUrl.should.deepEqual(newUrl);
    });
  });

  describe("SET_MOST_RECENT_URLS", function() {
    it("Should Set mostRecentUrls", function () {
      const newUrls = ['urls', 'otherUrls'];
      const action = {
        type: "SET_MOST_RECENT_URLS",
        payload: newUrls
      };

      const output = reducer(state, action);
      output.mostRecentUrls.should.deepEqual(newUrls);
    });
  });

  describe("SET_FETCH_ALL_TABLES", function() {
    it("Should Set wdcShouldFetchAllTables", function () {
      const newValue = true;
      const action = {
        type: "SET_WDC_SHOULD_FETCH_ALL_TABLES",
        payload: newValue
      };

      const output = reducer(state, action);
      output.wdcShouldFetchAllTables.should.deepEqual(newValue);
    });
  });

  describe("SET_CURRENT_PHASE", function() {
    it("Should Set currentPhase", function () {
      const newPhase = consts.phases.GATHER_DATA;
      const action = {
        type: "SET_CURRENT_PHASE",
        payload: newPhase
      };

      const output = reducer(state, action);
      output.currentPhase.should.deepEqual(newPhase);
    });
  });

  describe("SET_PHASE_IN_PROGRESS", function() {
    it("Should Set phaseInProgress", function () {
      const newValue = true;
      const action = {
        type: "SET_PHASE_IN_PROGRESS",
        payload: newValue
      };

      const output = reducer(state, action);
      output.phaseInProgress.should.deepEqual(newValue);
    });
  });

  describe("SET_PHASE_INIT_CALLBACK_CALLED", function() {
    it("Should Set phaseInitCallbakCalled", function () {
      const newValue = true;
      const action = {
        type: "SET_PHASE_INIT_CALLBACK_CALLED",
        payload: newValue
      };

      const output = reducer(state, action);
      output.phaseInitCallbackCalled.should.deepEqual(newValue);
    });
  });

  describe("SET_PHASE_SUBMIT_CALLED", function() {
    it("Should Set phaseSubmitCalled", function () {
      const newValue = true;
      const action = {
        type: "SET_PHASE_SUBMIT_CALLED",
        payload: newValue
      };

      const output = reducer(state, action);
      output.phaseSubmitCalled.should.deepEqual(newValue);
    });
  });

  describe("SET_SHOULD_HAVE_GATHER_DATA_FRAME", function() {
    it("Should Set shouldHaveGatherDataFrame", function () {
      const newValue = true;
      const action = {
        type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME",
        payload: newValue
      };

      const output = reducer(state, action);
      output.shouldHaveGatherDataFrame.should.deepEqual(newValue);
    });
  });

  describe("SET_SIMULATOR_WINDOW", function() {
    it("Should Set simulatorWindow", function () {
      const newValue = {window: "window"};
      const action = {
        type: "SET_SIMULATOR_WINDOW",
        payload: newValue
      };

      const output = reducer(state, action);
      output.simulatorWindow.should.deepEqual(newValue);
    });
  });

  describe("SET_TABLES", function() {
    it("Should Set tables", function () {
      const newValue = {
        "id": {
          schema : [{ id: 1, columns: { id: 1, dataType: "int" } }],
          data : [],
        }
      };

      const action = {
        type: "SET_TABLES",
        payload: newValue
      };

      const output = reducer(state, action);
      output.tables.should.deepEqual(newValue);
    });
  });

  describe("ADD_TABLES", function() {
    it("Should Add Tables", function () {
      const tables = {
        "id": {
          schema: [{ id: 1, columns: { id: 1, dataType: "int" } }],
          data: [],
        }
      };

      const newTables = {
        "id2": {
          schema: [{ id: 2, columns: { id: 2, dataType: "int" } }],
          data: [],
        }
      };

      let newState = { ...state, tables };

      const action = {
        type: "ADD_TABLES",
        payload: newTables
      };

      const output = reducer(newState, action);
      output.tables.should.deepEqual({ ...tables, ...newTables });
    });
  });

  describe("RESET_STATE", function() {
    it("Should reset state", function () {
      const newState = { ...state, wdcUrl: "different" };
      const action = {
        type: "RESET_STATE",
        payload: state
      };

      const output = reducer(newState, action);
      output.should.deepEqual(state);
    });
  });

  describe("RESET_PHASE_STATE", function() {
    it("Should reset Phase States", function () {
      const newState = {
        ...state,
        phaseInProgress: true,
        phaseSubmitCalled: true,
        phaseInitCallbackCalled: true,
      };

      const action = {
        type: "RESET_PHASE_STATE",
      };

      const output = reducer(newState, action);
      output.should.deepEqual(state);
    });
  });

  describe("RESET_WDC_ATTRS", function() {
    it("Should Reset wdcAttrs", function () {
      const newState = {
        ...state,
        wdcAttrs: {
          connectionName: 'name',
          connectionData: 'data',
          username: 'name',
          password: 'pw',
          authPurpose: "ap",
          locale: 'en-us',
        },
      };

      const action = {
        type: "RESET_WDC_ATTRS",
      };

      const output = reducer(newState, action);
      output.should.deepEqual(state);
    });
  });

  describe("RESET_TABLES", function() {
    it("Should Reset tables", function () {
      const newState = {
        ...state,
        tables: {}
      };

      const action = {
        type: "RESET_TABLES",
      };

      const output = reducer(newState, action);
      output.should.deepEqual(state);
    });
  });

  describe("RESET_TABLE_DATA", function() {
    it("Should Reset Table Data", function () {
      let tables = {
        "id": {
          schema: [{ id: 1, columns: { id: 1, dataType: "int" } }],
          data: [[42]],
        }
      };

      let resetTables = {
        "id": {
          schema: [{ id: 1, columns: { id: 1, dataType: "int" } }],
          data: [],
        }
      };

      const newState = {
        ...state,
        tables,
      };
      const action = {
        type: "RESET_TABLE_DATA",
        payload: "id"
      };

      const output = reducer(newState, action);
      output.should.deepEqual({ ...state, tables: resetTables });
    });
  });
});
