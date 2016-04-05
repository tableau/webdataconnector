(function() {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        // Tell tableau about the fields and their types
        // Then call schemaCallback when finished
    }

    myConnector.getData = function(table, doneCallback) {
        // Pass back data to tableau using table.appendRows
        // Call doneCallback when finished
    }

    $(document).ready(function() {
        // on document ready
    });

    tableau.registerConnector(myConnector);
})();
