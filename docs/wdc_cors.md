---
title: WDC Working with CORS
layout: docs
---

The JavaScript code in a web data connector typically makes requests to
a server that's on a different domain than the one that's hosting the
web data connector's HTML page. That is, the code makes requests that
represent cross-origin resource sharing (CORS). As a security measure,
most browsers restrict CORS requests made from JavaScript code.

This restriction can result in errors when the web data connector runs.
For example, if the code in your connector makes requests to a server that
doesn't allow CORS requests, you might see an error like the following in
your browser console:

```
XMLHttpRequest cannot load URL. No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

If your connector experiences CORS-related errors when trying to access
another site, you can try the approaches listed in this topic:

* TOC
{:toc}

**Note**: For information about how to use the Web Data Connector
simulator to help debug errors, including CORS errors, see [Debugging in the Simulator and Tableau]({{ site.baseurl
}}/docs/wdc_debugging).

Make requests through a proxy server {#proxy-server}
------------------------------------

To circumvent browser restrictions on CORS, you can use a proxy server.
A proxy server acts as a simple go-between for your connector and the server that you
want to get data from. Because a proxy server doesn't run in a browser, it isn't
limited by the same restrictions on CORS.

If the proxy server is in the same domain as the web data connector,
JavaScript in the connector page does not run into CORS restrictions. If
the proxy server is in another domain, the proxy server can be
configured to set the `Access-Control-Allow-Origin` header to allow
requests from the connector's domain.

The WDC SDK comes with a test proxy server that you can use out of the box.

1. From the top-level directory of the repository, open a command prompt or terminal and run the following command:

   ```
   npm start
   ```

   The test proxy server and test web server start.

1. In your connector code, prefix your requests with the following URL:

   ```
   http://localhost:8889
   ```

   For example, for the `earthquakeUSGS` connector, you would change the `$.getJSON` function from this:

   ```
   $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",
   ...
   ```

   To this:

   ```
   $.getJSON("http://localhost:8889/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",
   ```

**Important:** The test proxy server supports HTTP API calls only.

If you want to share your connectors with other users in your organization, you can download
and configure a production proxy server, or you can use a free, public proxy server like
[http://cors.io/.](http://cors.io/) or [https://crossorigin.me/](https://crossorigin.me/).

Request CORS support from API Server {#request-access}
--------------------

To allow CORS requests, the server that hosts the data can set the
`Access-Control-Allow-Origin` header in the response. The header can be
set to specific domains (for example, `http://example.com`), or to `*`
to indicate that all domains are allowed access to the server's data. To
get CORS support for requests from your connector, you can contact the
owners of the site that hosts the data you are querying and ask them to
add the `Access-Control-Allow-Origin` header with your domain in it, or
to add your domain if the site already sends the header.

For more information, see [HTTP access
control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
on the Mozilla Developer Network site.

Make requests with JSONP {#jsonp}
---------

If the site that contains the data doesn't support CORS, it's often
possible to get data from the site by using *JSON with padding*, or
JSONP. JSONP provides an alternative to making requests directly in
JavaScript, since those are blocked. Instead, you use JavaScript to
dynamically create or update a `<script>` element and set its `src`
attribute to a URL that points to the site that has the data. The
URL also contains the name of a callback function that's in the
connector page. If the site supports JSONP, the response includes the
data in JSON format, "padded" with a call to the callback function.

If you use jQuery in your web data connector, you can make JSONP calls
using the <span class="api-command-ref">ajax</span> function. For more
information, see [jQuery.ajax()](http://api.jquery.com/jQuery.ajax/) on
the jQuery site.

If you aren't using jQuery, you can implement JSONP in your JavaScript
code. For example, a connector might contain the following JavaScript
code, which dynamically creates a `<script>` element and sets its `src`
attribute to the URL of a server that has a fictional temperature
service. The URL includes various parameters; one of the parameters is
the name of a callback function. When the new `<script>` element is
created, the browser invokes the URL that the `src` attribute is set to.

```js
    var scriptTag = document.createElement('script');
    scriptTag.src = "http://myserver/temperatures?city=Seattle&year=2014&callback=getTemperatures";
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
```

The connector must also include the following function, which is invoked
by the "padded" JSON that the temperature site returns. The JSON data is
passed to the function as the <span
class="api-placeholder">jsonpData</span> parameter, and the code in the
function can extract values as it would from any JSON block.

```js
    var getTemperatures = function(jsonpData) {
        alert(jsonpData.someProperty);
        // More code here to extract the JSON data
    }
```

For more information, see [JSONP](https://en.wikipedia.org/wiki/JSONP)
on Wikipedia.

