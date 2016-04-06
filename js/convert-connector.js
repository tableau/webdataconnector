function _convertConnectorFor12(connector) {
  var _schemaCallback = null;

  // The old connector will have 2 functions, getColumnHeaders and getTableData. Lets convert them
  connector.getSchema = function(schemaCallback) {
  	_schemaCallback = schemaCallback;
  	connector.getColumnHeaders();
  }

  tableau.headersCallback = function(fieldNames, types) {
  	// Convert this into a table info object
  	var cols = [];
  	for(var i=0; i<fieldNames.length && i<types.length; i++) {
  		var colInfo = {
  			id: fieldNames[i],
  			dataType: types[i]
  		};

  		cols.push(colInfo);
  	}

  	var tableInfo = {
  	  id : "WDC",
  	  incrementColumnId: tableau.incrementalExtractColumn,
  	  columns : cols
  	};

  	_schemaCallback([tableInfo]);
  }

  var _dataDoneCallback;
  var _table;

  connector.getData = function(table, dataDoneCallback) {
  	_dataDoneCallback = dataDoneCallback;
  	_table = table;
  	connector.getTableData(_table.incrementValue);
  }

  tableau.dataCallback = function(data, lastRecordToken, moreData) {
  	// We got some data back from the connector itself. Call back with the data first
  	_table.appendRows(data);
  	if (moreData) {
  	  // If we have more data we need to simulate what Tableau used to do and run the for loop
  	  // Do it via window.setTimeout to help with the stack
  	  window.setTimeout(function() {
  	  	connector.getTableData(lastRecordToken);
  	  }, 0);
  	} else {
  	  _dataDoneCallback();
  	}
  }
}