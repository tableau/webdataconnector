---
title: Create a Connector
layout: docs3
---
{% include prelim_note.md %}

To create your connector, we recommend that you first create a sample connector and edit those files. It's easier to get all the files and directory structure your connector needs by just using an existing example.

Use the connector you created in the [Get Started]({{ site.baseurl }}/docs/index) topic. Copy that sample connector directory to another directory. You're now ready to create your own connector.

<!-- Start with create connector with your connector name -->

* TOC
{:toc}

To create your connector, do the following steps.
# Step 1: Configure your connector's properties

In your new connector directory, find and open the `connector.json` file. Make the following changes:

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
   | max | The latest Tableau version your connector supports. Enter `*` for the current version. |

1. Change the permissions.

   | Name | Value |
   |------|-------|
   | permission.api | The URI for the API that the connector is allowed to access, along with the methods (POST, GET, PUT, PATCH, DELETE) that the connector is allowed to use. |

1. Change the auth type.

   | Name | Value |
   |------|-------|
   | auth.type | Accepted values are `api-key`, `basic-auth`, `custom`, `none`, and `oauth2`. |
   
   <!-- oauth2 = 'oauth2', 'api-key' = 'api-key', basic = 'basic-auth', custom = 'custom', none = 'none', -->

1. Change the HTML pane size.

   | Name | Value |
   |------|-------|
   | window.height | The height of the connector HTML pane |
   | window.width | The width of the connector HTML pane |

# Step 2: Create the user interface
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

# Step 3: Edit the connector object
Now that you've created a user interface, it's time to edit the JavaScript code for the connector's button. First, open the `/app/index.js` file. 

``` js
function submit() {
  connector.handlerInputs = [
    {
      fetcher: 'MyFetcher',
      parser: 'MyParser',
      data: {
        url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
      },
    },
  ]
  connector.submit()
}
```
Some notes about the code:
* Both the `fetcher` and `parser` refer to the handlers. These are JavaScript files in the `handlers` directory. These files are the backend of your connector. Keep the values the same, unless you plan to change the filenames. 
* Change the `url` value to the URL where you want to your connector to get your data.
* The names of the fetcher and parser must match the filenames in the handlers directory.

# Step 4: Update the fetcher file
If your data is complex and needs preprocessing, use the Taco Toolkit library to prepare your data.
The following is the default code that the fetcher uses to get the data:

<!-- Insert fetcher file content here. -->

# Step 5: Configure how the data is presented

Now you must define how
you want to map the data to one or more or tables. This mapping of data is done in the schema.

To decide how to map your data, look at your data source. When you're done looking at the summary of the JSON data source, make the necessary edits to structure the returned data.

``` js
import { Parser, log } from 'taco-toolkit/handlers'

export default class MyParser extends Parser {
  parse(fetcherResult, input, context) {
    const table = this.createTable('Earthquake Data')
    table.setId('EarthquakeData')
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
        id: 'location',
        dataType: 'geometry',
      },
    ])

    table.addRows(
      fetcherResult.features.map((row) => {
        return { id: row.id, mag: row.properties.mag, title: row.properties.title, location: row.geometry }
      })
    )
    return this.container
  }
}
```

Some notes:
* You don't need to write a custom parser for CSV data or for Excel data. The Taco Toolkit contains these parsers. For more information, see ???

# Step 6: Build your connector
Enter the command:
```
taco build
```
```
taco pack
```
```
taco run --desktop
```
