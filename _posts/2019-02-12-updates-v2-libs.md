---
title: "Version 2.3.1, 2.2.2 & 2.1.4 Patch Notes"
abstract: "Fix incorrect assignment of webchannel objects to <code>window.tableau</code>"
---


In support of a future release of Tableau, we have released a new patch for the WDC API. The files can be found here:

```
https://connectors.tableau.com/libs/tableauwdc-2.3.1.js
https://connectors.tableau.com/libs/tableauwdc-2.3.1.min.js
https://connectors.tableau.com/libs/tableauwdc-2.2.2.js
https://connectors.tableau.com/libs/tableauwdc-2.2.2.min.js
https://connectors.tableau.com/libs/tableauwdc-2.1.4.js
https://connectors.tableau.com/libs/tableauwdc-2.1.4.min.js

```

The only change in the patch is that instead of redeclaring `window.tableau` to point to webchannel objects, we are now explicitly copying over the needed `tableau` properties. This is required so that the original reference of `window.tableau` is not lost. Note this only affects customers who are using a version of Tableau with WDC WebEngine enabled (in a future release of Tableau).
 
