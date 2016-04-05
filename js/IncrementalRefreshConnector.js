(function() {
    var myConnector = tableau.makeConnector();

    myConnector.getColumnHeaders = function() {
        var connectionData = tableau.connectionData;
        var fieldNames = ["id", "x", "day", "day_and_time", "true_or_false", "color"];
        var fieldTypes = ['int', 'float', 'date', 'datetime', 'bool', 'string'];
        tableau.incrementalExtractColumn = "id";
        tableau.headersCallback(fieldNames, fieldTypes);
    }


    //With this sample we will generate some sample date for the columns: id, x, day, date_and _time, true_or_false, and color.
    //The user input for the max iterations determines the number of rows to add. 
    // 
    myConnector.getTableData = function(lastRecordNumber) {
        var lastId = parseInt(lastRecordNumber || -1);

        var connectionData = JSON.parse(tableau.connectionData);
        var max_iterations = connectionData.max_iterations;


        var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
        var data = [];
        var now = Date();
        date_and_time = new Date();
        for (var i = 0; i < max_iterations; i++) {
            lastId++;
            var id = lastId;
            var millis = date_and_time.getTime();
            millis += 1000 * i; //add a second
            date_and_time.setTime(millis);
            date_only = new Date(date_and_time.getTime());
            date_only.setHours(0, 0, 0, 0);
            data.push({
                "id": id,
                "x": i,
                "day": date_only.toISOString(),
                "day_and_time": date_and_time.toISOString(),
                "true_or_false": i % 2,
                "color": colors[id % colors.length],
            });
        }

        tableau.dataCallback(data, lastId.toString(), false);
    };

    _convertConnectorFor12(myConnector);
    tableau.registerConnector(myConnector);
})();

$(document).ready(function() {
    $("#inputForm").submit(function(evt) { // This event fires when a button is clicked
        evt.preventDefault();
        var max_iterations = $('input[name=max_iterations]').val();
        var connectionData = {
            "max_iterations": parseInt(max_iterations)
        };
        tableau.connectionData = JSON.stringify(connectionData);
        tableau.submit();
    });
});