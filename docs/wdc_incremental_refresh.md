---
title: WDC Incremental Refresh
layout: docs
---

Tableau uses web data connectors to fetch data and store that data in an extract. You can always refresh the entire
extract. However, if you implement incremental refresh, you can also fetch only the new data for the extract, which can
greatly reduce the time required to download the data.

It is possible to enable incremental refresh functionality for any table that is brought back by the web data connector.

To enable incremental refresh functionality on a table, you must set the
[tableInfo.incrementColumnId]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.tableinfo-1.incrementcolumnid)
property on the tableInfo object for that table as defined in your
[getSchema]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.webdataconnector.getschema) function.
The incrementColumnId property should be set to the ID of the column that will be used as
the key for the incremental refresh.

For example, suppose you had a table with an ID field.  For every new record in the table, the ID is incremented by 1,
and no previous data is ever deleted or overwritten.  In that scenario, you would want the ID column to be referenced by
incrementColumnID.  That way, when gathering data, you can fetch only the records that have an ID that is larger than
the largest ID you have fetched during the last gather data phase.

For example, here is the getSchema method of the IncrementalRefreshConnector dev sample:

```js
myConnector.getSchema = function(schemaCallback) {
    var cols = [
        { id: "id", dataType: "string" },
        { id: "x", dataType: "string" },
        { id: "day", dataType: "string" },
        { id: "day_and_time", dataType: "string" },
        { id: "true_or_false",  dataType: "string" },
        { id: "color", dataType: "string" }
    ];

    var tableInfo = {
        alias: "Incremental Refresh Connector",
        id: "mainTable",
        columns: cols,
        incrementColumnId: "id"
    };

    schemaCallback([tableInfo]);
};
```

When Tableau calls the getData method of the connector, it passes in a table object.
If an incremental refresh is being requested by the end user in Tableau, and if the
[tableInfo.incrementColumnId]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.tableinfo-1.incrementcolumnid)
was set during the getSchema function for that table, then the table object will contain
a value in the [table.incrementValue]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.table.incrementvalue)
property.  This value will contain the current largest value from the increment column.

For example, this is how this property is utilized in the IncrementalRefreshConnector dev sample:


```js
myConnector.getData = function(table, doneCallback) {
    var lastId = parseInt(table.incrementValue || -1);

    // Gather only the most recent data with an ID greather than 'lastId'
    // ......

    table.appendRows(dataArray);
    doneCallback();
};
```

The WDC API supports three data types for the incremental refresh column: DateTime, Date, and integer. For incremental
refresh, you typically use a field that represents a date, a timestamp, or a row number.
