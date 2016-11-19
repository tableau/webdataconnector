/*! Build Number: 2.1.2 */
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
	var tableauwdc = __webpack_require__(19);
	tableauwdc.init();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var APPROVED_ORIGINS_KEY = "wdc_approved_origins";
	var SEPARATOR = ",";
	var Cookies = __webpack_require__(8);

	function _getApprovedOriginsValue() {
	  var result = Cookies.get(APPROVED_ORIGINS_KEY);
	  return result;
	}

	function _saveApprovedOrigins(originArray) {
	  var newOriginString = originArray.join(SEPARATOR);
	  console.log("Saving approved origins '" + newOriginString + "'");
	  
	  // We could potentially make this a longer term cookie instead of just for the current session
	  var result = Cookies.set(APPROVED_ORIGINS_KEY, newOriginString);
	  return result;
	}

	// Adds an approved origins to the list already saved in a session cookie
	function addApprovedOrigin(origin) {
	  if (origin) {
	    var origins = getApprovedOrigins();
	    origins.push(origin);
	    _saveApprovedOrigins(origins);
	  }
	}

	// Retrieves the origins which have already been approved by the user
	function getApprovedOrigins() {
	  var originsString = _getApprovedOriginsValue();
	  if (!originsString || 0 === originsString.length) {
	    return [];
	  }

	  var origins = originsString.split(SEPARATOR);
	  return origins;
	}

	module.exports.addApprovedOrigin = addApprovedOrigin;
	module.exports.getApprovedOrigins = getApprovedOrigins;


/***/ },
/* 2 */
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
/* 3 */
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
	  publicInterface.reportProgress = this._reportProgress.bind(this);

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

	NativeDispatcher.prototype._reportProgress = function (progress) {
	  // Report progress was added in 2.1 so it may not be available if Tableau only knows 2.0
	  if (!!this.nativeApiRootObj.WDCBridge_Api_reportProgress) {
	    this.nativeApiRootObj.WDCBridge_Api_reportProgress.api(progress);
	  } else {
	    console.log("reportProgress not available from this Tableau version");
	  }
	}

	NativeDispatcher.prototype._dataDoneCallback = function() {
	  this.nativeApiRootObj.WDCBridge_Api_dataDoneCallback.api();
	}

	module.exports = NativeDispatcher;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Table = __webpack_require__(6);
	var Enums = __webpack_require__(2);

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
	Shared.prototype._triggerDataGathering = function(tablesAndIncrementValues, filterInfo) {
	  if (tablesAndIncrementValues.length != 1) {
	    throw ("Unexpected number of tables specified. Expected 1, actual " + tablesAndIncrementValues.length.toString());
	  }

	  var tableAndIncremntValue = tablesAndIncrementValues[0];
	  var table = new Table(tableAndIncremntValue.tableInfo, filterInfo, tableAndIncremntValue.incrementValue, this.privateApiObj._tableDataCallback);
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ApprovedOrigins = __webpack_require__(1);

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
	    "usernameAlias": this.globalObj.tableau.usernameAlias,
	    "incrementalExtractColumn": this.globalObj.tableau.incrementalExtractColumn,
	    "versionNumber": this.globalObj.tableau.versionNumber,
	    "locale": this.globalObj.tableau.locale,
	    "authPurpose": this.globalObj.tableau.authPurpose,
	    "platformOS": this.globalObj.tableau.platformOS,
	    "platformVersion": this.globalObj.tableau.platformVersion,
	    "platformEdition": this.globalObj.tableau.platformEdition,
	    "platformBuildNumber": this.globalObj.tableau.platformBuildNumber
	  };

	  return propValues;
	}

	SimulatorDispatcher.prototype._applyPropertyValues = function(props) {
	  if (props) {
	    this.globalObj.tableau.connectionName = props.connectionName;
	    this.globalObj.tableau.connectionData = props.connectionData;
	    this.globalObj.tableau.password = props.password;
	    this.globalObj.tableau.username = props.username;
	    this.globalObj.tableau.usernameAlias = props.usernameAlias;
	    this.globalObj.tableau.incrementalExtractColumn = props.incrementalExtractColumn;
	    this.globalObj.tableau.locale = props.locale;
	    this.globalObj.tableau.language = props.locale;
	    this.globalObj.tableau.authPurpose = props.authPurpose;
	    this.globalObj.tableau.platformOS = props.platformOS;
	    this.globalObj.tableau.platformVersion = props.platformVersion;
	    this.globalObj.tableau.platformEdition = props.platformEdition;
	    this.globalObj.tableau.platformBuildNumber = props.platformBuildNumber;
	  }
	}

	SimulatorDispatcher.prototype._buildMessagePayload = function(msgName, msgData, props) {
	  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": ("2.1.2") };
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
	    // Make sure we only post this info back to the source origin the user approved in _getWebSecurityWarningConfirm
	    this._sourceWindow.postMessage(messagePayload, this._sourceOrigin);
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

	SimulatorDispatcher.prototype._getWebSecurityWarningConfirm = function() {
	  // Due to cross-origin security issues over https, we may not be able to retrieve _sourceWindow.
	  // Use sourceOrigin instead.
	  var origin = this._sourceOrigin;

	  var Uri = __webpack_require__(17);
	  var parsedOrigin = new Uri(origin);
	  var hostName = parsedOrigin.host();

	  var supportedHosts = ["localhost", "tableau.github.io"];
	  if (supportedHosts.indexOf(hostName) >= 0) {
	      return true;
	  }

	  // Whitelist Tableau domains
	  if (hostName && hostName.endsWith("online.tableau.com")) {
	      return true;
	  }

	  var alreadyApprovedOrigins = ApprovedOrigins.getApprovedOrigins();
	  if (alreadyApprovedOrigins.indexOf(origin) >= 0) {
	    // The user has already approved this origin, no need to ask again
	    console.log("Already approved the origin'" + origin + "', not asking again");
	    return true;
	  }

	  var localizedWarningTitle = this._getLocalizedString("webSecurityWarning");
	  var completeWarningMsg  = localizedWarningTitle + "\n\n" + hostName + "\n";
	  var isConfirmed = confirm(completeWarningMsg);

	  if (isConfirmed) {
	    // Set a session cookie to mark that we've approved this already
	    ApprovedOrigins.addApprovedOrigin(origin);
	  }

	  return isConfirmed;
	}

	SimulatorDispatcher.prototype._getCurrentLocale = function() {
	    // Use current browser's locale to get a localized warning message
	    var currentBrowserLanguage = (navigator.language || navigator.userLanguage);
	    var locale = currentBrowserLanguage? currentBrowserLanguage.substring(0, 2): "en";

	    var supportedLocales = ["de", "en", "es", "fr", "ja", "ko", "pt", "zh"];
	    // Fall back to English for other unsupported lanaguages
	    if (supportedLocales.indexOf(locale) < 0) {
	        locale = 'en';
	    }

	    return locale;
	}

	SimulatorDispatcher.prototype._getLocalizedString = function(stringKey) {
	    var locale = this._getCurrentLocale();

	    // Use static require here, otherwise webpack would generate a much bigger JS file
	    var deStringsMap = __webpack_require__(9);
	    var enStringsMap = __webpack_require__(10);
	    var esStringsMap = __webpack_require__(11);
	    var jaStringsMap = __webpack_require__(13);
	    var frStringsMap = __webpack_require__(12);
	    var koStringsMap = __webpack_require__(14);
	    var ptStringsMap = __webpack_require__(15);
	    var zhStringsMap = __webpack_require__(16);

	    var stringJsonMapByLocale =
	    {
	        "de": deStringsMap,
	        "en": enStringsMap,
	        "es": esStringsMap,
	        "fr": frStringsMap,
	        "ja": jaStringsMap,
	        "ko": koStringsMap,
	        "pt": ptStringsMap,
	        "zh": zhStringsMap
	    };

	    var localizedStringsJson = stringJsonMapByLocale[locale];
	    return localizedStringsJson[stringKey];
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
	    this._sourceWindow = evt.source;
	    this._sourceOrigin = evt.origin;
	  }

	  var msgData = payloadObj.msgData;
	  this._applyPropertyValues(payloadObj.props);

	  switch(payloadObj.msgName) {
	    case "init":
	      // Warn users about possible phinishing attacks
	      var confirmResult = this._getWebSecurityWarningConfirm();
	      if (!confirmResult) {
	        window.close();
	      } else {
	        this.globalObj.tableau.phase = msgData.phase;
	        this.globalObj._tableau.triggerInitialization();
	      }

	      break;
	    case "shutdown":
	      this.globalObj._tableau.triggerShutdown();
	      break;
	    case "getSchema":
	      this.globalObj._tableau.triggerSchemaGathering();
	      break;
	    case "getData":
	      this.globalObj._tableau.triggerDataGathering(msgData.tablesAndIncrementValues, msgData.filterInfo);
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
	  publicInterface.reportProgress = this._reportProgress.bind(this);
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
	  }.bind(this), 0);
	}

	SimulatorDispatcher.prototype._log = function(msg) {
	  this._sendMessage("log", {"logMsg": msg});
	}

	SimulatorDispatcher.prototype._reportProgress = function(msg) {
	  this._sendMessage("reportProgress", {"progressMsg": msg});
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
/* 6 */
/***/ function(module, exports) {

	/**
	* @class Represents a single table which Tableau has requested
	* @param tableInfo {Object} - Information about the table
	* @param incrementValue {string=} - Incremental update value
	*/
	function Table(tableInfo, filterInfo, incrementValue, dataCallbackFn) {
	  /** @member {Object} Information about the table which has been requested. This is
	  guaranteed to be one of the tables the connector returned in the call to getSchema. */
	  this.tableInfo = tableInfo;
		
		this.isFiltered = (filterInfo) ? true : false;

		this.filterInfo = filterInfo;

	  /** @member {string} Defines the incremental update value for this table. Empty string if
	  there is not an incremental update requested. */
	  this.incrementValue = incrementValue || "";

	  /** @private */
	  this._dataCallbackFn = dataCallbackFn;

	  // bind the public facing version of this function so it can be passed around
	  this.appendRows = this._appendRows.bind(this);
	}

	/**
	* @method appends the given rows to the set of data contained in this table
	* @param data {array} - Either an array of arrays or an array of objects which represent
	* the individual rows of data to append to this table
	*/
	Table.prototype._appendRows = function(data) {
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Cookies.js - 1.2.3
	 * https://github.com/ScottHamper/Cookies
	 *
	 * This is free and unencumbered software released into the public domain.
	 */
	(function (global, undefined) {
	    'use strict';

	    var factory = function (window) {
	        if (typeof window.document !== 'object') {
	            throw new Error('Cookies.js requires a `window` with a `document` object');
	        }

	        var Cookies = function (key, value, options) {
	            return arguments.length === 1 ?
	                Cookies.get(key) : Cookies.set(key, value, options);
	        };

	        // Allows for setter injection in unit tests
	        Cookies._document = window.document;

	        // Used to ensure cookie keys do not collide with
	        // built-in `Object` properties
	        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
	        
	        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

	        Cookies.defaults = {
	            path: '/',
	            secure: false
	        };

	        Cookies.get = function (key) {
	            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
	                Cookies._renewCache();
	            }
	            
	            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

	            return value === undefined ? undefined : decodeURIComponent(value);
	        };

	        Cookies.set = function (key, value, options) {
	            options = Cookies._getExtendedOptions(options);
	            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

	            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

	            return Cookies;
	        };

	        Cookies.expire = function (key, options) {
	            return Cookies.set(key, undefined, options);
	        };

	        Cookies._getExtendedOptions = function (options) {
	            return {
	                path: options && options.path || Cookies.defaults.path,
	                domain: options && options.domain || Cookies.defaults.domain,
	                expires: options && options.expires || Cookies.defaults.expires,
	                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
	            };
	        };

	        Cookies._isValidDate = function (date) {
	            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	        };

	        Cookies._getExpiresDate = function (expires, now) {
	            now = now || new Date();

	            if (typeof expires === 'number') {
	                expires = expires === Infinity ?
	                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
	            } else if (typeof expires === 'string') {
	                expires = new Date(expires);
	            }

	            if (expires && !Cookies._isValidDate(expires)) {
	                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
	            }

	            return expires;
	        };

	        Cookies._generateCookieString = function (key, value, options) {
	            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
	            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
	            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
	            options = options || {};

	            var cookieString = key + '=' + value;
	            cookieString += options.path ? ';path=' + options.path : '';
	            cookieString += options.domain ? ';domain=' + options.domain : '';
	            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
	            cookieString += options.secure ? ';secure' : '';

	            return cookieString;
	        };

	        Cookies._getCacheFromString = function (documentCookie) {
	            var cookieCache = {};
	            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

	            for (var i = 0; i < cookiesArray.length; i++) {
	                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

	                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
	                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
	                }
	            }

	            return cookieCache;
	        };

	        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
	            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
	            var separatorIndex = cookieString.indexOf('=');

	            // IE omits the "=" when the cookie value is an empty string
	            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

	            var key = cookieString.substr(0, separatorIndex);
	            var decodedKey;
	            try {
	                decodedKey = decodeURIComponent(key);
	            } catch (e) {
	                if (console && typeof console.error === 'function') {
	                    console.error('Could not decode cookie with key "' + key + '"', e);
	                }
	            }
	            
	            return {
	                key: decodedKey,
	                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
	            };
	        };

	        Cookies._renewCache = function () {
	            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
	            Cookies._cachedDocumentCookie = Cookies._document.cookie;
	        };

	        Cookies._areEnabled = function () {
	            var testKey = 'cookies.js';
	            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
	            Cookies.expire(testKey);
	            return areEnabled;
	        };

	        Cookies.enabled = Cookies._areEnabled();

	        return Cookies;
	    };
	    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

	    // AMD support
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return cookiesExport; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    // CommonJS/Node.js support
	    } else if (typeof exports === 'object') {
	        // Support Node.js specific `module.exports` (which can be a function)
	        if (typeof module === 'object' && typeof module.exports === 'object') {
	            exports = module.exports = cookiesExport;
	        }
	        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
	        exports.Cookies = cookiesExport;
	    } else {
	        global.Cookies = cookiesExport;
	    }
	})(typeof window === 'undefined' ? this : window);

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "wwTo help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jsUri
	 * https://github.com/derek-watson/jsUri
	 *
	 * Copyright 2013, Derek Watson
	 * Released under the MIT license.
	 *
	 * Includes parseUri regular expressions
	 * http://blog.stevenlevithan.com/archives/parseuri
	 * Copyright 2007, Steven Levithan
	 * Released under the MIT license.
	 */

	 /*globals define, module */

	(function(global) {

	  var re = {
	    starts_with_slashes: /^\/+/,
	    ends_with_slashes: /\/+$/,
	    pluses: /\+/g,
	    query_separator: /[&;]/,
	    uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?(\[[0-9a-fA-F:.]+\]|[^:\/?#]*)(?::(\d+|(?=:)))?(:)?)((((?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	  };

	  /**
	   * Define forEach for older js environments
	   * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
	   */
	  if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function(callback, thisArg) {
	      var T, k;

	      if (this == null) {
	        throw new TypeError(' this is null or not defined');
	      }

	      var O = Object(this);
	      var len = O.length >>> 0;

	      if (typeof callback !== "function") {
	        throw new TypeError(callback + ' is not a function');
	      }

	      if (arguments.length > 1) {
	        T = thisArg;
	      }

	      k = 0;

	      while (k < len) {
	        var kValue;
	        if (k in O) {
	          kValue = O[k];
	          callback.call(T, kValue, k, O);
	        }
	        k++;
	      }
	    };
	  }

	  /**
	   * unescape a query param value
	   * @param  {string} s encoded value
	   * @return {string}   decoded value
	   */
	  function decode(s) {
	    if (s) {
	        s = s.toString().replace(re.pluses, '%20');
	        s = decodeURIComponent(s);
	    }
	    return s;
	  }

	  /**
	   * Breaks a uri string down into its individual parts
	   * @param  {string} str uri
	   * @return {object}     parts
	   */
	  function parseUri(str) {
	    var parser = re.uri_parser;
	    var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "isColonUri", "relative", "path", "directory", "file", "query", "anchor"];
	    var m = parser.exec(str || '');
	    var parts = {};

	    parserKeys.forEach(function(key, i) {
	      parts[key] = m[i] || '';
	    });

	    return parts;
	  }

	  /**
	   * Breaks a query string down into an array of key/value pairs
	   * @param  {string} str query
	   * @return {array}      array of arrays (key/value pairs)
	   */
	  function parseQuery(str) {
	    var i, ps, p, n, k, v, l;
	    var pairs = [];

	    if (typeof(str) === 'undefined' || str === null || str === '') {
	      return pairs;
	    }

	    if (str.indexOf('?') === 0) {
	      str = str.substring(1);
	    }

	    ps = str.toString().split(re.query_separator);

	    for (i = 0, l = ps.length; i < l; i++) {
	      p = ps[i];
	      n = p.indexOf('=');

	      if (n !== 0) {
	        k = decode(p.substring(0, n));
	        v = decode(p.substring(n + 1));
	        pairs.push(n === -1 ? [p, null] : [k, v]);
	      }

	    }
	    return pairs;
	  }

	  /**
	   * Creates a new Uri object
	   * @constructor
	   * @param {string} str
	   */
	  function Uri(str) {
	    this.uriParts = parseUri(str);
	    this.queryPairs = parseQuery(this.uriParts.query);
	    this.hasAuthorityPrefixUserPref = null;
	  }

	  /**
	   * Define getter/setter methods
	   */
	  ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function(key) {
	    Uri.prototype[key] = function(val) {
	      if (typeof val !== 'undefined') {
	        this.uriParts[key] = val;
	      }
	      return this.uriParts[key];
	    };
	  });

	  /**
	   * if there is no protocol, the leading // can be enabled or disabled
	   * @param  {Boolean}  val
	   * @return {Boolean}
	   */
	  Uri.prototype.hasAuthorityPrefix = function(val) {
	    if (typeof val !== 'undefined') {
	      this.hasAuthorityPrefixUserPref = val;
	    }

	    if (this.hasAuthorityPrefixUserPref === null) {
	      return (this.uriParts.source.indexOf('//') !== -1);
	    } else {
	      return this.hasAuthorityPrefixUserPref;
	    }
	  };

	  Uri.prototype.isColonUri = function (val) {
	    if (typeof val !== 'undefined') {
	      this.uriParts.isColonUri = !!val;
	    } else {
	      return !!this.uriParts.isColonUri;
	    }
	  };

	  /**
	   * Serializes the internal state of the query pairs
	   * @param  {string} [val]   set a new query string
	   * @return {string}         query string
	   */
	  Uri.prototype.query = function(val) {
	    var s = '', i, param, l;

	    if (typeof val !== 'undefined') {
	      this.queryPairs = parseQuery(val);
	    }

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (s.length > 0) {
	        s += '&';
	      }
	      if (param[1] === null) {
	        s += param[0];
	      } else {
	        s += param[0];
	        s += '=';
	        if (typeof param[1] !== 'undefined') {
	          s += encodeURIComponent(param[1]);
	        }
	      }
	    }
	    return s.length > 0 ? '?' + s : s;
	  };

	  /**
	   * returns the first query param value found for the key
	   * @param  {string} key query key
	   * @return {string}     first value found for key
	   */
	  Uri.prototype.getQueryParamValue = function (key) {
	    var param, i, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        return param[1];
	      }
	    }
	  };

	  /**
	   * returns an array of query param values for the key
	   * @param  {string} key query key
	   * @return {array}      array of values
	   */
	  Uri.prototype.getQueryParamValues = function (key) {
	    var arr = [], i, param, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        arr.push(param[1]);
	      }
	    }
	    return arr;
	  };

	  /**
	   * removes query parameters
	   * @param  {string} key     remove values for key
	   * @param  {val}    [val]   remove a specific value, otherwise removes all
	   * @return {Uri}            returns self for fluent chaining
	   */
	  Uri.prototype.deleteQueryParam = function (key, val) {
	    var arr = [], i, param, keyMatchesFilter, valMatchesFilter, l;

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {

	      param = this.queryPairs[i];
	      keyMatchesFilter = decode(param[0]) === decode(key);
	      valMatchesFilter = param[1] === val;

	      if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
	        arr.push(param);
	      }
	    }

	    this.queryPairs = arr;

	    return this;
	  };

	  /**
	   * adds a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.addQueryParam = function (key, val, index) {
	    if (arguments.length === 3 && index !== -1) {
	      index = Math.min(index, this.queryPairs.length);
	      this.queryPairs.splice(index, 0, [key, val]);
	    } else if (arguments.length > 0) {
	      this.queryPairs.push([key, val]);
	    }
	    return this;
	  };

	  /**
	   * test for the existence of a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.hasQueryParam = function (key) {
	    var i, len = this.queryPairs.length;
	    for (i = 0; i < len; i++) {
	      if (this.queryPairs[i][0] == key)
	        return true;
	    }
	    return false;
	  };

	  /**
	   * replaces query param values
	   * @param  {string} key         key to replace value for
	   * @param  {string} newVal      new value
	   * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
	    var index = -1, len = this.queryPairs.length, i, param;

	    if (arguments.length === 3) {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
	          index = i;
	          break;
	        }
	      }
	      if (index >= 0) {
	        this.deleteQueryParam(key, decode(oldVal)).addQueryParam(key, newVal, index);
	      }
	    } else {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key)) {
	          index = i;
	          break;
	        }
	      }
	      this.deleteQueryParam(key);
	      this.addQueryParam(key, newVal, index);
	    }
	    return this;
	  };

	  /**
	   * Define fluent setter methods (setProtocol, setHasAuthorityPrefix, etc)
	   */
	  ['protocol', 'hasAuthorityPrefix', 'isColonUri', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
	    var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
	    Uri.prototype[method] = function(val) {
	      this[key](val);
	      return this;
	    };
	  });

	  /**
	   * Scheme name, colon and doubleslash, as required
	   * @return {string} http:// or possibly just //
	   */
	  Uri.prototype.scheme = function() {
	    var s = '';

	    if (this.protocol()) {
	      s += this.protocol();
	      if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
	        s += ':';
	      }
	      s += '//';
	    } else {
	      if (this.hasAuthorityPrefix() && this.host()) {
	        s += '//';
	      }
	    }

	    return s;
	  };

	  /**
	   * Same as Mozilla nsIURI.prePath
	   * @return {string} scheme://user:password@host:port
	   * @see  https://developer.mozilla.org/en/nsIURI
	   */
	  Uri.prototype.origin = function() {
	    var s = this.scheme();

	    if (this.userInfo() && this.host()) {
	      s += this.userInfo();
	      if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
	        s += '@';
	      }
	    }

	    if (this.host()) {
	      s += this.host();
	      if (this.port() || (this.path() && this.path().substr(0, 1).match(/[0-9]/))) {
	        s += ':' + this.port();
	      }
	    }

	    return s;
	  };

	  /**
	   * Adds a trailing slash to the path
	   */
	  Uri.prototype.addTrailingSlash = function() {
	    var path = this.path() || '';

	    if (path.substr(-1) !== '/') {
	      this.path(path + '/');
	    }

	    return this;
	  };

	  /**
	   * Serializes the internal state of the Uri object
	   * @return {string}
	   */
	  Uri.prototype.toString = function() {
	    var path, s = this.origin();

	    if (this.isColonUri()) {
	      if (this.path()) {
	        s += ':'+this.path();
	      }
	    } else if (this.path()) {
	      path = this.path();
	      if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
	        s += '/';
	      } else {
	        if (s) {
	          s.replace(re.ends_with_slashes, '/');
	        }
	        path = path.replace(re.starts_with_slashes, '/');
	      }
	      s += path;
	    } else {
	      if (this.host() && (this.query().toString() || this.anchor())) {
	        s += '/';
	      }
	    }
	    if (this.query().toString()) {
	      s += this.query().toString();
	    }

	    if (this.anchor()) {
	      if (this.anchor().indexOf('#') !== 0) {
	        s += '#';
	      }
	      s += this.anchor();
	    }

	    return s;
	  };

	  /**
	   * Clone a Uri object
	   * @return {Uri} duplicate copy of the Uri
	   */
	  Uri.prototype.clone = function() {
	    return new Uri(this.toString());
	  };

	  /**
	   * export via AMD or CommonJS, otherwise leak a global
	   */
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Uri;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = Uri;
	  } else {
	    global.Uri = Uri;
	  }
	}(this));


