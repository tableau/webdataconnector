---
title: WDC Samples
layout: docs3
---
{% include prelim_note.md %}

* TOC
{:toc}

The Web Data Connector comes with sample connectors that you can use as templates to build your own connector. Also, these sample connectors help you can learn about specific features of the WDC SDK.
The samples are built using the TACO Toolkit. 

 - [Default connector](wdc_create_connector.html) 
 
    This is the default connector when you created the first connector. This connector connects to the United States Geological Survey (USGS) Earthquake feed and gets data about earthquakes in the last week.

- [Basic authentication connector](wdc_create_basic_auth_connector.html) 

    This connector shows you how to create your own connector authorized by username and password.

 - [Custom authentication connector](wdc_create_custom_auth_connector.html) 
 
    This connector shows how to create your own custom authorization connector.


 - [OAuth connector](wdc_create_oauth_connector.html) 
 
    This connector demonstrates how to use the locale property of the Tableau object to localize content. For more information about how Tableau handles data connection with OAuth, see [OAuth Connections](https://help.tableau.com/current/server/en-us/protected_auth.htm){:target="_blank"} in the Tableau Server help.

 - [Multi-table connector](wdc_create_multitable_connector.html) 
 
    This connector builds on the default connector to show how to get data into multiple tables from a data source.

 - [React connector](wdc_create_react_connector.html) 
 
    This connector shows you how to use build a React connector.

