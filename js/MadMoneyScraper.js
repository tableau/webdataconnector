(function() {
  var SEGMENT_KEY = {
    "F": "Featured Stock",
    "D": "Discussed Stock",
    "C": "Caller's Stock",
    "I": "Guest Interview",
    "L": "Lightning Round",
    "M": "Mail Bag",
    "G": "Game Plan",
    "S": "Sudden Death"
  };

  var CALL_ICON = {
    "5": "Buy Recommendation",
    "4": "Positive Mention",
    "3": "Hold or Neutral",
    "2": "Negative Mention",
    "1": "Sell Recommendation"
  };
  
  function getConnectionUrl(url) {
    var yqlQueryBase = "http://query.yahooapis.com/v1/public/yql?q=";
    var query = "select * from html where url='" + url + "'";
    var restOfQueryString = "&format=xml";
    var yqlUrl = yqlQueryBase + encodeURIComponent(query) + restOfQueryString;
    return yqlUrl;
  }

  var myConnector = tableau.makeConnector();
  
  myConnector.getSchema = function(schemaCallback) {
    var cols = [
        { id: "ticker", alias: "Ticker", dataType: tableau.dataTypeEnum.string },
        { id: "company", alias: "Company", dataType: tableau.dataTypeEnum.string },
        { id: "date", alias: "Date", dataType: tableau.dataTypeEnum.string },
        { id: "segment", alias: "Segment", dataType: tableau.dataTypeEnum.string },
        { id: "call", alias: "Call", dataType: tableau.dataTypeEnum.string },
        { id: "price", alias: "Price", dataType: tableau.dataTypeEnum.float }
    ];

    var tableInfo = {
        alias: "Stock Data for " + tableau.connectionData,
        id: 'stockData',
        columns: cols
    };

    schemaCallback([tableInfo]);
  };
      
  myConnector.getData = function(table, doneCallback) {
    var connectionUrl = "http://madmoney.thestreet.com/screener/index.cfm?airdate=30&showrows=500";

    var xhr = $.ajax({
      url: getConnectionUrl(connectionUrl),
      success: function (response) {
        var stockTableRows = $(response).find('#stockTable tr');
        stockTableRows = stockTableRows.not(':first'); // Removes the first row which is the header

        var tableData = [];
        stockTableRows.each(function (i, row) {

          var $stockTableColumnsInRow = $(row).find('td');

          // Build a row from the parsed response
          tableData.push({
            'ticker':  $($stockTableColumnsInRow[0]).find('a').text(),
            'company': $($stockTableColumnsInRow[0]).text(),
            'date':    $($stockTableColumnsInRow[1]).text(),
            'segment': SEGMENT_KEY[$($stockTableColumnsInRow[2]).find('img').attr('alt')],
            'call':    CALL_ICON[$($stockTableColumnsInRow[3]).find('img').attr('alt')],
            'price':   parseFloat($($stockTableColumnsInRow[4]).text().substring(1)) // remove currency, and convert to Float.
          });
        });
        
        table.appendRows(tableData);
        doneCallback();
        // tableau.dataCallback(tableData, "", false);
      }
    });
  };
  
  tableau.registerConnector(myConnector);
})();

$(document).ready(function(){
  $("#submitButton").click(function() { // This event fires when a button is clicked
    tableau.connectionName = 'Mad Money Picks';
    tableau.submit();
  });
});