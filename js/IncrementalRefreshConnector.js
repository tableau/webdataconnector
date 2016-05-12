(function() {
    var myConnector = tableau.makeConnector();
    
    myConnector.getSchema = function(schemaCallback) {
         var cols = [
             { id: "id", dataType: tableau.dataTypeEnum.int },
             { id: "x", dataType: tableau.dataTypeEnum.string },
             { id: "day", dataType: tableau.dataTypeEnum.datetime },
             { id: "day_and_time", dataType: tableau.dataTypeEnum.datetime },
             { id: "true_or_false",  dataType: tableau.dataTypeEnum.bool  },
             { id: "color", dataType: tableau.dataTypeEnum.string }
         ];
         
         var tableInfo = {
             alias: "Incremental Refresh Connector",
             id: "mainTable",
             columns: cols,
             incrementColumnId: "id"
         };
         
         schemaCallback([tableInfo]);
     };


    // With this sample we will generate some sample date for the columns: id, x, day, date_and _time, true_or_false, and color.
    // The user input for the max iterations determines the number of rows to add. 
    myConnector.getData = function(table, doneCallback) {
        var lastId = parseInt(table.incrementValue || -1);

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
                "true_or_false": (i % 2 == 0),
                "color": colors[id % colors.length],
            });
        }

        table.appendRows(data);
        doneCallback();   
    };

     setupConnector = function() {
        var max_iterations = $("#max_iterations").val();
        
        if (max_iterations) {
            var connectionData = {
                "max_iterations": parseInt(max_iterations)
            };
            tableau.connectionData = JSON.stringify(connectionData);
            tableau.submit();
        }
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
