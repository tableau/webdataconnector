(function() {
    var versionNumber = "1.1.0";

    tableau = {versionNumber: versionNumber};

    tableau.phaseEnum = {
        interactivePhase: "interactive",
        authPhase: "auth",
        gatherDataPhase: "gatherData"
    };
})();

var tabSimulatorObj = function(innerIframe) {
    this.targetWindow = innerIframe.contentWindow;
}

tabSimulatorObj.prototype = {
    connectionName: "",
    connectionData: "",
    password: "",
    username: "",
    phase: tableau.phaseEnum.interactivePhase,
    incrementalExtractColumn: null,
    _MAX_DATA_REQUEST_CALLS: 5,
    _authenticated: true,
    _lastRefreshColVal: "",
    _wasSubmitCalled: false,
    _wasInitCallbackCalled: false,

    updateSimulatorUI: function () {
        $('#connectionName').val(this.connectionName);
        $('#connectionData').val(this.connectionData);
        $('#incrementalExtractColumn').val(this.incrementalExtractColumn);
        $('#incrementalRefresh').prop("disabled", true);
        $('#scriptVersion').val(this.scriptVersion);
        $('#username').val(this.username);
        $('#password').val(this.password);
    },

    submit: function () {
        if (this.phase == tableau.phaseEnum.gatherDataPhase) {
            // if submit is called in the data gathering phase ignore it
            return;
        }
        this.connectionData = this._ensureStringData(this.connectionData);
        this.username = this._ensureStringData(this.username);
        this.password = this._ensureStringData(this.password);
        this.connectionName = this._ensureStringData(this.connectionName);

        this.updateSimulatorUI();

        // reset authentication state and call init because submit triggers the second phase which starts with a new context
        this._authenticated = true;

        this._wasSubmitCalled = true;
        this._checkSubmitAndInitCallback();
    },

    _checkSubmitAndInitCallback: function() {
        this.updateSimulatorUI();
        if (this._wasSubmitCalled && this._wasInitCallbackCalled) {
            // clear out the data table. It is probably already empty, but you can hit
            // submit multiple times in the simulator (you can't in Tableau), and there
            // is an expectation that the simulator will run through the second phase again.
            // Clear the table so the second phase can re-fill it.
            this._clearDataTable();
            // set the interactive state to false at this point and start the data gathering (second phase)
            this._sendInit(tableau.phaseEnum.gatherDataPhase);
        }
    },

    initCallback: function () {
        if (this.phase != tableau.phaseEnum.gatherDataPhase) {
            this._wasInitCallbackCalled = true;
            this._checkSubmitAndInitCallback();
        } else {
            this._requestHeaders();
        }
    },

    shutdownCallback: function () {
        console.log("shutdownCallback called. All done.");
    },

    _clearDataTable: function () {
        $('#fetchedData').html('<table id="dataTable"><tr id="headerTypeRow"/><tr id="headerNameRow"/></table>'); // clear out the data table
    },

    headersCallback: function (titles, types) {
        // only create the headers if they aren't already there and if we were passed valid lists.
        if (titles.length != types.length) {
            var warningMsg = 'header titles and types must be the same length';
            this._warn(warningMsg);
        }
        if (titles && types && $('#headerTypeRow').find("th").length == 0)
        {
            var headerTypeRow = $('#headerTypeRow');
            var headerNameRow = $('#headerNameRow');
            if (this.incrementalExtractColumn && titles.indexOf(this.incrementalExtractColumn) == -1) {
            	this._warn('Incremental refresh column is set but is not a column returned to Tableau, IncrementalExtractColumn: "' + this.incrementalExtractColumn + '"');
            }
            for (var ii = 0; ii < titles.length; ++ii) {
                var cell = $('<th />');
                cell.addClass("tableCell");
                cell.text('[' + types[ii] + ']');
                headerTypeRow.append(cell);
                cell = cell = $('<th />');
                cell.addClass("tableCell");
                cell.text(titles[ii]);
                headerNameRow.append(cell);
            }
        }
        this._tableTitles = titles;

        this._startRequestTableData();
    },

    dataCallback: function (dataRows, recordsRead, moreData) {
        var table = $('#dataTable')
        for (var ii = 0; ii < dataRows.length; ++ ii)
        {
            // add a row
            var dataRow = dataRows[ii];
            var row = $('<tr />');
            for (var jj = 0; jj < this._tableTitles.length; ++jj)
            {
                var colName = this._tableTitles[jj]
                var cell = $('<td />');
                $(cell).addClass("tableCell");
                var cellVal;
                if (Array.isArray(dataRow)) {
                    cellVal = dataRow[jj];
                } else {
                    cellVal = dataRow[colName];
                }
                cell.text(cellVal);
                row.append(cell);

                if (this.incrementalExtractColumn && this.incrementalExtractColumn == colName) {
                    this._lastRefreshColVal = cellVal;
                }
            }
            table.append(row);
        }
        this._numreads++;
        if (this._numreads > this._MAX_DATA_REQUEST_CALLS ) {
            this.log("Maximum Number of Requests Reached", "blue");
            this._sendShutdown();
        } else if (moreData) {
            this._requestTableData(recordsRead);
        } else {
            this.log("No More Data", "blue");
            this._sendShutdown();
        }

        // Updates incremental refresh button if there is data and the incremental column is assigned
        if (($('#incrementalExtractColumn').val()) && ($('#incrementalExtractColumn').val().length > 0))
            $('#incrementalRefresh').prop("disabled", false);
    },

    abortWithError: function (errorMsg) {
        this.log(errorMsg, "red");
        throw "WDC error: " + errorMsg;
    },

    log: function (message, color) {
        color = color || "#444444";
        console.log(message);

        var table = $('#logTable');
        var rowDef = "<tr style='color:" + color + "'/>";
        var row = $(rowDef);
        var cell = $('<td />');
        cell.text(message);
        row.append(cell);
        table.append(row);
    },

    reloadConnector: function () {
        this._wasSubmitCalled = false;
    },

    _getLastRefreshColumnValue: function () {
        return this._lastRefreshColVal.toString();
    },

    _requestHeaders: function () {
        if (false === this._authenticated) {
          this._error("Authentication Failed:  Refusing to request headers");
          return;
        }
        this._sendGetColumnHeaders();
    },

    _startRequestTableData: function () {
        this._numreads = 0;
        var initialLastRecordToken = this._getLastRefreshColumnValue()
        this._requestTableData(initialLastRecordToken);
    },

    _requestTableData: function (lastRecordToken) {
        if (false === this._authenticated) {
          this._error("Authentication Failed:  Refusing to request data");
          return;
        }
        lastRecordToken = this._ensureStringData(lastRecordToken);
        this._sendGetTableData(lastRecordToken);
    },

    // Tableau can only accept string data coming from javascript.
    // If we want Tableau to store any data, it needs to be a string.
    // This method checks the type of the data and will notify the connector
    // author if the data is not a string.
    _ensureStringData: function (data) {
        if (typeof data != 'string') {
            this._warn("Tableau only accepts strings, but passed " + data.toString());
        }
        return data.toString();
    },

    _error: function (message) {
        this.log("ERROR: " + message, "red");
    },

    _warn: function (warningMessage) {
        this.log("Warning: " + warningMessage, "orange");
    },

    _sendInit: function (phase) {
        this.phase = phase;
        this._sendMessage("init", {phase: phase});
    },

    _sendShutdown: function () {
        this._sendMessage("shutdown");
    },

    _sendGetColumnHeaders: function () {
        this._sendMessage("getColumnHeaders");
    },

    _sendGetTableData: function (lastRecordToken) {
        this._sendMessage("getTableData", {"lastRecordToken": lastRecordToken});
    },

    _sendMessage: function (msgName, msgData) {
        var messagePayload = this._buildMessagePayload(msgName, msgData);

        this.targetWindow.postMessage(messagePayload, "*");
    },

    _receiveMessage: function (event) {
        // check event.origin
        var payloadObj = JSON.parse(event.data);
        var msgData = payloadObj.msgData;
        this._applyPropertyValues(payloadObj.props);

        switch(payloadObj.msgName) {
            case "submit":
                this.submit();
            break;
            case "initCallback":
                this.initCallback();
                this._verifyVersionNumber(payloadObj.props.versionNumber);
            break;
            case "shutdownCallback":
                this.shutdownCallback();
            break;
            case "log":
                this.log(msgData.logMsg);
            break;
            case "headersCallback":
                var fieldNames = msgData.fieldNames;
                var fieldTypes = msgData.types;
                this.headersCallback(fieldNames, fieldTypes);
            break;
            case "dataCallback":
                var data = msgData.data;
                var lastRecordToken = msgData.lastRecordToken;
                var moreData = msgData.moreData;
                this.dataCallback(data, lastRecordToken, moreData);
            break;
            case "abortWithError":
                var errorMsg = msgData.errorMsg;
                this.abortWithError(errorMsg);
            break;
        }
    },

    _buildMessagePayload: function (msgName, msgData) {
        var msgObj = {"msgName": msgName,
                      "props": this._packagePropertyValues(),
                      "msgData": msgData};
        return JSON.stringify(msgObj);
    },

    _packagePropertyValues: function () {
        var propValues = {"connectionName": this.connectionName,
                          "connectionData": this.connectionData,
                          "password": this.password,
                          "username": this.username,
                          "incrementalExtractColumn": this.incrementalExtractColumn};
        return propValues;
    },

    _applyPropertyValues: function (props) {
        if (props) {
            this.connectionName = props.connectionName;
            this.connectionData = props.connectionData;
            this.password = props.password;
            this.username = props.username;
            this.incrementalExtractColumn = props.incrementalExtractColumn;
        }
    },

    _verifyVersionNumber: function (wdcApiVersion) {
        if (wdcApiVersion !== tableau.versionNumber) {
            throw "Simulator version '" + tableau.versionNumber + "' does not match connector version'" + wdcApiVersion + "'."
        }
    }
}

