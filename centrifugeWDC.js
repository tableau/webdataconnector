(function () {

	// // Init function for connector, called during every phase
	// myConnector.init = function(initCallback) {
	// 	tableau.authType = tableau.authTypeEnum.basic;
	// 	initCallback();
	// }

	var myConnector = tableau.makeConnector();

	myConnector.getSchema = function (schemaCallback) {
		//tableau.log("Hello WDC!");
		var cols = [{
			id: "id",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "title",
			alias: "Slug Title",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "vanity_title",
			alias: "Actual Title",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "tag",
			alias: "tag",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "active",
			alias: "active",
			dataType: tableau.dataTypeEnum.bool
		}, {
			id: "release_date",
			alias: "release_date",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "box_office_opening",
			alias: "box_office_opening",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "distributor",
			alias: "distributor",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "rating",
			alias: "rating",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "franchise",
			alias: "franchise",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "installment",
			alias: "installment",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "cast",
			alias: "cast",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "adaptation",
			alias: "adaptation",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "cinephile",
			alias: "cinephile",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "oscar_nominee",
			alias: "oscar_nominee",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "cinema_score_letter",
			alias: "cinema_score_letter",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "cinema_score_number",
			alias: "cinema_score_number",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "tracker_title",
			alias: "tracker_title",
			dataType: tableau.dataTypeEnum.string
		}];

		var tableSchema = {
			id: "centrifugeFeed",
			alias: "Property information from Centrifuge",
			columns: cols
		};

		schemaCallback([tableSchema]);

	};

	myConnector.getData = function (table, doneCallback) {
		//tableau.log("getData");
    $.ajaxSetup({
      headers : {
        'Authorization' : "Basic " + tableau.username
      }
    });
		//$.getJSON("http://localhost:3030/api/properties", function(resp) {
		$.getJSON("http://centrifuge.com/api/properties", function(resp) {
			var properties = resp.properties,
				tableData = [];

			// Iterate over the JSON object
			for (var i = 0, len = properties.length; i < len; i++) {
				tableData.push({
					"id": properties[i].id,
					"title": properties[i].title,
					"vanity_title": properties[i].vanity_title,
					"tag": properties[i].tag,
					"active": properties[i].active,
					"release_date": properties[i].release_date,
					"box_office_opening": properties[i].box_office_opening,
					"distributor": properties[i].distributor,
					"rating": properties[i].rating,
					"franchise": properties[i].franchise,
					"installment": properties[i].installment,
					"cast": properties[i].cast,
					"adaptation": properties[i].adaptation,
					"cinephile": properties[i].cinephile,
					"oscar_nominee": properties[i].oscar_nominee,
					"cinema_score_letter": properties[i].cinema_score_letter,
					"cinema_score_number": properties[i].cinema_score_number,
					"tracker_title": properties[i].tracker_title
				});
			}

			table.appendRows(tableData);
			doneCallback();
		});
	};

	tableau.registerConnector(myConnector);

	$(document).ready(function () {
		$("#submitButton").click(function () {
      //tableau.log("submitButton function");
			tableau.connectionName = "Fizz Centrifuge Feed";
      var email = $('#email')[0].value;
      var token = $('#token')[0].value;
      tableau.username = btoa(email + ":" + token);
			tableau.submit();
		});
	});
})();
