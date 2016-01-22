# Tableau WDC Separate Phase Simulator 

This is an experimental new version of the Tableau WDC simulator.  Please see the original webdataconnector repo for more details about WDC.  [Hosted Simulator](http://dbecks.github.io/webdataconnector/simulator)

Notable Features
---------------
* Simulator re-written as a React app
* The interactive and data gathering phases run in different contexts, just like in Tableau.
* The interactive phase runs in a popup instead of an iframe, which means debugging OAuth flows is now possible.
* The two phases can be ran independently.
* Updated UI.

Updated tableauwdc API
---------------
This new version of the simulator will only run web data connectors that are written using the version 1.2.0 of the tableauwdc javascript API.  This file can be found hosted here: [http://dbecks.github.io/webdataconnector/js/tableauwdc-1.2.0.js](http://dbecks.github.io/webdataconnector/js/tableauwdc-1.1.1.js).


Feedback Requested
---------------
Please open tracking issues for any found bugs or improvement requests.  Please also view the issues tab for all current known issues.