function iframeLoaded(obj) {
    // insert some callback functions in the iframe
    var iFrameID = document.getElementById('host-iframe');
    if (!(iFrameID.src && iFrameID.src.length > 0)) {
        iFrameID.src = _getConnectorURL();
        return;
    }
    $('#url').val(iFrameID.src);
    if (!this.tabSimulator) {
        this.tabSimulator = new tabSimulatorObj(iFrameID);
        var sim = this.tabSimulator;
        $(window).on('message', function(e){ sim._receiveMessage(e.originalEvent); });
        _clearLog();
    } else {
        this.tabSimulator.reloadConnector();
    }
    this.tabSimulator._clearDataTable();
    this.tabSimulator._sendInit(tableau.phaseEnum.interactivePhase);
    return false;
}

function _clearLog() {
    $('#log').html('<table id="logTable"></table>'); // clear out the log table
}

function _getConnectorURL() {
    try {
        // build an anchor object out of the url so it is easy to parse
        var docLink = $('<a>', { href:document.URL } )[0];
        var q = docLink.search.substring(1);
        if (q) {
            // use some regexes to turn the query into json, then parse the json
            var params = JSON.parse('{"' + decodeURI(q).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
            var src = params['src'];
            if (src && src.length > 0) {
                // append the query and hash parts of the url along to the hosted connector
                return src + docLink.search.substring(0) + docLink.hash.substring(0);
            }
        }
    } catch (err) {
        var msg =
        msg += "Error description: " + err.message + "\n\n";
        msg += "Please specify the connector on url line: e.g.\n\n"
        msg += "Simulator.html?src=ExampleConnector.html.\n\n";
        alert(msg);
    }

    // Set the default connector here
    return "../Examples/StockQuoteConnector_final.html"
}

$(document).ready(function () {
    var iFrameID = document.getElementById('host-iframe');

    $(window).height();

    var $win = $(window);

    $win.on('resize',function(){
        $("#col1bottom").height($win.height()- 150);
    });

    $("#reload").click(function () { // full reload of connector into iframe
      iFrameID.src = $('#url').val();
      return false;
    });

    $("#incrementalRefresh").click(function () {
      tabSimulator.log("Performing incremental refresh", "blue");
      tabSimulator._sendInit(tableau.phaseEnum.gatherDataPhase);
      return false;
    });

    $("#clearLog").click(function () { // Clear log entries
      _clearLog();
      return false;
    });
});
