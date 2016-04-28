---
layout: page
title: Web Data Connector SDK Samples
base: docs
---

The Web Data Connector SDK includes sample connectors that illustrate
various additional ways to get content using a web data connector. The
samples are in the Examples folder of the location where you extracted
the Web Data Connector SDK. The samples include the following:

-   GoogleSheetsConnector.html. Reads the columns from a published
    Google spreadsheet. This sample illustrates how to use OAuth to let
    the user sign in using Google.

-   IncrementalUpdateConnector.html. Shows how to use a column to define
    incremental updates with manufactured data.

-   jsonConnector.html. Accepts a JSON file that's provided using a web
    URL, by copying and pasting the JSON data, or by dragging and
    dropping the data. To use the sample, drag or copy your JSON block
    into the connector's text area. Make sure you have valid JSON,
    because this example doesn't include error handling. This connector
    includes code that uses heuristics to transform a JSON block into
    table data.

-   MadMoneyScrapter.html. This sample reads data from the Mad Money
    page on thestreet.com (http://www.thestreet.com/mad-money/) and
    illustrates how to scrape data from a web page's table.

-   SocrataConnector.html. Reads data from one of three
    Socrata (http://www.socrata.com/) data sources, which are data
    sources for US government information. This connector illustrates
    how to page data, and how to use incremental refresh.

-   xmlConnector.html. Reads XML documents (from disk, via a URL, or
    from text that's pasted into a text box) and extracts data
    from them.


