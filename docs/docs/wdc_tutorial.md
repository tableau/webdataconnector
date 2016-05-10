---
layout: page
title: WDC Tutorial
base: docs
---

> This tutorial picks up where the [Get Started]({{ site.baseurl }}docs) topic left off. If you haven't already, go back and set up your development environment.

What you'll build
---------------------

By the end of this tutorial, you'll have a working WDC that connects to the [USGS Earthquake feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/index.php) and downloads data for earthquakes that occurred in the last week.

You'll learn how to:

* [Create the user interface](#create-ui) for your WDC with HTML.
* [Create the connector object](#create-connector-obj).
* [Define a schema](#define-schema), which maps web data to table columns.
* [Get the data](#get-data) for a single table.

If you *really* want to skip all of this and go straight to the source code, look for the `earthquakeUSGS` files in the `Examples` directory and the `js` directory. You'll get a lot more out of this if you build it from scratch though--promise!

### Create the user interface {#create-ui}

### Create the connector object {#create-connector-obj}

### Define a schema {#define-schema}

### Get the data {#get-data}



Next
----

In the next part of the tutorial, you'll create the basic HTML page for
the connector and an outline of the JavaScript code that all web data
connectors must contain.

[Web Data Connector Tutorial Part 2: Create the Connector
Structure](wdc_tutorial_create_page.html)

What you'll do
--------------

In this part of the tutorial, you create a new web page for the
connector. The page will contain the basic markup and JavaScript code
that all web data connectors have. You'll learn about these features:

-   The basic structure of all web data connectors
-   The Web Data Connector JavaScript library
-   The [tableau](wdc_ref.html#tableau_object_functions) object
-   The
    [tableau.makeConnector](wdc_ref.html#tableau_functions_makeConnector)
    function
-   The
    [tableau.registerConnector](wdc_ref.html#tableau_functions_registerConnector)
    function
-   The [getColumnHeaders](wdc_ref.html#connector_getColumHeaders)
    function
-   The [getTableData](wdc_ref.html#connector_getTableData) function

Create the page
---------------

Using a text editor or other tool that lets you edit HTML markup, create
a new file named `StockConnectorTutorial.html`. Save it in the folder
where you extracted the Web Data Connector SDK files.

**Note**: The tutorial assumes this location. If you use a different
location, you'll need to adjust a few instructions, such as where you
start the web server that you'll use later to test.

Add basic markup and JavaScript code {#add-basic-markup-and-javascript}
------------------------------------

Copy the following markup and JavaScript code into the page.

    .html>
    <meta http-equiv="Cache-Control" content="no-store" />
    <head>
      <title>Stock Quote Connector-Tutorial</title>
      <script src="https://connectors.tableau.com/libs/tableauwdc-1.1.1.js" type="text/javascript"></script>
      <script type="text/javascript">
      (function() {
          var myConnector = tableau.makeConnector();

          myConnector.getColumnHeaders = function() {
              var fieldNames = [];
              var fieldTypes = [];
              tableau.headersCallback(fieldNames, fieldTypes);
          }

          myConnector.getTableData = function(lastRecordToken) {
              var dataToReturn = [];
              var lastRecordToken = 0;
              var hasMoreData = false;
              tableau.dataCallback(dataToReturn, lastRecordToken.toString(), hasMoreData);
          }

          tableau.registerConnector(myConnector);
      })();
      </script>
    </head>
    <body>
    </body>
    <.html>

### Code explanation

This page contains basic HTML markup for a web page, plus two important
`<script>` elements that all web data connectors must have.

If you're familiar with the [phases](wdc_phases.html) that the web data
connector goes through in its lifecycle, this is the outline of the code
for the data-gathering (second) phase. You'll add the HTML markup and
code for the interactive (first) phase in a later step of the tutorial.
You'll also fill in the actual code for the data-gathering phase in a
later part of the tutorial.

#### Referencing the Web Data Connector JavaScript library

The first `<script>` element at the top of the file adds a reference to
the Tableau Web Data Connector JavaScript library
(`tableauwdc-1.1.1.js`). This JavaScript library contains code that
enables communication between your connector and Tableau. This element
must appear in the file before you make any calls that involve the
`tableau` object.

**Note**: This listing includes a reference to the `tableauwdc-1.1.1.js`
To connect to a web data connector that uses that version of the WDC
library, you must be using a recent version of Tableau. For more
information, see [Web Data Connector Library
Versions](wdc-library-versions.html).

#### The tableau object and creating the connector instance

The second `<script>` element includes an outline of the JavaScript code
that your web data connector uses to interact with Tableau. This code is
contained in an anonymous function.

The Web Data Connector JavaScript library defines a `tableau` object. In
your connector, inside the function block that contains the JavaScript
code, the first thing that your connector must do is call the
`tableau.makeConnector` function. This creates an instance of a
connector object that you can attach other functions to. In this case,
the connector instance is assigned to the variable `myConnector`, but
you can use any variable name you like.

#### The getColumnHeaders and getTableData functions

The next blocks of code create two functions, `getColumnHeaders` and
`getTableData`, and attach them to the connector instance. (You'll add
more code to these functions later in the tutorial.)

The `getColumnHeaders` function is where you define the columns (fields)
for the data that the connector returns. In the function, you create an
array of column names and an array of corresponding data types, as
you'll see later in the tutorial. After you've created the arrays of
column names and column data types, you pass them to Tableau by calling
`tableau.headersCallback`.

The `getTableData` function is where you fetch the data. The exact
method you use to do this depends on where the data is, but a typical
example is that you make web requests to a web site and get back XML or
JSON data. However you get the data, once you have it, you put it into
an array (here, named `dataToReturn`). Each entry in the array
represents one row of data. The entries can be JavaScript objects, where
the keys must match the column names. Or the entries can be an array of
values, where the order of the values must match the order of columns as
defined in the `getColumnHeaders` function. After you build the array,
you pass the array of data to Tableau by calling the
`tableau.dataCallback` function.

#### Registering the connector

The final step for the connector's code is to register your connector.
After you've created the connector instance and added the
`getColumnHeaders` and `getTableData` functions to it, you call
`tableau.registerConnector` and pass the connector instance to it.

What you'll do
--------------

In this part of the tutorial, you create the HTML markup and
corresponding code for the interactive (first) phase of the connector.
Tableau loads the web data connector in interactive phase when a user
first chooses the connector as a data source in Tableau. In this
tutorial, the page prompts the user for a stock ticker symbol and lets
the user click a button to submit the page. You'll learn about these
features:

-   The
    [tableau.connectionName](wdc_ref.html#tableau_properties_connectionName)
    property
-   The
    [tableau.connectionData](wdc_ref.html#tableau_properties_connectionData)
    property
-   The [tableau.submit](wdc_ref.html#tableau_functions_submit) function

Not all web data connectors have to interact with the user. A web data
connector must display UI to the user only if the connector must prompt
the user for search parameters or other values.

**Note**: This part assumes you've already completed the previous parts
of the tutorial.

Add a reference to jQuery
-------------------------

For convenience, you can use [jQuery](https://jquery.org/), a library
that provides an easy-to-use, cross-browser platform for web
development. jQuery is not required in order to create a web data
connector, but it simplifies some of the coding that the connector does.

Open or switch to the StockConnectorTutorial.html file that you've been
working on. Inside the `<head>` element, add the following `<script>`
element.

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" type="text/javascript"></script>

This `<script>` element loads the jQuery library (jquery.min.js) from
the googleapis.com site. If you prefer, you can load the jQuery library
from a local directory instead—the SDK includes a jQuery library in the
`js` directory.

Add the HTML markup
-------------------

The web data connector you're creating gets stock data. The connector
must prompt the user for a stock ticker symbol. After the user has
entered the symbol, the user clicks a button to submit page.

Open the web data connector you're working on. Inside the `<body>`
element, add the following markup:

      <p>Enter a stock ticker symbol: <input type="text" id="ticker" /></p>
      <p><button type="button" id="submitButton">Get the Data</button></p>

Add code to get user values and submit the page
-----------------------------------------------

After the user clicks <span class="uicontrol">Get the Data</span>, the
connector must get the value that the user entered for the stock ticker.
Inside the `<script>` block where the other connector code is, add the
following code:

    $(document).ready(function() {
        $("#submitButton").click(function() {
          var tickerSymbol = $('#ticker').val().trim();
          if (tickerSymbol) {
            tableau.connectionName = "Stock Data for " + tickerSymbol;
            tableau.connectionData = tickerSymbol;
            tableau.submit();
          }
        });
      });

This block uses jQuery to bind code to the button's click event. Inside
the click event handler, the code uses more jQuery to get the value of
the element with the ID of "ticker"—that is, of the text box.

This code sets the `tableau.connectionName` property, which lets you
provide a name for this connector in Tableau. Tableau displays the value
of this property in the <span class="uicontrol">Data</span> tab when a
user is working with data from this web data connector.

The web data connector will need the ticker symbol later, during the
data-gathering (second) phase. Tableau loads the connector in separate
sessions for each phase, so you can't use global variables or cookies to
pass data from the interactive phase to the data-gathering phase.
Instead, you can put data into the `tableau.connectionData` property.
This value of this property is stored in the workbook that the user is
creating. The value must be a string, so if you need to store multiple
values, you should create a single out of the values before you store
them in the property.

When the interactive phase is done—that is, when the user has provided
all the information that the web data connector needs—the connector
calls the `tableau.submit` function. This tells Tableau that the
connector has finished the interactive phase. Tableau then proceeds to
the data-gathering phase.

### Submitting the page if there is no user interaction

If a web data connector doesn't interact with the user, the page doesn't
have to have HTML markup in it. However, the page must still call the
`tableau.submit` function in order to tell Tableau that the interactive
phase is complete. For example, in a web data connector that doesn't
interact with the user, you can include a function like the following
one, which calls `tableau.submit` immediately after the page has been
initialized.

``` {space="preserve"}
myConnector.init = function() {
    tableau.initCallback();
    tableau.submit();
};
```

The page so far
---------------

When you're done with this part of the tutorial, the finished page looks
like the following listing.

    .html>
    <meta http-equiv="Cache-Control" content="no-store" />
    <head>
      <title>Stock Quote Connector-Tutorial</title>
      <script src="https://connectors.tableau.com/libs/tableauwdc-1.1.1.js" type="text/javascript"></script>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" type="text/javascript"></script>

      <script type="text/javascript">
      (function() {
          var myConnector = tableau.makeConnector();

          myConnector.getColumnHeaders = function() {
              var fieldNames = [];
              var fieldTypes = [];
              tableau.headersCallback(fieldNames, fieldTypes);
          }

          myConnector.getTableData = function(lastRecordToken) {
              var dataToReturn = [];
              var lastRecordToken = 0;
              var hasMoreData = false;
              tableau.dataCallback(dataToReturn, lastRecordToken.toString(), hasMoreData);
          }

          tableau.registerConnector(myConnector);
      })();


      $(document).ready(function() {
        $("#submitButton").click(function() {
          var tickerSymbol = $('#ticker').val().trim();
          if (tickerSymbol) {
            tableau.connectionName = "Stock Data for " + tickerSymbol;
            tableau.connectionData = tickerSymbol;
            tableau.submit();
          }
        });
      });
    </script>
    </head>
    <body>
      <p>Enter a stock ticker symbol: <input type="text" id="ticker" /></p>
      <p><button type="button" id="submitButton">Get the Data</button></p>
    </body>
    <.html>
    
    
    Make sure you have access to a web server
-----------------------------------------

The Web Data Connector SDK includes a simulator. The simulator is an
HTML page that loads your web data connector page and interact with it
the same way that Tableau does. Because the simulator is written as a
web page and uses JavaScript, you can use web developer tools to debug
your connector.

To use the simulator, you need to be able to request your web data
connector page from a web server; the simulator requires you to specify
a URL that uses HTTP or HTTPS. If you're working on a computer that
doesn't already have a web server running, you can run a lightweight
server such as the Python development server or a Mongoose server. If
you haven't already set up a server, follow the instructions in [Use the
Python Development Server for Web Data
Connectors](wdc_sdk_using_python_server.html).

**Note**: In this tutorial, we'll assume that you are running the Python
HTTP server as a local web server and that it uses port 8888. If you are
using a different web server configuration, adjust the instructions in
the tutorial accordingly.

Start the simulator
-------------------

If you're using Windows and you've installed Python 2.x on your
computer, use the file explorer to navigate to the folder where you
extracted the Web Data Connector SDK. Double-click the
`start_server.bat` file. This opens a command window and starts the
Python server.

If you're using Python 3.x, or if you're not using Windows, open a
command window on your computer. Change to the change to the folder
where you extracted the SDK files. For python 2.x, enter the following
command:

    python -m SimpleHTTPServer 8888

For python 3.4.2, enter the following command:

    python -m http.server 8888

When the server is running, open a browser and enter the following URL:

``` {space="preserve"}
http://localhost:8888/simulator/
```

The simulator opens and displays a default web data connector. The
default connector is similar to the one you've been building. You'll
load your own connector in the next step.

Test your web data connector page
---------------------------------

In the <span class="uicontrol">WDC URL</span> box, enter the following
URL to load the connector you've been building:

    http://localhost:8888/StockConnectorTutorial.html

Clear the <span class="uicontrol">Automatically continue to
data-gathering phase</span> check box. For this test, you don't want to
run the data-gathering phase at all.

Click <span class="uicontrol">Run Interactive Phase</span>. The
simulator opens a window and displays your connector.

![]({{ site.baseurl }}assets/wdc_tutorial_simulator_interactive_phase.png)

Enter a stock symbol (like `DATA`) in the text box, and then click the
<span class="uicontrol">Get the Data</span> button.

If everything is working, u nder <span class="uicontrol">Web Data
Connector Properties</span> on the right-hand side of the simulator, the
<span class="uicontrol">Connection Name</span> box shows the value that
you assigned to the `tableau.connectionName` property. The <span
class="uicontrol">Connection Data</span> box shows whatever you entered
into the text box, because your code set the `tableau.connectionData`
property to that value.

![]({{ site.baseurl }}assets/wdc_tutorial_simulator_test1_success.png)

If you don't see these results, there's probably an error in your code.
Examine the code in the editor and make sure that everything is spelled
correctly, that code blocks have been properly closed, and so on.


What you'll do
--------------

In this part of the tutorial, you'll add code that defines the columns
(fields) for the data that the web data connector returns. Then you'll
add the code that actually fetches the data from the source (a site that
returns stock price data). The code you'll add here is the code that
runs during the data-gathering (second) phase of the connector. You'll
learn about these features:

-   The [getColumnHeaders](wdc_ref.html#connector_getColumHeaders)
    function
-   The
    [tableau.headersCallback](wdc_ref.html#tableau_functions_headersCallback)
    function
-   The [getTableData](wdc_ref.html#connector_getTableData) function
-   The
    [tableau.dataCallback](wdc_ref.html#tableau_functions_dataCallback)
    function
-   The
    [tableau.abortWithError](wdc_ref.html#tableau_functions_abortWithError)
    function
-   The [tableau.log](wdc_ref.html#tableau_functions_log) function
-   The
    [tableau.connectionData](wdc_ref.html#tableau_properties_connectionData)
    property

**Note**: This part assumes you've already completed the previous parts
of the tutorial.

Add code for defining columns
-----------------------------

The stock data that the web data connector returns consists of three
columns: the ticker name, the date, and the closing price for that date.
You define these columns in the `getColumnHeaders` function that's
attached to the connector instance in your code.

Open or switch to the StockConnectorTutorial.html file that you've been
working on. Find the `myConnector.getColumnHeaders` function, and
completely replace that function with the following code:

    myConnector.getColumnHeaders = function() {
        var fieldNames = ['Ticker', 'Day', 'Close'];
        var fieldTypes = ['string', 'date', 'float'];
        tableau.headersCallback(fieldNames, fieldTypes);
    }

### Code explanation

In this updated function, the arrays assigned to the `fieldNames` and
`fieldTypes` arrays have values. (The variable names `fieldNames` and
`fieldTypes` can be anything you want.) The `fieldNames` array contains
the column names (`'Ticker', 'Day', 'Close'`). The `fieldTypes` array
contains data types that correspond by position with the names in
`fieldNames`—for example, the name `Day` corresponds with the data type
`date`. You specify the data types as strings from this list of possible
types: `bool`, `date`, `datetime`, `float`, `int`, and `string`.

When the `tableau.headersCallback` function is called, the connector
passes to Tableau the array of column information that you've created.

The data returned by a web data connector can contain more fields than
the fields that you define in the `getColumnHeaders` function. The
columns you define don't have to represent all the data that the web
data connector returns; the connector might return many more columns
than you're defining. The columns you define are the ones that will be
available to Tableau. (The columns names you pass in `fieldNames` also
don't have to match the column names in the data that's returned from
the data source.)

**Tip**: The more columns you specify, the longer it can take to create
an extract from the results of your data query. For best performance,
define only the columns that are required for the data set that's
created by the web data connector.

About the Yahoo YQL query
-------------------------

Before you add code to fetch the data, it's useful to understand how the
web data connector will get stock price data. The web data connector
you're creating uses the Yahoo REST API to send a query that's
constructed using the [Yahoo Query Language
(YQL)](https://developer.yahoo.com/yql/). In its basic form, the
connector sends a YQL query that might look like the following example:

`select * from yahoo.finance.historicaldata where symbol = "DATA" and startDate = "2014-08-01" and endDate = "2015-08-01"`

This query gets stock price information for the stock whose symbol is
`DATA` (which is the symbol for Tableau) for a one-year period from
August 1, 2014 to August 1, 2015. In the tutorial, the user provides the
stock ticker name, and the connector code sets the end date to today's
date and start date to today minus one year. (The web data connector
could also prompt the user to enter values for a date range, but for
this tutorial you're not adding that feature.)

The base URI for the API call to send this query looks like the
following:

`http://query.yahooapis.com/v1/public/yql?q=your-query`

In this URI, *your-query* is the YQL statement. However, the query has
to be URI-encoded—spaces have to be converted to `%20`, etc.

The URL requires two additional parameters. One is a `format` parameter
that you can use to specify that you want JSON or XML format for the
results. The other is the `env` parameter that is used with YQL queries
to specify an Open Data table mapping between the actual data source for
the stock data and the YQL query language. This mapping is what lets
Yahoo provide a general query interface for a wide variety of data. For
more information about Open Data tables, see the
[datatables.org](http://www.datatables.org/) site and the [Yahoo
documentation](https://developer.yahoo.com/yql/guide/yql-opentables-chapter.html).

The following example shows a URI that your web data connector might
create in order to send the query to Yahoo:

` http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22DATA%22%20and%20startDate%20%3D%20%222014-08-15%22%20and%20endDate%20%3D%20%222015-08-01%22&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json`

To factor the work of creating this URI into manageable pieces, you'll
add some helper functions to the web data connector.

Add the helper functions
------------------------

Inside the anonymous function that contains your web data connector
code, and before you call the `tableau.makeConnector` function, add the
following three functions:

    function buildUri(tickerSymbol, startDate, endDate) {
          var startDateStr = getFormattedDate(startDate);
          var endDateStr   = getFormattedDate(endDate);
          var queryStatement = 'select * from yahoo.finance.historicaldata where symbol = "' +
                                tickerSymbol +
                               '" and startDate = "' + startDateStr +
                               '" and endDate = "' + endDateStr + '"';
          var uri = 'http://query.yahooapis.com/v1/public/yql?q=' +
                    encodeURIComponent(queryStatement) +
                    "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
          return uri;
        }

        function getFormattedDate(date) {
            // Returns a date in the format YYYY-MM-DD
            return date.getUTCFullYear()  +
                   '-' +
                   makeTwoDigits(date.getUTCMonth() + 1) +
                   '-'
                   + makeTwoDigits(date.getUTCDate());
        }

        function makeTwoDigits(num) {
           // Pads a digit to be two digits with leading zero
           return num <= 9 ? "0" + num.toString() : num.toString();
        }

### Code explanation

The `buildUri` function takes a stock ticker symbol, a start date, and
an end date, and uses them to build a URI in the format described in the
preceding section. The `getFormattedDate` function takes a date and
returns the date formatted as YYYY-MM-DD, which is the format that YQL
requires. And finally, the `makeTwoDigits` function pads a digit to two
digits, using a leading zero if required. This numeric format is
required for the month and day in the date in YQL queries.

Add the code to get stock data
------------------------------

Finally, you can add code to actually fetch the data. In the connector's
`getTableData` function, you run the query that the code has created.
Add the following block, completely replacing the skeleton
`getTableData` function that is already in the file.

    myConnector.getTableData = function(lastRecordToken) {
        var dataToReturn = [];
        var hasMoreData = false;

        // Get parameter values and build YQL query
        var ticker = tableau.connectionData;
        var endDate = new Date();
        var startDate = new Date();
        startDate.setYear(endDate.getFullYear() - 1);
        var connectionUri = buildUri(ticker, startDate, endDate);

        var xhr = $.ajax({
          url: connectionUri,
          dataType: 'json',
          success: function (data) {
              if (data.query.results) {
                  var quotes = data.query.results.quote;
                  var ii;
                  for (ii = 0; ii < quotes.length; ++ii) {
                      var entry = {'Ticker': quotes[ii].Symbol,
                                   'Day': quotes[ii].Date,
                                   'Close': quotes[ii].Close};
                      dataToReturn.push(entry);
                  }
                  tableau.dataCallback(dataToReturn, lastRecordToken, false);
                }
                else {
                  tableau.abortWithError("No results found for ticker symbol: " + ticker);
                }
          },
          error: function (xhr, ajaxOptions, thrownError) {
              // If the connection fails, log the error and return an empty set.
              tableau.log("Connection error: " + xhr.responseText + "\n" + thrownError);
              tableau.abortWithError("Error while trying to connecto to the Yahoo stock data source.");
          }
        });
     }

### Code explanation

The block begins by initializing variables to hold information that will
be passed to Tableau. The `dataToReturn` array will hold the individual
data rows. The `hasMoreData` variable is a Boolean flag that is used if
the web data connector returns data in chunks (pages). Since the
connector doesn't use chunking, `hasMoreData` is set to `false`.

As described earlier, the query that the web data connector sends to
Yahoo includes a ticker symbol, a start date, and an end date. In the
`getTableData` function, the ticker symbol is retrieved from the
`tableau.connectionData` property, which is where the information was
stored at the end of the interactive (first) phase. This illustrates the
basic pattern for how you pass data between phases. The start date and
end date (always the current date) are calculated using standard
JavaScript functions.

**Note**: For information about the data formats that you can use in a
web data connector, see [Formats for Date and DateTime Values in Web
Data Connectors](wdc_ref_date_formats.html).

The code then builds the URI for the request to send to Yahoo. This task
is performed by one of the helper functions that you added earlier.

#### The jQuery ajax function

The next block of code is a single jQuery block that calls the
`jQuery.ajax` function to make an HTTP request using AJAX. There are a
variety of ways to make HTTP requests in JavaScript, but using jQuery
has some advantages. It works the same in all browsers, and it sends the
request asynchronously, so that the user is not blocked while the query
is waiting for results.

**Note**: For more information about the jQuery ajax call, see
[jQuery.ajax()](http://api.jquery.com/jQuery.ajax/) on the jQuery site.

The code passes four parameters to the `ajax` function. The `url`
parameter is the URI of the request, and the `dataType` parameter is set
to specify that the request should return data in JSON format.

The `success` parameter is set to a function that's invoked if the
request returns data. In this function, the code loops through the JSON
data to extract the `Symbol`, `Date`, and `Close` values from each
object in the response. For each set of values, the code creates a
JavaScript object that contains `Symbol`, `Date`, and `Close` fields,
and adds the object to the array in `dataToReturn`. Notice that the
fields added to the JavaScript object don't have to match the field
names in the original data. However, the fields in the JavaScript object
do have to match the column names in the sfield names array that was
created in `getColumnHeaders`.

When the code has finished adding data to the `dataToReturn` array, it
calls `tableau.dataCallback` in order to pass the data to Tableau. The
call to `tableau.dataCallback` also passes the `lastRecordToken` and
`hasMoreData` values. The value of `lastRecordToken` is passed as a
parameter to `getTableData`. You need to change this value only if the
web data connector is returning data in chunks (pages). In this case,
there is no chunking, so the code can simply pass to
`tableau.dataCallback` whatever value was passed to the `getTableData`
function. And since this connector does not get data in pages, the
`hasMoreData` value is set to `false`.

The `error` parameter is set to another function whose parameters
contain details about the error.

This block of code for the AJAX request tests for two error conditions:
the result contains no values, and the connection did not succeed. (The
query returns no values if the user enters an invalid stock ticker
symbol.) For both error conditions, the code calls the
`tableau.abortWithError` function. This function tells Tableau that the
connector has terminated so that Tableau can notify the user that
there's been a problem. If the connector can't even make a connection to
the data source, the code also calls `tableau.log`. This function is
used to display information in the simulator console for debugging. The
messages don't appear in Tableau, but they are added to the Tableau
logs.

The web data connector is now finished.

The page so far
---------------

When you're done with this part of the tutorial, the finished page looks
like the following listing.

    .html>
    <meta http-equiv="Cache-Control" content="no-store" />
    <head>
      <title>Stock Quote Connector-Tutorial</title>
      <script src="https://connectors.tableau.com/libs/tableauwdc-1.1.1.js" type="text/javascript"></script>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" type="text/javascript"></script>

      <script type="text/javascript">
      (function() {

        function buildUri(tickerSymbol, startDate, endDate) {
          var startDateStr = getFormattedDate(startDate);
          var endDateStr   = getFormattedDate(endDate);
          var queryStatement = 'select * from yahoo.finance.historicaldata where symbol = "' +
                                tickerSymbol +
                               '" and startDate = "' + startDateStr +
                               '" and endDate = "' + endDateStr + '"';
          var uri = 'http://query.yahooapis.com/v1/public/yql?q=' +
                    encodeURIComponent(queryStatement) +
                    "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
          return uri;
        }

        function getFormattedDate(date) {
            // Return a date in the format YYYY-MM-DD
            return date.getUTCFullYear()  +
                   '-' +
                   makeTwoDigits(date.getUTCMonth() + 1) +
                   '-' +
                   makeTwoDigits(date.getUTCDate());
        }

        function makeTwoDigits(num) {
           // Pad a digit to be two digits with leading zero
           return num <= 9 ? "0" + num.toString() : num.toString();
        }

        var myConnector = tableau.makeConnector();

        myConnector.getColumnHeaders = function() {
            var fieldNames = ['Ticker', 'Day', 'Close'];
            var fieldTypes = ['string', 'date', 'float'];
            tableau.headersCallback(fieldNames, fieldTypes);
        }

        myConnector.getTableData = function(lastRecordToken) {
            var dataToReturn = [];
            var hasMoreData = false;

            // Get parameter values and build YQL query
            var ticker = tableau.connectionData;
            var endDate = new Date();
            var startDate = new Date();
            startDate.setYear(endDate.getFullYear() - 1);
            var connectionUri = buildUri(ticker, startDate, endDate);

            var xhr = $.ajax({
              url: connectionUri,
              dataType: 'json',
              success: function (data) {
                  if (data.query.results) {
                    var quotes = data.query.results.quote;
                    var ii;
                    for (ii = 0; ii < quotes.length; ++ii) {
                        var entry = {'Ticker': quotes[ii].Symbol,
                                     'Day': quotes[ii].Date,
                                     'Close': quotes[ii].Close};
                        dataToReturn.push(entry);
                    }
                    tableau.dataCallback(dataToReturn, lastRecordToken, false);
                  }
                  else {
                      tableau.abortWithError("No results found for ticker symbol: " + ticker);
                  }
              },
              error: function (xhr, ajaxOptions, thrownError) {
                  tableau.log("Connection error: " + xhr.responseText + "\n" + thrownError);
                  tableau.abortWithError("Error while trying to connect to the Yahoo stock data source.");
              }
            });
          }
          tableau.registerConnector(myConnector);
      })();

      $(document).ready(function() {
        $("#submitButton").click(function() {
          var tickerSymbol = $('#ticker').val().trim();
          if (tickerSymbol) {
            tableau.connectionName = "Stock Data for " + tickerSymbol;
            tableau.connectionData = tickerSymbol;
            tableau.submit();
          }
        });
      });
    </script>
    </head>
    <body>
      <p>Enter a stock ticker symbol: <input type="text" id="ticker" /></p>
      <p><button type="button" id="submitButton">Get the Data</button></p>
    </body>
    <.html>
Testing in the simulator
------------------------

You can test the web data connector the same way you did before. First,
make sure that your local web server is still running, as described in
[Test the Connector So Far](wdc_tutorial_testing_part1.html). Open the
simulator by entering the following in your browser:

`http://localhost:8888/simulator/`

When the simulator loads, enter the following URL into the <span
class="uicontrol">WDC URL</span> box:

`http://localhost:8888/StockConnectorTutorial.html`

Make sure this time that the <span class="uicontrol">Automatically
continue to data-gathering phase</span> check box is selected. This
time, you *do* want to run the data-gathering phase.

Click <span class="uicontrol">Run Interactive Phase</span>. The
simulator opens your connector in a window and you see the same page
that you saw before. Enter a stock symbol (like `DATA`) in the text box,
and then click the <span class="uicontrol">Get the Data</span> button.

As soon as you submit the page, the simulator runs the connector's
data-gathering phase. While the connector is gathering data, an <span
class="uicontrol">In Progress</span> message appears next to <span
class="uicontrol">Phase 2: Data Gathering</span>:

![]({{ site.baseurl }}assets/wdc_tutorial_data_gathering_in_progress.png)

When the connector has finished gathering data, the simulator displays
the data at the bottom of the page, like this:

![]({{ site.baseurl }}assets/wdc_tutorial_new_simulator_test_final_488x420.png)

If the connector is not working, you can debug it. For suggestions, see
[Debugging with the simulator](wdc_simulator.html#debugging).

Test in Tableau
---------------

If the web data connector is working, you can try using it in Tableau.
Start Tableau Desktop, and under <span class="uicontrol">Connect</span>,
choose <span class="uicontrol">Web Data Connector</span>.

![]({{ site.baseurl }}assets/wdc_desktop_use_connector.png)

In the dialog box that's displayed, enter the localhost URL for your web
data connector, such as the following:

`http://localhost:8888/StockConnectorTutorial.html`

Tableau loads your web data connector in its interactive phase:

![]({{ site.baseurl }}assets/wdc_tutorial_tableau_test_interactive_phase.png)

Once again enter a stock symbol (like `DATA`) in the text box, and then
click the <span class="uicontrol">Get the Data</span> button. When you
do, Tableau runs the web data connector in its data-gathering phase and
creates a data extract from the data. When the connector has finished
fetching the data and has passed it to Tableau, and when Tableau has
finished creating the extract, Tableau opens a new workbook with the
data ready to view.

Additional web data connector features
--------------------------------------

This tutorial has shown you how to create a basic web data connector
that includes the features that all connectors have. Web data connectors
support additional features that you might need for other scenarios,
such as these:

-   Authentication. Some sites that you might get data from might
    require a user name and password, or might support OAuth. For more
    information, see [Authenticating with a Web Data
    Connector](wdc_authentication.html).

-   Returning data in chunks (paging). In some cases, a data site might
    limit how much information you can get in a single request. To get
    all the data you need, you might need to make multiple requests
    before you pass the data to Tableau. For more information, see
    [Returning Data in Chunks (Paging)](wdc_paging.html).

-   Incremental refresh. As with other connectors, you can refresh data
    extracts that are created by web data connectors. When your
    connector is loaded in order to refresh an extract, you can either
    get all the data again, or you can get only the data that is new
    since the last time the extract was refreshed. For more information,
    see [Incremental Refresh](wdc_incremental_refresh.html).

-   CORS. Some sites do not support cross-origin resource sharing
    (CORS), and might not allow your web data connector to make
    AJAX requests. For information about to handle this scenario, see
    [Managing Cross-Origin Resource Sharing (CORS) in Web Data
    Connectors](wdc_cors.html).

The Web Data Connector SDK includes a number of samples that illustrate
ways to use these features. For more information, see [Web Data
Connector SDK Samples](wdc_sdk_samples.html).
