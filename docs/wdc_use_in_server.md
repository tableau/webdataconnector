---
title: Use a WDC in Tableau Server
layout: docs
---

You can use your web data connector (WDC) on Tableau Server as you would any other data source. You can publish the web data connector as a data source, or you can publish a workbook that embeds your connector as the data source.  

When you use a web data connector, Tableau creates an extract of the data. You can refresh the extract in Tableau Desktop. However, to be able to refresh the extract on Tableau Server, there are a couple of other considerations. 

- You need to ensure that your web data connector is added to the safe list. Because a WDC contains JavaScript and typically connects to other sites, you need to work with the Tableau Server administrator to test and verify the connector is safe to use. 

- If your web data connector requires authentication, you need to embed the credentials when you publish the data source or workbook. This is because the refresh can occur on a schedule or in some other background context, and the server cannot prompt for credentials.

- For security, consider using HTTPS protocol for the connector and all external libraries that your web data connector uses.     

For more information, see [Web Data Connectors in Tableau Server](http://onlinehelp.tableau.com/current/server/en-us/datasource_wdc.htm){:target="_blank"} and [Testing and Vetting Web Data Connectors](http://onlinehelp.tableau.com/current/server/en-us/datasource_wdc_vetting.htm){:target="_blank"} in the Tableau Server Help. 

