import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import should from 'should';
import jsdom from  'jsdom';
import sinon from 'sinon';

import * as consts from '../../utils/consts.js';
import * as simulatorActions from '../../actions/simulator_actions.js';
import * as messagingActions from '../../actions/messaging_actions.js';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Messaging Thunks', function() {
  // setup the simplest document possible
  global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
  // get the window object out of the document
  global.window = document.defaultView;

  // create a mock simulator dom and window
  let simDocument = jsdom.jsdom('<!doctype html><html><body></body></html>');
  // get the window object out of the document
  let simulatorWindow = simDocument.defaultView;
  let postMessageStub = sinon.stub(simulatorWindow, "postMessage", (payload)=>payload);

  // mock toastr object which is normally in the documents global scope
  global.toastr = sinon.spy();
  toastr.error = sinon.spy();
  describe('Receive Message', function() {
    it('Should merge WDC Attrs', function () {
      const data = {
        msgData: "",
        msgName: consts.eventNames.SHUTDOWN,
        props: {
          connectionName: "name",
          connectionData: "data",
          username: "username",
          password: "password",
          platformOS: "platformOs",
          platformVersion: "platformVersion",
          platformEdition: "platformEdition",
          platformBuildNumber: "platformBuildNumber",
          authPurpose: "ephemeral",
          locale: "en-us"
        },
        version: "2.0.1"
      };

      const payload = { data: JSON.stringify(data) };

      const expectedActions = [
        { type: "SET_WDC_ATTRS", payload: data.props},
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(messagingActions.receiveMessage(payload));
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('handleInit Thunk', function() {
    it('Should Create the Right Actions', function () {
      const expectedActions = [
        { type: "SET_PHASE_INIT_CALLBACK_CALLED", payload: true},
        { type: "SET_PHASE_IN_PROGRESS", payload: true},
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(messagingActions.handleInit())
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('handleSubmit Thunk', function() {
    it('Should Create the Right Actions', function () {
      const closeSimulatorActions = [
        { type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME", payload: false },
        { type: "SET_SIMULATOR_WINDOW" },
      ];

      const startGatherDataPhaseActions = [
        { type: "SET_CURRENT_PHASE", payload: consts.phases.GATHER_DATA },
        { type: "SET_PHASE_IN_PROGRESS", payload: true },
          ...closeSimulatorActions,
        { type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME", payload: true },
      ];

      const expectedActions = [
        { type: "SET_PHASE_SUBMIT_CALLED", payload: true},
        { type: "SET_PHASE_IN_PROGRESS", payload: false},
        ...closeSimulatorActions,
        { type: "RESET_TABLES"},
        ...startGatherDataPhaseActions,
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(messagingActions.handleSubmit());
      store.getActions().should.deepEqual(expectedActions);
    });

    it('Should Do Nothing in Data Gather Phase', function () {
      const expectedActions = [];
      const store = mockStore({
        ...consts.defaultState,
        currentPhase: consts.phases.GATHER_DATA
      })

      store.dispatch(messagingActions.handleSubmit());
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('handleSchemaCallback Thunk', function() {
    it('Should Create the Right Actions', function () {
      const schema = {
        id: "table",
        columns: [
          { id: "x", dataType: "int" },
          { id: "y", dataType: "int" },
        ],
      };

      const table = {
        [schema.id]: {
          schema,
          data: []
        }
      };

      const expectedActions = [
        { type: "ADD_TABLES", payload: table },
        { type: "SET_PHASE_IN_PROGRESS", payload: false },
      ];

      const store = mockStore(consts.defaultState);

      //schema callback expects an array of schemas
      store.dispatch(messagingActions.handleSchemaCallback([schema]));
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('handleDataCallback Thunk', function() {
    it('Should Create the Right Actions', function () {
      const schema = {
        id: "1",
        cols: [
          { id: "x", dataType: "int" },
          { id: "y", dataType: "int" },
        ],
      };

      const tableName = schema.id;
      const data = [{"x": 5, "y": 42 }];

      const table = {
        [schema.id]: {
          schema,
          data
        }
      }

      const expectedActions = [
        { type: "SET_TABLES", payload: table },
      ];

      const state = {...consts.defaultState, tables: table};
      const store = mockStore(state);

      store.dispatch(messagingActions.handleDataCallback(tableName, data));
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('handleAbort Thunk', function() {
    const err = " ";
    it('Should Create the Right Actions', function () {
      const expectedActions = [
        { type: "SET_PHASE_IN_PROGRESS", payload: false },
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(messagingActions.handleAbort(err));
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('handleAbortForAuth Thunk', function() {
    it('Should Create the Right Actions', function () {
      const closeSimulatorActions = [
        { type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME", payload: false },
        { type: "SET_SIMULATOR_WINDOW" },
      ];
      const expectedActions = [
        { type: "SET_PHASE_IN_PROGRESS", payload: false },
        ...closeSimulatorActions,
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(messagingActions.handleAbortForAuth());
      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('sendMessage Thunk', function() {
    const messageName = "testEvent";
    const payload = {test: "payload"};

    const message = {
      msgName: messageName,
      msgData: payload,
      props: consts.defaultState.wdcAttrs,
    };

    it('Should Send a Message', function () {
      const state = {...consts.defaultState, simulatorWindow};
      const store = mockStore(state);

      store.dispatch(messagingActions.sendMessage(messageName, payload));
      simulatorWindow.postMessage.calledOnce.should.be.true();
    });

    it(' Should Send the Right Message', function () {
      simulatorWindow.postMessage.returned(JSON.stringify(message)).should.be.true();
      simulatorWindow.postMessage.reset();
    });
  });

  describe('sendInit Thunk', function() {
    const state = {...consts.defaultState, simulatorWindow};
    const messageName = consts.eventNames.INIT;
    const payload = {phase: state.currentPhase};

    const message = {
      msgName: messageName,
      msgData: payload,
      props: state.wdcAttrs,
    };

    it('Should Send a Message', function () {
      const store = mockStore(state);

      store.dispatch(messagingActions.sendInit());
      simulatorWindow.postMessage.calledOnce.should.be.true();
    });

    it(' Should Send the Right Message', function () {
      simulatorWindow.postMessage.returned(JSON.stringify(message)).should.be.true();
      simulatorWindow.postMessage.reset();
    });
  });

  describe('sendGetHeaders Thunk', function() {
    const state = {...consts.defaultState, simulatorWindow};
    const messageName = consts.eventNames.SCHEMA_GET;
    const payload = {};

    const message = {
      msgName: messageName,
      msgData: payload,
      props: state.wdcAttrs,
    };

    it('Should Send a Message', function () {
      const store = mockStore(state);

      store.dispatch(messagingActions.sendGetHeaders());
      simulatorWindow.postMessage.calledOnce.should.be.true();
    });

    it(' Should Send the Right Message', function () {
      simulatorWindow.postMessage.returned(JSON.stringify(message)).should.be.true();
      simulatorWindow.postMessage.reset();
    });
  });

  describe('sendGetData Thunk', function() {
    const schema = {
      id: "table",
      columns: [
        { id: "id", dataType: "int" },
        { id: "y", dataType: "int" },
      ],
    };

    const tables = [{
      [schema.id]: {
        schema,
        data: []
      }
    }];

    const tablesAndIncrementValues = [{tableInfo: schema, incrementValue: "" }];
    const isFreshFetch = true;
    const state = { ...consts.defaultState, simulatorWindow, tables };
    const store = mockStore(state);

    const messageName = consts.eventNames.DATA_GET;
    const payload = { tablesAndIncrementValues };

    const message = {
      msgName: messageName,
      msgData: payload,
      props: state.wdcAttrs,
    };

    it('Should Send a Message', function () {
      store.dispatch(messagingActions.sendGetData(tablesAndIncrementValues, isFreshFetch));
      simulatorWindow.postMessage.calledOnce.should.be.true();
    });

    it(' Should Send the Right Message', function () {
      simulatorWindow.postMessage.returned(JSON.stringify(message)).should.be.true();
      simulatorWindow.postMessage.reset();
    });

    it(' Should Create the Right Actions', function () {
      const expectedActions = [
        { type: "RESET_TABLE_DATA", payload: tablesAndIncrementValues[0].tableInfo.id},
        { type: "SET_PHASE_IN_PROGRESS", payload: true},
      ];

      store.getActions().should.deepEqual(expectedActions);
    });
  });

  describe('sendShutdown Thunk', function() {
    const state = {...consts.defaultState, simulatorWindow};
    const messageName = consts.eventNames.SHUTDOWN;
    const payload = {};

    const message = {
      msgName: messageName,
      msgData: payload,
      props: state.wdcAttrs,
    };

    it('Should Send a Message', function () {
      const store = mockStore(state);

      store.dispatch(messagingActions.sendShutdown());
      simulatorWindow.postMessage.calledOnce.should.be.true();
    });

    it(' Should Send the Right Message', function () {
      simulatorWindow.postMessage.returned(JSON.stringify(message)).should.be.true();
      simulatorWindow.postMessage.reset();
    });
  });
});
