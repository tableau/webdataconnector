---
title: "First Official 2.0 API Published"
abstract: "In preparation for the upcoming release of Tableau 10.0, we have published the first official 2.0 WDC Library."
photoname: "blog_version2.png"
---

### Beta version is now deprecated
The version of the WDC API that was used in beta - [https://connectors.tableau.com/libs/tableauwdc-2.0.0-beta.js](https://connectors.tableau.com/libs/tableauwdc-2.0.0-beta.js)
- is now deprecated as we move towards the launch of Tableau 10.0.

We will not take down that version any time soon, but please transition your connectors to use the first official supported 2.0 release, tableauwdc-2.0.5. 
This version contains a number of critical bug fixes.


### Please upgrade to a new version

We have four files that have been published.  Please use whichever version you prefer.  The .latest files will always point to the latest patch version of a given minor release of the API.  

- [https://connectors.tableau.com/libs/tableauwdc-2.0.5.js](https://connectors.tableau.com/libs/tableauwdc-2.0.5.js)
- [https://connectors.tableau.com/libs/tableauwdc-2.0.5.min.js](https://connectors.tableau.com/libs/tableauwdc-2.0.5.min.js)
- [https://connectors.tableau.com/libs/tableauwdc-2.0.latest.js](https://connectors.tableau.com/libs/tableauwdc-2.0.latest.js)
- [https://connectors.tableau.com/libs/tableauwdc-2.0.latest.min.js](https://connectors.tableau.com/libs/tableauwdc-2.0.latest.min.js)


### Added feature: Locale support
One new 2.0 feature that was missing from the 2.0.beta file was the new locale API.  In WDC version 2, you can read the locale 
property from the API through tableau.locale.  This property is based on the Language that the user has set within Tableau through "Help -> Choose Language".
For example, if a Tableau user has selected "English" from the help dropdown, the tableau.locale property will be "en-us".

You can use the locale property to localize your WDC content for your users.