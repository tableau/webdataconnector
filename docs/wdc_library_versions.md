---
title: WDC Versions
layout: docs
---

Every web data connector must include a reference to the Tableau WDC
library. You can get the latest version of the WDC here:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.latest.js
```

There is also a minified version available:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.latest.min.js
```

The above URLs are the recommended ways of linking to the Tableau WDC and guarantee that
you receive patch versions for the current minor version as we release them.
If you prefer to opt out of receiving automatic patch versions, you can link directly
to the current patch version, 2.0.5:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.5.js
https://connectors.tableau.com/libs/tableauwdc-2.0.5.min.js
```


Compatibility with versions of Tableau
--------------------------------------

The following table displays which versions of the WDC are compatible with Tableau Desktop:

|WDC version           |Tableau version   |
|----------------------|-----------------|
|`tableauwdc-2.0.0`    |10.0 or later|
|`tableauwdc-1.1.1`    |9.3 <br />9.2.4 or later <br />9.1.6 or later|
|`tableauwdc-1.1.0`    |9.2.0 through 9.2.3 <br />9.1.0 through 9.1.5|

In Tableau Desktop, if you try to open a connector that uses an incompatible version of the WDC,
you might see an error like the following:

```
The version of Tableau that you are using cannot use the web data connector that you are trying to access.
The connector requires at least version 'x.x' of the web data connector API.
```

**Note**: Newer versions of the WDC simulator require later versions
of the WDC library as well.
