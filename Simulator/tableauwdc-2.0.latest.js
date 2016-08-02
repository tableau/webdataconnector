/*! Build Number: 2.0.7 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Main entry point to pull together everything needed for the WDC shim library
	// This file will be exported as a bundled js file by webpack so it can be included
	// in a <script> tag in an html document. Alernatively, a connector may include
	// this whole package in their code and would need to call init like this
	var tableauwdc = __webpack_require__(8);
	tableauwdc.init();


/***/ },
/* 1 */
/***/ function(module, exports) {

	/** This file lists all of the enums which should available for the WDC */
	var allEnums = {
	  phaseEnum : {
	    interactivePhase: "interactive",
	    authPhase: "auth",
	    gatherDataPhase: "gatherData"
	  },

	  authPurposeEnum : {
	    ephemeral: "ephemeral",
	    enduring: "enduring"
	  },

	  authTypeEnum : {
	    none: "none",
	    basic: "basic",
	    custom: "custom"
	  },

	  dataTypeEnum : {
	    bool: "bool",
	    date: "date",
	    datetime: "datetime",
	    float: "float",
	    int: "int",
	    string: "string"
	  },

	  columnRoleEnum : {
	      dimension: "dimension",
	      measure: "measure"
	  },

	  columnTypeEnum : {
	      continuous: "continuous",
	      discrete: "discrete"
	  },

	  aggTypeEnum : {
	      sum: "sum",
	      avg: "avg",
	      median: "median",
	      count: "count",
	      countd: "count_dist"
	  },

	  geographicRoleEnum : {
	      area_code: "area_code",
	      cbsa_msa: "cbsa_msa",
	      city: "city",
	      congressional_district: "congressional_district",
	      country_region: "country_region",
	      county: "county",
	      state_province: "state_province",
	      zip_code_postcode: "zip_code_postcode",
	      latitude: "latitude",
	      longitude: "longitude"
	  },

	  unitsFormatEnum : {
	      thousands: "thousands",
	      millions: "millions",
	      billions_english: "billions_english",
	      billions_standard: "billions_standard"
	  },

	  numberFormatEnum : {
	      number: "number",
	      currency: "currency",
	      scientific: "scientific",
	      percentage: "percentage"
	  },

	  localeEnum : {
	      america: "en-us",
	      brazil:  "pt-br",
	      china:   "zh-cn",
	      france:  "fr-fr",
	      germany: "de-de",
	      japan:   "ja-jp",
	      korea:   "ko-kr",
	      spain:   "es-es"
	  },

	  joinEnum : {
	      inner: "inner",
	      left: "left"
	  }
	}

	// Applies the enums as properties of the target object
	function apply(target) {
	  for(var key in allEnums) {
	    target[key] = allEnums[key];
	  }
	}

	module.exports.apply = apply;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/** @class Used for communicating between Tableau desktop/server and the WDC's
	* Javascript. is predominantly a pass-through to the Qt WebBridge methods
	* @param nativeApiRootObj {Object} - The root object where the native Api methods
	* are available. For WebKit, this is window.
	*/
	function NativeDispatcher (nativeApiRootObj) {
	  this.nativeApiRootObj = nativeApiRootObj;
	  this._initPublicInterface();
	  this._initPrivateInterface();
	}

	NativeDispatcher.prototype._initPublicInterface = function() {
	  console.log("Initializing public interface for NativeDispatcher");
	  this._submitCalled = false;

	  var publicInterface = {};
	  publicInterface.abortForAuth = this._abortForAuth.bind(this);
	  publicInterface.abortWithError = this._abortWithError.bind(this);
	  publicInterface.addCrossOriginException = this._addCrossOriginException.bind(this);
	  publicInterface.log = this._log.bind(this);
	  publicInterface.submit = this._submit.bind(this);

	  this.publicInterface = publicInterface;
	}

	NativeDispatcher.prototype._abortForAuth = function(msg) {
	  this.nativeApiRootObj.WDCBridge_Api_abortForAuth.api(msg);
	}

	NativeDispatcher.prototype._abortWithError = function(msg) {
	  this.nativeApiRootObj.WDCBridge_Api_abortWithError.api(msg);
	}

	NativeDispatcher.prototype._addCrossOriginException = function(destOriginList) {
	  this.nativeApiRootObj.WDCBridge_Api_addCrossOriginException.api(destOriginList);
	}

	NativeDispatcher.prototype._log = function(msg) {
	  this.nativeApiRootObj.WDCBridge_Api_log.api(msg);
	}

	NativeDispatcher.prototype._submit = function() {
	  if (this._submitCalled) {
	    console.log("submit called more than once");
	    return;
	  }

	  this._submitCalled = true;
	  this.nativeApiRootObj.WDCBridge_Api_submit.api();
	};

	NativeDispatcher.prototype._initPrivateInterface = function() {
	  console.log("Initializing private interface for NativeDispatcher");

	  this._initCallbackCalled = false;
	  this._shutdownCallbackCalled = false;

	  var privateInterface = {};
	  privateInterface._initCallback = this._initCallback.bind(this);
	  privateInterface._shutdownCallback = this._shutdownCallback.bind(this);
	  privateInterface._schemaCallback = this._schemaCallback.bind(this);
	  privateInterface._tableDataCallback = this._tableDataCallback.bind(this);
	  privateInterface._dataDoneCallback = this._dataDoneCallback.bind(this);

	  this.privateInterface = privateInterface;
	}

	NativeDispatcher.prototype._initCallback = function() {
	  if (this._initCallbackCalled) {
	    console.log("initCallback called more than once");
	    return;
	  }

	  this._initCallbackCalled = true;
	  this.nativeApiRootObj.WDCBridge_Api_initCallback.api();
	}

	NativeDispatcher.prototype._shutdownCallback = function() {
	  if (this._shutdownCallbackCalled) {
	    console.log("shutdownCallback called more than once");
	    return;
	  }

	  this._shutdownCallbackCalled = true;
	  this.nativeApiRootObj.WDCBridge_Api_shutdownCallback.api();
	}

	NativeDispatcher.prototype._schemaCallback = function(schema, standardConnections) {
	  // Check to make sure we are using a version of desktop which has the WDCBridge_Api_schemaCallbackEx defined
	  if (!!this.nativeApiRootObj.WDCBridge_Api_schemaCallbackEx) {
	    // Providing standardConnections is optional but we can't pass undefined back because Qt will choke
	    this.nativeApiRootObj.WDCBridge_Api_schemaCallbackEx.api(schema, standardConnections || []);
	  } else {
	    this.nativeApiRootObj.WDCBridge_Api_schemaCallback.api(schema);
	  }
	}

	NativeDispatcher.prototype._tableDataCallback = function(tableName, data) {
	  this.nativeApiRootObj.WDCBridge_Api_tableDataCallback.api(tableName, data);
	}

	NativeDispatcher.prototype._dataDoneCallback = function() {
	  this.nativeApiRootObj.WDCBridge_Api_dataDoneCallback.api();
	}

	module.exports = NativeDispatcher;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Table = __webpack_require__(5);
	var Enums = __webpack_require__(1);

	/** @class This class represents the shared parts of the javascript
	* library which do not have any dependence on whether we are running in
	* the simulator, in Tableau, or anywhere else
	* @param tableauApiObj {Object} - The already created tableau API object (usually window.tableau)
	* @param privateApiObj {Object} - The already created private API object (usually window._tableau)
	* @param globalObj {Object} - The global object to attach things to (usually window)
	*/
	function Shared (tableauApiObj, privateApiObj, globalObj) {
	  this.privateApiObj = privateApiObj;
	  this.globalObj = globalObj;
	  this._hasAlreadyThrownErrorSoDontThrowAgain = false;

	  this.changeTableauApiObj(tableauApiObj);
	}


	Shared.prototype.init = function() {
	  console.log("Initializing shared WDC");
	  this.globalObj.onerror = this._errorHandler.bind(this);

	  // Initialize the functions which will be invoked by the native code
	  this._initTriggerFunctions();

	  // Assign the deprecated functions which aren't availible in this version of the API
	  this._initDeprecatedFunctions();
	}

	Shared.prototype.changeTableauApiObj = function(tableauApiObj) {
	  this.tableauApiObj = tableauApiObj;

	  // Assign our make & register functions right away because a connector can use
	  // them immediately, even before bootstrapping has completed
	  this.tableauApiObj.makeConnector = this._makeConnector.bind(this);
	  this.tableauApiObj.registerConnector = this._registerConnector.bind(this);

	  Enums.apply(this.tableauApiObj);
	}

	Shared.prototype._errorHandler = function(message, file, line, column, errorObj) {
	  console.error(errorObj); // print error for debugging in the browser
	  if (this._hasAlreadyThrownErrorSoDontThrowAgain) {
	    return true;
	  }

	  var msg = message;
	  if(errorObj) {
	    msg += "   stack:" + errorObj.stack;
	  } else {
	    msg += "   file: " + file;
	    msg += "   line: " + line;
	  }

	  if (this.tableauApiObj && this.tableauApiObj.abortWithError) {
	    this.tableauApiObj.abortWithError(msg);
	  } else {
	    throw msg;
	  }

	  this._hasAlreadyThrownErrorSoDontThrowAgain = true;
	  return true;
	}

	Shared.prototype._makeConnector = function() {
	  var defaultImpls = {
	    init: function(cb) { cb(); },
	    shutdown: function(cb) { cb(); }
	  };

	  return defaultImpls;
	}

	Shared.prototype._registerConnector = function (wdc) {

	  // do some error checking on the wdc
	  var functionNames = ["init", "shutdown", "getSchema", "getData"];
	  for (var ii = functionNames.length - 1; ii >= 0; ii--) {
	    if (typeof(wdc[functionNames[ii]]) !== "function") {
	      throw "The connector did not define the required function: " + functionNames[ii];
	    }
	  };

	  console.log("Connector registered");

	  this.globalObj._wdc = wdc;
	  this._wdc = wdc;
	}

	Shared.prototype._initTriggerFunctions = function() {
	  this.privateApiObj.triggerInitialization = this._triggerInitialization.bind(this);
	  this.privateApiObj.triggerSchemaGathering = this._triggerSchemaGathering.bind(this);
	  this.privateApiObj.triggerDataGathering = this._triggerDataGathering.bind(this);
	  this.privateApiObj.triggerShutdown = this._triggerShutdown.bind(this);
	}

	// Starts the WDC
	Shared.prototype._triggerInitialization = function() {
	  this._wdc.init(this.privateApiObj._initCallback);
	}

	// Starts the schema gathering process
	Shared.prototype._triggerSchemaGathering = function() {
	  this._wdc.getSchema(this.privateApiObj._schemaCallback);
	}

	// Starts the data gathering process
	Shared.prototype._triggerDataGathering = function(tablesAndIncrementValues) {
	  if (tablesAndIncrementValues.length != 1) {
	    throw ("Unexpected number of tables specified. Expected 1, actual " + tablesAndIncrementValues.length.toString());
	  }

	  var tableAndIncremntValue = tablesAndIncrementValues[0];
	  var table = new Table(tableAndIncremntValue.tableInfo, tableAndIncremntValue.incrementValue, this.privateApiObj._tableDataCallback);
	  this._wdc.getData(table, this.privateApiObj._dataDoneCallback);
	}

	// Tells the WDC it's time to shut down
	Shared.prototype._triggerShutdown = function() {
	  this._wdc.shutdown(this.privateApiObj._shutdownCallback);
	}

	// Initializes a series of global callbacks which have been deprecated in version 2.0.0
	Shared.prototype._initDeprecatedFunctions = function() {
	  this.tableauApiObj.initCallback = this._initCallback.bind(this);
	  this.tableauApiObj.headersCallback = this._headersCallback.bind(this);
	  this.tableauApiObj.dataCallback = this._dataCallback.bind(this);
	  this.tableauApiObj.shutdownCallback = this._shutdownCallback.bind(this);
	}

	Shared.prototype._initCallback = function () {
	  this.tableauApiObj.abortWithError("tableau.initCallback has been deprecated in version 2.0.0. Please use the callback function passed to init");
	};

	Shared.prototype._headersCallback = function (fieldNames, types) {
	  this.tableauApiObj.abortWithError("tableau.headersCallback has been deprecated in version 2.0.0");
	};

	Shared.prototype._dataCallback = function (data, lastRecordToken, moreData) {
	  this.tableauApiObj.abortWithError("tableau.dataCallback has been deprecated in version 2.0.0");
	};

	Shared.prototype._shutdownCallback = function () {
	  this.tableauApiObj.abortWithError("tableau.shutdownCallback has been deprecated in version 2.0.0. Please use the callback function passed to shutdown");
	};

	module.exports = Shared;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @class Used for communicating between the simulator and web data connector. It does
	* this by passing messages between the WDC window and its parent window
	* @param globalObj {Object} - the global object to find tableau interfaces as well
	* as register events (usually window)
	*/
	function SimulatorDispatcher (globalObj) {
	  this.globalObj = globalObj;
	  this._initMessageHandling();
	  this._initPublicInterface();
	  this._initPrivateInterface();
	}

	SimulatorDispatcher.prototype._initMessageHandling = function() {
	  console.log("Initializing message handling");
	  this.globalObj.addEventListener('message', this._receiveMessage.bind(this), false);
	  this.globalObj.document.addEventListener("DOMContentLoaded", this._onDomContentLoaded.bind(this));
	}

	SimulatorDispatcher.prototype._onDomContentLoaded = function() {
	  // Attempt to notify the simulator window that the WDC has loaded
	  if(this.globalObj.parent !== window) {
	    this.globalObj.parent.postMessage(this._buildMessagePayload('loaded'), '*');
	  }

	  if(this.globalObj.opener) {
	    try { // Wrap in try/catch for older versions of IE
	      this.globalObj.opener.postMessage(this._buildMessagePayload('loaded'), '*');
	    } catch(e) {
	      console.warn('Some versions of IE may not accurately simulate the Web Data Connector. Please retry on a Webkit based browser');
	    }
	  }
	}

	SimulatorDispatcher.prototype._packagePropertyValues = function() {
	  var propValues = {
	    "connectionName": this.globalObj.tableau.connectionName,
	    "connectionData": this.globalObj.tableau.connectionData,
	    "password": this.globalObj.tableau.password,
	    "username": this.globalObj.tableau.username,
	    "incrementalExtractColumn": this.globalObj.tableau.incrementalExtractColumn,
	    "versionNumber": this.globalObj.tableau.versionNumber,
	    "locale": this.globalObj.tableau.locale,
	    "authPurpose": this.globalObj.tableau.authPurpose
	  };

	  return propValues;
	}

	SimulatorDispatcher.prototype._applyPropertyValues = function(props) {
	  if (props) {
	    this.globalObj.tableau.connectionName = props.connectionName;
	    this.globalObj.tableau.connectionData = props.connectionData;
	    this.globalObj.tableau.password = props.password;
	    this.globalObj.tableau.username = props.username;
	    this.globalObj.tableau.incrementalExtractColumn = props.incrementalExtractColumn;
	    this.globalObj.tableau.locale = props.locale;
	    this.globalObj.tableau.language = props.locale;
	    this.globalObj.tableau.authPurpose = props.authPurpose;
	  }
	}

	SimulatorDispatcher.prototype._buildMessagePayload = function(msgName, msgData, props) {
	  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": ("2.0.7") };
	  return JSON.stringify(msgObj);
	}

	SimulatorDispatcher.prototype._sendMessage = function(msgName, msgData) {
	  var messagePayload = this._buildMessagePayload(msgName, msgData, this._packagePropertyValues());

	  // Check first to see if we have a messageHandler defined to post the message to
	  if (typeof this.globalObj.webkit != 'undefined' &&
	    typeof this.globalObj.webkit.messageHandlers != 'undefined' &&
	    typeof this.globalObj.webkit.messageHandlers.wdcHandler != 'undefined') {
	    this.globalObj.webkit.messageHandlers.wdcHandler.postMessage(messagePayload);
	  } else if (!this._sourceWindow) {
	    throw "Looks like the WDC is calling a tableau function before tableau.init() has been called."
	  } else {
	    this._sourceWindow.postMessage(messagePayload, "*");
	  }
	}

	SimulatorDispatcher.prototype._getPayloadObj = function(payloadString) {
	  var payload = null;
	  try {
	    payload = JSON.parse(payloadString);
	  } catch(e) {
	    return null;
	  }

	  return payload;
	}

	SimulatorDispatcher.prototype._receiveMessage = function(evt) {
	  console.log("Received message!");

	  var wdc = this.globalObj._wdc;
	  if (!wdc) {
	    throw "No WDC registered. Did you forget to call tableau.registerConnector?";
	  }

	  var payloadObj = this._getPayloadObj(evt.data);
	  if(!payloadObj) return; // This message is not needed for WDC

	  if (!this._sourceWindow) {
	    this._sourceWindow = evt.source
	  }

	  var msgData = payloadObj.msgData;
	  this._applyPropertyValues(payloadObj.props);

	  switch(payloadObj.msgName) {
	    case "init":
	      this.globalObj.tableau.phase = msgData.phase;
	      this.globalObj._tableau.triggerInitialization();
	      break;
	    case "shutdown":
	      this.globalObj._tableau.triggerShutdown();
	      break;
	    case "getSchema":
	      this.globalObj._tableau.triggerSchemaGathering();
	      break;
	    case "getData":
	      this.globalObj._tableau.triggerDataGathering(msgData.tablesAndIncrementValues);
	      break;
	  }
	};

	/**** PUBLIC INTERFACE *****/
	SimulatorDispatcher.prototype._initPublicInterface = function() {
	  console.log("Initializing public interface");
	  this._submitCalled = false;

	  var publicInterface = {};
	  publicInterface.abortForAuth = this._abortForAuth.bind(this);
	  publicInterface.abortWithError = this._abortWithError.bind(this);
	  publicInterface.addCrossOriginException = this._addCrossOriginException.bind(this);
	  publicInterface.log = this._log.bind(this);
	  publicInterface.submit = this._submit.bind(this);

	  // Assign the public interface to this
	  this.publicInterface = publicInterface;
	}

	SimulatorDispatcher.prototype._abortForAuth = function(msg) {
	  this._sendMessage("abortForAuth", {"msg": msg});
	}

	SimulatorDispatcher.prototype._abortWithError = function(msg) {
	  this._sendMessage("abortWithError", {"errorMsg": msg});
	}

	SimulatorDispatcher.prototype._addCrossOriginException = function(destOriginList) {
	  // Don't bother passing this back to the simulator since there's nothing it can
	  // do. Just call back to the WDC indicating that it worked
	  console.log("Cross Origin Exception requested in the simulator. Pretending to work.")
	  setTimeout(function() {
	    this.globalObj._wdc.addCrossOriginExceptionCompleted(destOriginList);
	  }, 0);
	}

	SimulatorDispatcher.prototype._log = function(msg) {
	  this._sendMessage("log", {"logMsg": msg});
	}

	SimulatorDispatcher.prototype._submit = function() {
	  this._sendMessage("submit");
	};

	/**** PRIVATE INTERFACE *****/
	SimulatorDispatcher.prototype._initPrivateInterface = function() {
	  console.log("Initializing private interface");

	  var privateInterface = {};
	  privateInterface._initCallback = this._initCallback.bind(this);
	  privateInterface._shutdownCallback = this._shutdownCallback.bind(this);
	  privateInterface._schemaCallback = this._schemaCallback.bind(this);
	  privateInterface._tableDataCallback = this._tableDataCallback.bind(this);
	  privateInterface._dataDoneCallback = this._dataDoneCallback.bind(this);

	  // Assign the private interface to this
	  this.privateInterface = privateInterface;
	}

	SimulatorDispatcher.prototype._initCallback = function() {
	  this._sendMessage("initCallback");
	}

	SimulatorDispatcher.prototype._shutdownCallback = function() {
	  this._sendMessage("shutdownCallback");
	}

	SimulatorDispatcher.prototype._schemaCallback = function(schema, standardConnections) {
	  this._sendMessage("_schemaCallback", {"schema": schema, "standardConnections" : standardConnections || []});
	}

	SimulatorDispatcher.prototype._tableDataCallback = function(tableName, data) {
	  this._sendMessage("_tableDataCallback", { "tableName": tableName, "data": data });
	}

	SimulatorDispatcher.prototype._dataDoneCallback = function() {
	  this._sendMessage("_dataDoneCallback");
	}

	module.exports = SimulatorDispatcher;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	* @class Represents a single table which Tableau has requested
	* @param tableInfo {Object} - Information about the table
	* @param incrementValue {string=} - Incremental update value
	*/
	function Table(tableInfo, incrementValue, dataCallbackFn) {
	  /** @member {Object} Information about the table which has been requested. This is
	  guaranteed to be one of the tables the connector returned in the call to getSchema. */
	  this.tableInfo = tableInfo;

	  /** @member {string} Defines the incremental update value for this table. Empty string if
	  there is not an incremental update requested. */
	  this.incrementValue = incrementValue || "";

	  /** @private */
	  this._dataCallbackFn = dataCallbackFn;
	}

	/**
	* @method appends the given rows to the set of data contained in this table
	* @param data {array} - Either an array of arrays or an array of objects which represent
	* the individual rows of data to append to this table
	*/
	Table.prototype.appendRows = function(data) {
	  // Do some quick validation that this data is the format we expect
	  if (!data) {
	    console.warn("rows data is null or undefined");
	    return;
	  }

	  if (!Array.isArray(data)) {
	    // Log a warning because the data is not an array like we expected
	    console.warn("Table.appendRows must take an array of arrays or array of objects");
	    return;
	  }

	  // Call back with the rows for this table
	  this._dataCallbackFn(this.tableInfo.id, data);
	}

	module.exports = Table;


/***/ },
/* 6 */
/***/ function(module, exports) {

	function copyFunctions(src, dest) {
	  for(var key in src) {
	    if (typeof src[key] === 'function') {
	      dest[key] = src[key];
	    }
	  }
	}

	module.exports.copyFunctions = copyFunctions;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/****************************************************************************
	**
	** Copyright (C) 2015 The Qt Company Ltd.
	** Copyright (C) 2014 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
	** Contact: http://www.qt.io/licensing/
	**
	** This file is part of the QtWebChannel module of the Qt Toolkit.
	**
	** $QT_BEGIN_LICENSE:LGPL21$
	** Commercial License Usage
	** Licensees holding valid commercial Qt licenses may use this file in
	** accordance with the commercial license agreement provided with the
	** Software or, alternatively, in accordance with the terms contained in
	** a written agreement between you and The Qt Company. For licensing terms
	** and conditions see http://www.qt.io/terms-conditions. For further
	** information use the contact form at http://www.qt.io/contact-us.
	**
	** GNU Lesser General Public License Usage
	** Alternatively, this file may be used under the terms of the GNU Lesser
	** General Public License version 2.1 or version 3 as published by the Free
	** Software Foundation and appearing in the file LICENSE.LGPLv21 and
	** LICENSE.LGPLv3 included in the packaging of this file. Please review the
	** following information to ensure the GNU Lesser General Public License
	** requirements will be met: https://www.gnu.org/licenses/lgpl.html and
	** http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
	**
	** As a special exception, The Qt Company gives you certain additional
	** rights. These rights are described in The Qt Company LGPL Exception
	** version 1.1, included in the file LGPL_EXCEPTION.txt in this package.
	**
	** $QT_END_LICENSE$
	**
	****************************************************************************/

	"use strict";

	var QWebChannelMessageTypes = {
	    signal: 1,
	    propertyUpdate: 2,
	    init: 3,
	    idle: 4,
	    debug: 5,
	    invokeMethod: 6,
	    connectToSignal: 7,
	    disconnectFromSignal: 8,
	    setProperty: 9,
	    response: 10,
	};

	var QWebChannel = function(transport, initCallback)
	{
	    if (typeof transport !== "object" || typeof transport.send !== "function") {
	        console.error("The QWebChannel expects a transport object with a send function and onmessage callback property." +
	                      " Given is: transport: " + typeof(transport) + ", transport.send: " + typeof(transport.send));
	        return;
	    }

	    var channel = this;
	    this.transport = transport;

	    this.send = function(data)
	    {
	        if (typeof(data) !== "string") {
	            data = JSON.stringify(data);
	        }
	        channel.transport.send(data);
	    }

	    this.transport.onmessage = function(message)
	    {
	        var data = message.data;
	        if (typeof data === "string") {
	            data = JSON.parse(data);
	        }
	        switch (data.type) {
	            case QWebChannelMessageTypes.signal:
	                channel.handleSignal(data);
	                break;
	            case QWebChannelMessageTypes.response:
	                channel.handleResponse(data);
	                break;
	            case QWebChannelMessageTypes.propertyUpdate:
	                channel.handlePropertyUpdate(data);
	                break;
	            default:
	                console.error("invalid message received:", message.data);
	                break;
	        }
	    }

	    this.execCallbacks = {};
	    this.execId = 0;
	    this.exec = function(data, callback)
	    {
	        if (!callback) {
	            // if no callback is given, send directly
	            channel.send(data);
	            return;
	        }
	        if (channel.execId === Number.MAX_VALUE) {
	            // wrap
	            channel.execId = Number.MIN_VALUE;
	        }
	        if (data.hasOwnProperty("id")) {
	            console.error("Cannot exec message with property id: " + JSON.stringify(data));
	            return;
	        }
	        data.id = channel.execId++;
	        channel.execCallbacks[data.id] = callback;
	        channel.send(data);
	    };

	    this.objects = {};

	    this.handleSignal = function(message)
	    {
	        var object = channel.objects[message.object];
	        if (object) {
	            object.signalEmitted(message.signal, message.args);
	        } else {
	            console.warn("Unhandled signal: " + message.object + "::" + message.signal);
	        }
	    }

	    this.handleResponse = function(message)
	    {
	        if (!message.hasOwnProperty("id")) {
	            console.error("Invalid response message received: ", JSON.stringify(message));
	            return;
	        }
	        channel.execCallbacks[message.id](message.data);
	        delete channel.execCallbacks[message.id];
	    }

	    this.handlePropertyUpdate = function(message)
	    {
	        for (var i in message.data) {
	            var data = message.data[i];
	            var object = channel.objects[data.object];
	            if (object) {
	                object.propertyUpdate(data.signals, data.properties);
	            } else {
	                console.warn("Unhandled property update: " + data.object + "::" + data.signal);
	            }
	        }
	        channel.exec({type: QWebChannelMessageTypes.idle});
	    }

	    this.debug = function(message)
	    {
	        channel.send({type: QWebChannelMessageTypes.debug, data: message});
	    };

	    channel.exec({type: QWebChannelMessageTypes.init}, function(data) {
	        for (var objectName in data) {
	            var object = new QObject(objectName, data[objectName], channel);
	        }
	        // now unwrap properties, which might reference other registered objects
	        for (var objectName in channel.objects) {
	            channel.objects[objectName].unwrapProperties();
	        }
	        if (initCallback) {
	            initCallback(channel);
	        }
	        channel.exec({type: QWebChannelMessageTypes.idle});
	    });
	};

	function QObject(name, data, webChannel)
	{
	    this.__id__ = name;
	    webChannel.objects[name] = this;

	    // List of callbacks that get invoked upon signal emission
	    this.__objectSignals__ = {};

	    // Cache of all properties, updated when a notify signal is emitted
	    this.__propertyCache__ = {};

	    var object = this;

	    // ----------------------------------------------------------------------

	    this.unwrapQObject = function(response)
	    {
	        if (response instanceof Array) {
	            // support list of objects
	            var ret = new Array(response.length);
	            for (var i = 0; i < response.length; ++i) {
	                ret[i] = object.unwrapQObject(response[i]);
	            }
	            return ret;
	        }
	        if (!response
	            || !response["__QObject*__"]
	            || response["id"] === undefined) {
	            return response;
	        }

	        var objectId = response.id;
	        if (webChannel.objects[objectId])
	            return webChannel.objects[objectId];

	        if (!response.data) {
	            console.error("Cannot unwrap unknown QObject " + objectId + " without data.");
	            return;
	        }

	        var qObject = new QObject( objectId, response.data, webChannel );
	        qObject.destroyed.connect(function() {
	            if (webChannel.objects[objectId] === qObject) {
	                delete webChannel.objects[objectId];
	                // reset the now deleted QObject to an empty {} object
	                // just assigning {} though would not have the desired effect, but the
	                // below also ensures all external references will see the empty map
	                // NOTE: this detour is necessary to workaround QTBUG-40021
	                var propertyNames = [];
	                for (var propertyName in qObject) {
	                    propertyNames.push(propertyName);
	                }
	                for (var idx in propertyNames) {
	                    delete qObject[propertyNames[idx]];
	                }
	            }
	        });
	        // here we are already initialized, and thus must directly unwrap the properties
	        qObject.unwrapProperties();
	        return qObject;
	    }

	    this.unwrapProperties = function()
	    {
	        for (var propertyIdx in object.__propertyCache__) {
	            object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx]);
	        }
	    }

	    function addSignal(signalData, isPropertyNotifySignal)
	    {
	        var signalName = signalData[0];
	        var signalIndex = signalData[1];
	        object[signalName] = {
	            connect: function(callback) {
	                if (typeof(callback) !== "function") {
	                    console.error("Bad callback given to connect to signal " + signalName);
	                    return;
	                }

	                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];
	                object.__objectSignals__[signalIndex].push(callback);

	                if (!isPropertyNotifySignal && signalName !== "destroyed") {
	                    // only required for "pure" signals, handled separately for properties in propertyUpdate
	                    // also note that we always get notified about the destroyed signal
	                    webChannel.exec({
	                        type: QWebChannelMessageTypes.connectToSignal,
	                        object: object.__id__,
	                        signal: signalIndex
	                    });
	                }
	            },
	            disconnect: function(callback) {
	                if (typeof(callback) !== "function") {
	                    console.error("Bad callback given to disconnect from signal " + signalName);
	                    return;
	                }
	                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];
	                var idx = object.__objectSignals__[signalIndex].indexOf(callback);
	                if (idx === -1) {
	                    console.error("Cannot find connection of signal " + signalName + " to " + callback.name);
	                    return;
	                }
	                object.__objectSignals__[signalIndex].splice(idx, 1);
	                if (!isPropertyNotifySignal && object.__objectSignals__[signalIndex].length === 0) {
	                    // only required for "pure" signals, handled separately for properties in propertyUpdate
	                    webChannel.exec({
	                        type: QWebChannelMessageTypes.disconnectFromSignal,
	                        object: object.__id__,
	                        signal: signalIndex
	                    });
	                }
	            }
	        };
	    }

	    /**
	     * Invokes all callbacks for the given signalname. Also works for property notify callbacks.
	     */
	    function invokeSignalCallbacks(signalName, signalArgs)
	    {
	        var connections = object.__objectSignals__[signalName];
	        if (connections) {
	            connections.forEach(function(callback) {
	                callback.apply(callback, signalArgs);
	            });
	        }
	    }

	    this.propertyUpdate = function(signals, propertyMap)
	    {
	        // update property cache
	        for (var propertyIndex in propertyMap) {
	            var propertyValue = propertyMap[propertyIndex];
	            object.__propertyCache__[propertyIndex] = propertyValue;
	        }

	        for (var signalName in signals) {
	            // Invoke all callbacks, as signalEmitted() does not. This ensures the
	            // property cache is updated before the callbacks are invoked.
	            invokeSignalCallbacks(signalName, signals[signalName]);
	        }
	    }

	    this.signalEmitted = function(signalName, signalArgs)
	    {
	        invokeSignalCallbacks(signalName, signalArgs);
	    }

	    function addMethod(methodData)
	    {
	        var methodName = methodData[0];
	        var methodIdx = methodData[1];
	        object[methodName] = function() {
	            var args = [];
	            var callback;
	            for (var i = 0; i < arguments.length; ++i) {
	                if (typeof arguments[i] === "function")
	                    callback = arguments[i];
	                else
	                    args.push(arguments[i]);
	            }

	            webChannel.exec({
	                "type": QWebChannelMessageTypes.invokeMethod,
	                "object": object.__id__,
	                "method": methodIdx,
	                "args": args
	            }, function(response) {
	                if (response !== undefined) {
	                    var result = object.unwrapQObject(response);
	                    if (callback) {
	                        (callback)(result);
	                    }
	                }
	            });
	        };
	    }

	    function bindGetterSetter(propertyInfo)
	    {
	        var propertyIndex = propertyInfo[0];
	        var propertyName = propertyInfo[1];
	        var notifySignalData = propertyInfo[2];
	        // initialize property cache with current value
	        // NOTE: if this is an object, it is not directly unwrapped as it might
	        // reference other QObject that we do not know yet
	        object.__propertyCache__[propertyIndex] = propertyInfo[3];

	        if (notifySignalData) {
	            if (notifySignalData[0] === 1) {
	                // signal name is optimized away, reconstruct the actual name
	                notifySignalData[0] = propertyName + "Changed";
	            }
	            addSignal(notifySignalData, true);
	        }

	        Object.defineProperty(object, propertyName, {
	            get: function () {
	                var propertyValue = object.__propertyCache__[propertyIndex];
	                if (propertyValue === undefined) {
	                    // This shouldn't happen
	                    console.warn("Undefined value in property cache for property \"" + propertyName + "\" in object " + object.__id__);
	                }

	                return propertyValue;
	            },
	            set: function(value) {
	                if (value === undefined) {
	                    console.warn("Property setter for " + propertyName + " called with undefined value!");
	                    return;
	                }
	                object.__propertyCache__[propertyIndex] = value;
	                webChannel.exec({
	                    "type": QWebChannelMessageTypes.setProperty,
	                    "object": object.__id__,
	                    "property": propertyIndex,
	                    "value": value
	                });
	            }
	        });

	    }

	    // ----------------------------------------------------------------------

	    data.methods.forEach(addMethod);

	    data.properties.forEach(bindGetterSetter);

	    data.signals.forEach(function(signal) { addSignal(signal, false); });

	    for (var name in data.enums) {
	        object[name] = data.enums[name];
	    }
	}

	//required for use with nodejs
	if (true) {
	    module.exports = {
	        QWebChannel: QWebChannel
	    };
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Utilities = __webpack_require__(6);
	var Shared = __webpack_require__(3);
	var NativeDispatcher = __webpack_require__(2);
	var SimulatorDispatcher = __webpack_require__(4);
	var qwebchannel = __webpack_require__(7);

	/** @module ShimLibrary - This module defines the WDC's shim library which is used
	to bridge the gap between the javascript code of the WDC and the driving context
	of the WDC (Tableau desktop, the simulator, etc.) */

	// This function should be called once bootstrapping has been completed and the
	// dispatcher and shared WDC objects are both created and available
	function bootstrappingFinished(_dispatcher, _shared) {
	  Utilities.copyFunctions(_dispatcher.publicInterface, window.tableau);
	  Utilities.copyFunctions(_dispatcher.privateInterface, window._tableau);
	  _shared.init();
	}

	// Initializes the wdc shim library. You must call this before doing anything with WDC
	module.exports.init = function() {

	  // The initial code here is the only place in our module which should have global
	  // knowledge of how all the WDC components are glued together. This is the only place
	  // which will know about the window object or other global objects. This code will be run
	  // immediately when the shim library loads and is responsible for determining the context
	  // which it is running it and setup a communications channel between the js & running code
	  var dispatcher = null;
	  var shared = null;

	  // Always define the private _tableau object at the start
	  window._tableau = {};

	  // Check to see if the tableauVersionBootstrap is defined as a global object. If so,
	  // we are running in the Tableau desktop/server context. If not, we're running in the simulator
	  if (!!window.tableauVersionBootstrap) {
	    // We have the tableau object defined
	    console.log("Initializing NativeDispatcher, Reporting version number");
	    window.tableauVersionBootstrap.ReportVersionNumber(("2.0.7"));
	    dispatcher = new NativeDispatcher(window);
	  } else if (!!window.qt && !!window.qt.webChannelTransport) {
	    console.log("Initializing NativeDispatcher for qwebchannel");
	    window.tableau = {};

	    // We're running in a context where the webChannelTransport is available. This means QWebEngine is in use
	    window.channel = new qwebchannel.QWebChannel(qt.webChannelTransport, function(channel) {
	      console.log("QWebChannel created successfully");

	      // Define the function which tableau will call after it has inserted all the required objects into the javascript frame
	      window._tableau._nativeSetupCompleted = function() {
	        // Once the native code tells us everything here is done, we should have all the expected objects inserted into js
	        dispatcher = new NativeDispatcher(channel.objects);
	        window.tableau = channel.objects.tableau;
	        shared.changeTableauApiObj(window.tableau);
	        bootstrappingFinished(dispatcher, shared);
	      };

	      // Actually call into the version bootstrapper to report our version number
	      channel.objects.tableauVersionBootstrap.ReportVersionNumber(("2.0.7"));
	    });
	  } else {
	    console.log("Version Bootstrap is not defined, Initializing SimulatorDispatcher");
	    window.tableau = {};
	    dispatcher = new SimulatorDispatcher(window);
	  }

	  // Initialize the shared WDC object and add in our enum values
	  shared = new Shared(window.tableau, window._tableau, window);

	  // Check to see if the dispatcher is already defined and immediately call the
	  // callback if so
	  if (dispatcher) {
	    bootstrappingFinished(dispatcher, shared);
	  }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDUzZTJjMGRlMzYxMzJiZmNkMTc2Iiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0VudW1zLmpzIiwid2VicGFjazovLy8uL05hdGl2ZURpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vU2hhcmVkLmpzIiwid2VicGFjazovLy8uL1NpbXVsYXRvckRpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vVGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vVXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL34vcXdlYmNoYW5uZWwvcXdlYmNoYW5uZWwuanMiLCJ3ZWJwYWNrOi8vLy4vdGFibGVhdXdkYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDUzZTJjMGRlMzYxMzJiZmNkMTc2XG4gKiovIiwiLy8gTWFpbiBlbnRyeSBwb2ludCB0byBwdWxsIHRvZ2V0aGVyIGV2ZXJ5dGhpbmcgbmVlZGVkIGZvciB0aGUgV0RDIHNoaW0gbGlicmFyeVxuLy8gVGhpcyBmaWxlIHdpbGwgYmUgZXhwb3J0ZWQgYXMgYSBidW5kbGVkIGpzIGZpbGUgYnkgd2VicGFjayBzbyBpdCBjYW4gYmUgaW5jbHVkZWRcbi8vIGluIGEgPHNjcmlwdD4gdGFnIGluIGFuIGh0bWwgZG9jdW1lbnQuIEFsZXJuYXRpdmVseSwgYSBjb25uZWN0b3IgbWF5IGluY2x1ZGVcbi8vIHRoaXMgd2hvbGUgcGFja2FnZSBpbiB0aGVpciBjb2RlIGFuZCB3b3VsZCBuZWVkIHRvIGNhbGwgaW5pdCBsaWtlIHRoaXNcbnZhciB0YWJsZWF1d2RjID0gcmVxdWlyZSgnLi90YWJsZWF1d2RjLmpzJyk7XG50YWJsZWF1d2RjLmluaXQoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiBUaGlzIGZpbGUgbGlzdHMgYWxsIG9mIHRoZSBlbnVtcyB3aGljaCBzaG91bGQgYXZhaWxhYmxlIGZvciB0aGUgV0RDICovXG52YXIgYWxsRW51bXMgPSB7XG4gIHBoYXNlRW51bSA6IHtcbiAgICBpbnRlcmFjdGl2ZVBoYXNlOiBcImludGVyYWN0aXZlXCIsXG4gICAgYXV0aFBoYXNlOiBcImF1dGhcIixcbiAgICBnYXRoZXJEYXRhUGhhc2U6IFwiZ2F0aGVyRGF0YVwiXG4gIH0sXG5cbiAgYXV0aFB1cnBvc2VFbnVtIDoge1xuICAgIGVwaGVtZXJhbDogXCJlcGhlbWVyYWxcIixcbiAgICBlbmR1cmluZzogXCJlbmR1cmluZ1wiXG4gIH0sXG5cbiAgYXV0aFR5cGVFbnVtIDoge1xuICAgIG5vbmU6IFwibm9uZVwiLFxuICAgIGJhc2ljOiBcImJhc2ljXCIsXG4gICAgY3VzdG9tOiBcImN1c3RvbVwiXG4gIH0sXG5cbiAgZGF0YVR5cGVFbnVtIDoge1xuICAgIGJvb2w6IFwiYm9vbFwiLFxuICAgIGRhdGU6IFwiZGF0ZVwiLFxuICAgIGRhdGV0aW1lOiBcImRhdGV0aW1lXCIsXG4gICAgZmxvYXQ6IFwiZmxvYXRcIixcbiAgICBpbnQ6IFwiaW50XCIsXG4gICAgc3RyaW5nOiBcInN0cmluZ1wiXG4gIH0sXG5cbiAgY29sdW1uUm9sZUVudW0gOiB7XG4gICAgICBkaW1lbnNpb246IFwiZGltZW5zaW9uXCIsXG4gICAgICBtZWFzdXJlOiBcIm1lYXN1cmVcIlxuICB9LFxuXG4gIGNvbHVtblR5cGVFbnVtIDoge1xuICAgICAgY29udGludW91czogXCJjb250aW51b3VzXCIsXG4gICAgICBkaXNjcmV0ZTogXCJkaXNjcmV0ZVwiXG4gIH0sXG5cbiAgYWdnVHlwZUVudW0gOiB7XG4gICAgICBzdW06IFwic3VtXCIsXG4gICAgICBhdmc6IFwiYXZnXCIsXG4gICAgICBtZWRpYW46IFwibWVkaWFuXCIsXG4gICAgICBjb3VudDogXCJjb3VudFwiLFxuICAgICAgY291bnRkOiBcImNvdW50X2Rpc3RcIlxuICB9LFxuXG4gIGdlb2dyYXBoaWNSb2xlRW51bSA6IHtcbiAgICAgIGFyZWFfY29kZTogXCJhcmVhX2NvZGVcIixcbiAgICAgIGNic2FfbXNhOiBcImNic2FfbXNhXCIsXG4gICAgICBjaXR5OiBcImNpdHlcIixcbiAgICAgIGNvbmdyZXNzaW9uYWxfZGlzdHJpY3Q6IFwiY29uZ3Jlc3Npb25hbF9kaXN0cmljdFwiLFxuICAgICAgY291bnRyeV9yZWdpb246IFwiY291bnRyeV9yZWdpb25cIixcbiAgICAgIGNvdW50eTogXCJjb3VudHlcIixcbiAgICAgIHN0YXRlX3Byb3ZpbmNlOiBcInN0YXRlX3Byb3ZpbmNlXCIsXG4gICAgICB6aXBfY29kZV9wb3N0Y29kZTogXCJ6aXBfY29kZV9wb3N0Y29kZVwiLFxuICAgICAgbGF0aXR1ZGU6IFwibGF0aXR1ZGVcIixcbiAgICAgIGxvbmdpdHVkZTogXCJsb25naXR1ZGVcIlxuICB9LFxuXG4gIHVuaXRzRm9ybWF0RW51bSA6IHtcbiAgICAgIHRob3VzYW5kczogXCJ0aG91c2FuZHNcIixcbiAgICAgIG1pbGxpb25zOiBcIm1pbGxpb25zXCIsXG4gICAgICBiaWxsaW9uc19lbmdsaXNoOiBcImJpbGxpb25zX2VuZ2xpc2hcIixcbiAgICAgIGJpbGxpb25zX3N0YW5kYXJkOiBcImJpbGxpb25zX3N0YW5kYXJkXCJcbiAgfSxcblxuICBudW1iZXJGb3JtYXRFbnVtIDoge1xuICAgICAgbnVtYmVyOiBcIm51bWJlclwiLFxuICAgICAgY3VycmVuY3k6IFwiY3VycmVuY3lcIixcbiAgICAgIHNjaWVudGlmaWM6IFwic2NpZW50aWZpY1wiLFxuICAgICAgcGVyY2VudGFnZTogXCJwZXJjZW50YWdlXCJcbiAgfSxcblxuICBsb2NhbGVFbnVtIDoge1xuICAgICAgYW1lcmljYTogXCJlbi11c1wiLFxuICAgICAgYnJhemlsOiAgXCJwdC1iclwiLFxuICAgICAgY2hpbmE6ICAgXCJ6aC1jblwiLFxuICAgICAgZnJhbmNlOiAgXCJmci1mclwiLFxuICAgICAgZ2VybWFueTogXCJkZS1kZVwiLFxuICAgICAgamFwYW46ICAgXCJqYS1qcFwiLFxuICAgICAga29yZWE6ICAgXCJrby1rclwiLFxuICAgICAgc3BhaW46ICAgXCJlcy1lc1wiXG4gIH0sXG5cbiAgam9pbkVudW0gOiB7XG4gICAgICBpbm5lcjogXCJpbm5lclwiLFxuICAgICAgbGVmdDogXCJsZWZ0XCJcbiAgfVxufVxuXG4vLyBBcHBsaWVzIHRoZSBlbnVtcyBhcyBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG5mdW5jdGlvbiBhcHBseSh0YXJnZXQpIHtcbiAgZm9yKHZhciBrZXkgaW4gYWxsRW51bXMpIHtcbiAgICB0YXJnZXRba2V5XSA9IGFsbEVudW1zW2tleV07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9FbnVtcy5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiBAY2xhc3MgVXNlZCBmb3IgY29tbXVuaWNhdGluZyBiZXR3ZWVuIFRhYmxlYXUgZGVza3RvcC9zZXJ2ZXIgYW5kIHRoZSBXREMnc1xuKiBKYXZhc2NyaXB0LiBpcyBwcmVkb21pbmFudGx5IGEgcGFzcy10aHJvdWdoIHRvIHRoZSBRdCBXZWJCcmlkZ2UgbWV0aG9kc1xuKiBAcGFyYW0gbmF0aXZlQXBpUm9vdE9iaiB7T2JqZWN0fSAtIFRoZSByb290IG9iamVjdCB3aGVyZSB0aGUgbmF0aXZlIEFwaSBtZXRob2RzXG4qIGFyZSBhdmFpbGFibGUuIEZvciBXZWJLaXQsIHRoaXMgaXMgd2luZG93LlxuKi9cbmZ1bmN0aW9uIE5hdGl2ZURpc3BhdGNoZXIgKG5hdGl2ZUFwaVJvb3RPYmopIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqID0gbmF0aXZlQXBpUm9vdE9iajtcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xuICB0aGlzLl9pbml0UHJpdmF0ZUludGVyZmFjZSgpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwdWJsaWMgaW50ZXJmYWNlIGZvciBOYXRpdmVEaXNwYXRjaGVyXCIpO1xuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHVibGljSW50ZXJmYWNlID0ge307XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gdGhpcy5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRGb3JBdXRoLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRXaXRoRXJyb3IuYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmFwaShkZXN0T3JpZ2luTGlzdCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfbG9nLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9zdWJtaXRDYWxsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhcInN1Ym1pdCBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc3VibWl0LmFwaSgpO1xufTtcblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHByaXZhdGUgaW50ZXJmYWNlIGZvciBOYXRpdmVEaXNwYXRjaGVyXCIpO1xuXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xuICB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XG5cbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcbiAgcHJpdmF0ZUludGVyZmFjZS5faW5pdENhbGxiYWNrID0gdGhpcy5faW5pdENhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSB0aGlzLl90YWJsZURhdGFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9kYXRhRG9uZUNhbGxiYWNrID0gdGhpcy5fZGF0YURvbmVDYWxsYmFjay5iaW5kKHRoaXMpO1xuXG4gIHRoaXMucHJpdmF0ZUludGVyZmFjZSA9IHByaXZhdGVJbnRlcmZhY2U7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCkge1xuICAgIGNvbnNvbGUubG9nKFwiaW5pdENhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9pbml0Q2FsbGJhY2suYXBpKCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkKSB7XG4gICAgY29uc29sZS5sb2coXCJzaHV0ZG93bkNhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2h1dGRvd25DYWxsYmFjay5hcGkoKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XG4gIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBhcmUgdXNpbmcgYSB2ZXJzaW9uIG9mIGRlc2t0b3Agd2hpY2ggaGFzIHRoZSBXRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrRXggZGVmaW5lZFxuICBpZiAoISF0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4KSB7XG4gICAgLy8gUHJvdmlkaW5nIHN0YW5kYXJkQ29ubmVjdGlvbnMgaXMgb3B0aW9uYWwgYnV0IHdlIGNhbid0IHBhc3MgdW5kZWZpbmVkIGJhY2sgYmVjYXVzZSBRdCB3aWxsIGNob2tlXG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeC5hcGkoc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zIHx8IFtdKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFjay5hcGkoc2NoZW1hKTtcbiAgfVxufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbih0YWJsZU5hbWUsIGRhdGEpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfdGFibGVEYXRhQ2FsbGJhY2suYXBpKHRhYmxlTmFtZSwgZGF0YSk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9kYXRhRG9uZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2RhdGFEb25lQ2FsbGJhY2suYXBpKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmF0aXZlRGlzcGF0Y2hlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9OYXRpdmVEaXNwYXRjaGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIFRhYmxlID0gcmVxdWlyZSgnLi9UYWJsZS5qcycpO1xudmFyIEVudW1zID0gcmVxdWlyZSgnLi9FbnVtcy5qcycpO1xuXG4vKiogQGNsYXNzIFRoaXMgY2xhc3MgcmVwcmVzZW50cyB0aGUgc2hhcmVkIHBhcnRzIG9mIHRoZSBqYXZhc2NyaXB0XG4qIGxpYnJhcnkgd2hpY2ggZG8gbm90IGhhdmUgYW55IGRlcGVuZGVuY2Ugb24gd2hldGhlciB3ZSBhcmUgcnVubmluZyBpblxuKiB0aGUgc2ltdWxhdG9yLCBpbiBUYWJsZWF1LCBvciBhbnl3aGVyZSBlbHNlXG4qIEBwYXJhbSB0YWJsZWF1QXBpT2JqIHtPYmplY3R9IC0gVGhlIGFscmVhZHkgY3JlYXRlZCB0YWJsZWF1IEFQSSBvYmplY3QgKHVzdWFsbHkgd2luZG93LnRhYmxlYXUpXG4qIEBwYXJhbSBwcml2YXRlQXBpT2JqIHtPYmplY3R9IC0gVGhlIGFscmVhZHkgY3JlYXRlZCBwcml2YXRlIEFQSSBvYmplY3QgKHVzdWFsbHkgd2luZG93Ll90YWJsZWF1KVxuKiBAcGFyYW0gZ2xvYmFsT2JqIHtPYmplY3R9IC0gVGhlIGdsb2JhbCBvYmplY3QgdG8gYXR0YWNoIHRoaW5ncyB0byAodXN1YWxseSB3aW5kb3cpXG4qL1xuZnVuY3Rpb24gU2hhcmVkICh0YWJsZWF1QXBpT2JqLCBwcml2YXRlQXBpT2JqLCBnbG9iYWxPYmopIHtcbiAgdGhpcy5wcml2YXRlQXBpT2JqID0gcHJpdmF0ZUFwaU9iajtcbiAgdGhpcy5nbG9iYWxPYmogPSBnbG9iYWxPYmo7XG4gIHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4gPSBmYWxzZTtcblxuICB0aGlzLmNoYW5nZVRhYmxlYXVBcGlPYmoodGFibGVhdUFwaU9iaik7XG59XG5cblxuU2hhcmVkLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHNoYXJlZCBXRENcIik7XG4gIHRoaXMuZ2xvYmFsT2JqLm9uZXJyb3IgPSB0aGlzLl9lcnJvckhhbmRsZXIuYmluZCh0aGlzKTtcblxuICAvLyBJbml0aWFsaXplIHRoZSBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBpbnZva2VkIGJ5IHRoZSBuYXRpdmUgY29kZVxuICB0aGlzLl9pbml0VHJpZ2dlckZ1bmN0aW9ucygpO1xuXG4gIC8vIEFzc2lnbiB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbnMgd2hpY2ggYXJlbid0IGF2YWlsaWJsZSBpbiB0aGlzIHZlcnNpb24gb2YgdGhlIEFQSVxuICB0aGlzLl9pbml0RGVwcmVjYXRlZEZ1bmN0aW9ucygpO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLmNoYW5nZVRhYmxlYXVBcGlPYmogPSBmdW5jdGlvbih0YWJsZWF1QXBpT2JqKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iaiA9IHRhYmxlYXVBcGlPYmo7XG5cbiAgLy8gQXNzaWduIG91ciBtYWtlICYgcmVnaXN0ZXIgZnVuY3Rpb25zIHJpZ2h0IGF3YXkgYmVjYXVzZSBhIGNvbm5lY3RvciBjYW4gdXNlXG4gIC8vIHRoZW0gaW1tZWRpYXRlbHksIGV2ZW4gYmVmb3JlIGJvb3RzdHJhcHBpbmcgaGFzIGNvbXBsZXRlZFxuICB0aGlzLnRhYmxlYXVBcGlPYmoubWFrZUNvbm5lY3RvciA9IHRoaXMuX21ha2VDb25uZWN0b3IuYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLnJlZ2lzdGVyQ29ubmVjdG9yID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0b3IuYmluZCh0aGlzKTtcblxuICBFbnVtcy5hcHBseSh0aGlzLnRhYmxlYXVBcGlPYmopO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9lcnJvckhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlLCBmaWxlLCBsaW5lLCBjb2x1bW4sIGVycm9yT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3JPYmopOyAvLyBwcmludCBlcnJvciBmb3IgZGVidWdnaW5nIGluIHRoZSBicm93c2VyXG4gIGlmICh0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbXNnID0gbWVzc2FnZTtcbiAgaWYoZXJyb3JPYmopIHtcbiAgICBtc2cgKz0gXCIgICBzdGFjazpcIiArIGVycm9yT2JqLnN0YWNrO1xuICB9IGVsc2Uge1xuICAgIG1zZyArPSBcIiAgIGZpbGU6IFwiICsgZmlsZTtcbiAgICBtc2cgKz0gXCIgICBsaW5lOiBcIiArIGxpbmU7XG4gIH1cblxuICBpZiAodGhpcy50YWJsZWF1QXBpT2JqICYmIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcikge1xuICAgIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihtc2cpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG1zZztcbiAgfVxuXG4gIHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4gPSB0cnVlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5fbWFrZUNvbm5lY3RvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmYXVsdEltcGxzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGNiKSB7IGNiKCk7IH0sXG4gICAgc2h1dGRvd246IGZ1bmN0aW9uKGNiKSB7IGNiKCk7IH1cbiAgfTtcblxuICByZXR1cm4gZGVmYXVsdEltcGxzO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9yZWdpc3RlckNvbm5lY3RvciA9IGZ1bmN0aW9uICh3ZGMpIHtcblxuICAvLyBkbyBzb21lIGVycm9yIGNoZWNraW5nIG9uIHRoZSB3ZGNcbiAgdmFyIGZ1bmN0aW9uTmFtZXMgPSBbXCJpbml0XCIsIFwic2h1dGRvd25cIiwgXCJnZXRTY2hlbWFcIiwgXCJnZXREYXRhXCJdO1xuICBmb3IgKHZhciBpaSA9IGZ1bmN0aW9uTmFtZXMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgIGlmICh0eXBlb2Yod2RjW2Z1bmN0aW9uTmFtZXNbaWldXSkgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgXCJUaGUgY29ubmVjdG9yIGRpZCBub3QgZGVmaW5lIHRoZSByZXF1aXJlZCBmdW5jdGlvbjogXCIgKyBmdW5jdGlvbk5hbWVzW2lpXTtcbiAgICB9XG4gIH07XG5cbiAgY29uc29sZS5sb2coXCJDb25uZWN0b3IgcmVnaXN0ZXJlZFwiKTtcblxuICB0aGlzLmdsb2JhbE9iai5fd2RjID0gd2RjO1xuICB0aGlzLl93ZGMgPSB3ZGM7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX2luaXRUcmlnZ2VyRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VySW5pdGlhbGl6YXRpb24gPSB0aGlzLl90cmlnZ2VySW5pdGlhbGl6YXRpb24uYmluZCh0aGlzKTtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJTY2hlbWFHYXRoZXJpbmcgPSB0aGlzLl90cmlnZ2VyU2NoZW1hR2F0aGVyaW5nLmJpbmQodGhpcyk7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyRGF0YUdhdGhlcmluZyA9IHRoaXMuX3RyaWdnZXJEYXRhR2F0aGVyaW5nLmJpbmQodGhpcyk7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyU2h1dGRvd24gPSB0aGlzLl90cmlnZ2VyU2h1dGRvd24uYmluZCh0aGlzKTtcbn1cblxuLy8gU3RhcnRzIHRoZSBXRENcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJJbml0aWFsaXphdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl93ZGMuaW5pdCh0aGlzLnByaXZhdGVBcGlPYmouX2luaXRDYWxsYmFjayk7XG59XG5cbi8vIFN0YXJ0cyB0aGUgc2NoZW1hIGdhdGhlcmluZyBwcm9jZXNzXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyU2NoZW1hR2F0aGVyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5nZXRTY2hlbWEodGhpcy5wcml2YXRlQXBpT2JqLl9zY2hlbWFDYWxsYmFjayk7XG59XG5cbi8vIFN0YXJ0cyB0aGUgZGF0YSBnYXRoZXJpbmcgcHJvY2Vzc1xuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlckRhdGFHYXRoZXJpbmcgPSBmdW5jdGlvbih0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpIHtcbiAgaWYgKHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcy5sZW5ndGggIT0gMSkge1xuICAgIHRocm93IChcIlVuZXhwZWN0ZWQgbnVtYmVyIG9mIHRhYmxlcyBzcGVjaWZpZWQuIEV4cGVjdGVkIDEsIGFjdHVhbCBcIiArIHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcy5sZW5ndGgudG9TdHJpbmcoKSk7XG4gIH1cblxuICB2YXIgdGFibGVBbmRJbmNyZW1udFZhbHVlID0gdGFibGVzQW5kSW5jcmVtZW50VmFsdWVzWzBdO1xuICB2YXIgdGFibGUgPSBuZXcgVGFibGUodGFibGVBbmRJbmNyZW1udFZhbHVlLnRhYmxlSW5mbywgdGFibGVBbmRJbmNyZW1udFZhbHVlLmluY3JlbWVudFZhbHVlLCB0aGlzLnByaXZhdGVBcGlPYmouX3RhYmxlRGF0YUNhbGxiYWNrKTtcbiAgdGhpcy5fd2RjLmdldERhdGEodGFibGUsIHRoaXMucHJpdmF0ZUFwaU9iai5fZGF0YURvbmVDYWxsYmFjayk7XG59XG5cbi8vIFRlbGxzIHRoZSBXREMgaXQncyB0aW1lIHRvIHNodXQgZG93blxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNodXRkb3duID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5zaHV0ZG93bih0aGlzLnByaXZhdGVBcGlPYmouX3NodXRkb3duQ2FsbGJhY2spO1xufVxuXG4vLyBJbml0aWFsaXplcyBhIHNlcmllcyBvZiBnbG9iYWwgY2FsbGJhY2tzIHdoaWNoIGhhdmUgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcblNoYXJlZC5wcm90b3R5cGUuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmhlYWRlcnNDYWxsYmFjayA9IHRoaXMuX2hlYWRlcnNDYWxsYmFjay5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmouZGF0YUNhbGxiYWNrID0gdGhpcy5fZGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuaW5pdENhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIGluaXRcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9oZWFkZXJzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZmllbGROYW1lcywgdHlwZXMpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5oZWFkZXJzQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fZGF0YUNhbGxiYWNrID0gZnVuY3Rpb24gKGRhdGEsIGxhc3RSZWNvcmRUb2tlbiwgbW9yZURhdGEpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5kYXRhQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5zaHV0ZG93bkNhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIHNodXRkb3duXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZWQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vU2hhcmVkLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIEBjbGFzcyBVc2VkIGZvciBjb21tdW5pY2F0aW5nIGJldHdlZW4gdGhlIHNpbXVsYXRvciBhbmQgd2ViIGRhdGEgY29ubmVjdG9yLiBJdCBkb2VzXG4qIHRoaXMgYnkgcGFzc2luZyBtZXNzYWdlcyBiZXR3ZWVuIHRoZSBXREMgd2luZG93IGFuZCBpdHMgcGFyZW50IHdpbmRvd1xuKiBAcGFyYW0gZ2xvYmFsT2JqIHtPYmplY3R9IC0gdGhlIGdsb2JhbCBvYmplY3QgdG8gZmluZCB0YWJsZWF1IGludGVyZmFjZXMgYXMgd2VsbFxuKiBhcyByZWdpc3RlciBldmVudHMgKHVzdWFsbHkgd2luZG93KVxuKi9cbmZ1bmN0aW9uIFNpbXVsYXRvckRpc3BhdGNoZXIgKGdsb2JhbE9iaikge1xuICB0aGlzLmdsb2JhbE9iaiA9IGdsb2JhbE9iajtcbiAgdGhpcy5faW5pdE1lc3NhZ2VIYW5kbGluZygpO1xuICB0aGlzLl9pbml0UHVibGljSW50ZXJmYWNlKCk7XG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0TWVzc2FnZUhhbmRsaW5nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIG1lc3NhZ2UgaGFuZGxpbmdcIik7XG4gIHRoaXMuZ2xvYmFsT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9yZWNlaXZlTWVzc2FnZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMuZ2xvYmFsT2JqLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIHRoaXMuX29uRG9tQ29udGVudExvYWRlZC5iaW5kKHRoaXMpKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX29uRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAvLyBBdHRlbXB0IHRvIG5vdGlmeSB0aGUgc2ltdWxhdG9yIHdpbmRvdyB0aGF0IHRoZSBXREMgaGFzIGxvYWRlZFxuICBpZih0aGlzLmdsb2JhbE9iai5wYXJlbnQgIT09IHdpbmRvdykge1xuICAgIHRoaXMuZ2xvYmFsT2JqLnBhcmVudC5wb3N0TWVzc2FnZSh0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKCdsb2FkZWQnKSwgJyonKTtcbiAgfVxuXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLm9wZW5lcikge1xuICAgIHRyeSB7IC8vIFdyYXAgaW4gdHJ5L2NhdGNoIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRVxuICAgICAgdGhpcy5nbG9iYWxPYmoub3BlbmVyLnBvc3RNZXNzYWdlKHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQoJ2xvYWRlZCcpLCAnKicpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS53YXJuKCdTb21lIHZlcnNpb25zIG9mIElFIG1heSBub3QgYWNjdXJhdGVseSBzaW11bGF0ZSB0aGUgV2ViIERhdGEgQ29ubmVjdG9yLiBQbGVhc2UgcmV0cnkgb24gYSBXZWJraXQgYmFzZWQgYnJvd3NlcicpO1xuICAgIH1cbiAgfVxufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcGFja2FnZVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9wVmFsdWVzID0ge1xuICAgIFwiY29ubmVjdGlvbk5hbWVcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uTmFtZSxcbiAgICBcImNvbm5lY3Rpb25EYXRhXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEsXG4gICAgXCJwYXNzd29yZFwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBhc3N3b3JkLFxuICAgIFwidXNlcm5hbWVcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZSxcbiAgICBcImluY3JlbWVudGFsRXh0cmFjdENvbHVtblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmluY3JlbWVudGFsRXh0cmFjdENvbHVtbixcbiAgICBcInZlcnNpb25OdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS52ZXJzaW9uTnVtYmVyLFxuICAgIFwibG9jYWxlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUubG9jYWxlLFxuICAgIFwiYXV0aFB1cnBvc2VcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5hdXRoUHVycG9zZVxuICB9O1xuXG4gIHJldHVybiBwcm9wVmFsdWVzO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYXBwbHlQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIGlmIChwcm9wcykge1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbk5hbWUgPSBwcm9wcy5jb25uZWN0aW9uTmFtZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25EYXRhID0gcHJvcHMuY29ubmVjdGlvbkRhdGE7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wYXNzd29yZCA9IHByb3BzLnBhc3N3b3JkO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWUgPSBwcm9wcy51c2VybmFtZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmluY3JlbWVudGFsRXh0cmFjdENvbHVtbiA9IHByb3BzLmluY3JlbWVudGFsRXh0cmFjdENvbHVtbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmxvY2FsZSA9IHByb3BzLmxvY2FsZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1Lmxhbmd1YWdlID0gcHJvcHMubG9jYWxlO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UgPSBwcm9wcy5hdXRoUHVycG9zZTtcbiAgfVxufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYnVpbGRNZXNzYWdlUGF5bG9hZCA9IGZ1bmN0aW9uKG1zZ05hbWUsIG1zZ0RhdGEsIHByb3BzKSB7XG4gIHZhciBtc2dPYmogPSB7XCJtc2dOYW1lXCI6IG1zZ05hbWUsIFwibXNnRGF0YVwiOiBtc2dEYXRhLCBcInByb3BzXCI6IHByb3BzLCBcInZlcnNpb25cIjogQlVJTERfTlVNQkVSIH07XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShtc2dPYmopO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2dOYW1lLCBtc2dEYXRhKSB7XG4gIHZhciBtZXNzYWdlUGF5bG9hZCA9IHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQobXNnTmFtZSwgbXNnRGF0YSwgdGhpcy5fcGFja2FnZVByb3BlcnR5VmFsdWVzKCkpO1xuXG4gIC8vIENoZWNrIGZpcnN0IHRvIHNlZSBpZiB3ZSBoYXZlIGEgbWVzc2FnZUhhbmRsZXIgZGVmaW5lZCB0byBwb3N0IHRoZSBtZXNzYWdlIHRvXG4gIGlmICh0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0ICE9ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIHRoaXMuZ2xvYmFsT2JqLndlYmtpdC5tZXNzYWdlSGFuZGxlcnMgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy53ZGNIYW5kbGVyICE9ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy53ZGNIYW5kbGVyLnBvc3RNZXNzYWdlKG1lc3NhZ2VQYXlsb2FkKTtcbiAgfSBlbHNlIGlmICghdGhpcy5fc291cmNlV2luZG93KSB7XG4gICAgdGhyb3cgXCJMb29rcyBsaWtlIHRoZSBXREMgaXMgY2FsbGluZyBhIHRhYmxlYXUgZnVuY3Rpb24gYmVmb3JlIHRhYmxlYXUuaW5pdCgpIGhhcyBiZWVuIGNhbGxlZC5cIlxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3NvdXJjZVdpbmRvdy5wb3N0TWVzc2FnZShtZXNzYWdlUGF5bG9hZCwgXCIqXCIpO1xuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRQYXlsb2FkT2JqID0gZnVuY3Rpb24ocGF5bG9hZFN0cmluZykge1xuICB2YXIgcGF5bG9hZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZFN0cmluZyk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQ7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9yZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIG1lc3NhZ2UhXCIpO1xuXG4gIHZhciB3ZGMgPSB0aGlzLmdsb2JhbE9iai5fd2RjO1xuICBpZiAoIXdkYykge1xuICAgIHRocm93IFwiTm8gV0RDIHJlZ2lzdGVyZWQuIERpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgdGFibGVhdS5yZWdpc3RlckNvbm5lY3Rvcj9cIjtcbiAgfVxuXG4gIHZhciBwYXlsb2FkT2JqID0gdGhpcy5fZ2V0UGF5bG9hZE9iaihldnQuZGF0YSk7XG4gIGlmKCFwYXlsb2FkT2JqKSByZXR1cm47IC8vIFRoaXMgbWVzc2FnZSBpcyBub3QgbmVlZGVkIGZvciBXRENcblxuICBpZiAoIXRoaXMuX3NvdXJjZVdpbmRvdykge1xuICAgIHRoaXMuX3NvdXJjZVdpbmRvdyA9IGV2dC5zb3VyY2VcbiAgfVxuXG4gIHZhciBtc2dEYXRhID0gcGF5bG9hZE9iai5tc2dEYXRhO1xuICB0aGlzLl9hcHBseVByb3BlcnR5VmFsdWVzKHBheWxvYWRPYmoucHJvcHMpO1xuXG4gIHN3aXRjaChwYXlsb2FkT2JqLm1zZ05hbWUpIHtcbiAgICBjYXNlIFwiaW5pdFwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5waGFzZSA9IG1zZ0RhdGEucGhhc2U7XG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VySW5pdGlhbGl6YXRpb24oKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzaHV0ZG93blwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlclNodXRkb3duKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2V0U2NoZW1hXCI6XG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2V0RGF0YVwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlckRhdGFHYXRoZXJpbmcobXNnRGF0YS50YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8qKioqIFBVQkxJQyBJTlRFUkZBQ0UgKioqKiovXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwdWJsaWMgaW50ZXJmYWNlXCIpO1xuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHVibGljSW50ZXJmYWNlID0ge307XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gdGhpcy5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XG5cbiAgLy8gQXNzaWduIHRoZSBwdWJsaWMgaW50ZXJmYWNlIHRvIHRoaXNcbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydEZvckF1dGhcIiwge1wibXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydFdpdGhFcnJvclwiLCB7XCJlcnJvck1zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gZnVuY3Rpb24oZGVzdE9yaWdpbkxpc3QpIHtcbiAgLy8gRG9uJ3QgYm90aGVyIHBhc3NpbmcgdGhpcyBiYWNrIHRvIHRoZSBzaW11bGF0b3Igc2luY2UgdGhlcmUncyBub3RoaW5nIGl0IGNhblxuICAvLyBkby4gSnVzdCBjYWxsIGJhY2sgdG8gdGhlIFdEQyBpbmRpY2F0aW5nIHRoYXQgaXQgd29ya2VkXG4gIGNvbnNvbGUubG9nKFwiQ3Jvc3MgT3JpZ2luIEV4Y2VwdGlvbiByZXF1ZXN0ZWQgaW4gdGhlIHNpbXVsYXRvci4gUHJldGVuZGluZyB0byB3b3JrLlwiKVxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2xvYmFsT2JqLl93ZGMuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb25Db21wbGV0ZWQoZGVzdE9yaWdpbkxpc3QpO1xuICB9LCAwKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImxvZ1wiLCB7XCJsb2dNc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJzdWJtaXRcIik7XG59O1xuXG4vKioqKiBQUklWQVRFIElOVEVSRkFDRSAqKioqKi9cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHJpdmF0ZUludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwcml2YXRlIGludGVyZmFjZVwiKTtcblxuICB2YXIgcHJpdmF0ZUludGVyZmFjZSA9IHt9O1xuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2h1dGRvd25DYWxsYmFjayA9IHRoaXMuX3NodXRkb3duQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2NoZW1hQ2FsbGJhY2sgPSB0aGlzLl9zY2hlbWFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX2RhdGFEb25lQ2FsbGJhY2sgPSB0aGlzLl9kYXRhRG9uZUNhbGxiYWNrLmJpbmQodGhpcyk7XG5cbiAgLy8gQXNzaWduIHRoZSBwcml2YXRlIGludGVyZmFjZSB0byB0aGlzXG4gIHRoaXMucHJpdmF0ZUludGVyZmFjZSA9IHByaXZhdGVJbnRlcmZhY2U7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJpbml0Q2FsbGJhY2tcIik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwic2h1dGRvd25DYWxsYmFja1wiKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX3NjaGVtYUNhbGxiYWNrXCIsIHtcInNjaGVtYVwiOiBzY2hlbWEsIFwic3RhbmRhcmRDb25uZWN0aW9uc1wiIDogc3RhbmRhcmRDb25uZWN0aW9ucyB8fCBbXX0pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbih0YWJsZU5hbWUsIGRhdGEpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfdGFibGVEYXRhQ2FsbGJhY2tcIiwgeyBcInRhYmxlTmFtZVwiOiB0YWJsZU5hbWUsIFwiZGF0YVwiOiBkYXRhIH0pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZGF0YURvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcIl9kYXRhRG9uZUNhbGxiYWNrXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRvckRpc3BhdGNoZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuKiBAY2xhc3MgUmVwcmVzZW50cyBhIHNpbmdsZSB0YWJsZSB3aGljaCBUYWJsZWF1IGhhcyByZXF1ZXN0ZWRcbiogQHBhcmFtIHRhYmxlSW5mbyB7T2JqZWN0fSAtIEluZm9ybWF0aW9uIGFib3V0IHRoZSB0YWJsZVxuKiBAcGFyYW0gaW5jcmVtZW50VmFsdWUge3N0cmluZz19IC0gSW5jcmVtZW50YWwgdXBkYXRlIHZhbHVlXG4qL1xuZnVuY3Rpb24gVGFibGUodGFibGVJbmZvLCBpbmNyZW1lbnRWYWx1ZSwgZGF0YUNhbGxiYWNrRm4pIHtcbiAgLyoqIEBtZW1iZXIge09iamVjdH0gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYmxlIHdoaWNoIGhhcyBiZWVuIHJlcXVlc3RlZC4gVGhpcyBpc1xuICBndWFyYW50ZWVkIHRvIGJlIG9uZSBvZiB0aGUgdGFibGVzIHRoZSBjb25uZWN0b3IgcmV0dXJuZWQgaW4gdGhlIGNhbGwgdG8gZ2V0U2NoZW1hLiAqL1xuICB0aGlzLnRhYmxlSW5mbyA9IHRhYmxlSW5mbztcblxuICAvKiogQG1lbWJlciB7c3RyaW5nfSBEZWZpbmVzIHRoZSBpbmNyZW1lbnRhbCB1cGRhdGUgdmFsdWUgZm9yIHRoaXMgdGFibGUuIEVtcHR5IHN0cmluZyBpZlxuICB0aGVyZSBpcyBub3QgYW4gaW5jcmVtZW50YWwgdXBkYXRlIHJlcXVlc3RlZC4gKi9cbiAgdGhpcy5pbmNyZW1lbnRWYWx1ZSA9IGluY3JlbWVudFZhbHVlIHx8IFwiXCI7XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuID0gZGF0YUNhbGxiYWNrRm47XG59XG5cbi8qKlxuKiBAbWV0aG9kIGFwcGVuZHMgdGhlIGdpdmVuIHJvd3MgdG8gdGhlIHNldCBvZiBkYXRhIGNvbnRhaW5lZCBpbiB0aGlzIHRhYmxlXG4qIEBwYXJhbSBkYXRhIHthcnJheX0gLSBFaXRoZXIgYW4gYXJyYXkgb2YgYXJyYXlzIG9yIGFuIGFycmF5IG9mIG9iamVjdHMgd2hpY2ggcmVwcmVzZW50XG4qIHRoZSBpbmRpdmlkdWFsIHJvd3Mgb2YgZGF0YSB0byBhcHBlbmQgdG8gdGhpcyB0YWJsZVxuKi9cblRhYmxlLnByb3RvdHlwZS5hcHBlbmRSb3dzID0gZnVuY3Rpb24oZGF0YSkge1xuICAvLyBEbyBzb21lIHF1aWNrIHZhbGlkYXRpb24gdGhhdCB0aGlzIGRhdGEgaXMgdGhlIGZvcm1hdCB3ZSBleHBlY3RcbiAgaWYgKCFkYXRhKSB7XG4gICAgY29uc29sZS53YXJuKFwicm93cyBkYXRhIGlzIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIExvZyBhIHdhcm5pbmcgYmVjYXVzZSB0aGUgZGF0YSBpcyBub3QgYW4gYXJyYXkgbGlrZSB3ZSBleHBlY3RlZFxuICAgIGNvbnNvbGUud2FybihcIlRhYmxlLmFwcGVuZFJvd3MgbXVzdCB0YWtlIGFuIGFycmF5IG9mIGFycmF5cyBvciBhcnJheSBvZiBvYmplY3RzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhbGwgYmFjayB3aXRoIHRoZSByb3dzIGZvciB0aGlzIHRhYmxlXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuKHRoaXMudGFibGVJbmZvLmlkLCBkYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9UYWJsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGNvcHlGdW5jdGlvbnMoc3JjLCBkZXN0KSB7XG4gIGZvcih2YXIga2V5IGluIHNyYykge1xuICAgIGlmICh0eXBlb2Ygc3JjW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb3B5RnVuY3Rpb25zID0gY29weUZ1bmN0aW9ucztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9VdGlsaXRpZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKipcbioqIENvcHlyaWdodCAoQykgMjAxNSBUaGUgUXQgQ29tcGFueSBMdGQuXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTQgS2xhcsOkbHZkYWxlbnMgRGF0YWtvbnN1bHQgQUIsIGEgS0RBQiBHcm91cCBjb21wYW55LCBpbmZvQGtkYWIuY29tLCBhdXRob3IgTWlsaWFuIFdvbGZmIDxtaWxpYW4ud29sZmZAa2RhYi5jb20+XG4qKiBDb250YWN0OiBodHRwOi8vd3d3LnF0LmlvL2xpY2Vuc2luZy9cbioqXG4qKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgUXRXZWJDaGFubmVsIG1vZHVsZSBvZiB0aGUgUXQgVG9vbGtpdC5cbioqXG4qKiAkUVRfQkVHSU5fTElDRU5TRTpMR1BMMjEkXG4qKiBDb21tZXJjaWFsIExpY2Vuc2UgVXNhZ2VcbioqIExpY2Vuc2VlcyBob2xkaW5nIHZhbGlkIGNvbW1lcmNpYWwgUXQgbGljZW5zZXMgbWF5IHVzZSB0aGlzIGZpbGUgaW5cbioqIGFjY29yZGFuY2Ugd2l0aCB0aGUgY29tbWVyY2lhbCBsaWNlbnNlIGFncmVlbWVudCBwcm92aWRlZCB3aXRoIHRoZVxuKiogU29mdHdhcmUgb3IsIGFsdGVybmF0aXZlbHksIGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgY29udGFpbmVkIGluXG4qKiBhIHdyaXR0ZW4gYWdyZWVtZW50IGJldHdlZW4geW91IGFuZCBUaGUgUXQgQ29tcGFueS4gRm9yIGxpY2Vuc2luZyB0ZXJtc1xuKiogYW5kIGNvbmRpdGlvbnMgc2VlIGh0dHA6Ly93d3cucXQuaW8vdGVybXMtY29uZGl0aW9ucy4gRm9yIGZ1cnRoZXJcbioqIGluZm9ybWF0aW9uIHVzZSB0aGUgY29udGFjdCBmb3JtIGF0IGh0dHA6Ly93d3cucXQuaW8vY29udGFjdC11cy5cbioqXG4qKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgVXNhZ2VcbioqIEFsdGVybmF0aXZlbHksIHRoaXMgZmlsZSBtYXkgYmUgdXNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXJcbioqIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyLjEgb3IgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZVxuKiogU29mdHdhcmUgRm91bmRhdGlvbiBhbmQgYXBwZWFyaW5nIGluIHRoZSBmaWxlIExJQ0VOU0UuTEdQTHYyMSBhbmRcbioqIExJQ0VOU0UuTEdQTHYzIGluY2x1ZGVkIGluIHRoZSBwYWNrYWdpbmcgb2YgdGhpcyBmaWxlLiBQbGVhc2UgcmV2aWV3IHRoZVxuKiogZm9sbG93aW5nIGluZm9ybWF0aW9uIHRvIGVuc3VyZSB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qKiByZXF1aXJlbWVudHMgd2lsbCBiZSBtZXQ6IGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvbGdwbC5odG1sIGFuZFxuKiogaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL29sZC1saWNlbnNlcy9sZ3BsLTIuMS5odG1sLlxuKipcbioqIEFzIGEgc3BlY2lhbCBleGNlcHRpb24sIFRoZSBRdCBDb21wYW55IGdpdmVzIHlvdSBjZXJ0YWluIGFkZGl0aW9uYWxcbioqIHJpZ2h0cy4gVGhlc2UgcmlnaHRzIGFyZSBkZXNjcmliZWQgaW4gVGhlIFF0IENvbXBhbnkgTEdQTCBFeGNlcHRpb25cbioqIHZlcnNpb24gMS4xLCBpbmNsdWRlZCBpbiB0aGUgZmlsZSBMR1BMX0VYQ0VQVElPTi50eHQgaW4gdGhpcyBwYWNrYWdlLlxuKipcbioqICRRVF9FTkRfTElDRU5TRSRcbioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzID0ge1xuICAgIHNpZ25hbDogMSxcbiAgICBwcm9wZXJ0eVVwZGF0ZTogMixcbiAgICBpbml0OiAzLFxuICAgIGlkbGU6IDQsXG4gICAgZGVidWc6IDUsXG4gICAgaW52b2tlTWV0aG9kOiA2LFxuICAgIGNvbm5lY3RUb1NpZ25hbDogNyxcbiAgICBkaXNjb25uZWN0RnJvbVNpZ25hbDogOCxcbiAgICBzZXRQcm9wZXJ0eTogOSxcbiAgICByZXNwb25zZTogMTAsXG59O1xuXG52YXIgUVdlYkNoYW5uZWwgPSBmdW5jdGlvbih0cmFuc3BvcnQsIGluaXRDYWxsYmFjaylcbntcbiAgICBpZiAodHlwZW9mIHRyYW5zcG9ydCAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdHJhbnNwb3J0LnNlbmQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlIFFXZWJDaGFubmVsIGV4cGVjdHMgYSB0cmFuc3BvcnQgb2JqZWN0IHdpdGggYSBzZW5kIGZ1bmN0aW9uIGFuZCBvbm1lc3NhZ2UgY2FsbGJhY2sgcHJvcGVydHkuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiIEdpdmVuIGlzOiB0cmFuc3BvcnQ6IFwiICsgdHlwZW9mKHRyYW5zcG9ydCkgKyBcIiwgdHJhbnNwb3J0LnNlbmQ6IFwiICsgdHlwZW9mKHRyYW5zcG9ydC5zZW5kKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2hhbm5lbCA9IHRoaXM7XG4gICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG5cbiAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbihkYXRhKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwudHJhbnNwb3J0LnNlbmQoZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmFuc3BvcnQub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhO1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnNpZ25hbDpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVNpZ25hbChkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMucmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVSZXNwb25zZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMucHJvcGVydHlVcGRhdGU6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVQcm9wZXJ0eVVwZGF0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZDpcIiwgbWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZXhlY0NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuZXhlY0lkID0gMDtcbiAgICB0aGlzLmV4ZWMgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcbiAgICB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIGlmIG5vIGNhbGxiYWNrIGlzIGdpdmVuLCBzZW5kIGRpcmVjdGx5XG4gICAgICAgICAgICBjaGFubmVsLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5uZWwuZXhlY0lkID09PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICAgICAgICAvLyB3cmFwXG4gICAgICAgICAgICBjaGFubmVsLmV4ZWNJZCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJpZFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBleGVjIG1lc3NhZ2Ugd2l0aCBwcm9wZXJ0eSBpZDogXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5pZCA9IGNoYW5uZWwuZXhlY0lkKys7XG4gICAgICAgIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1tkYXRhLmlkXSA9IGNhbGxiYWNrO1xuICAgICAgICBjaGFubmVsLnNlbmQoZGF0YSk7XG4gICAgfTtcblxuICAgIHRoaXMub2JqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5oYW5kbGVTaWduYWwgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IGNoYW5uZWwub2JqZWN0c1ttZXNzYWdlLm9iamVjdF07XG4gICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdC5zaWduYWxFbWl0dGVkKG1lc3NhZ2Uuc2lnbmFsLCBtZXNzYWdlLmFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHNpZ25hbDogXCIgKyBtZXNzYWdlLm9iamVjdCArIFwiOjpcIiArIG1lc3NhZ2Uuc2lnbmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgaWYgKCFtZXNzYWdlLmhhc093blByb3BlcnR5KFwiaWRcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHJlc3BvbnNlIG1lc3NhZ2UgcmVjZWl2ZWQ6IFwiLCBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW21lc3NhZ2UuaWRdKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGRlbGV0ZSBjaGFubmVsLmV4ZWNDYWxsYmFja3NbbWVzc2FnZS5pZF07XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVQcm9wZXJ0eVVwZGF0ZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBmb3IgKHZhciBpIGluIG1lc3NhZ2UuZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGFbaV07XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gY2hhbm5lbC5vYmplY3RzW2RhdGEub2JqZWN0XTtcbiAgICAgICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QucHJvcGVydHlVcGRhdGUoZGF0YS5zaWduYWxzLCBkYXRhLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgcHJvcGVydHkgdXBkYXRlOiBcIiArIGRhdGEub2JqZWN0ICsgXCI6OlwiICsgZGF0YS5zaWduYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaWRsZX0pO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWcgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgY2hhbm5lbC5zZW5kKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5kZWJ1ZywgZGF0YTogbWVzc2FnZX0pO1xuICAgIH07XG5cbiAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmluaXR9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIG9iamVjdE5hbWUgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBRT2JqZWN0KG9iamVjdE5hbWUsIGRhdGFbb2JqZWN0TmFtZV0sIGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyB1bndyYXAgcHJvcGVydGllcywgd2hpY2ggbWlnaHQgcmVmZXJlbmNlIG90aGVyIHJlZ2lzdGVyZWQgb2JqZWN0c1xuICAgICAgICBmb3IgKHZhciBvYmplY3ROYW1lIGluIGNoYW5uZWwub2JqZWN0cykge1xuICAgICAgICAgICAgY2hhbm5lbC5vYmplY3RzW29iamVjdE5hbWVdLnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5pdENhbGxiYWNrKSB7XG4gICAgICAgICAgICBpbml0Q2FsbGJhY2soY2hhbm5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pZGxlfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBRT2JqZWN0KG5hbWUsIGRhdGEsIHdlYkNoYW5uZWwpXG57XG4gICAgdGhpcy5fX2lkX18gPSBuYW1lO1xuICAgIHdlYkNoYW5uZWwub2JqZWN0c1tuYW1lXSA9IHRoaXM7XG5cbiAgICAvLyBMaXN0IG9mIGNhbGxiYWNrcyB0aGF0IGdldCBpbnZva2VkIHVwb24gc2lnbmFsIGVtaXNzaW9uXG4gICAgdGhpcy5fX29iamVjdFNpZ25hbHNfXyA9IHt9O1xuXG4gICAgLy8gQ2FjaGUgb2YgYWxsIHByb3BlcnRpZXMsIHVwZGF0ZWQgd2hlbiBhIG5vdGlmeSBzaWduYWwgaXMgZW1pdHRlZFxuICAgIHRoaXMuX19wcm9wZXJ0eUNhY2hlX18gPSB7fTtcblxuICAgIHZhciBvYmplY3QgPSB0aGlzO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdGhpcy51bndyYXBRT2JqZWN0ID0gZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAge1xuICAgICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgLy8gc3VwcG9ydCBsaXN0IG9mIG9iamVjdHNcbiAgICAgICAgICAgIHZhciByZXQgPSBuZXcgQXJyYXkocmVzcG9uc2UubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICByZXRbaV0gPSBvYmplY3QudW53cmFwUU9iamVjdChyZXNwb25zZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzcG9uc2VcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZVtcIl9fUU9iamVjdCpfX1wiXVxuICAgICAgICAgICAgfHwgcmVzcG9uc2VbXCJpZFwiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2JqZWN0SWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0pXG4gICAgICAgICAgICByZXR1cm4gd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgdW53cmFwIHVua25vd24gUU9iamVjdCBcIiArIG9iamVjdElkICsgXCIgd2l0aG91dCBkYXRhLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBxT2JqZWN0ID0gbmV3IFFPYmplY3QoIG9iamVjdElkLCByZXNwb25zZS5kYXRhLCB3ZWJDaGFubmVsICk7XG4gICAgICAgIHFPYmplY3QuZGVzdHJveWVkLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXSA9PT0gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdO1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBub3cgZGVsZXRlZCBRT2JqZWN0IHRvIGFuIGVtcHR5IHt9IG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGp1c3QgYXNzaWduaW5nIHt9IHRob3VnaCB3b3VsZCBub3QgaGF2ZSB0aGUgZGVzaXJlZCBlZmZlY3QsIGJ1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBiZWxvdyBhbHNvIGVuc3VyZXMgYWxsIGV4dGVybmFsIHJlZmVyZW5jZXMgd2lsbCBzZWUgdGhlIGVtcHR5IG1hcFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHRoaXMgZGV0b3VyIGlzIG5lY2Vzc2FyeSB0byB3b3JrYXJvdW5kIFFUQlVHLTQwMDIxXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWVzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4IGluIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHFPYmplY3RbcHJvcGVydHlOYW1lc1tpZHhdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBoZXJlIHdlIGFyZSBhbHJlYWR5IGluaXRpYWxpemVkLCBhbmQgdGh1cyBtdXN0IGRpcmVjdGx5IHVud3JhcCB0aGUgcHJvcGVydGllc1xuICAgICAgICBxT2JqZWN0LnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgcmV0dXJuIHFPYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy51bndyYXBQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJZHggaW4gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fKSB7XG4gICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJZHhdID0gb2JqZWN0LnVud3JhcFFPYmplY3Qob2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTaWduYWwoc2lnbmFsRGF0YSwgaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbClcbiAgICB7XG4gICAgICAgIHZhciBzaWduYWxOYW1lID0gc2lnbmFsRGF0YVswXTtcbiAgICAgICAgdmFyIHNpZ25hbEluZGV4ID0gc2lnbmFsRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W3NpZ25hbE5hbWVdID0ge1xuICAgICAgICAgICAgY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gY29ubmVjdCB0byBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ucHVzaChjYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzUHJvcGVydHlOb3RpZnlTaWduYWwgJiYgc2lnbmFsTmFtZSAhPT0gXCJkZXN0cm95ZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyBub3RlIHRoYXQgd2UgYWx3YXlzIGdldCBub3RpZmllZCBhYm91dCB0aGUgZGVzdHJveWVkIHNpZ25hbFxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuY29ubmVjdFRvU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gZGlzY29ubmVjdCBmcm9tIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZmluZCBjb25uZWN0aW9uIG9mIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUgKyBcIiB0byBcIiArIGNhbGxiYWNrLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcmVxdWlyZWQgZm9yIFwicHVyZVwiIHNpZ25hbHMsIGhhbmRsZWQgc2VwYXJhdGVseSBmb3IgcHJvcGVydGllcyBpbiBwcm9wZXJ0eVVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGlzY29ubmVjdEZyb21TaWduYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IHNpZ25hbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGFsbCBjYWxsYmFja3MgZm9yIHRoZSBnaXZlbiBzaWduYWxuYW1lLiBBbHNvIHdvcmtzIGZvciBwcm9wZXJ0eSBub3RpZnkgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb25zID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbE5hbWVdO1xuICAgICAgICBpZiAoY29ubmVjdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgc2lnbmFsQXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihzaWduYWxzLCBwcm9wZXJ0eU1hcClcbiAgICB7XG4gICAgICAgIC8vIHVwZGF0ZSBwcm9wZXJ0eSBjYWNoZVxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eUluZGV4IGluIHByb3BlcnR5TWFwKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5TWFwW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHNpZ25hbE5hbWUgaW4gc2lnbmFscykge1xuICAgICAgICAgICAgLy8gSW52b2tlIGFsbCBjYWxsYmFja3MsIGFzIHNpZ25hbEVtaXR0ZWQoKSBkb2VzIG5vdC4gVGhpcyBlbnN1cmVzIHRoZVxuICAgICAgICAgICAgLy8gcHJvcGVydHkgY2FjaGUgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrcyBhcmUgaW52b2tlZC5cbiAgICAgICAgICAgIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxzW3NpZ25hbE5hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsRW1pdHRlZCA9IGZ1bmN0aW9uKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpXG4gICAge1xuICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsQXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTWV0aG9kKG1ldGhvZERhdGEpXG4gICAge1xuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG1ldGhvZERhdGFbMF07XG4gICAgICAgIHZhciBtZXRob2RJZHggPSBtZXRob2REYXRhWzFdO1xuICAgICAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmludm9rZU1ldGhvZCxcbiAgICAgICAgICAgICAgICBcIm9iamVjdFwiOiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IG1ldGhvZElkeCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogYXJnc1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb2JqZWN0LnVud3JhcFFPYmplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYWxsYmFjaykocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRHZXR0ZXJTZXR0ZXIocHJvcGVydHlJbmZvKVxuICAgIHtcbiAgICAgICAgdmFyIHByb3BlcnR5SW5kZXggPSBwcm9wZXJ0eUluZm9bMF07XG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eUluZm9bMV07XG4gICAgICAgIHZhciBub3RpZnlTaWduYWxEYXRhID0gcHJvcGVydHlJbmZvWzJdO1xuICAgICAgICAvLyBpbml0aWFsaXplIHByb3BlcnR5IGNhY2hlIHdpdGggY3VycmVudCB2YWx1ZVxuICAgICAgICAvLyBOT1RFOiBpZiB0aGlzIGlzIGFuIG9iamVjdCwgaXQgaXMgbm90IGRpcmVjdGx5IHVud3JhcHBlZCBhcyBpdCBtaWdodFxuICAgICAgICAvLyByZWZlcmVuY2Ugb3RoZXIgUU9iamVjdCB0aGF0IHdlIGRvIG5vdCBrbm93IHlldFxuICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSBwcm9wZXJ0eUluZm9bM107XG5cbiAgICAgICAgaWYgKG5vdGlmeVNpZ25hbERhdGEpIHtcbiAgICAgICAgICAgIGlmIChub3RpZnlTaWduYWxEYXRhWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIG5hbWUgaXMgb3B0aW1pemVkIGF3YXksIHJlY29uc3RydWN0IHRoZSBhY3R1YWwgbmFtZVxuICAgICAgICAgICAgICAgIG5vdGlmeVNpZ25hbERhdGFbMF0gPSBwcm9wZXJ0eU5hbWUgKyBcIkNoYW5nZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZFNpZ25hbChub3RpZnlTaWduYWxEYXRhLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZG4ndCBoYXBwZW5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5kZWZpbmVkIHZhbHVlIGluIHByb3BlcnR5IGNhY2hlIGZvciBwcm9wZXJ0eSBcXFwiXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIlxcXCIgaW4gb2JqZWN0IFwiICsgb2JqZWN0Ll9faWRfXyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlByb3BlcnR5IHNldHRlciBmb3IgXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIiBjYWxsZWQgd2l0aCB1bmRlZmluZWQgdmFsdWUhXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5zZXRQcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgXCJvYmplY3RcIjogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBwcm9wZXJ0eUluZGV4LFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZGF0YS5tZXRob2RzLmZvckVhY2goYWRkTWV0aG9kKTtcblxuICAgIGRhdGEucHJvcGVydGllcy5mb3JFYWNoKGJpbmRHZXR0ZXJTZXR0ZXIpO1xuXG4gICAgZGF0YS5zaWduYWxzLmZvckVhY2goZnVuY3Rpb24oc2lnbmFsKSB7IGFkZFNpZ25hbChzaWduYWwsIGZhbHNlKTsgfSk7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEuZW51bXMpIHtcbiAgICAgICAgb2JqZWN0W25hbWVdID0gZGF0YS5lbnVtc1tuYW1lXTtcbiAgICB9XG59XG5cbi8vcmVxdWlyZWQgZm9yIHVzZSB3aXRoIG5vZGVqc1xuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgIFFXZWJDaGFubmVsOiBRV2ViQ2hhbm5lbFxuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9VdGlsaXRpZXMuanMnKTtcbnZhciBTaGFyZWQgPSByZXF1aXJlKCcuL1NoYXJlZC5qcycpO1xudmFyIE5hdGl2ZURpc3BhdGNoZXIgPSByZXF1aXJlKCcuL05hdGl2ZURpc3BhdGNoZXIuanMnKTtcbnZhciBTaW11bGF0b3JEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzJyk7XG52YXIgcXdlYmNoYW5uZWwgPSByZXF1aXJlKCdxd2ViY2hhbm5lbCcpO1xuXG4vKiogQG1vZHVsZSBTaGltTGlicmFyeSAtIFRoaXMgbW9kdWxlIGRlZmluZXMgdGhlIFdEQydzIHNoaW0gbGlicmFyeSB3aGljaCBpcyB1c2VkXG50byBicmlkZ2UgdGhlIGdhcCBiZXR3ZWVuIHRoZSBqYXZhc2NyaXB0IGNvZGUgb2YgdGhlIFdEQyBhbmQgdGhlIGRyaXZpbmcgY29udGV4dFxub2YgdGhlIFdEQyAoVGFibGVhdSBkZXNrdG9wLCB0aGUgc2ltdWxhdG9yLCBldGMuKSAqL1xuXG4vLyBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQgb25jZSBib290c3RyYXBwaW5nIGhhcyBiZWVuIGNvbXBsZXRlZCBhbmQgdGhlXG4vLyBkaXNwYXRjaGVyIGFuZCBzaGFyZWQgV0RDIG9iamVjdHMgYXJlIGJvdGggY3JlYXRlZCBhbmQgYXZhaWxhYmxlXG5mdW5jdGlvbiBib290c3RyYXBwaW5nRmluaXNoZWQoX2Rpc3BhdGNoZXIsIF9zaGFyZWQpIHtcbiAgVXRpbGl0aWVzLmNvcHlGdW5jdGlvbnMoX2Rpc3BhdGNoZXIucHVibGljSW50ZXJmYWNlLCB3aW5kb3cudGFibGVhdSk7XG4gIFV0aWxpdGllcy5jb3B5RnVuY3Rpb25zKF9kaXNwYXRjaGVyLnByaXZhdGVJbnRlcmZhY2UsIHdpbmRvdy5fdGFibGVhdSk7XG4gIF9zaGFyZWQuaW5pdCgpO1xufVxuXG4vLyBJbml0aWFsaXplcyB0aGUgd2RjIHNoaW0gbGlicmFyeS4gWW91IG11c3QgY2FsbCB0aGlzIGJlZm9yZSBkb2luZyBhbnl0aGluZyB3aXRoIFdEQ1xubW9kdWxlLmV4cG9ydHMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vIFRoZSBpbml0aWFsIGNvZGUgaGVyZSBpcyB0aGUgb25seSBwbGFjZSBpbiBvdXIgbW9kdWxlIHdoaWNoIHNob3VsZCBoYXZlIGdsb2JhbFxuICAvLyBrbm93bGVkZ2Ugb2YgaG93IGFsbCB0aGUgV0RDIGNvbXBvbmVudHMgYXJlIGdsdWVkIHRvZ2V0aGVyLiBUaGlzIGlzIHRoZSBvbmx5IHBsYWNlXG4gIC8vIHdoaWNoIHdpbGwga25vdyBhYm91dCB0aGUgd2luZG93IG9iamVjdCBvciBvdGhlciBnbG9iYWwgb2JqZWN0cy4gVGhpcyBjb2RlIHdpbGwgYmUgcnVuXG4gIC8vIGltbWVkaWF0ZWx5IHdoZW4gdGhlIHNoaW0gbGlicmFyeSBsb2FkcyBhbmQgaXMgcmVzcG9uc2libGUgZm9yIGRldGVybWluaW5nIHRoZSBjb250ZXh0XG4gIC8vIHdoaWNoIGl0IGlzIHJ1bm5pbmcgaXQgYW5kIHNldHVwIGEgY29tbXVuaWNhdGlvbnMgY2hhbm5lbCBiZXR3ZWVuIHRoZSBqcyAmIHJ1bm5pbmcgY29kZVxuICB2YXIgZGlzcGF0Y2hlciA9IG51bGw7XG4gIHZhciBzaGFyZWQgPSBudWxsO1xuXG4gIC8vIEFsd2F5cyBkZWZpbmUgdGhlIHByaXZhdGUgX3RhYmxlYXUgb2JqZWN0IGF0IHRoZSBzdGFydFxuICB3aW5kb3cuX3RhYmxlYXUgPSB7fTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIHRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwIGlzIGRlZmluZWQgYXMgYSBnbG9iYWwgb2JqZWN0LiBJZiBzbyxcbiAgLy8gd2UgYXJlIHJ1bm5pbmcgaW4gdGhlIFRhYmxlYXUgZGVza3RvcC9zZXJ2ZXIgY29udGV4dC4gSWYgbm90LCB3ZSdyZSBydW5uaW5nIGluIHRoZSBzaW11bGF0b3JcbiAgaWYgKCEhd2luZG93LnRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwKSB7XG4gICAgLy8gV2UgaGF2ZSB0aGUgdGFibGVhdSBvYmplY3QgZGVmaW5lZFxuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIE5hdGl2ZURpc3BhdGNoZXIsIFJlcG9ydGluZyB2ZXJzaW9uIG51bWJlclwiKTtcbiAgICB3aW5kb3cudGFibGVhdVZlcnNpb25Cb290c3RyYXAuUmVwb3J0VmVyc2lvbk51bWJlcihCVUlMRF9OVU1CRVIpO1xuICAgIGRpc3BhdGNoZXIgPSBuZXcgTmF0aXZlRGlzcGF0Y2hlcih3aW5kb3cpO1xuICB9IGVsc2UgaWYgKCEhd2luZG93LnF0ICYmICEhd2luZG93LnF0LndlYkNoYW5uZWxUcmFuc3BvcnQpIHtcbiAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBOYXRpdmVEaXNwYXRjaGVyIGZvciBxd2ViY2hhbm5lbFwiKTtcbiAgICB3aW5kb3cudGFibGVhdSA9IHt9O1xuXG4gICAgLy8gV2UncmUgcnVubmluZyBpbiBhIGNvbnRleHQgd2hlcmUgdGhlIHdlYkNoYW5uZWxUcmFuc3BvcnQgaXMgYXZhaWxhYmxlLiBUaGlzIG1lYW5zIFFXZWJFbmdpbmUgaXMgaW4gdXNlXG4gICAgd2luZG93LmNoYW5uZWwgPSBuZXcgcXdlYmNoYW5uZWwuUVdlYkNoYW5uZWwocXQud2ViQ2hhbm5lbFRyYW5zcG9ydCwgZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgICAgY29uc29sZS5sb2coXCJRV2ViQ2hhbm5lbCBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiKTtcblxuICAgICAgLy8gRGVmaW5lIHRoZSBmdW5jdGlvbiB3aGljaCB0YWJsZWF1IHdpbGwgY2FsbCBhZnRlciBpdCBoYXMgaW5zZXJ0ZWQgYWxsIHRoZSByZXF1aXJlZCBvYmplY3RzIGludG8gdGhlIGphdmFzY3JpcHQgZnJhbWVcbiAgICAgIHdpbmRvdy5fdGFibGVhdS5fbmF0aXZlU2V0dXBDb21wbGV0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgbmF0aXZlIGNvZGUgdGVsbHMgdXMgZXZlcnl0aGluZyBoZXJlIGlzIGRvbmUsIHdlIHNob3VsZCBoYXZlIGFsbCB0aGUgZXhwZWN0ZWQgb2JqZWN0cyBpbnNlcnRlZCBpbnRvIGpzXG4gICAgICAgIGRpc3BhdGNoZXIgPSBuZXcgTmF0aXZlRGlzcGF0Y2hlcihjaGFubmVsLm9iamVjdHMpO1xuICAgICAgICB3aW5kb3cudGFibGVhdSA9IGNoYW5uZWwub2JqZWN0cy50YWJsZWF1O1xuICAgICAgICBzaGFyZWQuY2hhbmdlVGFibGVhdUFwaU9iaih3aW5kb3cudGFibGVhdSk7XG4gICAgICAgIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChkaXNwYXRjaGVyLCBzaGFyZWQpO1xuICAgICAgfTtcblxuICAgICAgLy8gQWN0dWFsbHkgY2FsbCBpbnRvIHRoZSB2ZXJzaW9uIGJvb3RzdHJhcHBlciB0byByZXBvcnQgb3VyIHZlcnNpb24gbnVtYmVyXG4gICAgICBjaGFubmVsLm9iamVjdHMudGFibGVhdVZlcnNpb25Cb290c3RyYXAuUmVwb3J0VmVyc2lvbk51bWJlcihCVUlMRF9OVU1CRVIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiVmVyc2lvbiBCb290c3RyYXAgaXMgbm90IGRlZmluZWQsIEluaXRpYWxpemluZyBTaW11bGF0b3JEaXNwYXRjaGVyXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1ID0ge307XG4gICAgZGlzcGF0Y2hlciA9IG5ldyBTaW11bGF0b3JEaXNwYXRjaGVyKHdpbmRvdyk7XG4gIH1cblxuICAvLyBJbml0aWFsaXplIHRoZSBzaGFyZWQgV0RDIG9iamVjdCBhbmQgYWRkIGluIG91ciBlbnVtIHZhbHVlc1xuICBzaGFyZWQgPSBuZXcgU2hhcmVkKHdpbmRvdy50YWJsZWF1LCB3aW5kb3cuX3RhYmxlYXUsIHdpbmRvdyk7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkaXNwYXRjaGVyIGlzIGFscmVhZHkgZGVmaW5lZCBhbmQgaW1tZWRpYXRlbHkgY2FsbCB0aGVcbiAgLy8gY2FsbGJhY2sgaWYgc29cbiAgaWYgKGRpc3BhdGNoZXIpIHtcbiAgICBib290c3RyYXBwaW5nRmluaXNoZWQoZGlzcGF0Y2hlciwgc2hhcmVkKTtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90YWJsZWF1d2RjLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==