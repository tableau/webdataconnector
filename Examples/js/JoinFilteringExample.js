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
