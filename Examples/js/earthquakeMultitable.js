(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Schema for magnitude and place data
        var mag_place_cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "mag",
            alias: "magnitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lon",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }];

        var magPlaceTable = {
            id: "magPlace",
            alias: "Magnitude and Place Data",
            columns: mag_place_cols
        };

        // Schema for time and URL data
        var time_url_cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "time",
            alias: "time",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "url",
            alias: "url",
            dataType: tableau.dataTypeEnum.string
        }];

        var timeUrlTable = {
            id: "timeUrl",
            alias: "Time and URL Data",
            columns: time_url_cols
        };
        schemaCallback([magPlaceTable, timeUrlTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var dateObj = JSON.parse(tableau.connectionData),
            dateString = "starttime=" + dateObj.startDate + "&endtime=" + dateObj.endDate,
            apiCall = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&" + dateString + "&minmagnitude=4.5";

        $.getJSON(apiCall, function(resp) {
            var feat = resp.features,
                tableData = [];

            var i = 0;

            if (table.tableInfo.id == "magPlace") {
                for (i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "id": feat[i].id,
                        "mag": feat[i].properties.mag,
                        "title": feat[i].properties.title,
                        "lon": feat[i].geometry.coordinates[0],
                        "lat": feat[i].geometry.coordinates[1]
                    });
                }
            }

            if (table.tableInfo.id == "timeUrl") {
                for (i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "id": feat[i].id,
                        "url": feat[i].properties.url,
                        "time": new Date(feat[i].properties.time) // Convert to a date format from epoch time
                    });
                }
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var dateObj = {
                startDate: $('#start-date-one').val().trim(),
                endDate: $('#end-date-one').val().trim(),
            };

            // Simple date validation: Call the getDate function on the date object created
            function isValidDate(dateStr) {
                var d = new Date(dateStr);
                return !isNaN(d.getDate());
            }

            if (isValidDate(dateObj.startDate) && isValidDate(dateObj.endDate)) {
                tableau.connectionData = JSON.stringify(dateObj); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                $('#errorMsg').html("Enter valid dates. For example, 2016-05-08.");
            }
        });
    });
})();
