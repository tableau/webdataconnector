---
title: Get Started
layout: docs
---

Create a Web Data Connector (WDC) when you want to connect to a web data source from Tableau. A WDC is an HTML page
with JavaScript code that connects to web data (for example, by means of a REST API), converts the data to a JSON format,
and passes the data to Tableau.

<div class="alert alert-info">
    <b>Note:</b> This site is for version 3.x of the WDC API, which is compatible only with Tableau 2022.2 and later. Versions 1 and 2 of the WDC API, used with earlier versions of Tableau, are no longer supported.  
</div>

-----

<!-- There is no upgrade path. 

**Upgrading from previous WDC versions**
 
If you have connectors that were created using WDC versions 1.x or 2.x, those connectors might not work in later versions of Tableau. If you want your connector to work in later versions of Tableau, or if you want to use the features available in version 3.x of the WDC, you must to create a new connector. For information about version compatibility, see [WDC Versions]({{ site.baseurl }}\docs\wdc_library_versions). -->


-----

### Building a sample WDC connector

This section guides you through the process of setting up your development environment and building a sample WDC in the simulator.

To best understand what a WDC is, including how to build one, we recommend that you build a sample connector using a boilerplate included in the Taco Toolkit. To build a sample connector, perform the following tasks.


1. Make sure you have the following dependencies installed:
    * [Git](https://git-scm.com/downloads)
    * [node and npm](https://nodejs.org/en/download/)

<!--- Have we ever had anyone needing more help with these? Should we document more, or just let them figure it out? --->

2. Open your terminal and type the following command to install the TACO Toolkit:

   ```
   npm install -g taco-toolkit
   ```
   This installs the toolkit globally.

3. Verify the install by typing the following:

   ```
   taco
   ```
   This command returns the CLI version. If you don’t see a version, do???

4. Navigate to the root directory of the connector and enter the following command to create the connector:

   ```
   taco create myConnector —earthquake-data
   ```

   This creates a boilerplate file  with the earthquake data file included with the toolkit.

5. Navigate to the myConnector directory and build the connector by entering the following command:

   ```
   taco build
   ```

6. Type the following command to run the connector:


   ```
   taco run --emulator
   ```

   The WDC simulator appears.

   ![]({{ site.baseurl }}/assets/wdc_simulator_new_first_open.png)

**Note**: The `npm start` command also starts a test proxy server on port 8889 that you can route requests through in order to
circumvent Cross Origin Resource Sharing (CORS) restrictions. For more information, see
[Working with CORS]({{ site.baseurl }}/docs/wdc_cors).

### Try the sample WDCs

1. In the WDC URL field, confirm that the URL is set to the sample USGS
   Earthquake Data connector:

   ```
   ../Examples/html/earthquakeUSGS.html
   ```

   Alternatively, look in the Examples directory for more sample connectors.

1. Click the **Start Interactive Phase** button to display the user interface for the earthquake WDC.

1. Click the **Get Earthquake Data** button.

1. Click the **Fetch Table Data** button to download the data and display it in a table.


*Ready to make your own connector? Jump to the [WDC Tutorial]({{ site.baseurl }}/docs/wdc_tutorial).*
