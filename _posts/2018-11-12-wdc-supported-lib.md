---
title: "Support for WDC Libraries to Change in Tableau 2019.1"
abstract: "Web Data Connectors that use versions of the WDC client library (prior to v2.0.2) will display a warning in Tableau 2019.1. When Tableau 2019.2 is released, those WDCs will not run unless they have been updated."
---

Web Data Connectors (WDC) that use versions of the WDC client library (prior to v2.0.2) will display a warning in Tableau 2019.1.

`Warning - This version of the Web Data Connector library is deprecated...`

If you are using a Web Data Connector and see this warning message, contact the developer of the connector directly. When Tableau 2019.2 is released, a WDC that uses one of the specified libraries will not run, unless the developer updates the WDC to use a supported version of the library.

### Versions of the WDC library that will not be supported

Starting in Tableau 2019.1, a WDC that uses one of the following versions of the Web Data Connector client library (`tableauwdc-x.x.x.js`) will display the warning message that the library has been deprecated and will not be supported in Tableau 2019.2:

- 1.x (all versions)
- 2.0.0
- 2.0.1

In Tableau 2019.2, any Web Data Connectors that uses one of the deprecated libraries will stop working.

### Information for developers

 If you are a developer of a Web Data Connector, refer to the migration guide for the steps to upgrade from version 1.x, see [Upgrading from WDC Version 1.x]({{ site.baseurl }}\docs\wdc_upgrade). To find and use the latest version of the Web Data Connector client library, see [WDC Versions]({{ site.baseurl }}\docs\wdc_library_versions).

### The reason for this change

Web Data Connectors are JavaScript-based components written by third-party developers to build data connectors for Tableau. Web Data Connectors use an internal browser in Tableau called Qt WebKit. In Tableau 2019.2, Web Data Connectors will use Qt WebEngine (a Chromium-based browser), a significant upgrade over Tableau’s current browser. WDC developers will benefit from this upgrade with the ability to use modern JavaScript, and Chrome developer tools for debugging WDC code.

The earlier versions of the Web Data Connector client library were not designed for use under Qt WebEngine. Therefore, Tableau will no longer support these versions in future releases.
