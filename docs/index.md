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

### Building a sample WDC connector

This section guides you through the process of setting up your development environment and building a sample WDC in the simulator.

To best understand what a WDC is, including how to build one, we recommend that you build a sample connector using a boilerplate included in the Taco Toolkit. To build a sample connector, perform the following tasks.


1. Make sure you have the following dependencies installed:
    * [node version 16 and npm version 7 and above](https://nodejs.org/en/download/)


1. Open your terminal and type the following command to install the TACO Toolkit:

   ```
   npm install -g taco-toolkit
   ```
   This installs the toolkit globally. The Taco Toolkit includes:
    * Taco CLI
    * WDC boilerplate connector
    * WDC 3.0 SDK
    * Various utitlities for building, packaging, and signing your connectors

1. Verify the install by typing the following:

   ```
   taco
   ```
   This command returns the CLI version.
   
   <!--  Troubleshooting: Python not needed until you package the connector. Java is not required until you sign the connector.   -->
   <!-- This is a working sample connector vs. the starter connector we will explain in detail later. -->

1. Navigate to the root directory of the connector and enter the following command to create the connector:

   ```
   taco create myConnector --earthquake-data
   ```

   This creates a folder with the earthquake data boilerplate code, which is included with the toolkit.

1. Change directories to the myConnector directory.
   ```
   cd myConnector
   ```
   
1. Build the connector by entering the following command:

   ```
   taco build
   ```
   This clears any previous or existing build caches, then installs the dependencies, then builds the frontend code and the backend code (handlers), then copies the connector.json file (the configuration file).
   
   <!--   Scot: link terms to gloss or defined elsewhere: handlers, frontend, backend  
   This has created an unpackaged connector. -->
   
1. Create the Taco file
   ```
   taco pack
   ```
   This creates the .taco file

1. Type the following command to run the connector:

   ```
   taco run --desktop
   ```
   This starts Tableau Desktop with the appropriate command line parameters pointing it to your newly created connector. 
  
   
1. Launch the connector in Tableau Desktop.
   You will see a link to your connector in Tableau's list of connectors, earthquake-data by Salesforce. 
   Click on the link to see your dialog.
   EPS loads your default system browser to show the connector UI. This is considered the interactive phase/mode(?).
   
   <!--  Include image of Tableau connectors with link.   -->
   
   <!--  Scot: get correct term: mode/phase   -->

1. Click the **Get Earthquake Data** button.
   Clicking this button closes the browser window. 
<!--     -->
<!--  This piece will be important when customizing their own connector: transitions to the extract mode/phase, launching the extractor process that is isolated to this single instance of your connector. The fetcher and parser are executed in this isolated process that runs in a sandbox. -->



*Ready to make your own connector? Jump to the [WDC Tutorial]({{ site.baseurl }}/docs/wdc_tutorial).*
Want to learn more about the Taco Toolkit? See the reference (link here).
