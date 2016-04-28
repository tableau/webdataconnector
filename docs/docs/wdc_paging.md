---
layout: page
title: Returning Data in Chunks (Paging)
base: docs
---

Many sites limit how much information they return for a single request.
To get all the data that you need for a web data connector, you might
need to make repeated requests to the data source, fetching one chunk of
data at a time. For scenarios like this, you can implement paging in
your web data connector. When you implement paging, Tableau calls your
connector multiple times (until you tell it you're done), and during
each call, you pass another chunk of data to Tableau.

Basics of paging in a web data connector
----------------------------------------

During the data-gathering phase for the web data connector, Tableau
calls the [getTableData](wdc_ref.html#connector_getTableData) function in
your connector in order to get the connector's data. In the function,
you fetch the data, and then you pass it to Tableau by calling
[tableau.dataCallback](wdc_ref.html#tableau_functions_dataCallback). The
[tableau.dataCallback](wdc_ref.html#tableau_functions_dataCallback)
function takes three parameters:

-   <span class="api-placeholder">dataToReturn</span>. The array that
    contains a chunk of data to pass to Tableau.

-   <span class="api-placeholder">lastRecordToken</span>. An index value
    that indicates where you are in the data stream.

-   <span class="api-placeholder">hasMoreData</span>. A Boolean value
    that indicates whether there is more data to fetch.

When your code has fetched all the data, you pass `false` for the <span
class="api-placeholder">hasMoreData</span> parameter. In that case it
doesn't matter what value you pass for <span
class="api-placeholder">lastRecordToken</span>, though that parameter
must always be set to a string.

If your connector is going to pass data to Tableau in chunks, you do the
following:

-   Pass the current chunk of data to Tableau via the <span
    class="api-placeholder">dataToReturn</span> parameter.

-   Set <span class="api-placeholder">lastRecordToken</span> to a value
    that tells you where you are in the data. Tableau passes this value
    back to you as a parameter the next time it calls `getTableData`.
    This parameter must be set to a string, even if the token you're
    using is a numeric value.

-   Set the <span class="api-placeholder">hasMoreData</span> parameter
    to `true`. This indicates that Tableau should call your connector's
    `getTableData` function again to get the next chunk of data.

**Note**: In a web data connector that returns data in chunks, make the
chunks as big as practical (use the maximum page size that the data site
supports). The fewer requests that the web data connector has to make to
the data site to get the complete set of data, the faster Tableau can
load the data.

Example of how to return values in chunks
-----------------------------------------

The following example provides an illustration of how to implement
paging. This example returns data records that simply consist of integer
values. In the user-interaction (first) phase, the connector prompts you
for how many records to return, and what the "page" (chunk) size should
be.

    .html>
    <script src="https://connectors.tableau.com/libs/tableauwdc-1.1.1.js" type="text/javascript"></script>
    <meta http-equiv="Cache-Control" content="no-store" />
    <head>
    <script type="text/javascript">
    (function() {
      var myConnector = tableau.makeConnector();

      myConnector.getColumnHeaders = function() {
        var columnNames = ['NextNumber'];
        var columnTypes = ['int'];
        tableau.headersCallback(columnNames, columnTypes);
      }

      myConnector.getTableData = function(lastRecordToken) {
        var index;
        if(lastRecordToken.length == 0)
            {index = 0;}
        else
            {index = parseInt(lastRecordToken);}

        var connectionData = JSON.parse(tableau.connectionData);

        var pageSize = 5;
        var maxRecords = 20;

        if(connectionData.pageSize == ''){
            var pageSize = 5;
        }
        else
        {
            pageSize = parseInt(connectionData.pageSize);
        }

        var
        var maxRecords = parseInt(connectionData.maxRecords);

        // To see paging occurring in the simulator, put a debugger break or
        // tableau.log call here, as in the following example.
        msg = "pageSize = " + pageSize;
        msg += ", maxRecords = " + maxRecords;
        msg +=  ", lastRecordToken = " + lastRecordToken;
        tableau.log(msg);

        dataToReturn = [];
        hasMoreRecords = true;
        for(i = 0; i < pageSize;  i++)
        {
            index++;
            if(index > maxRecords)
            {
                hasMoreRecords = false;
            }
            else
            {
                var entry = {'NextNumber': index};
                dataToReturn.push(entry);
            }
        }
        tableau.dataCallback(dataToReturn, index.toString(), hasMoreRecords);
      }
      tableau.registerConnector(myConnector);
    })();
    </script>

    <script type="text/javascript">
    function buttonDone_click()
    {
        pageSize = document.getElementById("textPageSize").value
        maxRecords = document.getElementById("textMaxRecords").value
        tableau.connectionData = JSON.stringify({'pageSize': pageSize,'maxRecords': maxRecords});
        tableau.submit();
    }
    </script>
    </head>
    <body>
    <form id="inputForm" action="">
        <p>Page size: <input type="text" id="textPageSize" value="5" /></p>
        <p>Maximum records: <input type="text" id="textMaxRecords" value="20" /></p>
        <p><input type="button" id="buttonDone" onclick="buttonDone_click()" value="Done" /></p>
    </form>
    </body>
    <.html>

### Code explanation

This web data connector displays two text boxes. One prompts the user
for the page size, which is the number of records that the connector
will return in one chunk. The other text box prompts the user for the
maximum number of records to return. The values that the user enters for
these text boxes are stored in the
[tableau.connectionData](wdc_ref.html#tableau_properties_connectionData)
property at the end of the user-interaction (first) phase of the
connector.

At the beginning of the data-gathering (second) phase, the code extracts
the values in the [getTableData](wdc_ref.html#connector_getTableData)
function. Notice that the code uses `JSON.stringify` when storing the
values. This serializes the values into a JSON string, because the
[tableau.connectionData](wdc_ref.html#tableau_properties_connectionData)
property can accept only a string value. In the `getTableData` function,
the code deserializes the `tableau.connectionData` property into a JSON
object by calling `JSON.parse`.

The first time that Tableau calls `getTableData`, the value of the <span
class="api-placeholder">lastRecordToken</span> parameter that it passes
is 0. In this example, <span
class="api-placeholder">lastRecordToken</span> is passed back to Tableau
with the value of the last record that was added to the chunk.

When Tableau calls `getTableData` again, the value of <span
class="api-placeholder">lastRecordToken</span> is set to the value that
was sent to Tableau in the most recent
[tableau.dataCallback](wdc_ref.html#tableau_functions_dataCallback) call.
The code calculates the next chunk of data to return by incrementing the
value of <span class="api-placeholder">lastRecordToken</span>. When
<span class="api-placeholder">lastRecordToken</span> reaches the value
set for `maxRecords`, the code sets <span
class="api-placeholder">lastRecordToken</span> to `false` so that
Tableau does not call `getTableData` again.

Examples
--------

For an additional example of how to implement paging, see the
SocrataConnector example in the Web Data Connector SDK.
