---
title: Use a WDC in Tableau Server
layout: docs
---

You can use your web data connector (WDC) on Tableau Server as you would any other data source. You can publish the web data connector as a data source, or you can publish a workbook that embeds your connector as the data source.  

When you use a web data connector, Tableau creates an extract of the data. You can refresh the extract in Tableau Desktop. However, to be able to refresh the extract on Tableau Server, there are a couple of other considerations.

- If your web data connector requires authentication, you need to embed the credentials when you publish the data source or workbook. This is because the refresh can occur on a schedule or in some other background context, and the server cannot prompt for credentials. You should store credentials in `tableau.username` and `tableau.password` as these fields are encrypted. Do not use `tableau.connectionData` for sensitive information as this field is stored in plain text.

- You need to ensure that your web data connector is added to the safe list, and also ensure that the secondary safe list includes the domains that the connector can send requests to and receive requests from (external JavaScript libraries, local files, REST APIs). Because a WDC contains JavaScript and typically connects to other sites, you need to work with the Tableau Server administrator to test and verify the connector is safe to use. 
After verifying the WDC, the Tableau Server administrator can use the Tableau Services Manager (TSM) command line interface (CLI) to allow the WDC on the Tableau Server.

    For example, a Tableau Server administrator might use the following TSM command to add the sample USGS EarthQuake data connector to the safe list. This command also adds a secondary safe list that includes the domains of the libraries and sources that the WDC makes use of. You can't use wildcards in the primary URL (`--url`), but you can use wildcards (`.*`) in the secondary safe list (`--secondary`).

    ```
    tsm data-access web-data-connectors add --name "USGS Earthquakes" --url https://tableau.github.io:443/webdataconnector/Examples/html/earthquakeUSGS.html --secondary https://tableau.github.io/.*,https://earthquake.usgs.gov/.*,https://maxcdn.bootstrapcdn.com/.*,https://ajax.googleapis.com/.*,https://connectors.tableau.com/.*
    ```

- For security, consider using HTTPS protocol for the connector and all external libraries that your web data connector uses.

For more information, see [Web Data Connectors in Tableau Server](http://onlinehelp.tableau.com/current/server/en-us/datasource_wdc.htm){:target="_blank"} and [Testing and Vetting Web Data Connectors](http://onlinehelp.tableau.com/current/server/en-us/datasource_wdc_vetting.htm){:target="_blank"} in the Tableau Server Help.