/***/ },
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Utilities = __webpack_require__(7);
	var Shared = __webpack_require__(4);
	var NativeDispatcher = __webpack_require__(3);
	var SimulatorDispatcher = __webpack_require__(5);
	var qwebchannel = __webpack_require__(18);

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
	    window.tableauVersionBootstrap.ReportVersionNumber(("2.1.2"));
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
	      channel.objects.tableauVersionBootstrap.ReportVersionNumber(("2.1.2"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDBiMjM0MGIzMDgzMzBhNTM5ZjBlIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0FwcHJvdmVkT3JpZ2lucy5qcyIsIndlYnBhY2s6Ly8vLi9FbnVtcy5qcyIsIndlYnBhY2s6Ly8vLi9OYXRpdmVEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1RhYmxlLmpzIiwid2VicGFjazovLy8uL1V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nvb2tpZXMtanMvZGlzdC9jb29raWVzLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24iLCJ3ZWJwYWNrOi8vLy4vfi9qc3VyaS9VcmkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi90YWJsZWF1d2RjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBiMjM0MGIzMDgzMzBhNTM5ZjBlIiwiLy8gTWFpbiBlbnRyeSBwb2ludCB0byBwdWxsIHRvZ2V0aGVyIGV2ZXJ5dGhpbmcgbmVlZGVkIGZvciB0aGUgV0RDIHNoaW0gbGlicmFyeVxuLy8gVGhpcyBmaWxlIHdpbGwgYmUgZXhwb3J0ZWQgYXMgYSBidW5kbGVkIGpzIGZpbGUgYnkgd2VicGFjayBzbyBpdCBjYW4gYmUgaW5jbHVkZWRcbi8vIGluIGEgPHNjcmlwdD4gdGFnIGluIGFuIGh0bWwgZG9jdW1lbnQuIEFsZXJuYXRpdmVseSwgYSBjb25uZWN0b3IgbWF5IGluY2x1ZGVcbi8vIHRoaXMgd2hvbGUgcGFja2FnZSBpbiB0aGVpciBjb2RlIGFuZCB3b3VsZCBuZWVkIHRvIGNhbGwgaW5pdCBsaWtlIHRoaXNcbnZhciB0YWJsZWF1d2RjID0gcmVxdWlyZSgnLi90YWJsZWF1d2RjLmpzJyk7XG50YWJsZWF1d2RjLmluaXQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEFQUFJPVkVEX09SSUdJTlNfS0VZID0gXCJ3ZGNfYXBwcm92ZWRfb3JpZ2luc1wiO1xudmFyIFNFUEFSQVRPUiA9IFwiLFwiO1xudmFyIENvb2tpZXMgPSByZXF1aXJlKCdjb29raWVzLWpzJyk7XG5cbmZ1bmN0aW9uIF9nZXRBcHByb3ZlZE9yaWdpbnNWYWx1ZSgpIHtcbiAgdmFyIHJlc3VsdCA9IENvb2tpZXMuZ2V0KEFQUFJPVkVEX09SSUdJTlNfS0VZKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gX3NhdmVBcHByb3ZlZE9yaWdpbnMob3JpZ2luQXJyYXkpIHtcbiAgdmFyIG5ld09yaWdpblN0cmluZyA9IG9yaWdpbkFycmF5LmpvaW4oU0VQQVJBVE9SKTtcbiAgY29uc29sZS5sb2coXCJTYXZpbmcgYXBwcm92ZWQgb3JpZ2lucyAnXCIgKyBuZXdPcmlnaW5TdHJpbmcgKyBcIidcIik7XG4gIFxuICAvLyBXZSBjb3VsZCBwb3RlbnRpYWxseSBtYWtlIHRoaXMgYSBsb25nZXIgdGVybSBjb29raWUgaW5zdGVhZCBvZiBqdXN0IGZvciB0aGUgY3VycmVudCBzZXNzaW9uXG4gIHZhciByZXN1bHQgPSBDb29raWVzLnNldChBUFBST1ZFRF9PUklHSU5TX0tFWSwgbmV3T3JpZ2luU3RyaW5nKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQWRkcyBhbiBhcHByb3ZlZCBvcmlnaW5zIHRvIHRoZSBsaXN0IGFscmVhZHkgc2F2ZWQgaW4gYSBzZXNzaW9uIGNvb2tpZVxuZnVuY3Rpb24gYWRkQXBwcm92ZWRPcmlnaW4ob3JpZ2luKSB7XG4gIGlmIChvcmlnaW4pIHtcbiAgICB2YXIgb3JpZ2lucyA9IGdldEFwcHJvdmVkT3JpZ2lucygpO1xuICAgIG9yaWdpbnMucHVzaChvcmlnaW4pO1xuICAgIF9zYXZlQXBwcm92ZWRPcmlnaW5zKG9yaWdpbnMpO1xuICB9XG59XG5cbi8vIFJldHJpZXZlcyB0aGUgb3JpZ2lucyB3aGljaCBoYXZlIGFscmVhZHkgYmVlbiBhcHByb3ZlZCBieSB0aGUgdXNlclxuZnVuY3Rpb24gZ2V0QXBwcm92ZWRPcmlnaW5zKCkge1xuICB2YXIgb3JpZ2luc1N0cmluZyA9IF9nZXRBcHByb3ZlZE9yaWdpbnNWYWx1ZSgpO1xuICBpZiAoIW9yaWdpbnNTdHJpbmcgfHwgMCA9PT0gb3JpZ2luc1N0cmluZy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgb3JpZ2lucyA9IG9yaWdpbnNTdHJpbmcuc3BsaXQoU0VQQVJBVE9SKTtcbiAgcmV0dXJuIG9yaWdpbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzLmFkZEFwcHJvdmVkT3JpZ2luID0gYWRkQXBwcm92ZWRPcmlnaW47XG5tb2R1bGUuZXhwb3J0cy5nZXRBcHByb3ZlZE9yaWdpbnMgPSBnZXRBcHByb3ZlZE9yaWdpbnM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0FwcHJvdmVkT3JpZ2lucy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVGhpcyBmaWxlIGxpc3RzIGFsbCBvZiB0aGUgZW51bXMgd2hpY2ggc2hvdWxkIGF2YWlsYWJsZSBmb3IgdGhlIFdEQyAqL1xudmFyIGFsbEVudW1zID0ge1xuICBwaGFzZUVudW0gOiB7XG4gICAgaW50ZXJhY3RpdmVQaGFzZTogXCJpbnRlcmFjdGl2ZVwiLFxuICAgIGF1dGhQaGFzZTogXCJhdXRoXCIsXG4gICAgZ2F0aGVyRGF0YVBoYXNlOiBcImdhdGhlckRhdGFcIlxuICB9LFxuXG4gIGF1dGhQdXJwb3NlRW51bSA6IHtcbiAgICBlcGhlbWVyYWw6IFwiZXBoZW1lcmFsXCIsXG4gICAgZW5kdXJpbmc6IFwiZW5kdXJpbmdcIlxuICB9LFxuXG4gIGF1dGhUeXBlRW51bSA6IHtcbiAgICBub25lOiBcIm5vbmVcIixcbiAgICBiYXNpYzogXCJiYXNpY1wiLFxuICAgIGN1c3RvbTogXCJjdXN0b21cIlxuICB9LFxuXG4gIGRhdGFUeXBlRW51bSA6IHtcbiAgICBib29sOiBcImJvb2xcIixcbiAgICBkYXRlOiBcImRhdGVcIixcbiAgICBkYXRldGltZTogXCJkYXRldGltZVwiLFxuICAgIGZsb2F0OiBcImZsb2F0XCIsXG4gICAgaW50OiBcImludFwiLFxuICAgIHN0cmluZzogXCJzdHJpbmdcIlxuICB9LFxuXG4gIGNvbHVtblJvbGVFbnVtIDoge1xuICAgICAgZGltZW5zaW9uOiBcImRpbWVuc2lvblwiLFxuICAgICAgbWVhc3VyZTogXCJtZWFzdXJlXCJcbiAgfSxcblxuICBjb2x1bW5UeXBlRW51bSA6IHtcbiAgICAgIGNvbnRpbnVvdXM6IFwiY29udGludW91c1wiLFxuICAgICAgZGlzY3JldGU6IFwiZGlzY3JldGVcIlxuICB9LFxuXG4gIGFnZ1R5cGVFbnVtIDoge1xuICAgICAgc3VtOiBcInN1bVwiLFxuICAgICAgYXZnOiBcImF2Z1wiLFxuICAgICAgbWVkaWFuOiBcIm1lZGlhblwiLFxuICAgICAgY291bnQ6IFwiY291bnRcIixcbiAgICAgIGNvdW50ZDogXCJjb3VudF9kaXN0XCJcbiAgfSxcblxuICBnZW9ncmFwaGljUm9sZUVudW0gOiB7XG4gICAgICBhcmVhX2NvZGU6IFwiYXJlYV9jb2RlXCIsXG4gICAgICBjYnNhX21zYTogXCJjYnNhX21zYVwiLFxuICAgICAgY2l0eTogXCJjaXR5XCIsXG4gICAgICBjb25ncmVzc2lvbmFsX2Rpc3RyaWN0OiBcImNvbmdyZXNzaW9uYWxfZGlzdHJpY3RcIixcbiAgICAgIGNvdW50cnlfcmVnaW9uOiBcImNvdW50cnlfcmVnaW9uXCIsXG4gICAgICBjb3VudHk6IFwiY291bnR5XCIsXG4gICAgICBzdGF0ZV9wcm92aW5jZTogXCJzdGF0ZV9wcm92aW5jZVwiLFxuICAgICAgemlwX2NvZGVfcG9zdGNvZGU6IFwiemlwX2NvZGVfcG9zdGNvZGVcIixcbiAgICAgIGxhdGl0dWRlOiBcImxhdGl0dWRlXCIsXG4gICAgICBsb25naXR1ZGU6IFwibG9uZ2l0dWRlXCJcbiAgfSxcblxuICB1bml0c0Zvcm1hdEVudW0gOiB7XG4gICAgICB0aG91c2FuZHM6IFwidGhvdXNhbmRzXCIsXG4gICAgICBtaWxsaW9uczogXCJtaWxsaW9uc1wiLFxuICAgICAgYmlsbGlvbnNfZW5nbGlzaDogXCJiaWxsaW9uc19lbmdsaXNoXCIsXG4gICAgICBiaWxsaW9uc19zdGFuZGFyZDogXCJiaWxsaW9uc19zdGFuZGFyZFwiXG4gIH0sXG5cbiAgbnVtYmVyRm9ybWF0RW51bSA6IHtcbiAgICAgIG51bWJlcjogXCJudW1iZXJcIixcbiAgICAgIGN1cnJlbmN5OiBcImN1cnJlbmN5XCIsXG4gICAgICBzY2llbnRpZmljOiBcInNjaWVudGlmaWNcIixcbiAgICAgIHBlcmNlbnRhZ2U6IFwicGVyY2VudGFnZVwiXG4gIH0sXG5cbiAgbG9jYWxlRW51bSA6IHtcbiAgICAgIGFtZXJpY2E6IFwiZW4tdXNcIixcbiAgICAgIGJyYXppbDogIFwicHQtYnJcIixcbiAgICAgIGNoaW5hOiAgIFwiemgtY25cIixcbiAgICAgIGZyYW5jZTogIFwiZnItZnJcIixcbiAgICAgIGdlcm1hbnk6IFwiZGUtZGVcIixcbiAgICAgIGphcGFuOiAgIFwiamEtanBcIixcbiAgICAgIGtvcmVhOiAgIFwia28ta3JcIixcbiAgICAgIHNwYWluOiAgIFwiZXMtZXNcIlxuICB9LFxuXG4gIGpvaW5FbnVtIDoge1xuICAgICAgaW5uZXI6IFwiaW5uZXJcIixcbiAgICAgIGxlZnQ6IFwibGVmdFwiXG4gIH1cbn1cblxuLy8gQXBwbGllcyB0aGUgZW51bXMgYXMgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuZnVuY3Rpb24gYXBwbHkodGFyZ2V0KSB7XG4gIGZvcih2YXIga2V5IGluIGFsbEVudW1zKSB7XG4gICAgdGFyZ2V0W2tleV0gPSBhbGxFbnVtc1trZXldO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmFwcGx5ID0gYXBwbHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0VudW1zLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBAY2xhc3MgVXNlZCBmb3IgY29tbXVuaWNhdGluZyBiZXR3ZWVuIFRhYmxlYXUgZGVza3RvcC9zZXJ2ZXIgYW5kIHRoZSBXREMnc1xuKiBKYXZhc2NyaXB0LiBpcyBwcmVkb21pbmFudGx5IGEgcGFzcy10aHJvdWdoIHRvIHRoZSBRdCBXZWJCcmlkZ2UgbWV0aG9kc1xuKiBAcGFyYW0gbmF0aXZlQXBpUm9vdE9iaiB7T2JqZWN0fSAtIFRoZSByb290IG9iamVjdCB3aGVyZSB0aGUgbmF0aXZlIEFwaSBtZXRob2RzXG4qIGFyZSBhdmFpbGFibGUuIEZvciBXZWJLaXQsIHRoaXMgaXMgd2luZG93LlxuKi9cbmZ1bmN0aW9uIE5hdGl2ZURpc3BhdGNoZXIgKG5hdGl2ZUFwaVJvb3RPYmopIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqID0gbmF0aXZlQXBpUm9vdE9iajtcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xuICB0aGlzLl9pbml0UHJpdmF0ZUludGVyZmFjZSgpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwdWJsaWMgaW50ZXJmYWNlIGZvciBOYXRpdmVEaXNwYXRjaGVyXCIpO1xuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHVibGljSW50ZXJmYWNlID0ge307XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gdGhpcy5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5yZXBvcnRQcm9ncmVzcyA9IHRoaXMuX3JlcG9ydFByb2dyZXNzLmJpbmQodGhpcyk7XG5cbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRGb3JBdXRoLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRXaXRoRXJyb3IuYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmFwaShkZXN0T3JpZ2luTGlzdCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfbG9nLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9zdWJtaXRDYWxsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhcInN1Ym1pdCBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc3VibWl0LmFwaSgpO1xufTtcblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHByaXZhdGUgaW50ZXJmYWNlIGZvciBOYXRpdmVEaXNwYXRjaGVyXCIpO1xuXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xuICB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XG5cbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcbiAgcHJpdmF0ZUludGVyZmFjZS5faW5pdENhbGxiYWNrID0gdGhpcy5faW5pdENhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSB0aGlzLl90YWJsZURhdGFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9kYXRhRG9uZUNhbGxiYWNrID0gdGhpcy5fZGF0YURvbmVDYWxsYmFjay5iaW5kKHRoaXMpO1xuXG4gIHRoaXMucHJpdmF0ZUludGVyZmFjZSA9IHByaXZhdGVJbnRlcmZhY2U7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCkge1xuICAgIGNvbnNvbGUubG9nKFwiaW5pdENhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9pbml0Q2FsbGJhY2suYXBpKCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkKSB7XG4gICAgY29uc29sZS5sb2coXCJzaHV0ZG93bkNhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2h1dGRvd25DYWxsYmFjay5hcGkoKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XG4gIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBhcmUgdXNpbmcgYSB2ZXJzaW9uIG9mIGRlc2t0b3Agd2hpY2ggaGFzIHRoZSBXRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrRXggZGVmaW5lZFxuICBpZiAoISF0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4KSB7XG4gICAgLy8gUHJvdmlkaW5nIHN0YW5kYXJkQ29ubmVjdGlvbnMgaXMgb3B0aW9uYWwgYnV0IHdlIGNhbid0IHBhc3MgdW5kZWZpbmVkIGJhY2sgYmVjYXVzZSBRdCB3aWxsIGNob2tlXG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeC5hcGkoc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zIHx8IFtdKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFjay5hcGkoc2NoZW1hKTtcbiAgfVxufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbih0YWJsZU5hbWUsIGRhdGEpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfdGFibGVEYXRhQ2FsbGJhY2suYXBpKHRhYmxlTmFtZSwgZGF0YSk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9yZXBvcnRQcm9ncmVzcyA9IGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAvLyBSZXBvcnQgcHJvZ3Jlc3Mgd2FzIGFkZGVkIGluIDIuMSBzbyBpdCBtYXkgbm90IGJlIGF2YWlsYWJsZSBpZiBUYWJsZWF1IG9ubHkga25vd3MgMi4wXG4gIGlmICghIXRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3JlcG9ydFByb2dyZXNzKSB7XG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfcmVwb3J0UHJvZ3Jlc3MuYXBpKHByb2dyZXNzKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcInJlcG9ydFByb2dyZXNzIG5vdCBhdmFpbGFibGUgZnJvbSB0aGlzIFRhYmxlYXUgdmVyc2lvblwiKTtcbiAgfVxufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fZGF0YURvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9kYXRhRG9uZUNhbGxiYWNrLmFwaSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdGl2ZURpc3BhdGNoZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL05hdGl2ZURpc3BhdGNoZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFRhYmxlID0gcmVxdWlyZSgnLi9UYWJsZS5qcycpO1xudmFyIEVudW1zID0gcmVxdWlyZSgnLi9FbnVtcy5qcycpO1xuXG4vKiogQGNsYXNzIFRoaXMgY2xhc3MgcmVwcmVzZW50cyB0aGUgc2hhcmVkIHBhcnRzIG9mIHRoZSBqYXZhc2NyaXB0XG4qIGxpYnJhcnkgd2hpY2ggZG8gbm90IGhhdmUgYW55IGRlcGVuZGVuY2Ugb24gd2hldGhlciB3ZSBhcmUgcnVubmluZyBpblxuKiB0aGUgc2ltdWxhdG9yLCBpbiBUYWJsZWF1LCBvciBhbnl3aGVyZSBlbHNlXG4qIEBwYXJhbSB0YWJsZWF1QXBpT2JqIHtPYmplY3R9IC0gVGhlIGFscmVhZHkgY3JlYXRlZCB0YWJsZWF1IEFQSSBvYmplY3QgKHVzdWFsbHkgd2luZG93LnRhYmxlYXUpXG4qIEBwYXJhbSBwcml2YXRlQXBpT2JqIHtPYmplY3R9IC0gVGhlIGFscmVhZHkgY3JlYXRlZCBwcml2YXRlIEFQSSBvYmplY3QgKHVzdWFsbHkgd2luZG93Ll90YWJsZWF1KVxuKiBAcGFyYW0gZ2xvYmFsT2JqIHtPYmplY3R9IC0gVGhlIGdsb2JhbCBvYmplY3QgdG8gYXR0YWNoIHRoaW5ncyB0byAodXN1YWxseSB3aW5kb3cpXG4qL1xuZnVuY3Rpb24gU2hhcmVkICh0YWJsZWF1QXBpT2JqLCBwcml2YXRlQXBpT2JqLCBnbG9iYWxPYmopIHtcbiAgdGhpcy5wcml2YXRlQXBpT2JqID0gcHJpdmF0ZUFwaU9iajtcbiAgdGhpcy5nbG9iYWxPYmogPSBnbG9iYWxPYmo7XG4gIHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4gPSBmYWxzZTtcblxuICB0aGlzLmNoYW5nZVRhYmxlYXVBcGlPYmoodGFibGVhdUFwaU9iaik7XG59XG5cblxuU2hhcmVkLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHNoYXJlZCBXRENcIik7XG4gIHRoaXMuZ2xvYmFsT2JqLm9uZXJyb3IgPSB0aGlzLl9lcnJvckhhbmRsZXIuYmluZCh0aGlzKTtcblxuICAvLyBJbml0aWFsaXplIHRoZSBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBpbnZva2VkIGJ5IHRoZSBuYXRpdmUgY29kZVxuICB0aGlzLl9pbml0VHJpZ2dlckZ1bmN0aW9ucygpO1xuXG4gIC8vIEFzc2lnbiB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbnMgd2hpY2ggYXJlbid0IGF2YWlsaWJsZSBpbiB0aGlzIHZlcnNpb24gb2YgdGhlIEFQSVxuICB0aGlzLl9pbml0RGVwcmVjYXRlZEZ1bmN0aW9ucygpO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLmNoYW5nZVRhYmxlYXVBcGlPYmogPSBmdW5jdGlvbih0YWJsZWF1QXBpT2JqKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iaiA9IHRhYmxlYXVBcGlPYmo7XG5cbiAgLy8gQXNzaWduIG91ciBtYWtlICYgcmVnaXN0ZXIgZnVuY3Rpb25zIHJpZ2h0IGF3YXkgYmVjYXVzZSBhIGNvbm5lY3RvciBjYW4gdXNlXG4gIC8vIHRoZW0gaW1tZWRpYXRlbHksIGV2ZW4gYmVmb3JlIGJvb3RzdHJhcHBpbmcgaGFzIGNvbXBsZXRlZFxuICB0aGlzLnRhYmxlYXVBcGlPYmoubWFrZUNvbm5lY3RvciA9IHRoaXMuX21ha2VDb25uZWN0b3IuYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLnJlZ2lzdGVyQ29ubmVjdG9yID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0b3IuYmluZCh0aGlzKTtcblxuICBFbnVtcy5hcHBseSh0aGlzLnRhYmxlYXVBcGlPYmopO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9lcnJvckhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlLCBmaWxlLCBsaW5lLCBjb2x1bW4sIGVycm9yT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3JPYmopOyAvLyBwcmludCBlcnJvciBmb3IgZGVidWdnaW5nIGluIHRoZSBicm93c2VyXG4gIGlmICh0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbXNnID0gbWVzc2FnZTtcbiAgaWYoZXJyb3JPYmopIHtcbiAgICBtc2cgKz0gXCIgICBzdGFjazpcIiArIGVycm9yT2JqLnN0YWNrO1xuICB9IGVsc2Uge1xuICAgIG1zZyArPSBcIiAgIGZpbGU6IFwiICsgZmlsZTtcbiAgICBtc2cgKz0gXCIgICBsaW5lOiBcIiArIGxpbmU7XG4gIH1cblxuICBpZiAodGhpcy50YWJsZWF1QXBpT2JqICYmIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcikge1xuICAgIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihtc2cpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG1zZztcbiAgfVxuXG4gIHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4gPSB0cnVlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5fbWFrZUNvbm5lY3RvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmYXVsdEltcGxzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGNiKSB7IGNiKCk7IH0sXG4gICAgc2h1dGRvd246IGZ1bmN0aW9uKGNiKSB7IGNiKCk7IH1cbiAgfTtcblxuICByZXR1cm4gZGVmYXVsdEltcGxzO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9yZWdpc3RlckNvbm5lY3RvciA9IGZ1bmN0aW9uICh3ZGMpIHtcblxuICAvLyBkbyBzb21lIGVycm9yIGNoZWNraW5nIG9uIHRoZSB3ZGNcbiAgdmFyIGZ1bmN0aW9uTmFtZXMgPSBbXCJpbml0XCIsIFwic2h1dGRvd25cIiwgXCJnZXRTY2hlbWFcIiwgXCJnZXREYXRhXCJdO1xuICBmb3IgKHZhciBpaSA9IGZ1bmN0aW9uTmFtZXMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgIGlmICh0eXBlb2Yod2RjW2Z1bmN0aW9uTmFtZXNbaWldXSkgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgXCJUaGUgY29ubmVjdG9yIGRpZCBub3QgZGVmaW5lIHRoZSByZXF1aXJlZCBmdW5jdGlvbjogXCIgKyBmdW5jdGlvbk5hbWVzW2lpXTtcbiAgICB9XG4gIH07XG5cbiAgY29uc29sZS5sb2coXCJDb25uZWN0b3IgcmVnaXN0ZXJlZFwiKTtcblxuICB0aGlzLmdsb2JhbE9iai5fd2RjID0gd2RjO1xuICB0aGlzLl93ZGMgPSB3ZGM7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX2luaXRUcmlnZ2VyRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VySW5pdGlhbGl6YXRpb24gPSB0aGlzLl90cmlnZ2VySW5pdGlhbGl6YXRpb24uYmluZCh0aGlzKTtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJTY2hlbWFHYXRoZXJpbmcgPSB0aGlzLl90cmlnZ2VyU2NoZW1hR2F0aGVyaW5nLmJpbmQodGhpcyk7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyRGF0YUdhdGhlcmluZyA9IHRoaXMuX3RyaWdnZXJEYXRhR2F0aGVyaW5nLmJpbmQodGhpcyk7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyU2h1dGRvd24gPSB0aGlzLl90cmlnZ2VyU2h1dGRvd24uYmluZCh0aGlzKTtcbn1cblxuLy8gU3RhcnRzIHRoZSBXRENcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJJbml0aWFsaXphdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl93ZGMuaW5pdCh0aGlzLnByaXZhdGVBcGlPYmouX2luaXRDYWxsYmFjayk7XG59XG5cbi8vIFN0YXJ0cyB0aGUgc2NoZW1hIGdhdGhlcmluZyBwcm9jZXNzXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyU2NoZW1hR2F0aGVyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5nZXRTY2hlbWEodGhpcy5wcml2YXRlQXBpT2JqLl9zY2hlbWFDYWxsYmFjayk7XG59XG5cbi8vIFN0YXJ0cyB0aGUgZGF0YSBnYXRoZXJpbmcgcHJvY2Vzc1xuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlckRhdGFHYXRoZXJpbmcgPSBmdW5jdGlvbih0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpIHtcbiAgaWYgKHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcy5sZW5ndGggIT0gMSkge1xuICAgIHRocm93IChcIlVuZXhwZWN0ZWQgbnVtYmVyIG9mIHRhYmxlcyBzcGVjaWZpZWQuIEV4cGVjdGVkIDEsIGFjdHVhbCBcIiArIHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcy5sZW5ndGgudG9TdHJpbmcoKSk7XG4gIH1cblxuICB2YXIgdGFibGVBbmRJbmNyZW1udFZhbHVlID0gdGFibGVzQW5kSW5jcmVtZW50VmFsdWVzWzBdO1xuICB2YXIgdGFibGUgPSBuZXcgVGFibGUodGFibGVBbmRJbmNyZW1udFZhbHVlLnRhYmxlSW5mbywgdGFibGVBbmRJbmNyZW1udFZhbHVlLmluY3JlbWVudFZhbHVlLCB0aGlzLnByaXZhdGVBcGlPYmouX3RhYmxlRGF0YUNhbGxiYWNrKTtcbiAgdGhpcy5fd2RjLmdldERhdGEodGFibGUsIHRoaXMucHJpdmF0ZUFwaU9iai5fZGF0YURvbmVDYWxsYmFjayk7XG59XG5cbi8vIFRlbGxzIHRoZSBXREMgaXQncyB0aW1lIHRvIHNodXQgZG93blxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNodXRkb3duID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5zaHV0ZG93bih0aGlzLnByaXZhdGVBcGlPYmouX3NodXRkb3duQ2FsbGJhY2spO1xufVxuXG4vLyBJbml0aWFsaXplcyBhIHNlcmllcyBvZiBnbG9iYWwgY2FsbGJhY2tzIHdoaWNoIGhhdmUgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcblNoYXJlZC5wcm90b3R5cGUuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmhlYWRlcnNDYWxsYmFjayA9IHRoaXMuX2hlYWRlcnNDYWxsYmFjay5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmouZGF0YUNhbGxiYWNrID0gdGhpcy5fZGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuaW5pdENhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIGluaXRcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9oZWFkZXJzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZmllbGROYW1lcywgdHlwZXMpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5oZWFkZXJzQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fZGF0YUNhbGxiYWNrID0gZnVuY3Rpb24gKGRhdGEsIGxhc3RSZWNvcmRUb2tlbiwgbW9yZURhdGEpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5kYXRhQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5zaHV0ZG93bkNhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIHNodXRkb3duXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZWQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1NoYXJlZC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgQXBwcm92ZWRPcmlnaW5zID0gcmVxdWlyZSgnLi9BcHByb3ZlZE9yaWdpbnMuanMnKTtcblxuLyoqIEBjbGFzcyBVc2VkIGZvciBjb21tdW5pY2F0aW5nIGJldHdlZW4gdGhlIHNpbXVsYXRvciBhbmQgd2ViIGRhdGEgY29ubmVjdG9yLiBJdCBkb2VzXG4qIHRoaXMgYnkgcGFzc2luZyBtZXNzYWdlcyBiZXR3ZWVuIHRoZSBXREMgd2luZG93IGFuZCBpdHMgcGFyZW50IHdpbmRvd1xuKiBAcGFyYW0gZ2xvYmFsT2JqIHtPYmplY3R9IC0gdGhlIGdsb2JhbCBvYmplY3QgdG8gZmluZCB0YWJsZWF1IGludGVyZmFjZXMgYXMgd2VsbFxuKiBhcyByZWdpc3RlciBldmVudHMgKHVzdWFsbHkgd2luZG93KVxuKi9cbmZ1bmN0aW9uIFNpbXVsYXRvckRpc3BhdGNoZXIgKGdsb2JhbE9iaikge1xuICB0aGlzLmdsb2JhbE9iaiA9IGdsb2JhbE9iajtcbiAgdGhpcy5faW5pdE1lc3NhZ2VIYW5kbGluZygpO1xuICB0aGlzLl9pbml0UHVibGljSW50ZXJmYWNlKCk7XG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0TWVzc2FnZUhhbmRsaW5nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIG1lc3NhZ2UgaGFuZGxpbmdcIik7XG4gIHRoaXMuZ2xvYmFsT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9yZWNlaXZlTWVzc2FnZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMuZ2xvYmFsT2JqLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIHRoaXMuX29uRG9tQ29udGVudExvYWRlZC5iaW5kKHRoaXMpKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX29uRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAvLyBBdHRlbXB0IHRvIG5vdGlmeSB0aGUgc2ltdWxhdG9yIHdpbmRvdyB0aGF0IHRoZSBXREMgaGFzIGxvYWRlZFxuICBpZih0aGlzLmdsb2JhbE9iai5wYXJlbnQgIT09IHdpbmRvdykge1xuICAgIHRoaXMuZ2xvYmFsT2JqLnBhcmVudC5wb3N0TWVzc2FnZSh0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKCdsb2FkZWQnKSwgJyonKTtcbiAgfVxuXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLm9wZW5lcikge1xuICAgIHRyeSB7IC8vIFdyYXAgaW4gdHJ5L2NhdGNoIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRVxuICAgICAgdGhpcy5nbG9iYWxPYmoub3BlbmVyLnBvc3RNZXNzYWdlKHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQoJ2xvYWRlZCcpLCAnKicpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS53YXJuKCdTb21lIHZlcnNpb25zIG9mIElFIG1heSBub3QgYWNjdXJhdGVseSBzaW11bGF0ZSB0aGUgV2ViIERhdGEgQ29ubmVjdG9yLiBQbGVhc2UgcmV0cnkgb24gYSBXZWJraXQgYmFzZWQgYnJvd3NlcicpO1xuICAgIH1cbiAgfVxufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcGFja2FnZVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9wVmFsdWVzID0ge1xuICAgIFwiY29ubmVjdGlvbk5hbWVcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uTmFtZSxcbiAgICBcImNvbm5lY3Rpb25EYXRhXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEsXG4gICAgXCJwYXNzd29yZFwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBhc3N3b3JkLFxuICAgIFwidXNlcm5hbWVcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZSxcbiAgICBcInVzZXJuYW1lQWxpYXNcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZUFsaWFzLFxuICAgIFwiaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uLFxuICAgIFwidmVyc2lvbk51bWJlclwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnZlcnNpb25OdW1iZXIsXG4gICAgXCJsb2NhbGVcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sb2NhbGUsXG4gICAgXCJhdXRoUHVycG9zZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmF1dGhQdXJwb3NlLFxuICAgIFwicGxhdGZvcm1PU1wiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtT1MsXG4gICAgXCJwbGF0Zm9ybVZlcnNpb25cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybVZlcnNpb24sXG4gICAgXCJwbGF0Zm9ybUVkaXRpb25cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUVkaXRpb24sXG4gICAgXCJwbGF0Zm9ybUJ1aWxkTnVtYmVyXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1CdWlsZE51bWJlclxuICB9O1xuXG4gIHJldHVybiBwcm9wVmFsdWVzO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYXBwbHlQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIGlmIChwcm9wcykge1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbk5hbWUgPSBwcm9wcy5jb25uZWN0aW9uTmFtZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25EYXRhID0gcHJvcHMuY29ubmVjdGlvbkRhdGE7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wYXNzd29yZCA9IHByb3BzLnBhc3N3b3JkO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWUgPSBwcm9wcy51c2VybmFtZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lQWxpYXMgPSBwcm9wcy51c2VybmFtZUFsaWFzO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uID0gcHJvcHMuaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUubG9jYWxlID0gcHJvcHMubG9jYWxlO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUubGFuZ3VhZ2UgPSBwcm9wcy5sb2NhbGU7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5hdXRoUHVycG9zZSA9IHByb3BzLmF1dGhQdXJwb3NlO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1PUyA9IHByb3BzLnBsYXRmb3JtT1M7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybVZlcnNpb24gPSBwcm9wcy5wbGF0Zm9ybVZlcnNpb247XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUVkaXRpb24gPSBwcm9wcy5wbGF0Zm9ybUVkaXRpb247XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUJ1aWxkTnVtYmVyID0gcHJvcHMucGxhdGZvcm1CdWlsZE51bWJlcjtcbiAgfVxufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYnVpbGRNZXNzYWdlUGF5bG9hZCA9IGZ1bmN0aW9uKG1zZ05hbWUsIG1zZ0RhdGEsIHByb3BzKSB7XG4gIHZhciBtc2dPYmogPSB7XCJtc2dOYW1lXCI6IG1zZ05hbWUsIFwibXNnRGF0YVwiOiBtc2dEYXRhLCBcInByb3BzXCI6IHByb3BzLCBcInZlcnNpb25cIjogQlVJTERfTlVNQkVSIH07XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShtc2dPYmopO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2dOYW1lLCBtc2dEYXRhKSB7XG4gIHZhciBtZXNzYWdlUGF5bG9hZCA9IHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQobXNnTmFtZSwgbXNnRGF0YSwgdGhpcy5fcGFja2FnZVByb3BlcnR5VmFsdWVzKCkpO1xuXG4gIC8vIENoZWNrIGZpcnN0IHRvIHNlZSBpZiB3ZSBoYXZlIGEgbWVzc2FnZUhhbmRsZXIgZGVmaW5lZCB0byBwb3N0IHRoZSBtZXNzYWdlIHRvXG4gIGlmICh0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0ICE9ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIHRoaXMuZ2xvYmFsT2JqLndlYmtpdC5tZXNzYWdlSGFuZGxlcnMgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy53ZGNIYW5kbGVyICE9ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy53ZGNIYW5kbGVyLnBvc3RNZXNzYWdlKG1lc3NhZ2VQYXlsb2FkKTtcbiAgfSBlbHNlIGlmICghdGhpcy5fc291cmNlV2luZG93KSB7XG4gICAgdGhyb3cgXCJMb29rcyBsaWtlIHRoZSBXREMgaXMgY2FsbGluZyBhIHRhYmxlYXUgZnVuY3Rpb24gYmVmb3JlIHRhYmxlYXUuaW5pdCgpIGhhcyBiZWVuIGNhbGxlZC5cIlxuICB9IGVsc2Uge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IHBvc3QgdGhpcyBpbmZvIGJhY2sgdG8gdGhlIHNvdXJjZSBvcmlnaW4gdGhlIHVzZXIgYXBwcm92ZWQgaW4gX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm1cbiAgICB0aGlzLl9zb3VyY2VXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZVBheWxvYWQsIHRoaXMuX3NvdXJjZU9yaWdpbik7XG4gIH1cbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFBheWxvYWRPYmogPSBmdW5jdGlvbihwYXlsb2FkU3RyaW5nKSB7XG4gIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShwYXlsb2FkU3RyaW5nKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGF5bG9hZDtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm0gPSBmdW5jdGlvbigpIHtcbiAgLy8gRHVlIHRvIGNyb3NzLW9yaWdpbiBzZWN1cml0eSBpc3N1ZXMgb3ZlciBodHRwcywgd2UgbWF5IG5vdCBiZSBhYmxlIHRvIHJldHJpZXZlIF9zb3VyY2VXaW5kb3cuXG4gIC8vIFVzZSBzb3VyY2VPcmlnaW4gaW5zdGVhZC5cbiAgdmFyIG9yaWdpbiA9IHRoaXMuX3NvdXJjZU9yaWdpbjtcblxuICB2YXIgVXJpID0gcmVxdWlyZSgnanN1cmknKTtcbiAgdmFyIHBhcnNlZE9yaWdpbiA9IG5ldyBVcmkob3JpZ2luKTtcbiAgdmFyIGhvc3ROYW1lID0gcGFyc2VkT3JpZ2luLmhvc3QoKTtcblxuICB2YXIgc3VwcG9ydGVkSG9zdHMgPSBbXCJsb2NhbGhvc3RcIiwgXCJ0YWJsZWF1LmdpdGh1Yi5pb1wiXTtcbiAgaWYgKHN1cHBvcnRlZEhvc3RzLmluZGV4T2YoaG9zdE5hbWUpID49IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gV2hpdGVsaXN0IFRhYmxlYXUgZG9tYWluc1xuICBpZiAoaG9zdE5hbWUgJiYgaG9zdE5hbWUuZW5kc1dpdGgoXCJvbmxpbmUudGFibGVhdS5jb21cIikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGFscmVhZHlBcHByb3ZlZE9yaWdpbnMgPSBBcHByb3ZlZE9yaWdpbnMuZ2V0QXBwcm92ZWRPcmlnaW5zKCk7XG4gIGlmIChhbHJlYWR5QXBwcm92ZWRPcmlnaW5zLmluZGV4T2Yob3JpZ2luKSA+PSAwKSB7XG4gICAgLy8gVGhlIHVzZXIgaGFzIGFscmVhZHkgYXBwcm92ZWQgdGhpcyBvcmlnaW4sIG5vIG5lZWQgdG8gYXNrIGFnYWluXG4gICAgY29uc29sZS5sb2coXCJBbHJlYWR5IGFwcHJvdmVkIHRoZSBvcmlnaW4nXCIgKyBvcmlnaW4gKyBcIicsIG5vdCBhc2tpbmcgYWdhaW5cIik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbG9jYWxpemVkV2FybmluZ1RpdGxlID0gdGhpcy5fZ2V0TG9jYWxpemVkU3RyaW5nKFwid2ViU2VjdXJpdHlXYXJuaW5nXCIpO1xuICB2YXIgY29tcGxldGVXYXJuaW5nTXNnICA9IGxvY2FsaXplZFdhcm5pbmdUaXRsZSArIFwiXFxuXFxuXCIgKyBob3N0TmFtZSArIFwiXFxuXCI7XG4gIHZhciBpc0NvbmZpcm1lZCA9IGNvbmZpcm0oY29tcGxldGVXYXJuaW5nTXNnKTtcblxuICBpZiAoaXNDb25maXJtZWQpIHtcbiAgICAvLyBTZXQgYSBzZXNzaW9uIGNvb2tpZSB0byBtYXJrIHRoYXQgd2UndmUgYXBwcm92ZWQgdGhpcyBhbHJlYWR5XG4gICAgQXBwcm92ZWRPcmlnaW5zLmFkZEFwcHJvdmVkT3JpZ2luKG9yaWdpbik7XG4gIH1cblxuICByZXR1cm4gaXNDb25maXJtZWQ7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRDdXJyZW50TG9jYWxlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gVXNlIGN1cnJlbnQgYnJvd3NlcidzIGxvY2FsZSB0byBnZXQgYSBsb2NhbGl6ZWQgd2FybmluZyBtZXNzYWdlXG4gICAgdmFyIGN1cnJlbnRCcm93c2VyTGFuZ3VhZ2UgPSAobmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci51c2VyTGFuZ3VhZ2UpO1xuICAgIHZhciBsb2NhbGUgPSBjdXJyZW50QnJvd3Nlckxhbmd1YWdlPyBjdXJyZW50QnJvd3Nlckxhbmd1YWdlLnN1YnN0cmluZygwLCAyKTogXCJlblwiO1xuXG4gICAgdmFyIHN1cHBvcnRlZExvY2FsZXMgPSBbXCJkZVwiLCBcImVuXCIsIFwiZXNcIiwgXCJmclwiLCBcImphXCIsIFwia29cIiwgXCJwdFwiLCBcInpoXCJdO1xuICAgIC8vIEZhbGwgYmFjayB0byBFbmdsaXNoIGZvciBvdGhlciB1bnN1cHBvcnRlZCBsYW5hZ3VhZ2VzXG4gICAgaWYgKHN1cHBvcnRlZExvY2FsZXMuaW5kZXhPZihsb2NhbGUpIDwgMCkge1xuICAgICAgICBsb2NhbGUgPSAnZW4nO1xuICAgIH1cblxuICAgIHJldHVybiBsb2NhbGU7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRMb2NhbGl6ZWRTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmdLZXkpIHtcbiAgICB2YXIgbG9jYWxlID0gdGhpcy5fZ2V0Q3VycmVudExvY2FsZSgpO1xuXG4gICAgLy8gVXNlIHN0YXRpYyByZXF1aXJlIGhlcmUsIG90aGVyd2lzZSB3ZWJwYWNrIHdvdWxkIGdlbmVyYXRlIGEgbXVjaCBiaWdnZXIgSlMgZmlsZVxuICAgIHZhciBkZVN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19kZS1ERS5qc29uJyk7XG4gICAgdmFyIGVuU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24nKTtcbiAgICB2YXIgZXNTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvbicpO1xuICAgIHZhciBqYVN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uJyk7XG4gICAgdmFyIGZyU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb24nKTtcbiAgICB2YXIga29TdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvbicpO1xuICAgIHZhciBwdFN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19wdC1CUi5qc29uJyk7XG4gICAgdmFyIHpoU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24nKTtcblxuICAgIHZhciBzdHJpbmdKc29uTWFwQnlMb2NhbGUgPVxuICAgIHtcbiAgICAgICAgXCJkZVwiOiBkZVN0cmluZ3NNYXAsXG4gICAgICAgIFwiZW5cIjogZW5TdHJpbmdzTWFwLFxuICAgICAgICBcImVzXCI6IGVzU3RyaW5nc01hcCxcbiAgICAgICAgXCJmclwiOiBmclN0cmluZ3NNYXAsXG4gICAgICAgIFwiamFcIjogamFTdHJpbmdzTWFwLFxuICAgICAgICBcImtvXCI6IGtvU3RyaW5nc01hcCxcbiAgICAgICAgXCJwdFwiOiBwdFN0cmluZ3NNYXAsXG4gICAgICAgIFwiemhcIjogemhTdHJpbmdzTWFwXG4gICAgfTtcblxuICAgIHZhciBsb2NhbGl6ZWRTdHJpbmdzSnNvbiA9IHN0cmluZ0pzb25NYXBCeUxvY2FsZVtsb2NhbGVdO1xuICAgIHJldHVybiBsb2NhbGl6ZWRTdHJpbmdzSnNvbltzdHJpbmdLZXldO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVjZWl2ZU1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcbiAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBtZXNzYWdlIVwiKTtcblxuICB2YXIgd2RjID0gdGhpcy5nbG9iYWxPYmouX3dkYztcbiAgaWYgKCF3ZGMpIHtcbiAgICB0aHJvdyBcIk5vIFdEQyByZWdpc3RlcmVkLiBEaWQgeW91IGZvcmdldCB0byBjYWxsIHRhYmxlYXUucmVnaXN0ZXJDb25uZWN0b3I/XCI7XG4gIH1cblxuICB2YXIgcGF5bG9hZE9iaiA9IHRoaXMuX2dldFBheWxvYWRPYmooZXZ0LmRhdGEpO1xuICBpZighcGF5bG9hZE9iaikgcmV0dXJuOyAvLyBUaGlzIG1lc3NhZ2UgaXMgbm90IG5lZWRlZCBmb3IgV0RDXG5cbiAgaWYgKCF0aGlzLl9zb3VyY2VXaW5kb3cpIHtcbiAgICB0aGlzLl9zb3VyY2VXaW5kb3cgPSBldnQuc291cmNlO1xuICAgIHRoaXMuX3NvdXJjZU9yaWdpbiA9IGV2dC5vcmlnaW47XG4gIH1cblxuICB2YXIgbXNnRGF0YSA9IHBheWxvYWRPYmoubXNnRGF0YTtcbiAgdGhpcy5fYXBwbHlQcm9wZXJ0eVZhbHVlcyhwYXlsb2FkT2JqLnByb3BzKTtcblxuICBzd2l0Y2gocGF5bG9hZE9iai5tc2dOYW1lKSB7XG4gICAgY2FzZSBcImluaXRcIjpcbiAgICAgIC8vIFdhcm4gdXNlcnMgYWJvdXQgcG9zc2libGUgcGhpbmlzaGluZyBhdHRhY2tzXG4gICAgICB2YXIgY29uZmlybVJlc3VsdCA9IHRoaXMuX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm0oKTtcbiAgICAgIGlmICghY29uZmlybVJlc3VsdCkge1xuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGhhc2UgPSBtc2dEYXRhLnBoYXNlO1xuICAgICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VySW5pdGlhbGl6YXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNodXRkb3duXCI6XG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyU2h1dGRvd24oKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJnZXRTY2hlbWFcIjpcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJTY2hlbWFHYXRoZXJpbmcoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJnZXREYXRhXCI6XG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyRGF0YUdhdGhlcmluZyhtc2dEYXRhLnRhYmxlc0FuZEluY3JlbWVudFZhbHVlcyk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuLyoqKiogUFVCTElDIElOVEVSRkFDRSAqKioqKi9cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHVibGljSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHB1YmxpYyBpbnRlcmZhY2VcIik7XG4gIHRoaXMuX3N1Ym1pdENhbGxlZCA9IGZhbHNlO1xuXG4gIHZhciBwdWJsaWNJbnRlcmZhY2UgPSB7fTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0Rm9yQXV0aCA9IHRoaXMuX2Fib3J0Rm9yQXV0aC5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRXaXRoRXJyb3IgPSB0aGlzLl9hYm9ydFdpdGhFcnJvci5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSB0aGlzLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbi5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UubG9nID0gdGhpcy5fbG9nLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5yZXBvcnRQcm9ncmVzcyA9IHRoaXMuX3JlcG9ydFByb2dyZXNzLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5zdWJtaXQgPSB0aGlzLl9zdWJtaXQuYmluZCh0aGlzKTtcblxuICAvLyBBc3NpZ24gdGhlIHB1YmxpYyBpbnRlcmZhY2UgdG8gdGhpc1xuICB0aGlzLnB1YmxpY0ludGVyZmFjZSA9IHB1YmxpY0ludGVyZmFjZTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0Rm9yQXV0aCA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImFib3J0Rm9yQXV0aFwiLCB7XCJtc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydFdpdGhFcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImFib3J0V2l0aEVycm9yXCIsIHtcImVycm9yTXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSBmdW5jdGlvbihkZXN0T3JpZ2luTGlzdCkge1xuICAvLyBEb24ndCBib3RoZXIgcGFzc2luZyB0aGlzIGJhY2sgdG8gdGhlIHNpbXVsYXRvciBzaW5jZSB0aGVyZSdzIG5vdGhpbmcgaXQgY2FuXG4gIC8vIGRvLiBKdXN0IGNhbGwgYmFjayB0byB0aGUgV0RDIGluZGljYXRpbmcgdGhhdCBpdCB3b3JrZWRcbiAgY29uc29sZS5sb2coXCJDcm9zcyBPcmlnaW4gRXhjZXB0aW9uIHJlcXVlc3RlZCBpbiB0aGUgc2ltdWxhdG9yLiBQcmV0ZW5kaW5nIHRvIHdvcmsuXCIpXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nbG9iYWxPYmouX3dkYy5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbkNvbXBsZXRlZChkZXN0T3JpZ2luTGlzdCk7XG4gIH0uYmluZCh0aGlzKSwgMCk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJsb2dcIiwge1wibG9nTXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVwb3J0UHJvZ3Jlc3MgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJyZXBvcnRQcm9ncmVzc1wiLCB7XCJwcm9ncmVzc01zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcInN1Ym1pdFwiKTtcbn07XG5cbi8qKioqIFBSSVZBVEUgSU5URVJGQUNFICoqKioqL1xuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHByaXZhdGUgaW50ZXJmYWNlXCIpO1xuXG4gIHZhciBwcml2YXRlSW50ZXJmYWNlID0ge307XG4gIHByaXZhdGVJbnRlcmZhY2UuX2luaXRDYWxsYmFjayA9IHRoaXMuX2luaXRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9zY2hlbWFDYWxsYmFjayA9IHRoaXMuX3NjaGVtYUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3RhYmxlRGF0YUNhbGxiYWNrID0gdGhpcy5fdGFibGVEYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fZGF0YURvbmVDYWxsYmFjayA9IHRoaXMuX2RhdGFEb25lQ2FsbGJhY2suYmluZCh0aGlzKTtcblxuICAvLyBBc3NpZ24gdGhlIHByaXZhdGUgaW50ZXJmYWNlIHRvIHRoaXNcbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImluaXRDYWxsYmFja1wiKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NodXRkb3duQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJzaHV0ZG93bkNhbGxiYWNrXCIpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2NoZW1hQ2FsbGJhY2sgPSBmdW5jdGlvbihzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfc2NoZW1hQ2FsbGJhY2tcIiwge1wic2NoZW1hXCI6IHNjaGVtYSwgXCJzdGFuZGFyZENvbm5lY3Rpb25zXCIgOiBzdGFuZGFyZENvbm5lY3Rpb25zIHx8IFtdfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcIl90YWJsZURhdGFDYWxsYmFja1wiLCB7IFwidGFibGVOYW1lXCI6IHRhYmxlTmFtZSwgXCJkYXRhXCI6IGRhdGEgfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9kYXRhRG9uZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX2RhdGFEb25lQ2FsbGJhY2tcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2ltdWxhdG9yRGlzcGF0Y2hlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogQGNsYXNzIFJlcHJlc2VudHMgYSBzaW5nbGUgdGFibGUgd2hpY2ggVGFibGVhdSBoYXMgcmVxdWVzdGVkXG4qIEBwYXJhbSB0YWJsZUluZm8ge09iamVjdH0gLSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFibGVcbiogQHBhcmFtIGluY3JlbWVudFZhbHVlIHtzdHJpbmc9fSAtIEluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZVxuKi9cbmZ1bmN0aW9uIFRhYmxlKHRhYmxlSW5mbywgaW5jcmVtZW50VmFsdWUsIGRhdGFDYWxsYmFja0ZuKSB7XG4gIC8qKiBAbWVtYmVyIHtPYmplY3R9IEluZm9ybWF0aW9uIGFib3V0IHRoZSB0YWJsZSB3aGljaCBoYXMgYmVlbiByZXF1ZXN0ZWQuIFRoaXMgaXNcbiAgZ3VhcmFudGVlZCB0byBiZSBvbmUgb2YgdGhlIHRhYmxlcyB0aGUgY29ubmVjdG9yIHJldHVybmVkIGluIHRoZSBjYWxsIHRvIGdldFNjaGVtYS4gKi9cbiAgdGhpcy50YWJsZUluZm8gPSB0YWJsZUluZm87XG5cbiAgLyoqIEBtZW1iZXIge3N0cmluZ30gRGVmaW5lcyB0aGUgaW5jcmVtZW50YWwgdXBkYXRlIHZhbHVlIGZvciB0aGlzIHRhYmxlLiBFbXB0eSBzdHJpbmcgaWZcbiAgdGhlcmUgaXMgbm90IGFuIGluY3JlbWVudGFsIHVwZGF0ZSByZXF1ZXN0ZWQuICovXG4gIHRoaXMuaW5jcmVtZW50VmFsdWUgPSBpbmNyZW1lbnRWYWx1ZSB8fCBcIlwiO1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICB0aGlzLl9kYXRhQ2FsbGJhY2tGbiA9IGRhdGFDYWxsYmFja0ZuO1xuXG4gIC8vIGJpbmQgdGhlIHB1YmxpYyBmYWNpbmcgdmVyc2lvbiBvZiB0aGlzIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBwYXNzZWQgYXJvdW5kXG4gIHRoaXMuYXBwZW5kUm93cyA9IHRoaXMuX2FwcGVuZFJvd3MuYmluZCh0aGlzKTtcbn1cblxuLyoqXG4qIEBtZXRob2QgYXBwZW5kcyB0aGUgZ2l2ZW4gcm93cyB0byB0aGUgc2V0IG9mIGRhdGEgY29udGFpbmVkIGluIHRoaXMgdGFibGVcbiogQHBhcmFtIGRhdGEge2FycmF5fSAtIEVpdGhlciBhbiBhcnJheSBvZiBhcnJheXMgb3IgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGljaCByZXByZXNlbnRcbiogdGhlIGluZGl2aWR1YWwgcm93cyBvZiBkYXRhIHRvIGFwcGVuZCB0byB0aGlzIHRhYmxlXG4qL1xuVGFibGUucHJvdG90eXBlLl9hcHBlbmRSb3dzID0gZnVuY3Rpb24oZGF0YSkge1xuICAvLyBEbyBzb21lIHF1aWNrIHZhbGlkYXRpb24gdGhhdCB0aGlzIGRhdGEgaXMgdGhlIGZvcm1hdCB3ZSBleHBlY3RcbiAgaWYgKCFkYXRhKSB7XG4gICAgY29uc29sZS53YXJuKFwicm93cyBkYXRhIGlzIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIExvZyBhIHdhcm5pbmcgYmVjYXVzZSB0aGUgZGF0YSBpcyBub3QgYW4gYXJyYXkgbGlrZSB3ZSBleHBlY3RlZFxuICAgIGNvbnNvbGUud2FybihcIlRhYmxlLmFwcGVuZFJvd3MgbXVzdCB0YWtlIGFuIGFycmF5IG9mIGFycmF5cyBvciBhcnJheSBvZiBvYmplY3RzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhbGwgYmFjayB3aXRoIHRoZSByb3dzIGZvciB0aGlzIHRhYmxlXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuKHRoaXMudGFibGVJbmZvLmlkLCBkYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vVGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gY29weUZ1bmN0aW9ucyhzcmMsIGRlc3QpIHtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgaWYgKHR5cGVvZiBzcmNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvcHlGdW5jdGlvbnMgPSBjb3B5RnVuY3Rpb25zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9VdGlsaXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQ29va2llcy5qcyAtIDEuMi4zXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TY290dEhhbXBlci9Db29raWVzXHJcbiAqXHJcbiAqIFRoaXMgaXMgZnJlZSBhbmQgdW5lbmN1bWJlcmVkIHNvZnR3YXJlIHJlbGVhc2VkIGludG8gdGhlIHB1YmxpYyBkb21haW4uXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAod2luZG93KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llcy5qcyByZXF1aXJlcyBhIGB3aW5kb3dgIHdpdGggYSBgZG9jdW1lbnRgIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3dzIGZvciBzZXR0ZXIgaW5qZWN0aW9uIGluIHVuaXQgdGVzdHNcclxuICAgICAgICBDb29raWVzLl9kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgLy8gVXNlZCB0byBlbnN1cmUgY29va2llIGtleXMgZG8gbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgIC8vIGJ1aWx0LWluIGBPYmplY3RgIHByb3BlcnRpZXNcclxuICAgICAgICBDb29raWVzLl9jYWNoZUtleVByZWZpeCA9ICdjb29rZXkuJzsgLy8gSHVyciBodXJyLCA6KVxyXG4gICAgICAgIFxyXG4gICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgPSBuZXcgRGF0ZSgnRnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBVVEMnKTtcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IENvb2tpZXMuX2NhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsga2V5XTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IENvb2tpZXMuX2dldEV4cGlyZXNEYXRlKHZhbHVlID09PSB1bmRlZmluZWQgPyAtMSA6IG9wdGlvbnMuZXhwaXJlcyk7XHJcblxyXG4gICAgICAgICAgICBDb29raWVzLl9kb2N1bWVudC5jb29raWUgPSBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyhrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZXhwaXJlID0gZnVuY3Rpb24gKGtleSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5zZXQoa2V5LCB1bmRlZmluZWQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBvcHRpb25zICYmIG9wdGlvbnMucGF0aCB8fCBDb29raWVzLmRlZmF1bHRzLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkb21haW46IG9wdGlvbnMgJiYgb3B0aW9ucy5kb21haW4gfHwgQ29va2llcy5kZWZhdWx0cy5kb21haW4sXHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiBvcHRpb25zICYmIG9wdGlvbnMuZXhwaXJlcyB8fCBDb29raWVzLmRlZmF1bHRzLmV4cGlyZXMsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zZWN1cmUgIT09IHVuZGVmaW5lZCA/ICBvcHRpb25zLnNlY3VyZSA6IENvb2tpZXMuZGVmYXVsdHMuc2VjdXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5faXNWYWxpZERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09PSAnW29iamVjdCBEYXRlXScgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSA9IGZ1bmN0aW9uIChleHBpcmVzLCBub3cpIHtcclxuICAgICAgICAgICAgbm93ID0gbm93IHx8IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gZXhwaXJlcyA9PT0gSW5maW5pdHkgP1xyXG4gICAgICAgICAgICAgICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgOiBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgZXhwaXJlcyAqIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXhwaXJlcyAmJiAhQ29va2llcy5faXNWYWxpZERhdGUoZXhwaXJlcykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGV4cGlyZXNgIHBhcmFtZXRlciBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgdmFsaWQgRGF0ZSBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5wYXRoID8gJztwYXRoPScgKyBvcHRpb25zLnBhdGggOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZG9tYWluID8gJztkb21haW49JyArIG9wdGlvbnMuZG9tYWluIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmV4cGlyZXMgPyAnO2V4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnNlY3VyZSA/ICc7c2VjdXJlJyA6ICcnO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoZG9jdW1lbnRDb29raWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZUNhY2hlID0ge307XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZUNhY2hlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXHJcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBjb29raWVTdHJpbmcuc3Vic3RyKDAsIHNlcGFyYXRvckluZGV4KTtcclxuICAgICAgICAgICAgdmFyIGRlY29kZWRLZXk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvZGVkS2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb25zb2xlICYmIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGRlY29kZSBjb29raWUgd2l0aCBrZXkgXCInICsga2V5ICsgJ1wiJywgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGRlY29kZWRLZXksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogY29va2llU3RyaW5nLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpIC8vIERlZmVyIGRlY29kaW5nIHZhbHVlIHVudGlsIGFjY2Vzc2VkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuICAgIHZhciBjb29raWVzRXhwb3J0ID0gKGdsb2JhbCAmJiB0eXBlb2YgZ2xvYmFsLmRvY3VtZW50ID09PSAnb2JqZWN0JykgPyBmYWN0b3J5KGdsb2JhbCkgOiBmYWN0b3J5O1xyXG5cclxuICAgIC8vIEFNRCBzdXBwb3J0XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb2tpZXNFeHBvcnQ7IH0pO1xyXG4gICAgLy8gQ29tbW9uSlMvTm9kZS5qcyBzdXBwb3J0XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIFN1cHBvcnQgTm9kZS5qcyBzcGVjaWZpYyBgbW9kdWxlLmV4cG9ydHNgICh3aGljaCBjYW4gYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBCdXQgYWx3YXlzIHN1cHBvcnQgQ29tbW9uSlMgbW9kdWxlIDEuMS4xIHNwZWMgKGBleHBvcnRzYCBjYW5ub3QgYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBleHBvcnRzLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnbG9iYWwuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9XHJcbn0pKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvdyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nvb2tpZXMtanMvZGlzdC9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb25cbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZW4tVVMuanNvblxuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvblxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvblxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfamEtSlAuanNvblxuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvblxuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvblxuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwid3dUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc196aC1DTi5qc29uXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIGpzVXJpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGVyZWstd2F0c29uL2pzVXJpXG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIERlcmVrIFdhdHNvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICpcbiAqIEluY2x1ZGVzIHBhcnNlVXJpIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAqIGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9wYXJzZXVyaVxuICogQ29weXJpZ2h0IDIwMDcsIFN0ZXZlbiBMZXZpdGhhblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbiAvKmdsb2JhbHMgZGVmaW5lLCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuXG4gIHZhciByZSA9IHtcbiAgICBzdGFydHNfd2l0aF9zbGFzaGVzOiAvXlxcLysvLFxuICAgIGVuZHNfd2l0aF9zbGFzaGVzOiAvXFwvKyQvLFxuICAgIHBsdXNlczogL1xcKy9nLFxuICAgIHF1ZXJ5X3NlcGFyYXRvcjogL1smO10vLFxuICAgIHVyaV9wYXJzZXI6IC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QFxcL10qKSg/OjooW146QF0qKSk/KT9AKT8oXFxbWzAtOWEtZkEtRjouXStcXF18W146XFwvPyNdKikoPzo6KFxcZCt8KD89OikpKT8oOik/KSgoKCg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS9cbiAgfTtcblxuICAvKipcbiAgICogRGVmaW5lIGZvckVhY2ggZm9yIG9sZGVyIGpzIGVudmlyb25tZW50c1xuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaCNDb21wYXRpYmlsaXR5XG4gICAqL1xuICBpZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIFQsIGs7XG5cbiAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcbiAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBUID0gdGhpc0FyZztcbiAgICAgIH1cblxuICAgICAgayA9IDA7XG5cbiAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICAgIHZhciBrVmFsdWU7XG4gICAgICAgIGlmIChrIGluIE8pIHtcbiAgICAgICAgICBrVmFsdWUgPSBPW2tdO1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcbiAgICAgICAgfVxuICAgICAgICBrKys7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1bmVzY2FwZSBhIHF1ZXJ5IHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gcyBlbmNvZGVkIHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICBkZWNvZGVkIHZhbHVlXG4gICAqL1xuICBmdW5jdGlvbiBkZWNvZGUocykge1xuICAgIGlmIChzKSB7XG4gICAgICAgIHMgPSBzLnRvU3RyaW5nKCkucmVwbGFjZShyZS5wbHVzZXMsICclMjAnKTtcbiAgICAgICAgcyA9IGRlY29kZVVSSUNvbXBvbmVudChzKTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICAvKipcbiAgICogQnJlYWtzIGEgdXJpIHN0cmluZyBkb3duIGludG8gaXRzIGluZGl2aWR1YWwgcGFydHNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHIgdXJpXG4gICAqIEByZXR1cm4ge29iamVjdH0gICAgIHBhcnRzXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgICB2YXIgcGFyc2VyID0gcmUudXJpX3BhcnNlcjtcbiAgICB2YXIgcGFyc2VyS2V5cyA9IFtcInNvdXJjZVwiLCBcInByb3RvY29sXCIsIFwiYXV0aG9yaXR5XCIsIFwidXNlckluZm9cIiwgXCJ1c2VyXCIsIFwicGFzc3dvcmRcIiwgXCJob3N0XCIsIFwicG9ydFwiLCBcImlzQ29sb25VcmlcIiwgXCJyZWxhdGl2ZVwiLCBcInBhdGhcIiwgXCJkaXJlY3RvcnlcIiwgXCJmaWxlXCIsIFwicXVlcnlcIiwgXCJhbmNob3JcIl07XG4gICAgdmFyIG0gPSBwYXJzZXIuZXhlYyhzdHIgfHwgJycpO1xuICAgIHZhciBwYXJ0cyA9IHt9O1xuXG4gICAgcGFyc2VyS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaSkge1xuICAgICAgcGFydHNba2V5XSA9IG1baV0gfHwgJyc7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcGFydHM7XG4gIH1cblxuICAvKipcbiAgICogQnJlYWtzIGEgcXVlcnkgc3RyaW5nIGRvd24gaW50byBhbiBhcnJheSBvZiBrZXkvdmFsdWUgcGFpcnNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHIgcXVlcnlcbiAgICogQHJldHVybiB7YXJyYXl9ICAgICAgYXJyYXkgb2YgYXJyYXlzIChrZXkvdmFsdWUgcGFpcnMpXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVF1ZXJ5KHN0cikge1xuICAgIHZhciBpLCBwcywgcCwgbiwgaywgdiwgbDtcbiAgICB2YXIgcGFpcnMgPSBbXTtcblxuICAgIGlmICh0eXBlb2Yoc3RyKSA9PT0gJ3VuZGVmaW5lZCcgfHwgc3RyID09PSBudWxsIHx8IHN0ciA9PT0gJycpIHtcbiAgICAgIHJldHVybiBwYWlycztcbiAgICB9XG5cbiAgICBpZiAoc3RyLmluZGV4T2YoJz8nKSA9PT0gMCkge1xuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcyA9IHN0ci50b1N0cmluZygpLnNwbGl0KHJlLnF1ZXJ5X3NlcGFyYXRvcik7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwID0gcHNbaV07XG4gICAgICBuID0gcC5pbmRleE9mKCc9Jyk7XG5cbiAgICAgIGlmIChuICE9PSAwKSB7XG4gICAgICAgIGsgPSBkZWNvZGUocC5zdWJzdHJpbmcoMCwgbikpO1xuICAgICAgICB2ID0gZGVjb2RlKHAuc3Vic3RyaW5nKG4gKyAxKSk7XG4gICAgICAgIHBhaXJzLnB1c2gobiA9PT0gLTEgPyBbcCwgbnVsbF0gOiBbaywgdl0pO1xuICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFVyaSBvYmplY3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICovXG4gIGZ1bmN0aW9uIFVyaShzdHIpIHtcbiAgICB0aGlzLnVyaVBhcnRzID0gcGFyc2VVcmkoc3RyKTtcbiAgICB0aGlzLnF1ZXJ5UGFpcnMgPSBwYXJzZVF1ZXJ5KHRoaXMudXJpUGFydHMucXVlcnkpO1xuICAgIHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWYgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBnZXR0ZXIvc2V0dGVyIG1ldGhvZHNcbiAgICovXG4gIFsncHJvdG9jb2wnLCAndXNlckluZm8nLCAnaG9zdCcsICdwb3J0JywgJ3BhdGgnLCAnYW5jaG9yJ10uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBVcmkucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLnVyaVBhcnRzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy51cmlQYXJ0c1trZXldO1xuICAgIH07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBpZiB0aGVyZSBpcyBubyBwcm90b2NvbCwgdGhlIGxlYWRpbmcgLy8gY2FuIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWRcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gIHZhbFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5oYXNBdXRob3JpdHlQcmVmaXggPSBmdW5jdGlvbih2YWwpIHtcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWYgPSB2YWw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWYgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAodGhpcy51cmlQYXJ0cy5zb3VyY2UuaW5kZXhPZignLy8nKSAhPT0gLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZjtcbiAgICB9XG4gIH07XG5cbiAgVXJpLnByb3RvdHlwZS5pc0NvbG9uVXJpID0gZnVuY3Rpb24gKHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy51cmlQYXJ0cy5pc0NvbG9uVXJpID0gISF2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhIXRoaXMudXJpUGFydHMuaXNDb2xvblVyaTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBxdWVyeSBwYWlyc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFt2YWxdICAgc2V0IGEgbmV3IHF1ZXJ5IHN0cmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgcXVlcnkgc3RyaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKSB7XG4gICAgdmFyIHMgPSAnJywgaSwgcGFyYW0sIGw7XG5cbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMucXVlcnlQYWlycyA9IHBhcnNlUXVlcnkodmFsKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHMgKz0gJyYnO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtWzFdID09PSBudWxsKSB7XG4gICAgICAgIHMgKz0gcGFyYW1bMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzICs9IHBhcmFtWzBdO1xuICAgICAgICBzICs9ICc9JztcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbVsxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzICs9IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHMubGVuZ3RoID4gMCA/ICc/JyArIHMgOiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIHRoZSBmaXJzdCBxdWVyeSBwYXJhbSB2YWx1ZSBmb3VuZCBmb3IgdGhlIGtleVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleSBxdWVyeSBrZXlcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgZmlyc3QgdmFsdWUgZm91bmQgZm9yIGtleVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5nZXRRdWVyeVBhcmFtVmFsdWUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHBhcmFtLCBpLCBsO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGlmIChrZXkgPT09IHBhcmFtWzBdKSB7XG4gICAgICAgIHJldHVybiBwYXJhbVsxXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgcXVlcnkgcGFyYW0gdmFsdWVzIGZvciB0aGUga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5IHF1ZXJ5IGtleVxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICBhcnJheSBvZiB2YWx1ZXNcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuZ2V0UXVlcnlQYXJhbVZhbHVlcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgYXJyID0gW10sIGksIHBhcmFtLCBsO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGlmIChrZXkgPT09IHBhcmFtWzBdKSB7XG4gICAgICAgIGFyci5wdXNoKHBhcmFtWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfTtcblxuICAvKipcbiAgICogcmVtb3ZlcyBxdWVyeSBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5ICAgICByZW1vdmUgdmFsdWVzIGZvciBrZXlcbiAgICogQHBhcmFtICB7dmFsfSAgICBbdmFsXSAgIHJlbW92ZSBhIHNwZWNpZmljIHZhbHVlLCBvdGhlcndpc2UgcmVtb3ZlcyBhbGxcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmRlbGV0ZVF1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICB2YXIgYXJyID0gW10sIGksIHBhcmFtLCBrZXlNYXRjaGVzRmlsdGVyLCB2YWxNYXRjaGVzRmlsdGVyLCBsO1xuXG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblxuICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICBrZXlNYXRjaGVzRmlsdGVyID0gZGVjb2RlKHBhcmFtWzBdKSA9PT0gZGVjb2RlKGtleSk7XG4gICAgICB2YWxNYXRjaGVzRmlsdGVyID0gcGFyYW1bMV0gPT09IHZhbDtcblxuICAgICAgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmICFrZXlNYXRjaGVzRmlsdGVyKSB8fCAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiAoIWtleU1hdGNoZXNGaWx0ZXIgfHwgIXZhbE1hdGNoZXNGaWx0ZXIpKSkge1xuICAgICAgICBhcnIucHVzaChwYXJhbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5xdWVyeVBhaXJzID0gYXJyO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIGFkZHMgYSBxdWVyeSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSAga2V5ICAgICAgICBhZGQgdmFsdWVzIGZvciBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgdmFsICAgICAgICB2YWx1ZSB0byBhZGRcbiAgICogQHBhcmFtICB7aW50ZWdlcn0gW2luZGV4XSAgICBzcGVjaWZpYyBpbmRleCB0byBhZGQgdGhlIHZhbHVlIGF0XG4gICAqIEByZXR1cm4ge1VyaX0gICAgICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuYWRkUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXksIHZhbCwgaW5kZXgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBpbmRleCAhPT0gLTEpIHtcbiAgICAgIGluZGV4ID0gTWF0aC5taW4oaW5kZXgsIHRoaXMucXVlcnlQYWlycy5sZW5ndGgpO1xuICAgICAgdGhpcy5xdWVyeVBhaXJzLnNwbGljZShpbmRleCwgMCwgW2tleSwgdmFsXSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5xdWVyeVBhaXJzLnB1c2goW2tleSwgdmFsXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiB0ZXN0IGZvciB0aGUgZXhpc3RlbmNlIG9mIGEgcXVlcnkgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIGtleSAgICAgICAgYWRkIHZhbHVlcyBmb3Iga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30gIHZhbCAgICAgICAgdmFsdWUgdG8gYWRkXG4gICAqIEBwYXJhbSAge2ludGVnZXJ9IFtpbmRleF0gICAgc3BlY2lmaWMgaW5kZXggdG8gYWRkIHRoZSB2YWx1ZSBhdFxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmhhc1F1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGksIGxlbiA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5xdWVyeVBhaXJzW2ldWzBdID09IGtleSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogcmVwbGFjZXMgcXVlcnkgcGFyYW0gdmFsdWVzXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5ICAgICAgICAga2V5IHRvIHJlcGxhY2UgdmFsdWUgZm9yXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbmV3VmFsICAgICAgbmV3IHZhbHVlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW29sZFZhbF0gICAgcmVwbGFjZSBvbmx5IG9uZSBzcGVjaWZpYyB2YWx1ZSAob3RoZXJ3aXNlIHJlcGxhY2VzIGFsbClcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgICAgICByZXR1cm5zIHNlbGYgZm9yIGZsdWVudCBjaGFpbmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5yZXBsYWNlUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXksIG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsIGxlbiA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGgsIGksIHBhcmFtO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgICAgaWYgKGRlY29kZShwYXJhbVswXSkgPT09IGRlY29kZShrZXkpICYmIGRlY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSkgPT09IGRlY29kZShvbGRWYWwpKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLmRlbGV0ZVF1ZXJ5UGFyYW0oa2V5LCBkZWNvZGUob2xkVmFsKSkuYWRkUXVlcnlQYXJhbShrZXksIG5ld1ZhbCwgaW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICAgIGlmIChkZWNvZGUocGFyYW1bMF0pID09PSBkZWNvZGUoa2V5KSkge1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kZWxldGVRdWVyeVBhcmFtKGtleSk7XG4gICAgICB0aGlzLmFkZFF1ZXJ5UGFyYW0oa2V5LCBuZXdWYWwsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlZmluZSBmbHVlbnQgc2V0dGVyIG1ldGhvZHMgKHNldFByb3RvY29sLCBzZXRIYXNBdXRob3JpdHlQcmVmaXgsIGV0YylcbiAgICovXG4gIFsncHJvdG9jb2wnLCAnaGFzQXV0aG9yaXR5UHJlZml4JywgJ2lzQ29sb25VcmknLCAndXNlckluZm8nLCAnaG9zdCcsICdwb3J0JywgJ3BhdGgnLCAncXVlcnknLCAnYW5jaG9yJ10uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgbWV0aG9kID0gJ3NldCcgKyBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSk7XG4gICAgVXJpLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICB0aGlzW2tleV0odmFsKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTY2hlbWUgbmFtZSwgY29sb24gYW5kIGRvdWJsZXNsYXNoLCBhcyByZXF1aXJlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGh0dHA6Ly8gb3IgcG9zc2libHkganVzdCAvL1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5zY2hlbWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcyA9ICcnO1xuXG4gICAgaWYgKHRoaXMucHJvdG9jb2woKSkge1xuICAgICAgcyArPSB0aGlzLnByb3RvY29sKCk7XG4gICAgICBpZiAodGhpcy5wcm90b2NvbCgpLmluZGV4T2YoJzonKSAhPT0gdGhpcy5wcm90b2NvbCgpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcyArPSAnOic7XG4gICAgICB9XG4gICAgICBzICs9ICcvLyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhhc0F1dGhvcml0eVByZWZpeCgpICYmIHRoaXMuaG9zdCgpKSB7XG4gICAgICAgIHMgKz0gJy8vJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfTtcblxuICAvKipcbiAgICogU2FtZSBhcyBNb3ppbGxhIG5zSVVSSS5wcmVQYXRoXG4gICAqIEByZXR1cm4ge3N0cmluZ30gc2NoZW1lOi8vdXNlcjpwYXNzd29yZEBob3N0OnBvcnRcbiAgICogQHNlZSAgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vbnNJVVJJXG4gICAqL1xuICBVcmkucHJvdG90eXBlLm9yaWdpbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzID0gdGhpcy5zY2hlbWUoKTtcblxuICAgIGlmICh0aGlzLnVzZXJJbmZvKCkgJiYgdGhpcy5ob3N0KCkpIHtcbiAgICAgIHMgKz0gdGhpcy51c2VySW5mbygpO1xuICAgICAgaWYgKHRoaXMudXNlckluZm8oKS5pbmRleE9mKCdAJykgIT09IHRoaXMudXNlckluZm8oKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHMgKz0gJ0AnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3QoKSkge1xuICAgICAgcyArPSB0aGlzLmhvc3QoKTtcbiAgICAgIGlmICh0aGlzLnBvcnQoKSB8fCAodGhpcy5wYXRoKCkgJiYgdGhpcy5wYXRoKCkuc3Vic3RyKDAsIDEpLm1hdGNoKC9bMC05XS8pKSkge1xuICAgICAgICBzICs9ICc6JyArIHRoaXMucG9ydCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgdHJhaWxpbmcgc2xhc2ggdG8gdGhlIHBhdGhcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuYWRkVHJhaWxpbmdTbGFzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoID0gdGhpcy5wYXRoKCkgfHwgJyc7XG5cbiAgICBpZiAocGF0aC5zdWJzdHIoLTEpICE9PSAnLycpIHtcbiAgICAgIHRoaXMucGF0aChwYXRoICsgJy8nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIFVyaSBvYmplY3RcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoLCBzID0gdGhpcy5vcmlnaW4oKTtcblxuICAgIGlmICh0aGlzLmlzQ29sb25VcmkoKSkge1xuICAgICAgaWYgKHRoaXMucGF0aCgpKSB7XG4gICAgICAgIHMgKz0gJzonK3RoaXMucGF0aCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYXRoKCkpIHtcbiAgICAgIHBhdGggPSB0aGlzLnBhdGgoKTtcbiAgICAgIGlmICghKHJlLmVuZHNfd2l0aF9zbGFzaGVzLnRlc3QocykgfHwgcmUuc3RhcnRzX3dpdGhfc2xhc2hlcy50ZXN0KHBhdGgpKSkge1xuICAgICAgICBzICs9ICcvJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgcy5yZXBsYWNlKHJlLmVuZHNfd2l0aF9zbGFzaGVzLCAnLycpO1xuICAgICAgICB9XG4gICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UocmUuc3RhcnRzX3dpdGhfc2xhc2hlcywgJy8nKTtcbiAgICAgIH1cbiAgICAgIHMgKz0gcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaG9zdCgpICYmICh0aGlzLnF1ZXJ5KCkudG9TdHJpbmcoKSB8fCB0aGlzLmFuY2hvcigpKSkge1xuICAgICAgICBzICs9ICcvJztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucXVlcnkoKS50b1N0cmluZygpKSB7XG4gICAgICBzICs9IHRoaXMucXVlcnkoKS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFuY2hvcigpKSB7XG4gICAgICBpZiAodGhpcy5hbmNob3IoKS5pbmRleE9mKCcjJykgIT09IDApIHtcbiAgICAgICAgcyArPSAnIyc7XG4gICAgICB9XG4gICAgICBzICs9IHRoaXMuYW5jaG9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsb25lIGEgVXJpIG9iamVjdFxuICAgKiBAcmV0dXJuIHtVcml9IGR1cGxpY2F0ZSBjb3B5IG9mIHRoZSBVcmlcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFVyaSh0aGlzLnRvU3RyaW5nKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBleHBvcnQgdmlhIEFNRCBvciBDb21tb25KUywgb3RoZXJ3aXNlIGxlYWsgYSBnbG9iYWxcbiAgICovXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gVXJpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFVyaTtcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuVXJpID0gVXJpO1xuICB9XG59KHRoaXMpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc3VyaS9VcmkuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKlxuKiogQ29weXJpZ2h0IChDKSAyMDE1IFRoZSBRdCBDb21wYW55IEx0ZC5cbioqIENvcHlyaWdodCAoQykgMjAxNCBLbGFyw6RsdmRhbGVucyBEYXRha29uc3VsdCBBQiwgYSBLREFCIEdyb3VwIGNvbXBhbnksIGluZm9Aa2RhYi5jb20sIGF1dGhvciBNaWxpYW4gV29sZmYgPG1pbGlhbi53b2xmZkBrZGFiLmNvbT5cbioqIENvbnRhY3Q6IGh0dHA6Ly93d3cucXQuaW8vbGljZW5zaW5nL1xuKipcbioqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBRdFdlYkNoYW5uZWwgbW9kdWxlIG9mIHRoZSBRdCBUb29sa2l0LlxuKipcbioqICRRVF9CRUdJTl9MSUNFTlNFOkxHUEwyMSRcbioqIENvbW1lcmNpYWwgTGljZW5zZSBVc2FnZVxuKiogTGljZW5zZWVzIGhvbGRpbmcgdmFsaWQgY29tbWVyY2lhbCBRdCBsaWNlbnNlcyBtYXkgdXNlIHRoaXMgZmlsZSBpblxuKiogYWNjb3JkYW5jZSB3aXRoIHRoZSBjb21tZXJjaWFsIGxpY2Vuc2UgYWdyZWVtZW50IHByb3ZpZGVkIHdpdGggdGhlXG4qKiBTb2Z0d2FyZSBvciwgYWx0ZXJuYXRpdmVseSwgaW4gYWNjb3JkYW5jZSB3aXRoIHRoZSB0ZXJtcyBjb250YWluZWQgaW5cbioqIGEgd3JpdHRlbiBhZ3JlZW1lbnQgYmV0d2VlbiB5b3UgYW5kIFRoZSBRdCBDb21wYW55LiBGb3IgbGljZW5zaW5nIHRlcm1zXG4qKiBhbmQgY29uZGl0aW9ucyBzZWUgaHR0cDovL3d3dy5xdC5pby90ZXJtcy1jb25kaXRpb25zLiBGb3IgZnVydGhlclxuKiogaW5mb3JtYXRpb24gdXNlIHRoZSBjb250YWN0IGZvcm0gYXQgaHR0cDovL3d3dy5xdC5pby9jb250YWN0LXVzLlxuKipcbioqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBVc2FnZVxuKiogQWx0ZXJuYXRpdmVseSwgdGhpcyBmaWxlIG1heSBiZSB1c2VkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlclxuKiogR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDIuMSBvciB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlXG4qKiBTb2Z0d2FyZSBGb3VuZGF0aW9uIGFuZCBhcHBlYXJpbmcgaW4gdGhlIGZpbGUgTElDRU5TRS5MR1BMdjIxIGFuZFxuKiogTElDRU5TRS5MR1BMdjMgaW5jbHVkZWQgaW4gdGhlIHBhY2thZ2luZyBvZiB0aGlzIGZpbGUuIFBsZWFzZSByZXZpZXcgdGhlXG4qKiBmb2xsb3dpbmcgaW5mb3JtYXRpb24gdG8gZW5zdXJlIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbioqIHJlcXVpcmVtZW50cyB3aWxsIGJlIG1ldDogaHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9sZ3BsLmh0bWwgYW5kXG4qKiBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvb2xkLWxpY2Vuc2VzL2xncGwtMi4xLmh0bWwuXG4qKlxuKiogQXMgYSBzcGVjaWFsIGV4Y2VwdGlvbiwgVGhlIFF0IENvbXBhbnkgZ2l2ZXMgeW91IGNlcnRhaW4gYWRkaXRpb25hbFxuKiogcmlnaHRzLiBUaGVzZSByaWdodHMgYXJlIGRlc2NyaWJlZCBpbiBUaGUgUXQgQ29tcGFueSBMR1BMIEV4Y2VwdGlvblxuKiogdmVyc2lvbiAxLjEsIGluY2x1ZGVkIGluIHRoZSBmaWxlIExHUExfRVhDRVBUSU9OLnR4dCBpbiB0aGlzIHBhY2thZ2UuXG4qKlxuKiogJFFUX0VORF9MSUNFTlNFJFxuKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMgPSB7XG4gICAgc2lnbmFsOiAxLFxuICAgIHByb3BlcnR5VXBkYXRlOiAyLFxuICAgIGluaXQ6IDMsXG4gICAgaWRsZTogNCxcbiAgICBkZWJ1ZzogNSxcbiAgICBpbnZva2VNZXRob2Q6IDYsXG4gICAgY29ubmVjdFRvU2lnbmFsOiA3LFxuICAgIGRpc2Nvbm5lY3RGcm9tU2lnbmFsOiA4LFxuICAgIHNldFByb3BlcnR5OiA5LFxuICAgIHJlc3BvbnNlOiAxMCxcbn07XG5cbnZhciBRV2ViQ2hhbm5lbCA9IGZ1bmN0aW9uKHRyYW5zcG9ydCwgaW5pdENhbGxiYWNrKVxue1xuICAgIGlmICh0eXBlb2YgdHJhbnNwb3J0ICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0cmFuc3BvcnQuc2VuZCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgUVdlYkNoYW5uZWwgZXhwZWN0cyBhIHRyYW5zcG9ydCBvYmplY3Qgd2l0aCBhIHNlbmQgZnVuY3Rpb24gYW5kIG9ubWVzc2FnZSBjYWxsYmFjayBwcm9wZXJ0eS5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCIgR2l2ZW4gaXM6IHRyYW5zcG9ydDogXCIgKyB0eXBlb2YodHJhbnNwb3J0KSArIFwiLCB0cmFuc3BvcnQuc2VuZDogXCIgKyB0eXBlb2YodHJhbnNwb3J0LnNlbmQpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjaGFubmVsID0gdGhpcztcbiAgICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcblxuICAgIHRoaXMuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC50cmFuc3BvcnQuc2VuZChkYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLnRyYW5zcG9ydC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkYXRhLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuc2lnbmFsOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlU2lnbmFsKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5yZXNwb25zZTpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVJlc3BvbnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5wcm9wZXJ0eVVwZGF0ZTpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVByb3BlcnR5VXBkYXRlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiaW52YWxpZCBtZXNzYWdlIHJlY2VpdmVkOlwiLCBtZXNzYWdlLmRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5leGVjQ2FsbGJhY2tzID0ge307XG4gICAgdGhpcy5leGVjSWQgPSAwO1xuICAgIHRoaXMuZXhlYyA9IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxuICAgIHtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gaWYgbm8gY2FsbGJhY2sgaXMgZ2l2ZW4sIHNlbmQgZGlyZWN0bHlcbiAgICAgICAgICAgIGNoYW5uZWwuc2VuZChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbm5lbC5leGVjSWQgPT09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgICAgICAgIC8vIHdyYXBcbiAgICAgICAgICAgIGNoYW5uZWwuZXhlY0lkID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGV4ZWMgbWVzc2FnZSB3aXRoIHByb3BlcnR5IGlkOiBcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLmlkID0gY2hhbm5lbC5leGVjSWQrKztcbiAgICAgICAgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW2RhdGEuaWRdID0gY2FsbGJhY2s7XG4gICAgICAgIGNoYW5uZWwuc2VuZChkYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vYmplY3RzID0ge307XG5cbiAgICB0aGlzLmhhbmRsZVNpZ25hbCA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICB2YXIgb2JqZWN0ID0gY2hhbm5lbC5vYmplY3RzW21lc3NhZ2Uub2JqZWN0XTtcbiAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0LnNpZ25hbEVtaXR0ZWQobWVzc2FnZS5zaWduYWwsIG1lc3NhZ2UuYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgc2lnbmFsOiBcIiArIG1lc3NhZ2Uub2JqZWN0ICsgXCI6OlwiICsgbWVzc2FnZS5zaWduYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBpZiAoIW1lc3NhZ2UuaGFzT3duUHJvcGVydHkoXCJpZFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgcmVzcG9uc2UgbWVzc2FnZSByZWNlaXZlZDogXCIsIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWNDYWxsYmFja3NbbWVzc2FnZS5pZF0obWVzc2FnZS5kYXRhKTtcbiAgICAgICAgZGVsZXRlIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1ttZXNzYWdlLmlkXTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVByb3BlcnR5VXBkYXRlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gbWVzc2FnZS5kYXRhKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YVtpXTtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBjaGFubmVsLm9iamVjdHNbZGF0YS5vYmplY3RdO1xuICAgICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5wcm9wZXJ0eVVwZGF0ZShkYXRhLnNpZ25hbHMsIGRhdGEucHJvcGVydGllcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuaGFuZGxlZCBwcm9wZXJ0eSB1cGRhdGU6IFwiICsgZGF0YS5vYmplY3QgKyBcIjo6XCIgKyBkYXRhLnNpZ25hbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pZGxlfSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1ZyA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBjaGFubmVsLnNlbmQoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmRlYnVnLCBkYXRhOiBtZXNzYWdlfSk7XG4gICAgfTtcblxuICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaW5pdH0sIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZm9yICh2YXIgb2JqZWN0TmFtZSBpbiBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gbmV3IFFPYmplY3Qob2JqZWN0TmFtZSwgZGF0YVtvYmplY3ROYW1lXSwgY2hhbm5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm93IHVud3JhcCBwcm9wZXJ0aWVzLCB3aGljaCBtaWdodCByZWZlcmVuY2Ugb3RoZXIgcmVnaXN0ZXJlZCBvYmplY3RzXG4gICAgICAgIGZvciAodmFyIG9iamVjdE5hbWUgaW4gY2hhbm5lbC5vYmplY3RzKSB7XG4gICAgICAgICAgICBjaGFubmVsLm9iamVjdHNbb2JqZWN0TmFtZV0udW53cmFwUHJvcGVydGllcygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbml0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgIGluaXRDYWxsYmFjayhjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmlkbGV9KTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIFFPYmplY3QobmFtZSwgZGF0YSwgd2ViQ2hhbm5lbClcbntcbiAgICB0aGlzLl9faWRfXyA9IG5hbWU7XG4gICAgd2ViQ2hhbm5lbC5vYmplY3RzW25hbWVdID0gdGhpcztcblxuICAgIC8vIExpc3Qgb2YgY2FsbGJhY2tzIHRoYXQgZ2V0IGludm9rZWQgdXBvbiBzaWduYWwgZW1pc3Npb25cbiAgICB0aGlzLl9fb2JqZWN0U2lnbmFsc19fID0ge307XG5cbiAgICAvLyBDYWNoZSBvZiBhbGwgcHJvcGVydGllcywgdXBkYXRlZCB3aGVuIGEgbm90aWZ5IHNpZ25hbCBpcyBlbWl0dGVkXG4gICAgdGhpcy5fX3Byb3BlcnR5Q2FjaGVfXyA9IHt9O1xuXG4gICAgdmFyIG9iamVjdCA9IHRoaXM7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICB0aGlzLnVud3JhcFFPYmplY3QgPSBmdW5jdGlvbihyZXNwb25zZSlcbiAgICB7XG4gICAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0IGxpc3Qgb2Ygb2JqZWN0c1xuICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBBcnJheShyZXNwb25zZS5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHJldFtpXSA9IG9iamVjdC51bndyYXBRT2JqZWN0KHJlc3BvbnNlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXNwb25zZVxuICAgICAgICAgICAgfHwgIXJlc3BvbnNlW1wiX19RT2JqZWN0Kl9fXCJdXG4gICAgICAgICAgICB8fCByZXNwb25zZVtcImlkXCJdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvYmplY3RJZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICBpZiAod2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXSlcbiAgICAgICAgICAgIHJldHVybiB3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCB1bndyYXAgdW5rbm93biBRT2JqZWN0IFwiICsgb2JqZWN0SWQgKyBcIiB3aXRob3V0IGRhdGEuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHFPYmplY3QgPSBuZXcgUU9iamVjdCggb2JqZWN0SWQsIHJlc3BvbnNlLmRhdGEsIHdlYkNoYW5uZWwgKTtcbiAgICAgICAgcU9iamVjdC5kZXN0cm95ZWQuY29ubmVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdID09PSBxT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF07XG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhlIG5vdyBkZWxldGVkIFFPYmplY3QgdG8gYW4gZW1wdHkge30gb2JqZWN0XG4gICAgICAgICAgICAgICAgLy8ganVzdCBhc3NpZ25pbmcge30gdGhvdWdoIHdvdWxkIG5vdCBoYXZlIHRoZSBkZXNpcmVkIGVmZmVjdCwgYnV0IHRoZVxuICAgICAgICAgICAgICAgIC8vIGJlbG93IGFsc28gZW5zdXJlcyBhbGwgZXh0ZXJuYWwgcmVmZXJlbmNlcyB3aWxsIHNlZSB0aGUgZW1wdHkgbWFwXG4gICAgICAgICAgICAgICAgLy8gTk9URTogdGhpcyBkZXRvdXIgaXMgbmVjZXNzYXJ5IHRvIHdvcmthcm91bmQgUVRCVUctNDAwMjFcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBxT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZHggaW4gcHJvcGVydHlOYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcU9iamVjdFtwcm9wZXJ0eU5hbWVzW2lkeF1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGhlcmUgd2UgYXJlIGFscmVhZHkgaW5pdGlhbGl6ZWQsIGFuZCB0aHVzIG11c3QgZGlyZWN0bHkgdW53cmFwIHRoZSBwcm9wZXJ0aWVzXG4gICAgICAgIHFPYmplY3QudW53cmFwUHJvcGVydGllcygpO1xuICAgICAgICByZXR1cm4gcU9iamVjdDtcbiAgICB9XG5cbiAgICB0aGlzLnVud3JhcFByb3BlcnRpZXMgPSBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eUlkeCBpbiBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX18pIHtcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUlkeF0gPSBvYmplY3QudW53cmFwUU9iamVjdChvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJZHhdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFNpZ25hbChzaWduYWxEYXRhLCBpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsKVxuICAgIHtcbiAgICAgICAgdmFyIHNpZ25hbE5hbWUgPSBzaWduYWxEYXRhWzBdO1xuICAgICAgICB2YXIgc2lnbmFsSW5kZXggPSBzaWduYWxEYXRhWzFdO1xuICAgICAgICBvYmplY3Rbc2lnbmFsTmFtZV0gPSB7XG4gICAgICAgICAgICBjb25uZWN0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoY2FsbGJhY2spICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkJhZCBjYWxsYmFjayBnaXZlbiB0byBjb25uZWN0IHRvIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSA9IG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gfHwgW107XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XS5wdXNoKGNhbGxiYWNrKTtcblxuICAgICAgICAgICAgICAgIGlmICghaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbCAmJiBzaWduYWxOYW1lICE9PSBcImRlc3Ryb3llZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcmVxdWlyZWQgZm9yIFwicHVyZVwiIHNpZ25hbHMsIGhhbmRsZWQgc2VwYXJhdGVseSBmb3IgcHJvcGVydGllcyBpbiBwcm9wZXJ0eVVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAvLyBhbHNvIG5vdGUgdGhhdCB3ZSBhbHdheXMgZ2V0IG5vdGlmaWVkIGFib3V0IHRoZSBkZXN0cm95ZWQgc2lnbmFsXG4gICAgICAgICAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5jb25uZWN0VG9TaWduYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IHNpZ25hbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNjb25uZWN0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoY2FsbGJhY2spICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkJhZCBjYWxsYmFjayBnaXZlbiB0byBkaXNjb25uZWN0IGZyb20gc2lnbmFsIFwiICsgc2lnbmFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSA9IG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gfHwgW107XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0uaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBmaW5kIGNvbm5lY3Rpb24gb2Ygc2lnbmFsIFwiICsgc2lnbmFsTmFtZSArIFwiIHRvIFwiICsgY2FsbGJhY2submFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzUHJvcGVydHlOb3RpZnlTaWduYWwgJiYgb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSByZXF1aXJlZCBmb3IgXCJwdXJlXCIgc2lnbmFscywgaGFuZGxlZCBzZXBhcmF0ZWx5IGZvciBwcm9wZXJ0aWVzIGluIHByb3BlcnR5VXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5kaXNjb25uZWN0RnJvbVNpZ25hbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hbDogc2lnbmFsSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgYWxsIGNhbGxiYWNrcyBmb3IgdGhlIGdpdmVuIHNpZ25hbG5hbWUuIEFsc28gd29ya3MgZm9yIHByb3BlcnR5IG5vdGlmeSBjYWxsYmFja3MuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52b2tlU2lnbmFsQ2FsbGJhY2tzKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpXG4gICAge1xuICAgICAgICB2YXIgY29ubmVjdGlvbnMgPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsTmFtZV07XG4gICAgICAgIGlmIChjb25uZWN0aW9ucykge1xuICAgICAgICAgICAgY29ubmVjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBzaWduYWxBcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZSA9IGZ1bmN0aW9uKHNpZ25hbHMsIHByb3BlcnR5TWFwKVxuICAgIHtcbiAgICAgICAgLy8gdXBkYXRlIHByb3BlcnR5IGNhY2hlXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5SW5kZXggaW4gcHJvcGVydHlNYXApIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlNYXBbcHJvcGVydHlJbmRleF07XG4gICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgc2lnbmFsTmFtZSBpbiBzaWduYWxzKSB7XG4gICAgICAgICAgICAvLyBJbnZva2UgYWxsIGNhbGxiYWNrcywgYXMgc2lnbmFsRW1pdHRlZCgpIGRvZXMgbm90LiBUaGlzIGVuc3VyZXMgdGhlXG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBjYWNoZSBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2tzIGFyZSBpbnZva2VkLlxuICAgICAgICAgICAgaW52b2tlU2lnbmFsQ2FsbGJhY2tzKHNpZ25hbE5hbWUsIHNpZ25hbHNbc2lnbmFsTmFtZV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaWduYWxFbWl0dGVkID0gZnVuY3Rpb24oc2lnbmFsTmFtZSwgc2lnbmFsQXJncylcbiAgICB7XG4gICAgICAgIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxBcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRNZXRob2QobWV0aG9kRGF0YSlcbiAgICB7XG4gICAgICAgIHZhciBtZXRob2ROYW1lID0gbWV0aG9kRGF0YVswXTtcbiAgICAgICAgdmFyIG1ldGhvZElkeCA9IG1ldGhvZERhdGFbMV07XG4gICAgICAgIG9iamVjdFttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjaztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaW52b2tlTWV0aG9kLFxuICAgICAgICAgICAgICAgIFwib2JqZWN0XCI6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogbWV0aG9kSWR4LFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBvYmplY3QudW53cmFwUU9iamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGNhbGxiYWNrKShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZEdldHRlclNldHRlcihwcm9wZXJ0eUluZm8pXG4gICAge1xuICAgICAgICB2YXIgcHJvcGVydHlJbmRleCA9IHByb3BlcnR5SW5mb1swXTtcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5SW5mb1sxXTtcbiAgICAgICAgdmFyIG5vdGlmeVNpZ25hbERhdGEgPSBwcm9wZXJ0eUluZm9bMl07XG4gICAgICAgIC8vIGluaXRpYWxpemUgcHJvcGVydHkgY2FjaGUgd2l0aCBjdXJyZW50IHZhbHVlXG4gICAgICAgIC8vIE5PVEU6IGlmIHRoaXMgaXMgYW4gb2JqZWN0LCBpdCBpcyBub3QgZGlyZWN0bHkgdW53cmFwcGVkIGFzIGl0IG1pZ2h0XG4gICAgICAgIC8vIHJlZmVyZW5jZSBvdGhlciBRT2JqZWN0IHRoYXQgd2UgZG8gbm90IGtub3cgeWV0XG4gICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHByb3BlcnR5SW5mb1szXTtcblxuICAgICAgICBpZiAobm90aWZ5U2lnbmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKG5vdGlmeVNpZ25hbERhdGFbMF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBzaWduYWwgbmFtZSBpcyBvcHRpbWl6ZWQgYXdheSwgcmVjb25zdHJ1Y3QgdGhlIGFjdHVhbCBuYW1lXG4gICAgICAgICAgICAgICAgbm90aWZ5U2lnbmFsRGF0YVswXSA9IHByb3BlcnR5TmFtZSArIFwiQ2hhbmdlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkU2lnbmFsKG5vdGlmeVNpZ25hbERhdGEsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHlOYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkbid0IGhhcHBlblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmRlZmluZWQgdmFsdWUgaW4gcHJvcGVydHkgY2FjaGUgZm9yIHByb3BlcnR5IFxcXCJcIiArIHByb3BlcnR5TmFtZSArIFwiXFxcIiBpbiBvYmplY3QgXCIgKyBvYmplY3QuX19pZF9fKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUHJvcGVydHkgc2V0dGVyIGZvciBcIiArIHByb3BlcnR5TmFtZSArIFwiIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCB2YWx1ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnNldFByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICBcIm9iamVjdFwiOiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5XCI6IHByb3BlcnR5SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBkYXRhLm1ldGhvZHMuZm9yRWFjaChhZGRNZXRob2QpO1xuXG4gICAgZGF0YS5wcm9wZXJ0aWVzLmZvckVhY2goYmluZEdldHRlclNldHRlcik7XG5cbiAgICBkYXRhLnNpZ25hbHMuZm9yRWFjaChmdW5jdGlvbihzaWduYWwpIHsgYWRkU2lnbmFsKHNpZ25hbCwgZmFsc2UpOyB9KTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gZGF0YS5lbnVtcykge1xuICAgICAgICBvYmplY3RbbmFtZV0gPSBkYXRhLmVudW1zW25hbWVdO1xuICAgIH1cbn1cblxuLy9yZXF1aXJlZCBmb3IgdXNlIHdpdGggbm9kZWpzXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgUVdlYkNoYW5uZWw6IFFXZWJDaGFubmVsXG4gICAgfTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL1V0aWxpdGllcy5qcycpO1xudmFyIFNoYXJlZCA9IHJlcXVpcmUoJy4vU2hhcmVkLmpzJyk7XG52YXIgTmF0aXZlRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vTmF0aXZlRGlzcGF0Y2hlci5qcycpO1xudmFyIFNpbXVsYXRvckRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL1NpbXVsYXRvckRpc3BhdGNoZXIuanMnKTtcbnZhciBxd2ViY2hhbm5lbCA9IHJlcXVpcmUoJ3F3ZWJjaGFubmVsJyk7XG5cbi8qKiBAbW9kdWxlIFNoaW1MaWJyYXJ5IC0gVGhpcyBtb2R1bGUgZGVmaW5lcyB0aGUgV0RDJ3Mgc2hpbSBsaWJyYXJ5IHdoaWNoIGlzIHVzZWRcbnRvIGJyaWRnZSB0aGUgZ2FwIGJldHdlZW4gdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgV0RDIGFuZCB0aGUgZHJpdmluZyBjb250ZXh0XG5vZiB0aGUgV0RDIChUYWJsZWF1IGRlc2t0b3AsIHRoZSBzaW11bGF0b3IsIGV0Yy4pICovXG5cbi8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBvbmNlIGJvb3RzdHJhcHBpbmcgaGFzIGJlZW4gY29tcGxldGVkIGFuZCB0aGVcbi8vIGRpc3BhdGNoZXIgYW5kIHNoYXJlZCBXREMgb2JqZWN0cyBhcmUgYm90aCBjcmVhdGVkIGFuZCBhdmFpbGFibGVcbmZ1bmN0aW9uIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChfZGlzcGF0Y2hlciwgX3NoYXJlZCkge1xuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wdWJsaWNJbnRlcmZhY2UsIHdpbmRvdy50YWJsZWF1KTtcbiAgVXRpbGl0aWVzLmNvcHlGdW5jdGlvbnMoX2Rpc3BhdGNoZXIucHJpdmF0ZUludGVyZmFjZSwgd2luZG93Ll90YWJsZWF1KTtcbiAgX3NoYXJlZC5pbml0KCk7XG59XG5cbi8vIEluaXRpYWxpemVzIHRoZSB3ZGMgc2hpbSBsaWJyYXJ5LiBZb3UgbXVzdCBjYWxsIHRoaXMgYmVmb3JlIGRvaW5nIGFueXRoaW5nIHdpdGggV0RDXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8gVGhlIGluaXRpYWwgY29kZSBoZXJlIGlzIHRoZSBvbmx5IHBsYWNlIGluIG91ciBtb2R1bGUgd2hpY2ggc2hvdWxkIGhhdmUgZ2xvYmFsXG4gIC8vIGtub3dsZWRnZSBvZiBob3cgYWxsIHRoZSBXREMgY29tcG9uZW50cyBhcmUgZ2x1ZWQgdG9nZXRoZXIuIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2VcbiAgLy8gd2hpY2ggd2lsbCBrbm93IGFib3V0IHRoZSB3aW5kb3cgb2JqZWN0IG9yIG90aGVyIGdsb2JhbCBvYmplY3RzLiBUaGlzIGNvZGUgd2lsbCBiZSBydW5cbiAgLy8gaW1tZWRpYXRlbHkgd2hlbiB0aGUgc2hpbSBsaWJyYXJ5IGxvYWRzIGFuZCBpcyByZXNwb25zaWJsZSBmb3IgZGV0ZXJtaW5pbmcgdGhlIGNvbnRleHRcbiAgLy8gd2hpY2ggaXQgaXMgcnVubmluZyBpdCBhbmQgc2V0dXAgYSBjb21tdW5pY2F0aW9ucyBjaGFubmVsIGJldHdlZW4gdGhlIGpzICYgcnVubmluZyBjb2RlXG4gIHZhciBkaXNwYXRjaGVyID0gbnVsbDtcbiAgdmFyIHNoYXJlZCA9IG51bGw7XG5cbiAgLy8gQWx3YXlzIGRlZmluZSB0aGUgcHJpdmF0ZSBfdGFibGVhdSBvYmplY3QgYXQgdGhlIHN0YXJ0XG4gIHdpbmRvdy5fdGFibGVhdSA9IHt9O1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgdGFibGVhdVZlcnNpb25Cb290c3RyYXAgaXMgZGVmaW5lZCBhcyBhIGdsb2JhbCBvYmplY3QuIElmIHNvLFxuICAvLyB3ZSBhcmUgcnVubmluZyBpbiB0aGUgVGFibGVhdSBkZXNrdG9wL3NlcnZlciBjb250ZXh0LiBJZiBub3QsIHdlJ3JlIHJ1bm5pbmcgaW4gdGhlIHNpbXVsYXRvclxuICBpZiAoISF3aW5kb3cudGFibGVhdVZlcnNpb25Cb290c3RyYXApIHtcbiAgICAvLyBXZSBoYXZlIHRoZSB0YWJsZWF1IG9iamVjdCBkZWZpbmVkXG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciwgUmVwb3J0aW5nIHZlcnNpb24gbnVtYmVyXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XG4gICAgZGlzcGF0Y2hlciA9IG5ldyBOYXRpdmVEaXNwYXRjaGVyKHdpbmRvdyk7XG4gIH0gZWxzZSBpZiAoISF3aW5kb3cucXQgJiYgISF3aW5kb3cucXQud2ViQ2hhbm5lbFRyYW5zcG9ydCkge1xuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIE5hdGl2ZURpc3BhdGNoZXIgZm9yIHF3ZWJjaGFubmVsXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1ID0ge307XG5cbiAgICAvLyBXZSdyZSBydW5uaW5nIGluIGEgY29udGV4dCB3aGVyZSB0aGUgd2ViQ2hhbm5lbFRyYW5zcG9ydCBpcyBhdmFpbGFibGUuIFRoaXMgbWVhbnMgUVdlYkVuZ2luZSBpcyBpbiB1c2VcbiAgICB3aW5kb3cuY2hhbm5lbCA9IG5ldyBxd2ViY2hhbm5lbC5RV2ViQ2hhbm5lbChxdC53ZWJDaGFubmVsVHJhbnNwb3J0LCBmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlFXZWJDaGFubmVsIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuXG4gICAgICAvLyBEZWZpbmUgdGhlIGZ1bmN0aW9uIHdoaWNoIHRhYmxlYXUgd2lsbCBjYWxsIGFmdGVyIGl0IGhhcyBpbnNlcnRlZCBhbGwgdGhlIHJlcXVpcmVkIG9iamVjdHMgaW50byB0aGUgamF2YXNjcmlwdCBmcmFtZVxuICAgICAgd2luZG93Ll90YWJsZWF1Ll9uYXRpdmVTZXR1cENvbXBsZXRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBPbmNlIHRoZSBuYXRpdmUgY29kZSB0ZWxscyB1cyBldmVyeXRoaW5nIGhlcmUgaXMgZG9uZSwgd2Ugc2hvdWxkIGhhdmUgYWxsIHRoZSBleHBlY3RlZCBvYmplY3RzIGluc2VydGVkIGludG8ganNcbiAgICAgICAgZGlzcGF0Y2hlciA9IG5ldyBOYXRpdmVEaXNwYXRjaGVyKGNoYW5uZWwub2JqZWN0cyk7XG4gICAgICAgIHdpbmRvdy50YWJsZWF1ID0gY2hhbm5lbC5vYmplY3RzLnRhYmxlYXU7XG4gICAgICAgIHNoYXJlZC5jaGFuZ2VUYWJsZWF1QXBpT2JqKHdpbmRvdy50YWJsZWF1KTtcbiAgICAgICAgYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKGRpc3BhdGNoZXIsIHNoYXJlZCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBBY3R1YWxseSBjYWxsIGludG8gdGhlIHZlcnNpb24gYm9vdHN0cmFwcGVyIHRvIHJlcG9ydCBvdXIgdmVyc2lvbiBudW1iZXJcbiAgICAgIGNoYW5uZWwub2JqZWN0cy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJWZXJzaW9uIEJvb3RzdHJhcCBpcyBub3QgZGVmaW5lZCwgSW5pdGlhbGl6aW5nIFNpbXVsYXRvckRpc3BhdGNoZXJcIik7XG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcbiAgICBkaXNwYXRjaGVyID0gbmV3IFNpbXVsYXRvckRpc3BhdGNoZXIod2luZG93KTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdGhlIHNoYXJlZCBXREMgb2JqZWN0IGFuZCBhZGQgaW4gb3VyIGVudW0gdmFsdWVzXG4gIHNoYXJlZCA9IG5ldyBTaGFyZWQod2luZG93LnRhYmxlYXUsIHdpbmRvdy5fdGFibGVhdSwgd2luZG93KTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRpc3BhdGNoZXIgaXMgYWxyZWFkeSBkZWZpbmVkIGFuZCBpbW1lZGlhdGVseSBjYWxsIHRoZVxuICAvLyBjYWxsYmFjayBpZiBzb1xuICBpZiAoZGlzcGF0Y2hlcikge1xuICAgIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChkaXNwYXRjaGVyLCBzaGFyZWQpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90YWJsZWF1d2RjLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzNLQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9