(function() {
     //
     // Helper functions
     //

     // Takes a ticker symbol, a start date and an end date, and constructs a URL for the Yahoo! stock quote API
     function buildUrl(tickerSymbol, startDate, endDate) {
         var startDateStr = getDateAsString(startDate);
         var endDateStr = getDateAsString(endDate);
         var data = 'select * from yahoo.finance.historicaldata where symbol = "' + tickerSymbol + '" and startDate = "' + startDateStr +
             '" and endDate = "' + endDateStr + '"';
         var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(data) + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
         return url;
     }

     // Gets a string representation of a date that can be used with the Yahoo! API.
     function getDateAsString(date) {
         return date.getUTCFullYear() + '-' + makeTwoDigits(date.getUTCMonth() + 1) + '-' + makeTwoDigits(date.getUTCDate());
     }

     // Pads a given number with leading 0s so that there are two characters in the string. Example: makeTwoDigits(1) --> "01"
     function makeTwoDigits(num) {
         return num < 9 ? "0" + num.toString() : num.toString();
     }

     function getTickersArrayFromConnectionData(connectionData) {
         var tickersArray = connectionData.split(',');

         // Remove whitespace from each ticker string
         return tickersArray.map(function(obj) {
             return obj.trim();
         });
     }

     //
     // Connector definition
     // 
     var myConnector = tableau.makeConnector();

     myConnector.getSchema = function(schemaCallback) {
         var tickersArray = getTickersArrayFromConnectionData(tableau.connectionData);

         var schema = [];
         _.forEach(tickersArray, function(ticker) {
             var cols = [
                 { id: "ticker", alias: "Ticker", dataType: tableau.dataTypeEnum.string },
                 { id: "day", alias: "Day", dataType: tableau.dataTypeEnum.date },
                 { id: "close", alias: "Close", dataType: tableau.dataTypeEnum.float }
             ];

             var tableInfo = {
                 id: ticker,
                 columns: cols
             };

             schema.push(tableInfo);
         });

         schemaCallback(schema); // tell tableau about the fields and their types
     };

     myConnector.getData = function(table, doneCallback) {
         var endDate = new Date();
         var startDate = new Date();
         
         // set the start of the range to be 1 year ago
         startDate.setYear(endDate.getFullYear() - 1);
         
         var ticker = table.tableInfo.id;

         var connectionUrl = buildUrl(ticker, startDate, endDate);
         var APIPromise = makeAPIRequest(table, ticker, connectionUrl); // Key and ticker are the same

         APIPromise.then(function(response) {
             console.log("Success");
             doneCallback();
         }, function(error) {
             console.error(error);
         });
     };

     function makeAPIRequest(table, ticker, connectionUrl) {
         return new Promise(function(resolve, reject) {
             var xhr = $.ajax({
                 url: connectionUrl,
                 dataType: 'json',
                 success: function(data) {
                     if (data.query.results) {
                         var quotes = data.query.results.quote;
                         var ii;
                         var toRet = [];
                         // mash the data into an array of objects
                         for (ii = 0; ii < quotes.length; ++ii) {
                             // Each entry can be a list of values in the same order as the columns
                             // var entry = [quotes[ii].Symbol, quotes[ii].Date, quotes[ii].Close];
                             // or an object where the column ids are the keys of the map
                             /*var entry = {
                                 'ticker': quotes[ii].Symbol,
                                 'day': quotes[ii].Date,
                                 'close': quotes[ii].Close
                             };*/
                             var entry = [quotes[ii].Symbol, quotes[ii].Date, quotes[ii].Close];
                             toRet.push(entry);
                         }

                         table.appendRows(toRet);
                         resolve();
                     } else {
                         Promise.reject("No results found for ticker symbol: " + ticker);
                     }
                 },
                 error: function(xhr, ajaxOptions, thrownError) {
                     Promise.reject("error connecting to the yahoo stock data source: " + thrownError);
                 }
             });
         });
     }

     setupConnector = function() {
         var tickersString = $('#tickers').val().trim();
         if (tickersString) {
             tableau.connectionData = tickersString; // set the ticker symbol as the connection data so we can get to it when we fetch the data
             tableau.connectionName = 'Stock quotes: ' + tickersString; // name the data source. This will be the data source name in Tableau
             tableau.submit();
         }
     };

     tableau.registerConnector(myConnector);

     //
     // Setup connector UI
     //
     $(document).ready(function() {
         $("#submitButton").click(function() { // This event fires when a button is clicked
             setupConnector();
         });
         $('#tickerForm').submit(function(event) {
             event.preventDefault();
             setupConnector();
         });
     });
 })();