---
title: "Tableau 10.0 Release and WDC Updates"
abstract: "Use your 2.0 connectors in Tableau 10.0 and get the latest WDC updates."
---

### Upgrade to Tableau 10.0
You can now use connectors made with version 2.0 of the WDC API in Tableau! 
Learn more about how to upgrade to Tableau 10.0 and about the new features available here: [Get Tableau 10](http://www.tableau.com/new-features/10.0).


### GitHub Changes
Version 2.0 of the WDC API is now the latest released version of the WDC API. 
Because of this, the dev branch of the WDC GitHub repository has been merged into master, and master now represents version 2.0.
You can still access earlier versions of the WDC SDK through our release tags on GitHub.  

There are a few ramifications of this: 

* The hosted v1 samples are now deprecated (though we will continue to host them for some time to avoid any inconvenience).
* The hosted v1 simulator has been removed from our github.io page.
* Development for version 2.1 of the WDC SDK is now underway in the dev branch.

****

To be clear, we still support the v1 samples and simulator.  These will continue to be usable (and found through our GitHub release tags). 
These samples and simulator are still helpful when developing v1 WDCs - for Tableau 9.3 and earlier.  WDC v1 documentation can be found [here](http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/help.htm).
But we are no longer hosting these, to keep our GitHub branches in sync with the current version of the API. 

### 2.0.8 Patch Notes
We have also released a new patch of the WDC API. This can be found here:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.8.js
https://connectors.tableau.com/libs/tableauwdc-2.0.8.min.js
```

Here is a list of changes since the last released patch (2.0.5):

* Bug Fix: authPurpose attribute was missing from the shim, resulting in this attribute not being accessible in the simulator.
* Bug Fix: fixed two instances where context was not properly set.
* Bug Fix: missing underscore typo fix.