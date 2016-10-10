---
title: Standard Connections
layout: docs
---

When you create a web data connector that gets data from multiple tables, you can pre-specify how you want to join
the tables in Tableau Desktop. Tableau Desktop supports left and inner joins for web data connectors.

Before you create a standard connection, ensure that you have a working web data connector for your tables. For more information
on getting data from multiple tables, see the [Multiple Tables Tutorial]({{ site.baseurl }}/docs/wdc_multi_table_tutorial).

## Create the connection objects

For every two tables in a web data connector that you want to join, you need to create a connection object. A connection
object is a JavaScript object that specifies the two tables that you want to join, the columns that you want to use
to join the tables, and the type of join.


For example, you could use the following connection object to join the tables from the sample created in the
[Multiple Tables Tutorial]({{ site.baseurl }}/docs/wdc_multi_table_tutorial).


```js
var standardConnection = {
    "alias": "Joined earthquake data",
    "tables": [{
        "id": "magPlace",
        "alias": "Magnitude and Place"
    }, {
        "id": "timeUrl",
        "alias": "Time and URL"
    }],
    "joins": [{
        "left": {
            "tableAlias": "Magnitude and Place",
            "columnId": "id"
        },
        "right": {
            "tableAlias": "Time and URL",
            "columnId": "id"
        },
        "joinType": "inner"
    }]
};
```

The connection object includes the following properties:

* `alias`. This is the name of the connection as it appears in Tableau Desktop.

* `tables`. The tables that you want to join. For example, in the above connection object there is a table named `magPlace` and a
  table named `timeUrl`.

* `joins`. An array which includes the following properties:
  * `left` and `right`. Defines which tables you want to appear on the left and right side in Tableau Desktop. The order
    of the tables impacts the resulting joined data and is especially important if you use a left join or include more
    than two tables.
  * `joinType`. The type of join. Use an `inner` join to display only the rows of data that are in both tables. Use a
    `left` join to display all the rows that are in the left table and the matching rows that are in the right table.
    For more information on joins, see [Join Your
    Data](https://onlinehelp.tableau.com/current/pro/desktop/en-us/joining_tables.html) in the Tableau Desktop help.


## Pass connection objects to the schemaCallback function

The `schemaCallback` function takes an array of connection objects as a second parameter. For example, to pass the
sample connection object created above to Tableau, enter the following parameters:

```js
schemaCallback([magPlaceTable, timeUrlTable], [connectionObject]);
```

You can include multiple connection objects in the array.

## Use your standard connections in Tableau

To use a standard connection in Tableau, complete the following steps:

1. Open your connector and complete the interactive phase.

1. Drag your connection from the **Standard Connection** pane on the left to the **Tables** pane in the upper right.

   ![Drag your connection to the Tables pane.]({{ site.baseurl}}/assets/standard_connection_drag.png)

   The joined tables appear in the **Tables** pane.

   ![The joined tables appear.]({{ site.baseurl}}/assets/standard_connection_joined_tables.png)
