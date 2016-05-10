(function () {
    // Create the connector object
	var myConnector = tableau.makeConnector();

    // Define the schema
	myConnector.getSchema = function (schemaCallback) {
		var cols = [{
				id : "mag",
				alias : "magnitude",
				dataType : "float"
			}, 
            {
                id : "title",
				alias : "title",
				dataType : "string"
			}, 
            {
				id : "url",
				alias : "url",
				dataType : "string"
			},
            {
				id : "lat",
				alias : "latitude",
				dataType : "float"
			},
            {
				id : "lon",
				alias : "longitude",
				dataType : "float"
			}
		];

		var tableInfo = {
			id : "earthquakeFeed",
			alias : "Earthquakes with magnitude greater than 4.5 in the last seven days",
			columns : cols
		};

		schemaCallback([tableInfo]);
	};

    // Download the data
	myConnector.getData = function (table, doneCallback) {
        var tableData = [],
            mag = 0,
            title = "",
            url = "",
            lat = "",
            lon = "";

        $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
            var feat = resp.features;

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                mag = feat[i].properties.mag;
                title = feat[i].properties.title;
                url = feat[i].properties.url;
                lon = feat[i].geometry.coordinates[0];
                lat = feat[i].geometry.coordinates[1];

                tableData.push({ 
                   "mag": mag,
                   "title": title,
                   "url": url,
                   "lon": lon,
                   "lat": lat
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

	setupConnector = function () {
        tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
        tableau.submit(); // This sends the connector object to Tableau
	};

	tableau.registerConnector(myConnector);

	// Create event listeners for when the user submits the form
	$(document).ready(function () {
		$("#submitButton").click(function () {
			setupConnector();
		});
	});
})();
