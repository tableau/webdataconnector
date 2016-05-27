(function () {
	// Create the connector object
	var myConnector = tableau.makeConnector();

	// Define the schema
	myConnector.getSchema = function (schemaCallback) {
		var cols = [
			{ id : "mag", alias : "magnitude", dataType : tableau.dataTypeEnum.float },
			{ id : "title", alias : "title", dataType : tableau.dataTypeEnum.string },
			{ id : "url", alias : "url", dataType : tableau.dataTypeEnum.string },
			{ id : "lat", alias : "latitude", dataType : tableau.dataTypeEnum.float },
			{ id : "lon", alias : "longitude", dataType : tableau.dataTypeEnum.float }
		];

		var tableDateRangeOne = {
			id : tableau.connectionData.split(",")[0], //"starttime=2015-05-01&endtime=2015-05-08",
			alias : "Earthquake Feed Date Range One",
			columns : cols
		};

		var tableDateRangeTwo = {
			id : tableau.connectionData.split(",")[1], //"starttime=2016-05-01&endtime=2016-05-08",
			alias : "Earthquake Feed Date Range Two",
			columns : cols
		};
		schemaCallback([tableDateRangeOne, tableDateRangeTwo]);
	};

	// Download the data
	myConnector.getData = function (table, doneCallback) {
		var mag = 0,
            title = "",
            url = "",
            lat = 0,
            lon = 0;

        var apiCall = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&" + table.tableInfo.id + "&minmagnitude=4.5";

		$.getJSON(apiCall, function (resp) {
			var feat = resp.features,
                tableData = [];

			// Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
				mag = feat[i].properties.mag;
				title = feat[i].properties.title;
				url = feat[i].properties.url;
				lon = feat[i].geometry.coordinates[0];
				lat = feat[i].geometry.coordinates[1];

				tableData.push({
					"mag" : mag,
					"title" : title,
					"url" : url,
					"lon" : lon,
					"lat" : lat
				});
			}

            table.appendRows(tableData);

			doneCallback();
		});
	};

	tableau.registerConnector(myConnector);

	// Create event listeners for when the user submits the form
	$(document).ready(function () {
		$("#submitButton").click(function () {
            var startDateOne = $('#start-date-one').val().trim(),
                endDateOne = $('#end-date-one').val().trim(),
                startDateTwo = $('#start-date-two').val().trim(),
                endDateTwo = $('#end-date-two').val().trim(),
                dateRangeOne = "",
                dateRangeTwo = "";

            if (startDateOne && endDateOne && startDateTwo && endDateTwo) {
                dateRangeOne = "starttime=" + startDateOne + "&endtime=" + endDateOne;
                dateRangeTwo = "starttime=" + startDateTwo + "&endtime=" + endDateTwo;
                tableau.connectionData = dateRangeOne + "," + dateRangeTwo; // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                alert("Enter a valid date for each date range.");
            }
		});
	});
})();
