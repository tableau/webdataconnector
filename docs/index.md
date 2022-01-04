---
title: Get Started
layout: docs
---

A connector gets your data into Tableau, where you can then view and analyze it. Tableau includes dozens of connectors already and also gives you the tools to build new connectors. The Web Data Connector (WDC) is an HTML page with JavaScript code that connects to web data (for example, by means of a REST API), converts the data to a JSON format, and passes the data to Tableau.

<div class="alert alert-info">
    <b>Note:</b> This site is for version 3.x of the WDC API, which is compatible only with Tableau 10.0 and later. Versions 1.x and 2.x of the WDC API, used with earlier versions of Tableau, are no longer supported. For information about version compatibility, see [WDC Versions]({{ site.baseurl }}\docs\wdc_library_versions).
</div>

This section guides you through the process of setting up your development environment and running a sample WDC in the simulator. To best understand what a WDC is, including how to build one, we recommend that you build a sample connector using an included boilerplate. To build a sample connector, perform the following tasks.

* TOC
{:toc}

### Install the dependencies

You need a couple of things before we get started. Make sure you have the following dependencies installed:

* [Git](https://git-scm.com/downloads)
* [node and npm](https://nodejs.org/en/download/)

### Install the Taco Toolkit

1. Open your terminal and enter the following command. 
   ```
   npm install -g taco-toolkit
   ```
   This installs the toolkit globally.

. Change to the directory where you downloaded the repository:

   ```
   cd webdataconnector
   ```

### Run the simulator

1. Install dependencies with `npm`:

   ```
   npm install --production
   ```

   **Note**: You must run the command with administrator or sudo privileges.

1. Start the test web server:

   ```
   npm start
   ```

1. Open a browser and navigate to the following URL:


   ```
   http://localhost:8888/Simulator/index.html
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
