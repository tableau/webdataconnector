import should from 'should';
import * as consts from '../../utils/consts.js';
import * as simulatorActions from '../../actions/simulator_actions.js';

// Simulator Action Tests
describe("Simulator Action Creators", function() {
  describe("setWdcShouldFetchAllTables", function() {
    it("Should Create Right Action", function () {
      let input = true;
      let correctAction = {
        type: 'SET_WDC_SHOULD_FETCH_ALL_TABLES',
        payload: input
      };

      let action = simulatorActions.setWdcShouldFetchAllTables(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setWdcAttrs", function() {
    it("Should Create Right Action", function () {
      let input = {
        connectionName: '',
        connectionData: '',
        username: '',
        password: '',
      };

      let correctAction = {
        type: 'SET_WDC_ATTRS',
        payload: input
      };

      let action = simulatorActions.setWdcAttrs(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setFilterInfo", function() {
    it("Should Create Right Action", function () {
      let input = {
        selectedTable: '',
        selectedColumn: '',
        selectedFK: '',
      };

      let correctAction = {
        type: 'SET_FILTER_INFO',
        payload: input
      };

      let action = simulatorActions.setFilterInfo(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setActiveJoinFilter", function() {
    it("Should Create Right Action", function () {
      let input = "tableId";

      let correctAction = {
        type: 'SET_ACTIVE_JOIN_FILTER',
        payload: input
      };

      let action = simulatorActions.setActiveJoinFilter(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setWdcUrl", function() {
    it("Should Create Right Action", function () {
      let input = "../Examples/html/earthquakeUSGS.html";
      let correctAction = {
        type: 'SET_WDC_URL',
        payload: input
      };

      let action = simulatorActions.setWdcUrl(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setMostRecentUrls", function() {
    it("Should Create Right Action", function () {
      let input = ["../Examples/html/earthquakeUSGS.html", "otherUrls"];
      let correctAction = {
        type: 'SET_MOST_RECENT_URLS',
        payload: input
      };

      let action = simulatorActions.setMostRecentUrls(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setCurrentPhase", function() {
    it("Should Create Right Action", function () {
      let input = consts.phases.INTERACTIVE;
      let correctAction = {
        type: 'SET_CURRENT_PHASE',
        payload: input
      };

      let action = simulatorActions.setCurrentPhase(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setPhaseInProgress", function() {
    it("Should Create Right Action", function () {
      let input = true;
      let correctAction = {
        type: 'SET_PHASE_IN_PROGRESS',
        payload: input
      };

      let action = simulatorActions.setPhaseInProgress(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setPhaseInitCallbackCalled", function() {
    it("Should Create Right Action", function () {
      let input = true;
      let correctAction = {
        type: 'SET_PHASE_INIT_CALLBACK_CALLED',
        payload: input
      };

      let action = simulatorActions.setPhaseInitCallbackCalled(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setPhaseSubmitCalled", function() {
    it("Should Create Right Action", function () {
      let input = true;
      let correctAction = {
        type: 'SET_PHASE_SUBMIT_CALLED',
        payload: input
      };

      let action = simulatorActions.setPhaseSubmitCalled(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setSimulatorWindow", function() {
    it("Should Create Right Action", function () {
      let input = {mock_window: "mock"};
      let correctAction = {
        type: 'SET_SIMULATOR_WINDOW',
        payload: input
      };

      let action = simulatorActions.setSimulatorWindow(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setShouldHaveGatherDataFrame", function() {
    it("Should Create Right Action", function () {
      let input = true
      let correctAction = {
        type: 'SET_SHOULD_HAVE_GATHER_DATA_FRAME',
        payload: input
      };

      let action = simulatorActions.setShouldHaveGatherDataFrame(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setStandardConnections", function() {
    it("Should Create Right Action", function () {
      let input = {
        key: {
          standardConnections: {},
          data: []
        }
      };

      let correctAction = {
        type: 'SET_STANDARD_CONNECTIONS',
        payload: input
      };

      let action = simulatorActions.setStandardConnections(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("setTables", function() {
    it("Should Create Right Action", function () {
      let input = {
        key: {
          schema: {},
          data: []
        }
      };

      let correctAction = {
        type: 'SET_TABLES',
        payload: input
      };

      let action = simulatorActions.setTables(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("addTables", function() {
    it("Should Create Right Action", function () {
      let input = {
        key: {
          schema: {},
          data: []
        }
      };

      let correctAction = {
        type: 'ADD_TABLES',
        payload: input
      };

      let action = simulatorActions.addTables(input);
      action.should.deepEqual(correctAction);
    });
  });

  describe("resetState", function() {
    it("Should Create Right Action", function () {
      let correctAction = {
        type: 'RESET_STATE',
        payload: consts.defaultState
      };

      let action = simulatorActions.resetState();
      action.should.deepEqual(correctAction);
    });
  });

  describe("resetPhaseState", function() {
    it("Should Create Right Action", function () {
      let correctAction = {
        type: 'RESET_PHASE_STATE',
      };

      let action = simulatorActions.resetPhaseState();
      action.should.deepEqual(correctAction);
    });
  });

  describe("resetWdcAttrs", function() {
    it("Should Create Right Action", function () {
      let correctAction = {
        type: 'RESET_WDC_ATTRS',
      };

      let action = simulatorActions.resetWdcAttrs();
      action.should.deepEqual(correctAction);
    });
  });

  describe("resetTables", function() {
    it("Should Create Right Action", function () {
      let correctAction = {
        type: 'RESET_TABLES',
      };

      let action = simulatorActions.resetTables();
      action.should.deepEqual(correctAction);
    });
  });

  describe("resetTableData", function() {
    it("Should Create Right Action", function () {
      let correctAction = {
        type: 'RESET_TABLE_DATA',
      };

      let action = simulatorActions.resetTableData();
      action.should.deepEqual(correctAction);
    });
  });

  describe("resetStandardConnections", function() {
    it("Should Create Right Action", function () {
      let correctAction = {
        type: 'RESET_STANDARD_CONNECTIONS',
      };

      let action = simulatorActions.resetStandardConnections();
      action.should.deepEqual(correctAction);
    });
  })
});
