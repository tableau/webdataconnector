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
You can run the Simulator locally or use the hosted one here:

[Hosted WDC Simulator](http://tableau.github.io/webdataconnector/Simulator/)

On WDC Versioning
---------------
The hosted simulator requires that web data connectors be using version 1.1.1 of the WDC API. If you need to run a WDC that uses 1.1.0, you can use the [old simulator](http://tableau.github.io/webdataconnector/Simulator/old_simulator.html).

In Tableau Desktop versions 9.1 and 9.2, we had a bug that caused the WDC platform to not respect versioning.  If you are using a Desktop verion before 9.1.6 or before 9.2.4, you will see the following error when connecting to a WDC using 1.1.0.  "The version of Tableau that you are using cannot use the web data connector that you are trying to access. The connector requires at least version '1.1.1' of the web data connector API."  Please upgrade to the latest maintenance patch if you encounter this.

All of the hosted development samples have been upgraded to 1.1.1 so that they can be used in the new simulator.  However, we left the Google Sheets sample at 1.1.0 to minimize the impact for users who are actively using this web data connector and have not yet upgraded to the latest maintenance version.  The Google Sheets example has also been moved into the community section to reflect this.

Soon we will be incrementing the WDC API more frequently, so we will add a lookup table here that shows which WDC API versions work with which Tableau Desktop and Server versions. Moving forward, a specific Desktop minor version, i.e. 9.3, will work with any WDC of the corresponding minor version (9.3.* will work with 1.1.*).


Official Tableau WDC Samples
---------------
These are the samples created and maintained by Tableau.

"Hosted URL" can be used to run the connector in Tableau or in the Simulator.

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

Resource     | Author   |  Type    
-------- |  -------- |  --------
[Better WDC Performance with Promises](https://www.eric.pe/terson/engineers/better-wdc-performance-with-promises?utm_source=Twitter&utm_medium=Social&utm_campaign=Links&utm_source=Hootsuite&utm_medium=Social&utm_campaign=TableauSocial&hootPostID=968bfaeedfa4bcfb2e9087393c8f2c70)  |  [Eric Peterson](https://github.com/iamEAP)  |  Tutorial
[generator-web-data-connector](https://www.npmjs.com/package/generator-web-data-connector)  |  [Eric Peterson](https://github.com/iamEAP)  |  Development Tools
