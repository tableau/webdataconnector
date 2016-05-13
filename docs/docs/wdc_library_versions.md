---
layout: page
title: Web Data Connector Library Versions
base: docs
---

Every web data connector must include a reference to the Tableau WDC
JavaScript library. For example, the HTML page for a connector typically
includes an element like the following:

```html
<script src="https://connectors.tableau.com/libs/tableauwdc-2.0.0-beta.js" type="text/javascript"></script>
```

Occasionally a new version of the WDC JavaScript library is released.
You can always get the most current version of the library from the
[connectors.tableau.com](connectors.tableau.com) site, using the URL in the preceding example.


Compatibility with versions of Tableau
--------------------------------------

You can use connectors in Tableau Desktop, starting with
version 9.1. Later versions of the WDC library are compatible with later
versions of Tableau, as shown in the following table:

|WDC library version   |Tableau version   |
|----------------------|-----------------|
|`tableauwdc-2.0.0`    |10.0 or later|
|`tableauwdc-1.1.1`    |9.3 <br />9.2.4 or later <br />9.1.6 or later|
|`tableauwdc-1.1.0`    |9.2.3 or earlier <br />9.1.5 or earlier |

If you try to use an earlier version of Tableau to connect to a web data
connector that uses an incompatible version of the library, the
connection will not succeed and you will see this error:

```
The version of Tableau that you are using cannot use the web data connector that you are trying to access. 
The connector requires at least version '1.1.1' of the web data connector API.
```

**Note**: Newer versions of the [web data connector
simulator](wdc_simulator.html) that's part of the SDK require later
versions of the JavaScript library.
