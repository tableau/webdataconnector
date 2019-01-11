---
title: WDC Samples
layout: docs
---

The Web Data Connector comes with sample connectors that you can use to learn about specific features of the WDC API.
The samples are in the `Examples` folder of the `webdataconnector` repository. You can see the repository
online [here](https://github.com/tableau/webdataconnector/tree/master).

-   **[earthquakeUSGS](https://tableau.github.io/webdataconnector/Examples/html/earthquakeUSGS.html)**

    This is the default connector when you open the simulator. Instructions for building it are in the [Tutorial]({{ site.baseurl }}/docs/wdc_tutorial.html). It connects to the USGS Earthquake feed and gets data about earthquakes in the last week.

-   **[earthquakeMultitable](https://tableau.github.io/webdataconnector/Examples/html/earthquakeMultitable.html)**

    This connector builds on the previous one to showcase how to get data into multiple tables from a data source.

-   **[earthquakeMultilingual](https://tableau.github.io/webdataconnector/Examples/html/earthquakeMultilingual.html)**

    This connector demonstrates how to use the locale property of the tableau object to localize content.

-   **[StandardConnections](https://tableau.github.io/webdataconnector/Examples/html/StandardConnectionsExample.html)**

    This connector gets data from multiple tables in a local JSON file and specifies how the tables should be joined in Tableau Desktop.


-   **[IncrementalRefreshConnector](https://tableau.github.io/webdataconnector/Examples/html/IncrementalRefreshConnector.html)**

    This connector showcases how use the incremental refresh API to fetch data incrementally.



-   **[OAuthProxyExample](https://github.com/tableau/webdataconnector/tree/master/Examples/OAuthProxyExample)**

    This example shows you how to use OAuth as an authentication method.

