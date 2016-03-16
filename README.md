# webdataconnector

Tableau Web Data Connector.  Developer samples and tools.  Also a list of connectors created by the Tableau developer community.

Getting Started
---------------
* Clone this repo if you want to run everything locally (alternatively you can [download everything as a .zip file](https://github.com/tableau/webdataconnector/archive/gh-pages.zip))
* Try the samples (hosted or locally)
* Submit a pull request to share any connectors you've created
* Check out the Tableau Developer Portal at http://developers.tableau.com for WDC docs and forum

Coming Soon!
---------------
Want to see what's coming next for the WDC? In a future Tableau release, we will be releasing version 2.0 of the web data connector API.
This content is currently in beta and you can learn more here! [http://tableau.github.io/webdataconnector](http://tableau.github.io/webdataconnector).

Hosted WDC Simulator
---------------
Currently in development is the WDC API version 2.0.  The biggest change with this version is the addition of support for multiple tables.  We have also siginficiantly refactored the underlying structure of the web data connector API. 

This is a very early version of this feature, we are still under heavy iteration with the design of this API.  There will be some errors and incomplete functionality in the current version.  Please open an issue for any bug you encounter and also please leave feedback through issues as well!  


API Overview
---------------

There are two major changes in version 2 of thew WDC API:
* The API now allows the web data connector to independently bring back multiple tables
* The API waits for the developer to tell it when it's finished gathering data, rather than repeatedly calling getData.

In version 1, at a high level, a connector followed this flow:
 1. WDC loads and runs its interactive phase.  When finished, it calls tableau.submit().
 2. In the data gathering phase, Tableau/Simulator calls connector.getColumnHeaders(), which defines the schema for a single table.  The WDC calls a predefined callback when it finishes defining the schema.
 3. Tableau/Simulator calls connector.getTableData() which returns data through the predefined tableau.dataCallback.
 4. Step 3 is repeated until dataCallback passes a flag to tell Tableau it has no more data.


In contrast, at a high level, version 2 of the API follows this flow:
 1. WDC loads and runs its interactive phase.  When finished, it calls tableau.submit().
 2. In the data gathering phase, Tableau/Simulator calls connector.getSchema, which defines schemas for multiple tables. getSchema is passed a callback that the WDC calls when it has finished defining schemas. 
 3. Tableau/Simulator calls connector.getData.  getData is passed both a callback and list of tables that Tableau/Simulator has requested data for.  Within getData, the WDC developer can add data to any table at any time using a new method called appendRows. 
 4. Whenever the WDC has finished getting all of its data for the requested tables, it calls the passed in doneCallback.


Please consult the beta docs for new API definitions: [Beta docs](https://connectors.tableau.com/docs/API-Docs-2.0.html).

Please see the StockQuotesConnector_final sample as an example of a WDC built with the new API.


Sample Status and ConvertConnector
---------------
The samples have not yet been fully ported over.  Currently, only the StockQuotesConnector_final.html example has been ported to the new API.  This is a work in progress. Additionally, the IncrementalUpdateConnector and StockQuoteConnector_advanced samples have been modified to use a utility script that converts old connectors to the new version of the Library.  To use this convert connector utility in an old WDC, include the js/convert-connector.js script and call _convertConnectorFor12(myConnector) before calling tableau.registerConnector(myConnector).  

We are in the process of making new documentation and step by step tutorials for building WDCs on the new API. 

Name     | Data Source   |  Source Code    |  Hosted URL
-------- |  -------- |  -------- |  -------- 
Incremental Update Connector  |  N/A  |  [Examples](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [IncrementalUpdateConnector.html](https://tableau.github.io/webdataconnector/Examples/IncrementalUpdateConnector.html)
JSON Connector  |  N/A  |  [Examples](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [jsonConnector.html](https://tableau.github.io/webdataconnector/Examples/jsonConnector.html)
Mad Money Scraper Connector  |  Mad Money Stock Picks  |  [Examples](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [MadMoneyScraper.html](https://tableau.github.io/webdataconnector/Examples/MadMoneyScraper.html)
Socrata Connector  |  Socrata  |  [Examples](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [SocrataConnector.html](https://tableau.github.io/webdataconnector/Examples/SocrataConnector.html)
Stock Quote Connector  |  Yahoo! Stock Data  | [Examples](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [StockQuoteConnector_final.html](https://tableau.github.io/webdataconnector/Examples/StockQuoteConnector_final.html)
XML Connector  |  Any XML file  | [Examples](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [xmlConnector.html](https://tableau.github.io/webdataconnector/Examples/xmlConnector.html)


Community Created Connectors
---------------
These are connectors created and maintained by the community.  Not endorsed or supported by Tableau.

Name of Connector     | Data Source   |  Author   |   Source Code    |  Hosted URL
-------- |  -------- |  -------- |  --------  | ---------
AWS CloudWatch | [CloudWatch](https://aws.amazon.com/cloudwatch/) | David F. Severski|  [Tableau WDC for CloudWatch](https://github.com/davidski/tableau-wdc-cloudwatch)  |  N/A
DoubleClick Campaign Manager | [DCM by Google](https://www.doubleclickbygoogle.com/solutions/digital-marketing/campaign-manager/) | [Eric Peterson](https://github.com/iamEAP) | [dcm-dfa-wdc](https://github.com/tableau-mkt/dcm-dfa-wdc) | [DCM/DFA WDC](https://dcm-dfa-wdc.herokuapp.com/)
Elastic Search | [Elastic Search](https://www.elastic.co/products/elasticsearch) | Adam Lacey  |  [mradamlacey](https://github.com/mradamlacey/elasticsearch-tableau-connector)  |  N/A
Fitbit | [Fitbit.com](https://www.fitbit.com/) | Craig Bloodworth  |  N/A  |  [Fitbit WDC](http://data.theinformationlab.co.uk/fitbit.html)
Flickr | [Flickr](https://www.flickr.com/services/api/) | [Zeki Melek](https://github.com/melekzek)  |  [tableau-wdc-flickr](https://github.com/melekzek/tableau-wdc-flickr)  |  N/A
GitHub | [GitHub API](https://developer.github.com/v3/) | [Martin Keerman](https://github.com/etroid) | [github-data-connector](https://github.com/tableau-mkt/github-data-connector) | [GitHub WDC](https://github-web-data-connector.herokuapp.com) 
Google Sheets Connector  |  Google Sheets  |  Ivo Salmre  |  [Source](https://github.com/tableau/webdataconnector/tree/gh-pages/Examples)  |  [GoogleSheetsConnector.html](http://tableau.github.io/webdataconnector/Examples/GoogleSheetsConnector.html)
Import.io | [Import.io](https://www.import.io/) | Robert Rouse  |  N/A  |  [Import.io WDC](http://connectors.poc.interworks.com/importio/importio-magic.html)
Kimono | [Kimono](https://www.kimonolabs.com/) | [Franz Amador](https://github.com/fgamador) | [wdc](https://github.com/fgamador/wdc) | [KimonoConnector.html](https://fgamador.github.io/wdc/KimonoConnector.html)
Last.fm | [Last.fm](http://www.last.fm/) | Justin Dallal  |  [jdallal/LastFM-Web-Data-Connector](https://github.com/jdallal/LastFM-Web-Data-Connector)  |  N/A
Mapbox | [Mapbox.com](https://www.mapbox.com/) | Craig Bloodworth  |  N/A  |  [Mapbox WDC](http://data.theinformationlab.co.uk/directions.html)
Microsoft Health | [Microsoft Health](http://developer.microsoftband.com/cloudAPI) | [Ben Lower](https://github.com/benlower)  |  [tableau-wdc-mshealth](https://github.com/benlower/tableau-wdc-mshealth)  |  N/A
Moves App | [Moves App](https://www.moves-app.com/) | Craig Bloodworth  |  N/A  |  [Moves App WDC](http://data.theinformationlab.co.uk/moves.html)
New Relic Insights | [Insights Query API](https://docs.newrelic.com/docs/insights/new-relic-insights/adding-querying-data/querying-your-data-remotely) | [Eric Peterson](https://github.com/iamEAP) | [insights-data-connector](https://github.com/tableau-mkt/insights-data-connector) | [NR Insights WDC](https://insights-web-data-connector.herokuapp.com/)
Quandl | [Quandl.com](https://www.quandl.com/) | Craig Bloodworth  |  N/A  |  [Quandl WDC](http://data.theinformationlab.co.uk/quandl.html)
Reddit | [Reddit.com](https://www.reddit.com/) | Justin Dallal  |  [jdallal/Reddit-Web-Data-Connector](https://github.com/jdallal/Reddit-Web-Data-Connector)  |  N/A
Runkeeper | [Runkeeper.com](https://runkeeper.com/) | Craig Bloodworth  |  N/A  |  [Runkeeper WDC](http://data.theinformationlab.co.uk/runkeeper.html)
Seattle/King County Restaurant Inspections  | [King County](http://kingcounty.gov/healthservices/health/ehs/foodsafety/inspections/system.aspx) | [Ben Lower](https://github.com/benlower)  |  [tableau-wdc-kcfoodinspection](https://github.com/benlower/tableau-wdc-kcfoodinspection)  |  [foodInspectionWDC.html](http://benlower.github.io/tableau-wdc-kcfoodinspection/foodInspectionWDC.html)
Stripe | [Stripe API](https://stripe.com/docs/api) | [Benji Schwartz-Gilbert](https://github.com/benjisg) | [stripe-web-data-connector](https://github.com/benjisg/stripe-web-data-connector) | [Stripe WDC](https://benjisg.github.io/stripe-web-data-connector/stripe.html) | 
Square | [Square API](https://connect.squareup.com/) | [Samm Desmond](https://github.com/sdesmond46)  |  [WDC](https://github.com/sdesmond46/WDC)  |  [Square WDC](http://webdataconnector.azurewebsites.net/Connectors/Square/)
Tfl BikesPoint | [Tfl.gov](https://tfl.gov.uk/modes/cycling/santander-cycles) | James Dunkerley  |  [jdunkerley](https://github.com/jdunkerley/TableauWebData)  |  [Tfl BikesPoint WDC](http://jdunkerleytableau.azurewebsites.net/Bikes)
Travis CI | [Travis CI API](http://docs.travis-ci.com/api/) | [Eric Peterson](https://github.com/iamEAP) | [travis-data-connector](https://github.com/tableau-mkt/travis-data-connector) | [Travis CI WDC](https://travis-web-data-connector.herokuapp.com)
Trello Kanban | [Trello](https://trello.com/) | [Alex Baldini](https://github.com/abaldini/) | [WDC](https://github.com/abaldini/trello_WDC) | NA
Twitter Users | [Twitter API](https://dev.twitter.com/rest/public) | [Samm Desmond](https://github.com/sdesmond46)  |  [WDC](https://github.com/sdesmond46/WDC)  |  [Twitter WDC](http://webdataconnector.azurewebsites.net/Connectors/Twitter/)
United States Census Data | [Census Data](http://www.census.gov/data/developers/data-sets/decennial-census-data.html) | [Addy  Naik](https://github.com/port80labs)  | [Census WDC](https://github.com/port80labs/census-wdc) |  [Census WDC](https://census-tableau-wdc.herokuapp.com/)

Resources
---------------
Here are a few great WDC resources that might be helpful for developement.

