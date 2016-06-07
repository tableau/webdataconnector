---
layout: page
title: Multiple Tables Tutorial
base: docs
---

> This tutorial builds on the connector created in the basic [tutorial]({{ site.baseurl }}/docs/wdc_tutorial). Ensure that you understand the concepts in the basic tutorial before you continue.

By the end of this tutorial, you'll have a working WDC that stores earthquake data from two date ranges in two separate tables. 

You'll learn how to:

* [Before you get started](#before-you-get-started)
* [Create the user interface](#create-ui)
* [Store connection data](#store-connection-data)
* [Get multiple table schemas](#get-multiple-schemas)
* [Get data for each table](#get-data-for-tables)
* [See it in action](#see-in-action)

To see the source code for the completed connector, look for the `earthquakeMultitable` files in the `Examples` directory and the `js` directory.

### Before you get started {#before-you-get-started}

This tutorial builds on the USGS Earthquake feed connector created in the [tutorial]({{ site.baseurl }}/docs/wdc_tutorial). Before you get started, you'll need to make a copy of the connector that you can edit.

1. Copy the `earthquakeUSGS` files from the `Examples` directory and the `js` directory to the top-level directory for the repository. (This is the same directory as the README.)

1. Rename the files to `earthquakeMultitable.html` and `earthquakeMultitable.js`.

1. Edit the `earthquakeMultitable.html` file to point to the renamed `earthquakeMultitable.js` file:

   ```html
   <script src="earthquakeMultitable.js" type="text/javascript"></script>
   ```

### Create the user interface {#create-ui}

The existing connector interface doesn't do very much--it's just a button that you can click to run the connector. Let's add input fields to the user interface so that you can specify the date ranges for which you want to get earthquake data.

Open the `earthquakeMultitable.html` file, and copy the following code immediately above the `<button>` element:

```html
<h2>Compare earthquake data for two date ranges</h2>
<form>
    <div class="form-inline">
        <label for="start-date-one" class="text-center">Start Date One </label>
        <span>&mdash;<span>
        <label for="end-date-one">End Date One </label>
    </div>
    <div class="form-inline">
        <input type="date" class="form-control" id="start-date-one" value="2015-05-08">
        <input type="date" class="form-control" id="end-date-one" value="2015-05-15">
    </div>
    <div class="form-inline">
        <label for="start-date-two">Start Date Two </label>
        <span>&mdash;<span>
        <label for="end-date-two">End Date Two </label>
    </div>
    <div class="form-inline">
        <input type="date" class="form-control" id="start-date-two" value="2016-05-08">
        <input type="date" class="form-control" id="end-date-two" value="2016-05-15">
    </div>
</form>
```

This is a simple form with four input fields. Each input field includes the `date` type, a default value, and a label. Additionally, there are some `<div>` elements and classes on each element to use Bootstrap styling. If you load the page in a browser, the result looks like this:

!["The connector interface displays four input fields with labels for date ranges."]({{ site.baseurl }}/assets/earthquake_multitable_ui.png)

### Store connection data {#store-connection-data}

Now that you've updated the user interface, it's time to consume the user input data in the JavaScript code. We're going to get the values from the input fields and store them in a `tableau.connectionData` variable for use later.

Open the `earthquakeMultitable.js` file, and replace the `$(document).ready` function with the following code :

```js
$(document).ready(function () {
	$("#submitButton").click(function () {
		var startDateOne = $('#start-date-one').val().trim(),
			endDateOne = $('#end-date-one').val().trim(),
			startDateTwo = $('#start-date-two').val().trim(),
			endDateTwo = $('#end-date-two').val().trim(),
			dateRangeOne = "",
			dateRangeTwo = "";

		if (startDateOne && endDateOne && startDateTwo && endDateTwo) {
			dateRangeOne = "starttime=" + startDateOne + "&endtime=" + endDateOne;
			dateRangeTwo = "starttime=" + startDateTwo + "&endtime=" + endDateTwo;
			tableau.connectionData = dateRangeOne + "," + dateRangeTwo;
			tableau.connectionName = "USGS Earthquake Feed";
			tableau.submit(); 
		} else {
			alert("Enter a valid date for each date range.");
		}
	});
});
```

Some things to note about the code:

* As with the connector in the basic tutorial, the connector uses jquery to run code when the page loads and creates an event listener for the submit button.
* The values of the four input fields are stored in variables.
* The `if` statement checks that the four variables are defined and are not empty.
	* If the variables are defined, the date ranges are concatenated and stored in the `tableau.connectionData` variable. Note that the date range variables are formatted to match URL parameters expected by the USGS Earthquake API. 
	* If the variables are not defined, display an alert to the user.

The `tableau.connectionData` variable is the important piece here. It is created by the WDC so that you can pass data to the `getSchema` and `getData` functions.

### Get Multiple Table Schemas {#get-multiple-schemas}

In this part of the tutorial, you modify the `getSchema` code to create two table schemas and pass them to the `schemaCallback` in an array parameter. 

Replace the `myConnector.getSchema` function with the following code:

```js
myConnector.getSchema = function (schemaCallback) {
	var cols = [
		{ id : "mag", alias : "magnitude", dataType : tableau.dataTypeEnum.float },
		{ id : "title", alias : "title", dataType : tableau.dataTypeEnum.string },
		{ id : "url", alias : "url", dataType : tableau.dataTypeEnum.string },
		{ id : "lat", alias : "latitude", dataType : tableau.dataTypeEnum.float },
		{ id : "lon", alias : "longitude", dataType : tableau.dataTypeEnum.float }
	];

	var tableDateRangeOne = {
		id : tableau.connectionData.split(",")[0], // e.g. "starttime=2015-05-01&endtime=2015-05-08",
		alias : "Earthquake Feed Date Range One",
		columns : cols
	};

	var tableDateRangeTwo = {
		id : tableau.connectionData.split(",")[1], // e.g. "starttime=2016-05-01&endtime=2016-05-08",
		alias : "Earthquake Feed Date Range Two",
		columns : cols
	};
	schemaCallback([tableDateRangeOne, tableDateRangeTwo]);
};
```

Here's what's happening in the code:

* The `cols` array contains an object for each column in our tables. Because both tables of data will contain the same columns, this variable can be used by both table schemas.
* The `tableDateRangeOne` and `tableDateRangeTwo` variables each define a table schema object. 
* The `id` for each table schema is set to the date range values from `tableau.connectionData`. Because we set the value of `tableau.connectionData` to a string, we split the string on the "," delimiter.
* The table schemas are passed to `schemaCallback` as objects in an array.

### Get data for each table {#get-data-for-tables}

When you create multiple table schemas, the WDC API calls the `getData` function once for each schema. As a result, you need a way to change the call to the USGS Earthquake API for each table. The easiest way to do this is to use the `table.tableInfo.id` value that we set in the table schemas.

Copy the following line of code directly above the `$.getJSON` function:

```js
var apiCall = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&" + table.tableInfo.id + "&minmagnitude=4.5";
```

The API call includes several query parameters to define what data to return and the format. Note that the `table.tableInfo.id` value was set to the query parameters for specifying a date range. For more information on the query parameters used in the API call, see the [USGS Earthquake API documentation](http://earthquake.usgs.gov/fdsnws/event/1/).

Now, the only thing left to do is to replace the parameter in the `$.getJSON` function with the new API call. Replace the first line of the `$.getJSON` function with this line:

```js
$.getJSON(apiCall, function (resp) {
```

### See it in action {#see-in-action}

And that's it! You can test your connector in the simulator like you did in the [Get Started]({{ site.baseurl }}/docs/) section, or you can see the source code in the `Examples` and `js` directories to check your work. 

Now you're *definitely* ready to make your own connector!
