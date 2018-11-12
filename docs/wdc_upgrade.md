---
title: Upgrading from WDC Version 1.x 
layout: docs
---

If you have built connectors using WDC version 1.x you can continue to use those connectors in Tableau, up through Tableau 2019.1. See [WDC Versions]({{ site.baseurl }}\docs\wdc_library_versions) for information about compatibility. However, you cannot turn a version 1.x connector into a version 2.x connector by just linking to version 2.x of the Tableau WDC library. The connector will not work unless you also update the connector to use code changes introduced in version 2.x of the API.

**In this section**
* TOC
{:toc}


### Why should you upgrade?

You should considering upgrading your connectors to version 2.x to have access to all the great new features that have been introduced for WDC in Tableau 10.0 and later. You might want to keep your version 1.x connectors if you need to support earlier versions of Tableau.   

In version 2.x you can:

- Include multiple tables of data.
- Signal that you are done gathering data with a single callback, and you can add data that you gather directly to a table object created by Tableau. Previously, there was no way to signal that you were done gathering data. As a result, the WDC API repeatedly ran your `getTableData` function so that you could pass data to Tableau through a callback parameter. 
- Use the locale API to get the language currently set by the user in Tableau. 
- Specify how you want to join tables (standard connections) in Tableau Desktop. 
- Use join filtering to filter the data from one table based on the data from another. 
- Connect directly to spatial data. Using the new geometry value in the `tableau.dataType` enum, you can send GeoJSON objects directly back to Tableau.

### Lifecycle and phase differences between version 1.x and version 2.x

To support the new features, changes have been made to the API. For example, to support multiple tables, there is now a `getSchema()` function that has a callback function for reporting the tables contained in the WDC. The `getTableData()` function was changed to `getData()` and it now takes a table object as a parameter. Review the following list and the samples to better understand the changes. 

**In version 1.x:**

1. A connector loads and runs its interactive phase, then calls `tableau.submit()`.
2. In the data gathering phase, Tableau calls `connector.getColumnHeaders()`, which defines the schema for a single table. The `getColumnHeaders()` function finishes by calling a predefined callback.
3. Tableau calls `connector.getTableData()`, which passes data to Tableau by means of a parameter on the predefined `tableau.dataCallback()` function.
4. Step 3 is repeated until `tableau.dataCallback()` passes a flag to Tableau to signal that there is no more data.

**In version 2.x:**

1. A connector loads and runs its interactive phase, then calls `tableau.submit()`.
2. In the data gathering phase, Tableau calls `connector.getSchema()`, which defines the schema for one or more tables. The connector calls a predefined callback to signal that it is done defining the table schema.
3. Tableau calls `connector.getData()` with a table object parameter and a callback parameter. The `getData()` function appends data to the table object using the object's built-in `table.appendRows()` function. The `getData()` function is called once for each table defined in the schema. 
4. When the `getData()` function is done gathering data, it calls the `doneCallback()` that it was passed as a parameter.


### Changes to column and table identifiers

In WDC version 2.x, the column and table identifiers (`columnId` and `tableId`) can only contain alphanumeric (a-z, A-Z, 0-9) and underscore characters (`_`). The identifiers must match the regular expression: `^[a-zA-Z0-9_]*$`. The identifiers cannot contain spaces, hyphens, or special characters. In WDC version 1.x, the string values containing spaces were allowed to pass through. 


### Test your connector with the WDC simulator

As always, it is good practice to test your connector in the WDC version 2.x simulator to make sure you are getting the data that you expect. See [Debugging in the Simulator and Tableau]({{ site.baseurl }}\docs\wdc_debugging).

