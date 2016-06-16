---
layout: page
title: WDC Overview
base: docs
---

Create a Web Data Connector (WDC) when you want to connect to a web data source from Tableau. A WDC is just an HTML page with JavaScript code that connects to web data (for example by means of a REST API), converts the data to a JSON format, and passes the data to Tableau. 

Get Started
-----------
This section will guide you through the process of setting up your development environment and running the sample WDCs in the simulator.

* [Confirm prerequisites](#confirm-prereqs)
* [Get the WDC SDK](#get-wdc)
* [Run the simulator](#run-sim)
* [Try the sample WDCs](#try-samples)

### Confirm prerequisites {#confirm-prereqs}

You're going to need a couple of things before we get started. Make sure you have the following dependencies installed:

* [Git](https://git-scm.com/downloads)
* [node and npm](https://nodejs.org/en/download/)

### Get the WDC SDK {#get-wdc}

1. Open a terminal in the directory where you want to download the WDC SDK. Then, run the following command to clone the WDC git repository:

   ```
   git clone https://github.com/tableau/webdataconnector.git
   ```

1. Change into the directory for the downloaded repository:

   ```
   cd webdataconnector
   ```

1. Because this is the beta version of the WDC, you need to get the dev branch:

   ```
   git checkout dev
   ```

   You should see the following message:

   ``` 
   $ git checkout dev
   Branch dev set up to track remote branch dev from origin.
   Switched to a new branch 'dev'
   ```

### Run the simulator {#run-sim}

1. Install dependencies with `npm`:

   ```
   npm install
   ```

2. Start the test web server:

   ```
   npm start
   ```

3. Open a browser and navigate to the following URL:

   
   ```
   http://localhost:8888/Simulator/index.html 
   ```

   The WDC simulator appears!

   ![]({{ site.baseurl }}/assets/wdc_simulator_new_first_open.png){:width="650px"}


**Note**: The `npm start` command also starts a test proxy server on port 8889 that you can route requests through to circumvent Cross Origin Resource Sharing (CORS) restrictions. For more information, see [Managing CORS in WDCs]({{ site.baseurl }}/docs/wdc_cors).

### Try the sample WDCs {#try-samples}

1. In the WDC URL field, confirm that the URL is set to the sample USGS Earthquake Data connector:
   
   ```
   ../Examples/html/earthquakeUSGS.html
   ```

   Alternatively, look in the Examples directory for more sample connectors.

1. Click the **Start Interactive Phase** button to display the user interface for the earthquake WDC.

1. Click the **Get Earthquake Data** button.

1. Click the **Fetch Table Data** button to download the data and display it in a table.


*Ready to make your own connector? Jump to the [WDC Tutorial]({{ site.baseurl }}/docs/wdc_tutorial).*
