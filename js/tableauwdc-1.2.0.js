(function() {

  var versionNumber = "1.2.0";
  var _sourceWindow;

  if (typeof tableauVersionBootstrap === 'undefined') {
    // tableau version bootstrap isn't defined. We are likely running in the simulator so init up our tableau object
    tableau = {
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
        _sendMessage("headersCallback", {"fieldNames": fieldNames, "types":types});
      },

      dataCallback: function (data, lastRecordToken, moreData) {
        _sendMessage("dataCallback", {"data": data, "lastRecordToken": lastRecordToken, "moreData": moreData});
      },

      abortWithError: function (errorMsg) {
        _sendMessage("abortWithError", {"errorMsg": errorMsg});
      }
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


  } else { // Tableau version bootstrap is defined. Let's use it
    tableauVersionBootstrap.ReportVersionNumber(versionNumber);
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
    var functionNames = ["init", "shutdown", "getColumnHeaders", "getTableData"]
    for (var ii = functionNames.length - 1; ii >= 0; ii--) {
      if (typeof(wdc[functionNames[ii]]) !== "function") {
        throw "The connector did not define the required function: " + functionNames[ii];
      }
    };
    window._wdc = wdc;
  };

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

    //TODO: Validate that this is needed for the WDC

    return payload;
  }

  function _receiveMessage(evnt) {
    var wdc = window._wdc;
    if (!wdc) {
      throw "No WDC registered. Did you forget to call tableau.registerConnector?";
    }

    var payloadObj = getPayloadObj(event.data);
    if(!payloadObj) return; // Not needed for WDC

    if (!_sourceWindow) {
      _sourceWindow = evnt.source
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
      case "getColumnHeaders":
        wdc.getColumnHeaders();
        break;
      case "getTableData":
        wdc.getTableData(msgData.lastRecordToken);
        break;
    }
  };

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
    //return true; // Let error get logged
  }

  window.addEventListener('message', _receiveMessage, false);
})();
