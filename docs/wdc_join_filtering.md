---
title: Join Filtering
layout: docs
---

When you connect to multiple tables of data with a web data connector, you can filter the data from one table based on the data from another table.
Said another way, you can make one table dependent on the data returned from another table.

Use join filtering to improve the efficiency of your connectors by getting only the data that you want.
Otherwise, by default, Tableau gets all data from all tables.

Before you set up join filtering, ensure that you have a working web data connector for your tables. For more information
on getting data from multiple tables, see the [Multiple Tables Tutorial]({{ site.baseurl }}/docs/wdc_multi_table_tutorial).

Once you have a working connector for multiple tables, step through the following example to understand join filtering (or review the example connector at the end).

* TOC
{:toc}

<div class="alert alert-info">
    <b>Important:</b> Join filtering is only supported in WDC versions 2.2 and later.
</div>

### Create a sample schema

In this example, you create a connector for blog post data where you join two tables: a users table and a posts table.
You can use join filtering to first get data from the users table, then only get post data that corresponds to certain users.

Here is an example schema for the users table and posts table:

```js
var users_cols = [{
    id: "id",
    dataType: tableau.dataTypeEnum.string
}, {
    id: "name",
    alias: "name",
    dataType: tableau.dataTypeEnum.string
}];

var usersTable = {
    id: "users",
    alias: "User Data",
    columns: users_cols
};

var posts_cols = [{
    id: "id",
    dataType: tableau.dataTypeEnum.string
}, {
    id: "userId",
    alias: "userId",
    dataType: tableau.dataTypeEnum.string
}, {
    id: "title",
    alias: "title",
    dataType: tableau.dataTypeEnum.string
}];

var postsTable = {
    id: "posts",
    alias: "Post Data",
    columns: posts_cols
};

```

### Specify schema properties

Now that you have a sample schema, you can specify which tables you want join and which columns you want to use for the primary to foreign key relatioship.
To filter posts by user, set the following schema properties:

* `joinOnly`. (Optional) Whether you want to make join filtering required for this table.
  If you set this value to true, you cannot connect to the table without first connecting to the other table.
  For example, if you set this to true for the posts table, the posts table is disabled in Tableau unless you select the users table first.

* `filterable`. Set to true for the column that you want to use for filtering.
  Since we want the posts tables to be filtered on its `userId` column, you want to set this to true for the `userId` column of the `posts` table.

* `foreignKey`. Specify the tableId and columnId of the foreign key to use.
  Since the posts table `userId` column represents a foreign key to the users table `id` primary key, you would enter `{ "tableId": "users", "columnId": "id" }` on the posts table.  You can have many foreignKey attributes point to the same primary key.

The schema below has these properties already set:

```js
var users_cols = [{
    id: "id",
    dataType: tableau.dataTypeEnum.string,
}, {
    id: "name",
    alias: "name",
    dataType: tableau.dataTypeEnum.string
}];

var usersTable = {
    id: "users",
    alias: "User Data",
    columns: users_cols
};

// Schema for posts
var posts_cols = [{
    id: "id",
    dataType: tableau.dataTypeEnum.string
}, {
    id: "userId",
    alias: "userId",
    dataType: tableau.dataTypeEnum.string,
    filterable: true
}, {
    id: "title",
    alias: "title",
    dataType: tableau.dataTypeEnum.string
}];

var postsTable = {
    joinOnly: true,
    id: "posts",
    alias: "Post Data",
    columns: posts_cols,
    foreignKey: {
	"tableId": "users",
	"columnId": "id"
    }
};
```

### Get data for tables

Because the table that you want to filter depends on data from another table, you need to include additional logic to iterate over the filter values.
The dependent table includes the following properties that you can use:

* `isJoinFiltered`. Whether the table can be used for join filtering.
  If the schema properties are set correctly, this equals true.

* `filterValues`. An array of the values to use for filtering.
  For example, an array of the user ID values to get data for.

For example, you might iterate through the user ID filter values with the following `getData` function:

```js
myConnector.getData = function(table, doneCallback) {
var tableData = [];
if (table.tableInfo.id === "users") {
    $.getJSON("http://jsonplaceholder.typicode.com/users", function(resp) {
	for (var i = 0; i < resp.length; i++) {
				// Only return the first 5 users to demonstrate filtering
	    if (resp[i].id <= 5) {
		tableData.push({
		    "id": resp[i].id,
		    "name": resp[i].name
		});
	    }
	}

	table.appendRows(tableData);
	doneCallback();
    });
} else if (table.tableInfo.id === "posts") {
    var filterValues = table.filterValues;

    if (!table.isJoinFiltered) {
	tableau.abortWithError("The table must be filtered first.");
	return;
    }

    if (filterValues.length === 0) {
	doneCallback();
	return;
    }

    var postFetches = [];

    // Now that we have the ids of the filtered users,
    // get the posts for only those users.
    for (var userId in filterValues) {
      var postFetch = new Promise(function(resolve, reject) {
	$.getJSON("http://jsonplaceholder.typicode.com/posts?userId=" + userId, function(resp) {
	  for (var i = 0; i < resp.length; i++) {
	      tableData.push({
		  "id": resp[i].id,
		  "userId": resp[i].userId,
		  "title": resp[i].title
	      });
	  }
	  table.appendRows(tableData);
	  resolve();
	});
      });

      postFetches.push(postFetch);
    }

    Promise.all(postFetches).then(function(values) {
      doneCallback();
    })
}
};

```

### Full example

The full code for the example above is displayed below:


```js
(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Schema for users
        var users_cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "name",
            alias: "name",
            dataType: tableau.dataTypeEnum.string
        }];

        var usersTable = {
            id: "users",
            alias: "User Data",
            columns: users_cols
        };

        // Schema for posts
        var posts_cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "userId",
            alias: "userId",
            dataType: tableau.dataTypeEnum.string,
            filterable: true
        }, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }];

        var postsTable = {
            joinOnly: true,
            id: "posts",
            alias: "Post Data",
            columns: posts_cols,
            foreignKey: {
                "tableId": "users",
                "columnId": "id"
            }
        };

        schemaCallback([usersTable, postsTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var tableData = [];
        if (table.tableInfo.id === "users") {
            $.getJSON("http://jsonplaceholder.typicode.com/users", function(resp) {
                for (var i = 0; i < resp.length; i++) {
					// Only return the first 5 users to demonstrate filtering
                    if (resp[i].id <= 5) {
                        tableData.push({
                            "id": resp[i].id,
                            "name": resp[i].name
                        });
                    }
                }

                table.appendRows(tableData);
                doneCallback();
            });
        } else if (table.tableInfo.id === "posts") {
            var filterValues = table.filterValues;

            if (!table.isJoinFiltered) {
                tableau.abortWithError("The table must be filtered first.");
                return;
            }

            if (filterValues.length === 0) {
                doneCallback();
                return;
            }

            var postFetches = [];

            // Now that we have the ids of the filtered users,
            // get the posts for only those users.
            for (var userId in filterValues) {
              var postFetch = new Promise(function(resolve, reject) {
                $.getJSON("http://jsonplaceholder.typicode.com/posts?userId=" + userId, function(resp) {
                  for (var i = 0; i < resp.length; i++) {
                      tableData.push({
                          "id": resp[i].id,
                          "userId": resp[i].userId,
                          "title": resp[i].title
                      });
                  }
                  table.appendRows(tableData);
                  resolve();
                });
              });

              postFetches.push(postFetch);
            }

            Promise.all(postFetches).then(function(values) {
              doneCallback();
            })
        }
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "JSONPlaceholder"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
```
