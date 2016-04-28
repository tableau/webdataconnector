---
layout: page
title: Using a Web Data Connector in Tableau
base: docs
---

-   [Using a web data connector in Tableau
    Desktop](#using-wdc-in-tableau-desktop)

-   [Sharing a web data connector on Tableau
    Server](#sharing-wdcs-on-server)

-   [Suppressing the non-connector URL
    warning](#alerting-users-to-non-wdc-urls)

Using a web data connector in Tableau Desktop {#using-wdc-in-tableau-desktop}
---------------------------------------------

Users working with Tableau Desktop can use a web data connector much
like they use other connectors. When they connect to data, they select
the <span class="ui">Web Data Connector</span> option and then enter the
URL of the connector's HTML page. (The URL must use the HTTP or HTTPS
protocol, which means that the connector's HTML page must be requested
from a web server.)

![]({{ site.baseurl }}assets/wdc_desktop_use_connector.png)

For more information, see [Web Data
Connector](http://onlinehelp.tableau.com/current/pro/online/windows/en-us/help.html#examples_web_data_connector.html)
in the Tableau Desktop documentation.

Sharing a web data connector on Tableau Server {#sharing-wdcs-on-server}
----------------------------------------------

If multiple people in a workgroup want to use the same web data
connector, or if users want to create an extract and then be able to
refresh it on the server, the connector can be *imported* into Tableau
Server. This process copies the connector to the server and provides a
URL that users can specify when they want to use the connector.

For more information, see [Web Data Connectors in Tableau
Server](http://onlinehelp.tableau.com/current/server/en-us/help.html#datasource_wdc.html)
in the Tableau Server documentation.

Suppressing the non-connector URL warning {#alerting-users-to-non-wdc-urls}
-----------------------------------------

Starting in version 9.1.1 of Tableau Desktop, Tableau can help users
make sure that they're connecting to a valid web data connector. When
users connect, Tableau alerts users using a red banner if they enter a
URL that does not point to a web data connector:

![]({{ site.baseurl }}assets/example_wdc_error.png)

Under some circumstances, you might want to suppress this banner. A
typical example is that you have a portal page that lists a collection
of web data connectors that users can select from. When users enter the
URL of your portal page, Tableau will correctly detect that the page is
not a web data connector and display the warning. However, in this case,
the URL is valid from the user's perspective, and users shouldn't see
the banner.

**Note** Users are able to select a web data connector from your portal
page, and it will work. However, they will see the banner.

To suppress the banner, you can add the following JavaScript code to the
end of the `<head>` element in your portal page.

    <script src="https://public.tableau.com/javascripts/api/tableauwdc-1.1.1.js" type="text/javascript"></script>
    <script type="text/javascript">
        (function() {
            var myConnector = tableau.makeConnector();
            myConnector.getColumnHeaders = function() {}
            myConnector.getTableData = function(lastRecordToken) {}
            tableau.registerConnector(myConnector);
        })();
    </script>

In effect, this code indicates to Tableau that the page is a valid web
data connector. Therefore, Tableau does not display the banner.
