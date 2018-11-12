---
title: WDC Versions
layout: docs
---

Every web data connector must include a reference to the Tableau WDC
library. You can get the latest version of the WDC here:

```
https://connectors.tableau.com/libs/tableauwdc-2.3.latest.js
```

There is also a minified version available:

```
https://connectors.tableau.com/libs/tableauwdc-2.3.latest.min.js
```

The above URLs are the recommended ways of linking to the Tableau WDC and guarantee that
you receive patch versions for the current minor version as we release them.
If you prefer to opt out of receiving automatic patch versions, you can link directly
to a specific patch version, for example:

```
https://connectors.tableau.com/libs/tableauwdc-2.1.1.js
https://connectors.tableau.com/libs/tableauwdc-2.1.1.min.js
```


Compatibility with versions of Tableau
--------------------------------------

The following table displays which versions of the WDC are compatible with Tableau Desktop:

|WDC version           |Tableau version   |
|----------------------|-----------------|
|`tableauwdc-2.3.0`    |10.4 or later|
|`tableauwdc-2.2.0`    |10.2 or later|
|`tableauwdc-2.1.0`    |10.1 or later|
|`tableauwdc-2.0.2`    |10.0 and later |
|`tableauwdc-2.0.0`    |10.0 through 2019.1 |
|`tableauwdc-1.1.1`    |9.3 through 2019.1<br />9.2.4 through 2019.1 <br />9.1.6 through 2019.1|
|`tableauwdc-1.1.0`    |9.2.0 through 9.2.3 <br />9.1.0 through 9.1.5|

In Tableau Desktop, if you try to open a connector that uses an incompatible version of the WDC,
you might see an error like the following:

```
The version of Tableau that you are using cannot use the web data connector that you are trying to access.
The connector requires at least version 'x.x' of the web data connector API.
```

<div class="alert alert-info">
    <b>Note:</b> This site is for version 2 of the WDC, and will only be compatible with Tableau 10.0 and later. For
    information about version 1 of the WDC, see the archived <a href="http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/help.htm" style="text-decoration:underline;">documentation</a>
    and <a href="https://github.com/tableau/webdataconnector/releases/tag/v1.1.0" style="text-decoration:underline;">simulator</a>. 
    
</div>
If you are a developer, see [Upgrading from WDC Version 1.x]({{ site.baseurl }}\docs\wdc_upgrade) for information about migrating your WDC to version 2.
