(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "mag",
            alias: "magnitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "url",
            alias: "url",
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

        var tableInfo = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var mag = 0,
            title = "",
            url = "",
            lat = 0,
            lon = 0;

        $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
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

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        translateButton();
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();

// Values attached to the tableau object are loaded asyncronously.
// Here we poll the value of locale until it is properly loaded
// and defined, then we turn off the polling and translate the text.
var translateButton = function() {
    var pollLocale = setInterval(function() {
        if (tableau.locale) {
            switch (tableau.locale) {
                case tableau.localeEnum.china:
                    $("#submitButton").text("获取地震数据");
                    break;
                case tableau.localeEnum.germany:
                    $("#submitButton").text("Erhalten Erdbebendaten!");
                    break;
                case tableau.localeEnum.brazil:
                    $("#submitButton").text("Obter Dados de Terremoto!");
                    break;
                case tableau.localeEnum.france:
                    $("#submitButton").text("Obtenir les Données de Séismes!");
                    break;
                case tableau.localeEnum.japan:
                    $("#submitButton").text("地震データの取得");
                    break;
                case tableau.localeEnum.korea:
                    $("#submitButton").text("지진 데이터 가져 오기");
                    break;
                case tableau.localeEnum.spain:
                    $("#submitButton").text("Obtener Datos de Terremotos!");
                    break;
                default:
                    $("#submitButton").text("Get Earthquake Data!");
            }
            clearInterval(pollLocale);
        }
    }, 10);
};
