(function() {
    var myConnector = tableau.makeConnector();
    
    myConnector.getSchema = function(schemaCallback) {
         var userCols = [
             { id: "id", dataType: "int" },
             { id: "name", dataType: "string" },
             { id: "username", dataType: "string" },
             { id: "phone", dataType: "string" },
             { id: "website",  dataType: "string" },
         ]
         
         var postCols = [
             { id: "id", dataType: "int" },
             { id: "userId", dataType: "int" },
             { id: "title", dataType: "string" },
             { id: "body", dataType: "string" }
         ]
         
         var commentCols = [
             { id: "id", dataType: "int" },
             { id: "postId", dataType: "int" },
             { id: "name", dataType: "string" },
             { id: "email", dataType: "string" },
             { id: "body",  dataType: "string" },
         ]
         
         var albumCols = [
             { id: "id", dataType: "int" },
             { id: "userId", dataType: "int" },
             { id: "title", dataType: "string" }
         ]
         
         var photoCols = [
             { id: "id", dataType: "int" },
             { id: "albumId", dataType: "int" },
             { id: "title", dataType: "string" },
             { id: "url", dataType: "string" },
             { id: "thumbnailUrl",  dataType: "string" },
         ]
         
         var usersTable = {
             alias: "Users",
             id: "users",
             columns: userCols
         };
         
         var postsTable = {
             alias: "Posts",
             id: "posts",
             columns: postCols
         };
         
         var commentsTable = {
             alias: "Comments",
             id: "comments",
             columns: commentCols
         };
         
         var albumsTable = {
             alias: "Albums",
             id: "albums",
             columns: albumCols
         };
         
         var photosTable = {
             alias: "Photos",
             id: "photos",
             columns: photoCols
         };
         
         schemaCallback([usersTable, postsTable, commentsTable, albumsTable, photosTable]);
     };

    myConnector.getData = function(table, doneCallback) {
        var apiURL = 'http://jsonplaceholder.typicode.com/' + table.tableInfo.id;
        $.ajax(apiURL, {
            method: 'GET'
        }).then(function(data) {
            table.appendRows(data);
            doneCallback()  
        });
    };

     setupConnector = function() {
        tableau.connectionName = "JSON Multiple Table Connector";
        tableau.submit();
     };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() { // This event fires when a button is clicked
            setupConnector();
        });
        $('#inputForm').submit(function(event) {
            event.preventDefault();
            setupConnector();
        });
    });
})();
