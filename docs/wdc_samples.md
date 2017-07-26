---
title: WDC Samples
layout: docs
---

The Web Data Connector comes with sample connectors that you can use to learn about specific features of the WDC API.
The samples are in the `Examples` folder of the `webdataconnector` repository. You can see the repository
online [here](https://github.com/tableau/webdataconnector/tree/master).

-   **[https://tableau.github.io/webdataconnector/Examples/html/earthquakeUSGS.html](earthquakeUSGS)**

    This is the default connector when you open the simulator. Instructions for building it are in the [Tutorial]({{ site.baseurl }}/docs/wdc_tutorial.html). It connects to the USGS Earthquake feed and gets data about earthquakes in the last week.

-   **[https://tableau.github.io/webdataconnector/Examples/html/earthquakeMultitable.html](earthquakeMultitable)**

    This connector builds on the previous one to showcase how to get data into multiple tables from a data source.

-   **[https://tableau.github.io/webdataconnector/Examples/html/earthquakeMultilingual.html](earthquakeMultilingual)**

    This connector demonstrates how to use the locale property of the tableau object to localize content.

-   **[https://tableau.github.io/webdataconnector/Examples/html/StandardConnectionsExample.html](StandardConnections)**

    This connector gets data from multiple tables in a local JSON file and specifies how the tables should be joined in Tableau Desktop.

-   **[https://tableau.github.io/webdataconnector/Examples/html/StockQuoteConnector_promises.html](StockQuoteConnector_promises)**

    This connector gets stock quote data from Yahoo Finance and demonstrates how to use JavaScript
    promises to make several API requests.

-   **[https://tableau.github.io/webdataconnector/docs/wdc_samples.html](IncrementalRefreshConnector)**

    This connector showcases how use the incremental refresh API to fetch data incrementally.

-   **[https://tableau.github.io/webdataconnector/Examples/html/MadMoneyScraper.html](MadMoneyScraper)**

    This connector demonstrates how to scrape data from a table in a web page and bring that data back through
    the WDC API.

-   **OAuthProxyExample**

    This example shows you how to use OAuth as an authentication method.

