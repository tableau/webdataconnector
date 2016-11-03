// Example of Standard Connections in Web Data Connectors using JSONPlaceholder JSON endpoints
// Tableau 10.1 - WDC API v2.1

// Define our Web Data Connector
(function(){
  var myConnector = tableau.makeConnector();
  myConnector.getSchema = function(schemaCallback) {
    // Create a promise to get our Standard Connections List from a JSON file. This increases code readability since we
    // no longer need to define the lengthy object within our javascript itself.
    var standardConnections = new Promise(function(resolve, reject) {
    loadJSON("StandardConnectionsData", function(json) {
      var obj = JSON.parse(json);
      var connectionList = [];
      for (var connection in obj.connections) {
        connectionList.push(obj.connections[connection]);
      }
      resolve(connectionList);
    }, true);
    });
    // Create a promise to get our table schema info as well, just like above
    var tables = new Promise(function(resolve, reject) {
      loadJSON("StandardConnectionsTableInfoData", function(json) {
        var obj = JSON.parse(json);
        var tableList = [];
        for (var table in obj.tables) {
          tableList.push(obj.tables[table]);
        }
        resolve(tableList);
      }, true);
    });
    // Once all our promises are resolved, we can call the schemaCallback to send this info to Tableau
    Promise.all([tables, standardConnections]).then(function(data) {
      schemaCallback(data[0], data[1]);
    });
  }

  myConnector.getData = function(table, doneCallback) {
    // Load our data from the API. Multiple tables for WDC work by calling getData multiple times with a different id
    // so we want to make sure we are getting the correct table data per getData call
    loadJSON(table.tableInfo.id, function(data) {
      var obj = JSON.parse(data);
      var tableData = [];
      // Iterate through the data and build our table
      for (var i = 0; i < obj.length; i++) {
        tableEntry = {};
        var ref = obj[i];
        // We can use this handy shortcut because our JSON column names match our schema's column names perfectly
        Object.getOwnPropertyNames(ref).forEach(function(val, idx, array){
          // Handle specific cases by checking the name of the property
          switch(val) {
            case "address":
              tableEntry.lat = ref[val].geo.lat;
              tableEntry.lng = ref[val].geo.lng;
              tableEntry.zipcode = ref[val].zipcode;
              break;
            case "company":
              tableEntry.companyname = ref[val].name;
              tableEntry.catchPhrase = ref[val].catchPhrase;
              tableEntry.bs = ref[val].bs;
              break;
            default:
              tableEntry[val] = ref[val];
          }
        });
        tableData.push(tableEntry);
      }
      // Once we have all the data parsed, we send it to the Tableau table object
      table.appendRows(tableData);
      doneCallback();
    });
  }
  tableau.registerConnector(myConnector);
})();


// Helper function that loads a json and a callback to call once that file is loaded

function loadJSON(path, cb, isLocal) {
  var obj = new XMLHttpRequest();
  obj.overrideMimeType("application/json");
  if(isLocal) {
    obj.open("GET", "../json/" + path + ".json", true);
  }
  else {
    obj.open("GET", "https://crossorigin.me/http://jsonplaceholder.typicode.com/" + path, true);
  }
  obj.onreadystatechange = function() {
    if (obj.readyState == 4 && obj.status == "200"){
      cb(obj.responseText);
    }
  }
  obj.send(null);
}

function send() {
  tableau.submit();
}
