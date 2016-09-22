# Tableau Web Data Connector SDK
[![Coverage Status](https://coveralls.io/repos/github/tableau/webdataconnector/badge.svg?branch=dev)](https://coveralls.io/github/tableau/webdataconnector?branch=dev) [![Build Status](https://travis-ci.org/tableau/webdataconnector.svg?branch=dev)](https://travis-ci.org/tableau/webdataconnector)

This is the development branch of the web data connector platform. For information about the current version, see the
[documentation](http://tableau.github.io/webdataconnector/).

## What's New in 2.1

The following features are currently under development in version 2.1 of the WDC:

### Standard connections (available now in dev branch simulator)

When you create a web data connector that gets data from multiple tables, you can now pre-specify how you want to join
the tables in Tableau Desktop. The standard connections feature supports left and inner joins for tables.

To pre-specify these joins (or standard connections), complete the following steps:

1. Define table schemas like you would for any web data connector. For example, see a sample table schema
   [here](https://github.com/tableau/webdataconnector/blob/dev/Examples/json/StandardConnectionsTableInfoData.json).

1. Define the connections object that specifies which tables you want to join and what types of joins you want to use.
   For example, see the sample connections object
   [here](https://github.com/tableau/webdataconnector/blob/dev/Examples/json/StandardConnectionsData.json).

1. Pass the table schema and the connections object to the `schemaCallback` function in your connector. For example, see
   the sample connector
   [here](https://github.com/tableau/webdataconnector/blob/dev/Examples/js/StandardConnectionsExample.js).

Note that the `schemaCallback` function takes the connections object as a second, optional parameter.

### Progress reporting (coming in future Tableau release)

When you load a connector and get data, you can view progress information that indicates how many rows of data have been downloaded.

This feature is not included in the simulator, but will be available in Tableau.

During the data gathering phase, you can use tableau.reportProgress(String) to inform your users about the progress of their WDC connection.  The API accepts a string (which may be truncated if too long) and displays that string in the Tableau progress dialog.
