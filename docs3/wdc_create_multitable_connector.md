---
title: Create a Multiple Table Connector
layout: docs3
---
{% include prelim_note.md %}

To create your multiple table connector, we recommend that you first create a sample multiple table connector and edit the generated files. It's easier to get all the files and directory structure your connector needs by just using an existing example.

* TOC
{:toc}

To create your multiple table connector, do the following steps.
## Step 1: Create a boilerplate multiple table connector

1. Enter the following command to create the connector:

   ```
   taco create myMultitableConnector --multi-table
   ```

   This creates a directory with the earthquake data boilerplate code, which is included with the toolkit.

1. Change directories to the myMultitableConnector directory.
   ```
   cd myMultitableConnector
   ```
   
1. Build the connector by entering the following command:

   ```
   taco build
   ```
   This command clears any previous or existing build caches, then installs the dependencies, then builds the frontend code and the backend code (handlers), then copies the connector.json file (the configuration file).
   
## Step 2: Configure your connector's properties

In your new multiple table connector directory, find and open the `connector.json` file. 
```json
{
  "name": "earthquake-multi-table",
  "version": "1",
  "tableau-version": {
    "min": "2022.2",
    "max": "*"
  },
  "vendor": {
    "name": "vendor-name",
    "support-link": "https://vendor-name.com",
    "email": "support@Salesforce.com"
  },
  "permission": {
    "api": {
      "https://*.usgs.gov/": ["GET", "POST", "HEAD"]
    }
  },
  "auth": {
    "type": "none"
  },
  "window": {
    "height": 800,
    "width": 600
  }
}
```

Make the following changes:

1. Change the general properties.

   | Name | Value |
   |------|-------|
   | name | Your connector's name |
   | version | Your connector's version |
   | min | The earliest Tableau version your connector supports |
   | max | The latest Tableau version your connector supports. Enter `*` for the current version. |

1. Change the company properties.

   | Name | Value |
   |------|-------|
   | vendor.name | Your company name |
   | vendor.support-link | Your company's URL |
   | vendor.email | Your company's email |

1. Change the permissions.

   | Name | Value |
   |------|-------|
   | permission.api | The URI for the API that the connector is allowed to access, along with the methods (POST, GET, PUT, PATCH, DELETE) that the connector is allowed to use. |

1. Change the authentication type.

   | Name | Value |
   |------|-------|
   | auth.type | Accepted values are `api-key`, `basic-auth`, `custom`, `none`, and `oauth2`. |
   
   For more information about authentication, see [Authentication]({{ site.baseurl }}/docs3/wdc_authentication) topic.

1. Change the HTML pane size.

   | Name | Value |
   |------|-------|
   | window.height | The height of the connector HTML pane |
   | window.width | The width of the connector HTML pane |

## Step 3: Create the user interface
When you open a web data connector in Tableau, the connector displays an HTML page that links to your JavaScript code and to your connector's handlers.
Optionally, this page can also display a user interface for your users to select the data that they want to download.

To create a user interface for your connector, open the `/app/index.html` file. 
```html
<!DOCTYPE html>
<html>

<head>
  <title>USGS Earthquake Feed</title>
  <meta http-equiv="Cache-Control" content="no-store" />
  <link rel="shortcut icon" href="#" />
  <link href="index.css" rel="stylesheet" />
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  <script src="index.js" type="module"></script>
</head>

<body style="background-color: white;">
  <p id="error" style="display: block; margin-top: 2em; height: 5px; text-align: center; color: red;"></p>
  <div class="box">
    <button type="button" id="submitButton" disabled>Please wait while settings
      load...</button>
  </div>
  </div>
</body>

</html>
```

Let's run through what the code is doing. Skipping over the standard markup for an HTML page, notice the
following between the `head` tags:

* The `meta` tag prevents your browser from caching the page.
* The `index.css` and `toastify.min.js` files are used to simplify styling and formatting.
* The `index.js` file is the code for your connector.

Between the `body` tags, there is a simple button element that illustrates how users can interact with your connector
before getting data. In the next step, we'll configure what happens when that button is clicked.

## Step 4: Edit the connector object
Now that you've created a user interface, it's time to edit the JavaScript code for the connector's button. First, open the `/app/index.js` file. 

``` js
import Connector from 'taco-toolkit'

function onInitialized() {
  const elem = document.getElementById('submitButton')
  elem.innerText = 'Get Earthquake Data!'
  elem.removeAttribute('disabled')
}

const connector = new Connector(onInitialized)

function submit() {
  const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'

  connector.handlerInputs = [
    {
      fetcher: 'DataFetcher',
      parser: 'MagPlaceParser',
      data: {
        url: apiUrl,
      },
    },
    {
      fetcher: 'DataFetcher',
      parser: 'TimeUrlParser',
      data: {
        url: apiUrl,
      },
    },
  ]
  connector.submit()
}

window.addEventListener('load', function () {
  document.getElementById('submitButton').addEventListener('click', submit)
})
```
Some notes about the code:
* Change the `apiUrl` value to the URL where you want to your connector to get your data.
* Both the `fetcher` and `parser` refer to the handlers. These are JavaScript files in the `handlers` directory. These files are the backend of your connector. The names of the fetcher and parser must match the filenames in the handlers directory. Keep the values the same, unless you plan to change the filenames.
* Each handler input contains a fetcher and a parser. In this example, each input uses the same fetcher but one uses magnitude and place parser and the other uses time URL parser.
* The `apiUrl` in this example is the same for both tables. You can use a different `apiUrl` for each table if you want.
* You can use a separate fetcher for each table.

## Step 5: Update the fetcher file
If your data is complex and needs preprocessing, use the Taco Toolkit library to prepare your data.
The following is the default code that the fetcher uses to get the data:

```js
import { Fetcher, AjaxRequest } from ‘taco-toolkit/handlers’
export default class DataFetcher extends Fetcher {
  async *fetch(request, context) {
    yield await AjaxRequest.getJSON(request.data.url)
  }
}
```


## Step 6: Configure how the data is presented

Now you must define how
you want to map the data to one or more or tables. This mapping of data is done in the schema.

To decide how to map your data, look at your data source. When you're done looking at the summary of the JSON data source, make the necessary edits to structure the returned data.

``` js
import { Parser, log } from 'taco-toolkit/handlers'

export default class MagPlaceParser extends Parser {
  parse(fetcherResult, input, context) {
    const table = this.createTable('Magnitude and Place Data')
    table.setId('magPlace')
    table.addColumnHeaders([
      {
        id: 'id',
        dataType: 'string',
      },
      {
        id: 'mag',
        alias: 'magnitude',
        dataType: 'float',
      },
      {
        id: 'title',
        alias: 'title',
        dataType: 'string',
      },
      {
        id: 'lat',
        alias: 'latitude',
        columnRole: 'dimension',
        dataType: 'float',
      },
      {
        id: 'lon',
        alias: 'longitude',
        columnRole: 'dimension',
        dataType: 'float',
      },
    ])

    table.addRows(
      fetcherResult.features.map((row) => {
        return {
          id: row.id,
          mag: row.properties.mag,
          title: row.properties.title,
          lon: row.geometry.coordinates[0],
          lat: row.geometry.coordinates[1],
        }
      })
    )
    return this.container
  }
}
```

Some notes:
* You don't need to write a custom parser for CSV data or for Excel data. The Taco Toolkit contains these parsers. For more information, see ???

## Step 7: Build your connector
Enter these commands to build, pack, and run your new connector:
```
taco build
```
```
taco pack
```
```
taco run --desktop
```
