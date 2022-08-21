---
title: Create a Custom Authentication Connector
layout: docs3
---
{% include prelim_note.md %}

To create your custom authentication connector, we recommend that you first create a sample custom authentication connector and edit the generated files. It's easier to get all the files and directory structure your connector needs by just using an existing example.

* TOC
{:toc}

To create your custom authentication connector, do the following steps.
## Step 1: Create a boilerplate custom authentication connector

1. Enter the following command to create the connector:

   ```
   taco create myCustomAuthConnector --custom-auth
   ```

   This creates a directory with the earthquake data boilerplate code, which is included with the toolkit.

1. Change directories to the myCustomAuthConnector directory.
   ```
   cd myCustomAuthConnector
   ```
   
1. Build the connector by entering the following command:

   ```
   taco build
   ```
   This command clears any earlier or existing build caches. Then the command installs the dependencies and builds both the front-end code and the back-end code (handlers). Finally, the command copies the `connector.json` file (the configuration file) to your directory.
   
## Step 2: Configure your connector's properties

In your new custom authentication connector directory, find and open the `connector.json` file. 
```json
{
  "name": "custom-auth-sample",
  "version": "1",
  "tableau-version": {
    "min": "2022.2",
    "max": "*"
  },
  "vendor": {
    "name": "vendor-name",
    "support-link": "https://vendor-name.com",
    "email": "support@vendor-name.com"
  },
  "permission": {
    "api": {
      "https://*.usgs.gov/": ["GET", "POST", "HEAD"],
      "https://*.your_token_url/": ["GET", "POST", "HEAD"]
    }
  },
  "auth": {
    "type": "custom"
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

1. Verify the authentication value.

   | Name | Value |
   |------|-------|
   | auth.type | Set to `custom-auth` |
   
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
  <title>Custom Auth Sample</title>
  <meta http-equiv="Cache-Control" content="no-store" />
  <link rel="shortcut icon" href="#" />
  <link href="index.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="index.js" type="module"></script>
</head>

<body>
  <p id="error" style="display: block; margin-top: 2em; height: 5px; text-align: center; color: red;"></p>
 
  <div class="box m-auto ">
    <div class="card">
      <div class="card-header">
        Basic Auth Sample
      </div>

      <div class="card-body">
        <label for="userName" class="form-label">User Name</label>
        <input type="text" id="username" class="form-control mb-3" placeholder="User Name">

        <label for="Password" class="form-label">Password</label>
        <input type="password" id="password" class="form-control mb-4" placeholder="Password">

        <div class=" text-center">
          <button type="button" class="btn btn-success" id="submitButton" disabled> Please wait while settings load...</button>
        </div>
      </div>

    </div>
  </div>
 
</body>

</html>
```

Some notes about what the code is doing:

* The `meta` tag prevents your browser from caching the page.
* The `index.css` and `bootstrap.min.css` files are used to simplify styling and formatting.
* The `index.js` file is the code for your connector.
* The `input type="text"` is the form field for the username.
* The `<input type="password"` is the form field for the password.

## Step 4: Edit the connector object
Now that you've created a user interface, it's time to edit the JavaScript code for the connector's button. First, open the `/app/App.txs` file. 

``` js
import Connector from 'taco-toolkit'

const connector = new Connector(onInitialized)

function onInitialized() {
  const elem = document.getElementById('submitButton')
  elem.innerText = 'Get Data'
  elem.removeAttribute('disabled')
  setCredential()
}

function setCredential() {
  const { username, password } = connector.secrets || {}
  document.getElementById('username').value = username || ''
  document.getElementById('password').value = password || ''
}

function submit() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  if (!username || !password) {
    return
  }

  connector.secrets = { username, password }

  //TODO: change url to the one that works with the custom auth
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

window.addEventListener('load', function () {
  document.getElementById('submitButton').addEventListener('click', submit)
})
```
Some notes about the code:
* Change the URL to your API URL (Scot to get more information and provide)
The API URL, when we send a request, we must provide a header with the custom authentication credentials

## Step 5: Update the fetcher file
If your data is complex and needs preprocessing, use the Taco Toolkit library to prepare your data.
The following is the default code that the fetcher uses to get the data:

```js
import { Fetcher, AjaxRequest } from ‘taco-toolkit/handlers’
function getCustomAuthHeader(username, password) {
  const token = Buffer.from(`${username}:${password}`).toString(‘base64’)
  return { Authorization: `Basic ${token}` }
}
export default class CustomAuthFetcher extends Fetcher {
  async *fetch(request, context) {
    const { username, password } = context.connector.secrets
    const headers = getBasicAuthHeader(username, password)
    yield await AjaxRequest.getJSON(request.data.url, { headers })
  }
}
```
* The `headers` contain the custom authorization token.

## Step 6: Configure how the data is presented

Now you must define how
you want to map the data to one or more or tables. This mapping of data is done in the schema.

To decide how to map your data, look at your data source. When you're done looking at the summary of the JSON data source, make the necessary edits to structure the returned data.

``` js
import { Parser } from 'taco-toolkit/handlers'

export default class MyParser extends Parser {
  //TODO : update mapping to match the api result
  parse(fetcherResult, input, context) {
    const table = this.createTable('Sample Data')
    table.setId('SampleData')
    table.addColumnHeaders([
      {
        id: 'id',
        dataType: 'string',
      },
      {
        id: 'title',
        alias: 'title',
        dataType: 'string',
      },
    ])

    table.addRows(
      fetcherResult.features.map((row) => {
        return { id: row.id, title: row.title }
      })
    )
    return this.container
  }
}
```

Some notes:
* 

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
