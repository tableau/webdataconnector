(function() {
    var myConnector = tableau.makeConnector();
    
    myConnector.getSchema = function(schemaCallback) {
        // In this sample, we read our schema definition from a local JSON file.
        $.getJSON("../js/JSONMultiTableData.json", function(schemaJson) {
            schemaCallback(schemaJson);
        });
    };

    myConnector.getData = function(table, doneCallback) {
        var apiURL = 'http://jsonplaceholder.typicode.com/' + table.tableInfo.id;
        $.ajax(apiURL, {
            method: 'GET'
        }).then(function(data) {
            table.appendRows(data);
            doneCallback();
        });
    };

     setupConnector = function() {
        tableau.connectionName = "JSON Multiple Table Connector";
        tableau.submit();
     };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() { // This event fires when a button is clicked
            setupConnector();
        });
        $('#inputForm').submit(function(event) {
            event.preventDefault();
            setupConnector();
        });
    });
})();
