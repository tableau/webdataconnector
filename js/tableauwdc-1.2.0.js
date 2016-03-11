"use strict";

(function() {

  var versionNumber = "1.2.0";
  window._tableau = {};

  if (typeof tableauVersionBootstrap === 'undefined') {
    initializeSimulator();
  } else {
    initializeNative();
  }

  // Check if something weird happened during bootstraping. If so, just define a tableau object to we don't
  // throw errors all over the place because tableau isn't defined
  if (typeof tableau === "undefined") {
    tableau = {}
  }

  tableau.versionNumber = versionNumber;

  tableau.phaseEnum = {
    interactivePhase: "interactive",
    authPhase: "auth",
    gatherDataPhase: "gatherData"
  };

  tableau.dataTypeEnum = {
    bool: "bool",
    date: "date",
    datetime: "datetime",
    float: "float",
    int: "int",
    string: "string"
  };

  if (!tableau.phase) {
    tableau.phase = tableau.phaseEnum.interactivePhase;
  }

  // Assign the functions we always want to have available on the tableau object
  tableau.makeConnector = function() {
    var defaultImpls = {
      init: function() { tableau.initCallback(); },
      shutdown: function() { tableau.shutdownCallback(); }
    };
    return defaultImpls;
  };

  tableau.registerConnector = function (wdc) {
    // do some error checking on the wdc
    var functionNames = ["init", "shutdown", "getSchema", "getData"];
    for (var ii = functionNames.length - 1; ii >= 0; ii--) {
      if (typeof(wdc[functionNames[ii]]) !== "function") {
        throw "The connector did not define the required function: " + functionNames[ii];
      }
    };
    window._wdc = wdc;
  };

  // Seal the tableau object so that users can't add additional properties to it
  Object.preventExtensions(tableau);
  
  // Perform the initialization needed for both the simulator and native modes
  initializeShared();

  // Add global error handler. If there is a javascript error, this will report it to Tableau
  // so that it can be reported to the user.
  window.onerror = function (message, file, line, column, errorObj) {
    console.error(errorObj); // print error for debugging in the browser
    if (tableau._hasAlreadyThrownErrorSoDontThrowAgain) {
      return true;
    }

    var msg = message;
    if(errorObj) {
      msg += "   stack:" + errorObj.stack;
    } else {
      msg += "   file: " + file;
      msg += "   line: " + line;
    }

    if (tableau && tableau.abortWithError) {
      tableau.abortWithError(msg);
    } else {
      throw msg;
    }
    tableau._hasAlreadyThrownErrorSoDontThrowAgain = true;
    return true;
  }

  function initializeShared() {
    // Define the ColumnInfo class
    _tableau.ColumnInfo = function (id, dataType, alias, description, isPrimaryKey, foreignKey) {
      this.id = id;
      this.dataType = dataType;
      this.alias = alias;
      this.description = description;
      this.isPrimaryKey = isPrimaryKey;
      this.foreignKey = foreignKey;

      this.validate = function() {
        // TODO - validate all these inputs
        return true;
      };
    };

    _tableau.TableInfo = function(id, defaultAlias, description, incrementColumnId, columns) {
      this.id = id;
      this.defaultAlias = defaultAlias || "";
      this.description = description || "";
      this.incrementColumnId = incrementColumnId || "";
      this.columns = columns;

      this.validate = function() {
        // TODO - validate all these inputs
        return true;
      }
    };

    _tableau.Table = function(tableInfo, incrementValue) {
      this.tableInfo = tableInfo;
      this.incrementValue = incrementValue || "";
      this.appendRows = function(data) {
        // Call back with the rows for this table
        _tableau._tableDataCallback(this.tableInfo.id, data);
      }
    };

    _tableau.TableCollection = function(tablesAndIncrementValues) {
      // Expected format is an array of objects specifying a tableInfo object and increment values
      if (!Array.isArray(tablesAndIncrementValues)) {
        throw "TableCollection must be initializd with an array";
      }

      var _tables = {};
      var isIncremental = false;
      for(var i = 0; i < tablesAndIncrementValues.length; i++) {
        var tableInfo = tablesAndIncrementValues[i].tableInfo;
        var incrementValue = tablesAndIncrementValues[i].incrementValue;
        if (!!incrementValue) {
          isIncremental = true;
        }

        var table = new _tableau.Table(tableInfo, incrementValue);
        _tables[table.tableInfo.id] = table;
      }

      this.hasTable = function(tableId) {
        return _tables.hasOwnProperty(tableId || "");
      }

      this.getTable = function(tableId) {
        if (!this.hasTable(tableId)) {
          return null;
        }

        return _tables[tableId];
      }

      this.getTables = function() {
        return _tables;
      }

      this.getTableIds = function() {
        return _tables.keys();
      }
    }

    _tableau.triggerSchemaGathering = function() {
      _wdc.getSchema(_tableau._schemaCallback);
    };

    _tableau.triggerDataGathering = function(tablesAndIncrementValues) {
      var tableCollection = new _tableau.TableCollection(tablesAndIncrementValues);
      _wdc.getData(tableCollection, _tableau._dataDoneCallback);
    }
  }

  function initializeNative() {
    // Tableau version bootstrap is defined. Let's use it
    tableauVersionBootstrap.ReportVersionNumber(versionNumber);
    
    // Now that we've reported our version number, we've got to assemble up all the APIs which
    // desktop will have defined for us
    tableau.abortForAuth = function(msg) { window.WDCBridge_Api_abortForAuth.api(msg); }
    tableau.abortWithError = function(msg) { window.WDCBridge_Api_abortWithError.api(msg); }
    tableau.addCrossOriginException = function(destOriginList) { window.WDCBridge_Api_addCrossOriginException.api(destOriginList); }
    tableau.log = function(msg) { window.WDCBridge_Api_log.api(msg); }

    var initCallbackCalled = false;
    tableau.initCallback = function() { 
      if (initCallbackCalled) {
        console.log("initCallback called more than once");
        return;
      }

      initCallbackCalled = true;
      window.WDCBridge_Api_initCallback.api(); 
    };

    var submitCalled = false;
    tableau.submit = function() { 
      if (submitCalled) {
        console.log("submit called more than once");
        return;
      }

      submitCalled = true;
      window.WDCBridge_Api_submit.api(); 
    };

    var shutdownCallbackCalled = false;
    tableau.shutdownCallback = function() { 
      if (shutdownCallbackCalled) {
        console.log("shutdownCallback called more than once");
        return;
      }

      shutdownCallbackCalled = true;
      window.WDCBridge_Api_shutdownCallback.api(); 
    };

    // Assign our internal callback functions to a known location
    _tableau._schemaCallback = function(schema) { window.WDCBridge_Api_schemaCallback.api(schema); }
    _tableau._tableDataCallback = function(tableName, data) { window.WDCBridge_Api_tableDataCallback.api(tableName, data); }
    _tableau._dataDoneCallback = function() { window.WDCBridge_Api_dataDoneCallback.api(); }
  }
  
  // Encapsulates work necessary to make the WDC and simulator work together
  function initializeSimulator() {
    var _sourceWindow;

    // tableau version bootstrap isn't defined. We are likely running in the simulator so init up our tableau object
    window.tableau = {
      connectionName: "",
      connectionData: "",
      password: "",
      username: "",
      incrementalExtractColumn: "",

      initCallback: function () {
        _sendMessage("initCallback");
      },

      shutdownCallback: function () {
        _sendMessage("shutdownCallback");
      },

      submit: function () {
        _sendMessage("submit");
      },

      log: function (msg) {
        _sendMessage("log", {"logMsg": msg});
      },

      headersCallback: function (fieldNames, types) {
        throw "tableau.headersCallback has been deprecated in version 1.2.0";
      },

      dataCallback: function (data, lastRecordToken, moreData) {
        throw "tableau.dataCallback has been deprecated in version 1.2.0";
      },

      abortWithError: function (errorMsg) {
        _sendMessage("abortWithError", {"errorMsg": errorMsg});
      },

      abortForAuth: function(msg) {
        _sendMessage("abortForAuth", {"msg": msg});
      },

      // Note: for Tableau internal use only
      addCrossOriginException: function(destOriginList) {
        // Don't bother passing this back to the simulator since there's nothing it can
        // do. Just call back to the WDC indicating that it worked
        console.log("Cross Origin Exception requested in the simulator. Pretending to work.")
        window.setTimeout(function() {
          _wdc.addCrossOriginExceptionCompleted(destOriginList);
        }, 0)
      }
    };

    // Assign the internal callback function to send appropriate messages
    _tableau._schemaCallback = function(schema) { 
      _sendMessage("_schemaCallback", {"schema": schema}); 
    };

    _tableau._tableDataCallback = function(tableName, data) { 
      _sendMessage("_tableDataCallback", { "tableName": tableName, "data": data }); 
    };

    _tableau._dataDoneCallback = function() { 
      _sendMessage("_dataDoneCallback"); 
    };

    document.addEventListener("DOMContentLoaded", function() {
      // Attempt to notify the simulator window that the WDC has loaded
      if(window.parent !== window) {
        window.parent.postMessage(_buildMessagePayload('loaded'), '*');
      }
      if(window.opener) {
        try { // Wrap in try/catch for older versions of IE
          window.opener.postMessage(_buildMessagePayload('loaded'), '*');
        } catch(e) {
          console.warn('Some versions of IE may not accurately simulate the Web Data Connector.  Please retry on a Webkit based browser');
        }
      }
    });

    function _sendMessage(msgName, msgData) {
      var messagePayload = _buildMessagePayload(msgName, msgData, _packagePropertyValues());

      // Check first to see if we have a messageHandler defined to post the message to
      if (typeof window.webkit != 'undefined' &&
        typeof window.webkit.messageHandlers != 'undefined' &&
        typeof window.webkit.messageHandlers.wdcHandler != 'undefined') {

        window.webkit.messageHandlers.wdcHandler.postMessage(messagePayload);
      } else if (!_sourceWindow) {
        throw "Looks like the WDC is calling a tableau function before tableau.init() has been called."
      } else {
        _sourceWindow.postMessage(messagePayload, "*");
      }
    }

    function _buildMessagePayload(msgName, msgData, props) {
      var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": tableau.versionNumber };

      return JSON.stringify(msgObj);
    }

    function _packagePropertyValues() {
      var propValues = {"connectionName": tableau.connectionName,
        "connectionData": tableau.connectionData,
        "password": tableau.password,
        "username": tableau.username,
        "incrementalExtractColumn": tableau.incrementalExtractColumn,
        "versionNumber": tableau.versionNumber};
      return propValues;
    }

    function _applyPropertyValues(props) {
      if (props) {
        tableau.connectionName = props.connectionName;
        tableau.connectionData = props.connectionData;
        tableau.password = props.password;
        tableau.username = props.username;
        tableau.incrementalExtractColumn = props.incrementalExtractColumn;
      }
    }

    function getPayloadObj(payloadString) {
      var payload = null;
      try {
        payload = JSON.parse(payloadString);
      } catch(e) {
        return null;
      }

      return payload;
    }

    function _receiveMessage(evt) {
      var wdc = window._wdc;
      if (!wdc) {
        throw "No WDC registered. Did you forget to call tableau.registerConnector?";
      }

      var payloadObj = getPayloadObj(evt.data);
      if(!payloadObj) return; // This message is not needed for WDC

      if (!_sourceWindow) {
        _sourceWindow = evt.source
      }

      var msgData = payloadObj.msgData;
      _applyPropertyValues(payloadObj.props);

      switch(payloadObj.msgName) {
        case "init":
          tableau.phase = msgData.phase;
          wdc.init();
          break;
        case "shutdown":
          wdc.shutdown();
          break;
        case "getSchema":
          _tableau.triggerSchemaGathering();
          break;
        case "getData":
          _tableau.triggerDataGathering(msgData.tablesAndIncrementValues);
          break;
      }
    };
    window.addEventListener('message', _receiveMessage, false);
  }
})();