---
title: "Tableau WDC 2.0 Released"
abstract: "Version 2.0 of the Tableau WDC is out of beta! This version is compatible with the upcoming release of Tableau 10.0."
---

### Get the latest version
You can get the latest version of the WDC here:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.latest.js
```

There is also a minified version available:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.latest.min.js
```

The above URLs are the recommended ways of linking to the Tableau WDC and guarantee that you receive patch versions for the current minor version as we release them. 
If you prefer to opt out of receiving automatic patch versions, you can link directly to the current patch version, 2.0.5:

```
https://connectors.tableau.com/libs/tableauwdc-2.0.5.js
https://connectors.tableau.com/libs/tableauwdc-2.0.5.min.js
```

### Update beta connectors
If you were one of our wonderful beta adopters, the [tableauwdc-2.0.0-beta.js](https://connectors.tableau.com/libs/tableauwdc-2.0.0-beta.js)
release will remain available to give you time to update your beta connectors. However, the beta version is now officially deprecated. Note that the latest release includes several critical bug fixes and adds locale support. 


### New feature: Locale support
The latest version of the WDC also includes a new locale API that was not part of the beta. 
You can use the locale API to get the language currently set by the user in Tableau Desktop from the **Help > Choose Language** menu. 
This language is accessed through the `tableau.locale` property and can be used to conditionally display translated text in your connector. 

To see the locale API in action, see the new `eathquakeMultilingual` sample in the `Examples` directory of the `webdataconnector` repository.
