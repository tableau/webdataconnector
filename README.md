# Tableau WDC for Centrifuge

This fork of the Tableau WDC is set up to allow analysts to download data from Centrifuge api endpoints to use in Tableau.

To run this on the simulator locally, download, install, and run with `npm start`. To use your local Centrifuge, uncomment the line with the url in `centrifugeWDC.js`. You will need to sign in with the email you use for Centrifuge and your user token. See a member of the dev team if you do not have this token.

We are using a quick custom form to auth each request with Centrifuge due to an issue with WDC https://github.com/tableau/webdataconnector/issues/160

## Deploy Information

TODO

# Tableau Web Data Connector SDK
[![Tableau Supported](https://img.shields.io/badge/Support%20Level-Tableau%20Supported-53bd92.svg)](https://www.tableau.com/support-levels-it-and-developer-tools) [![Coverage Status](https://coveralls.io/repos/github/tableau/webdataconnector/badge.svg?branch=master)](https://coveralls.io/github/tableau/webdataconnector?branch=master) [![Build Status](https://travis-ci.org/tableau/webdataconnector.svg?branch=master)](https://travis-ci.org/tableau/webdataconnector)

Use the Tableau Web Data Connector (WDC) to connect to web data sources from Tableau. This is the repository for the Tableau WDC SDK, which includes developer samples and a simulator to help you create your connectors.

[Visit the project website and documentation here](http://tableau.github.io/webdataconnector/).

Want to contribute to the WDC? See our [contribution guidelines](http://tableau.github.io/).
