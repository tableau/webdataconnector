---
title: Node Proxy with OAuth Tutorial
layout: docs
---

`This content isn't finished yet: Coming soon`

This topic is part of a multi-part tutorial on how to use OAuth with a
Tableau web data connector. Here is a list of all the parts:

1. **Introduction and Overview** (you are here)
2. [Create a Foursquare App](wdc_tutorial_oauth_client_create_app.html)
3. [Create the UI for Signing In](wdc_tutorial_oauth_create_ui.html)
4. [Add Code for OAuth
   Sign-In](wdc_tutorial_oauth_client_add_oauth_authentication.html)
5. [Test OAuth Sign-In](wdc_tutorial_oauth_client_test_oauth.html)
6. [Get Columns and
   Data](wdc_tutorial_oauth_client_data_gathering_code.html)
7. [Manage
   Credentials](wdc_tutorial_oauth_client_add_oauth_manage_creds_during_data_gathering.html)
8. [Test the Connector in the
   Simulator](wdc_tutorial_oauth_client_test_in_simulator.html)
9. [Test the Connector in
   Tableau](wdc_tutorial_oauth_client_test_in_tableau.html)
10. [Complete Code Listing]({{ site.baseurl }}/docs/wdc_tutorial_oauth_client_code_listing.html)

In this part of the tutorial, you'll learn these things:

-   [The tutorial scenario](#tutorial-scenario). This section describes
    the web data connector that you'll build.

-   [Prerequisites](#prerequisites). What you'll need, and what we
    assume you already know about web data connectors.

-   [What is OAuth?](#what-is-oath) If you're new to OAuth, this section
    provides a quick overview.

-   [Which OAuth flow should I use: client-based or
    server-based?](#client-and-server-flow) There are two basic ways to
    work with OAuth authentication: client flow and server flow. This
    section provides a brief overview of each and when to use them.

**Note**: A complete code listing for the tutorial is available in [Web
Data Connector OAuth Tutorial: Complete Code
Listing](wdc_tutorial_oauth_client_code_listing.html).

The tutorial scenario {#tutorial-scenario}
---------------------

In this tutorial, you'll build a web data connector that gets data from
Foursquare (<http://foursquare.com>). Foursquare is an app that allows
users to search for local services, such as restaurants or attractions.
Foursquare also exposes an API that developers can use to perform many
of the functions that the app has. Foursquare is one of many sites that
use OAuth with their APIs. Others are Facebook, Yelp, Tumblr, Twitter,
Etsy, and many more.

For this tutorial, you'll create a web data connector that calls the
Foursquare
[`venuelikes`](https://developer.foursquare.com/docs/users/venuelikes)
endpoint, which returns a list of venues that a specific user has
"Liked" in Foursquare. When you call the `venuelikes` endpoint, you must
include an OAuth access token. The token tells Foursquare that the user
has allowed your app—namely, the web data connector—to access the user's
personal information on Foursquare.

**Note**: This tutorial illustrates how to use [OAuth
2.0](http://oauth.net/2/).

Prerequisites
-------------

To run this tutorial, you need the following:

1.  Basic familiarity with JavaScript.

2.  The Web Data Connector SDK installed on your computer.

3.  Familiarity with the concepts and web data connector example in [Web
    Data Connector Basic Tutorial](wdc_tutorial_basic.html).

4.  A web server running locally on your computer and listening on
    port 8888. As in the basic tutorial, you can use the Python
    development server.

What is OAuth and how does it work? {#what-is-oath}
-----------------------------------

This section provides some basic information about OAuth for those who
are not familiar with it. OAuth is an authentication protocol that
allows an *application* (in our case, a web data connector) to request
specific resources from a *resource provider* (Foursquare) on behalf of
a specific *resource owner* (the user who signs in to Foursquare). This
is a more secure and usable alternative to the application asking the
user directly for their Foursquare username and password.

In order to use OAuth, an application must be registered with the OAuth
resource provider. For example, in this tutorial, you register your
application with Foursquare. (If you were using a different OAuth
provider, you would register your application with that provider.) The
provider assigns a client ID and a client secret to the application.
When the application contacts the OAuth provider, the application passes
the client ID to identify itself. The exact process for registering your
application differs for each provider, and is typically explained in the
provider's documentation for how to use their API.

The following diagram illustrates an example OAuth flow, which is the
flow you will build. The steps following the diagram describe the
stepsin the flow.

![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_flow-2.png)

1.  The end user loads the web data connector in Tableau in order to
    connect to data.

2.  The connector displays a button that prompts the user to go to
    Foursquare to sign in. When the user clicks the button, the
    connector redirects the user to Foursquare to sign in. (The redirect
    URL includes the client ID for your connector.)

3.  On the Foursquare site, the user signs in and grants permission to
    the connector to access the user's personal information.

4.  Foursquare redirects the user back to the connector. As part of the
    URL that redirects the user back to the connector, Foursquare
    includes an access token.

5.  The connector includes the access token when it makes requests to
    Foursquare endpoints. When Foursquare gets the requests, it
    recognizes that the call is on behalf of the user.

6.  Foursquare returns the requested information for the user
    represented by the access token.

Which OAuth flow should I use: client-based or server-based? {#client-and-server-flow}
------------------------------------------------------------

Applications can use OAuth using one of two flows: client flow and
server flow. In client flow, JavaScript that runs in the browser makes
the OAuth calls and handles the access token. In server flow, the
authentication flow goes through a server instead of going back and
forth only between the client (browser) and the resource provider.

The primary motivation for using server-based flow is to increase
security. In client flow, all the information required in order to get
an access token is on the client—that is, in JavaScript code. This makes
the information visible to anyone who can read that JavaScript code. In
server flow, the server keeps the client secret that's assigned to the
app, and the secret is used to get the access token.

Which should you use? A rule of thumb is that if you're calling
endpoints that require your client secret, you should use server flow.
The client secret should be kept secure, and the client flow potentially
exposes the secret. In the server flow, the client secret can be kept
more secure on the server.

However, if you're not calling endpoints that require the client secret,
it's generally easier to implement the client flow.


What you'll do
--------------

In this part of the tutorial, you'll create an account with Foursquare
(the OAuth provider) and register your app. You'll get back a client ID
and client secret that you'll need for making calls to Foursquare later.

Register your app with Foursquare
---------------------------------

Before you create the web data connector, you must register your
Foursquare application (the web data connector) on the Foursquare
developer site. When you're done, you'll have a client ID that you use
when you communicate with Foursquare and that lets Foursquare know who
is making requests.

1.  Go to the [Foursquare.com](https://foursquare.com/) site. If you
    have a Foursquare developer account, sign in. Otherwise, sign up for
    a new account.

2.  Go to the [My Apps](https://foursquare.com/developers/apps)
    page (https://foursquare.com/developers/apps) on the Foursquare
    developer website.

3.  Click the <span class="uicontrol">Create a new app</span> button.

4.  Fill in the <span class="uicontrol">Your app name</span>, <span
    class="uicontrol">Download/welcome page url</span>, and <span
    class="uicontrol">Redirect URI(s)</span> boxes.

    You can use any values you want for the application name and welcome
    page URL. For the <span class="uicontrol">Redirect URI</span> box,
    enter the following:

    `http://localhost:8888/Examples/html/foursquare.html`

    You will use this value later on when you make a call to the
    Foursquare OAuth service.

5.  Click <span class="uicontrol">Save Changes</span>.

    Foursquare displays a client ID and a client secret.

6.  Copy the client ID and client secret and keep them in a
    secure location.

    **Note**: For this tutorial, you need only the client ID. You don't
    need the client secret for this tutorial.

"Like" some venues
------------------

If you're new to Foursquare, you don't have any "Liked" venues. To make
sure you have some data to work with later, do this.

1.  Go to the [Foursquare.com](http://www.fourquare.com) site and
    sign in.

2.  Search for venues and display the listing for a venue that you like.

3.  Click the "Like" icon at the bottom of the page.

    ![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_foursquare_likes.png)

4.  Repeat steps 2 and 3 a few times until you have a selection of
    "Liked" venues to test later.

Next
----

In the next part of the tutorial, you'll create the HTML page for the
connector and the JavaScript code to let the user sign in using
Foursquare.

[Web Data Connector OAuth Tutorial Part 3: Create the UI for Signing
In](wdc_tutorial_oauth_create_ui.html)

What you'll do
--------------

In this part of the tutorial, you create an HTML page that contains
markup for the UI that lets the user sign in to Foursquare. The HTML
page renders the following:

![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_basic_signin_ui.png)

You also add JavaScript code that toggles text in the page ("You are
signed in" or "You are not signed in"), depending on whether the user is
signed in.

**Note**: A complete code listing for the tutorial is available in [Web
Data Connector OAuth Tutorial: Complete Code
Listing](wdc_tutorial_oauth_client_code_listing.html).

Get the button graphic
----------------------

The page uses a graphic for the Connect to Foursquare button. Download
the graphic from the Foursquare resources page at the following
location:

`https://foursquare.com/about/logos`

At the bottom of the page, there's a link to a page where you can
download assets. This takes you to a shared Dropbox folder. Click that
link and then follow the links to get the <span
class="uicontrol">Connect to Foursquare</span> button. For example,
click <span class="uicontrol">Logos</span> &gt; <span
class="uicontrol">Developer</span>, and then download the
`Connect-to-Foursquare-300.png` file.

**Note**: The Foursquare UI for downloading assets might change without
notice.

Save the graphic as `foursquare_connect.png` in the `Examples` folder of
the Web Data Connector SDK location on your computer. (Use the name
`foursquare_connect.png` because that's the name that the
`foursquare.html` page you're creating expects.)

![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_foursquare_connect_button.png)

Create the HTML markup
----------------------

Create a new file named `foursquare.html` in the `Examples` folder. Then
copy the following markup into the new file.

```html
<!DOCTYPE.html>
<head>
    <meta charset="utf-8">
    <title>Foursquare Connector</title>
    <meta http-equiv="Cache-Control" content="no-store" />
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet"
       href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
    <!-- Latest compiled and minified JavaScript -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"
         type="text/javascript"></script>

    <!-- Latest WDC Library -->
    <script src="https://connectors.tableau.com/libs/tableauwdc-1.1.1.js"
         type="text/javascript"></script>

    <!-- This will contain all of your WDC code -->
    <script src="./foursquare.js" type="text/javascript"></script>
</head>
<body>
  <div style="margin: auto; text-align: center; margin-top: 50px; max-width: 300px">
    <!-- These labels will toggle depending on whether the user is authenticated
         or not -->
    <p class="signedin">You are signed in!</p>
    <p class="notsignedin">You are not signed in, please click below to sign in
       to your foursquare account.</p>

    <!-- The connect to foursquare button will have a link added to it in the js-->
    <a href="#" id="connectbutton"><img src="./foursquare_connect.png"
         alt="Login with Foursquagare"/></a>
    <br /><br />

    <!-- This button will fetch the user's "Liked" venues once the user is authenticated -->
    <p><a href="#" class="btn btn-primary btn-block" id="getvenuesbutton">
      <span class="glyphicon glyphicon-arrow-down"></span> Get Venues I Like</a>
    </p>
  </div>
</body>
</html>
```

At the top of the file, there are `<script>` elements that link to
various libraries: to Twitter Bootstrap, to jQuery, to the Tableau WDC
library, and to the `foursquare.js` library. The Bootstrap and jQuery
libraries are optional for web data connectors, but we use them in this
tutorial for professional styling (Bootstrap) and to help with some of
the JavaScript coding (jQuery). The WDC library (currently
`tableauwdc-1.1.1.js`) is required for all WDCs.

**Note**: To connect to a web data connector that uses
`tableauwdc-1.1.1.js`, you must be using a recent version of Tableau.
For more information, see [Web Data Connector Library
Versions](wdc-library-versions.html).

The `foursquare.js` file is a separate .js file that you'll create
shortly. It will contain all the code for making calls to Foursquare.

The page UI consists of a <span class="uicontrol">Connect to
Foursquare</span> button and a <span class="uicontrol">Get Venues I
Like</span> button. There is also a single label whose text changes
depending on whether the user is authenticated. If you run the page now,
both labels are shown.

### Add code to manage the UI

The next task is to add JavaScript that controls the UI in the page. The
connector should display one label if the user is signed in, and the
other label if not.

You also add code that stores the credentials you need later to make
calls to Foursquare.

In the `Examples` folder where the `foursquare.html` file is, create a
file named `foursquare.js` and copy the following code into it.

```js
   var config = {
     clientId: 'YOUR_CLIENT_ID',
     redirectUri: 'http://localhost:8888/Examples/foursquare.html',
     authUrl: 'https://foursquare.com/',
     version: '20150901'
   };
```

Replace `YOUR_CLIENT_ID` in the code with the client ID that you got
from Foursquare in [Part 1](wdc_tutorial_oauth_client_create_app.html).

Notice the value of `redirectUri`. This is the URL that Foursquare will
call after the user has signed in. You can see that the URL is
`foursquare.html`, meaning that Foursquare will redirect back to the
page that you're building. Notice also that the server name for the URL
is `localhost:8888`, meaning that the redirect will be made to a server
running on your computer. If the web data connector is hosted on another
server, this URL would have to be changed to reflect that.

**Important**: The values in the `foursquare.js` file, including your
client ID, are visible to anyone who can access your web data connector.
Don't use this approach if you need the client *secret* to call APIs
(which is an additional client value that you get from the OAuth
provider). In that case, you should use server-flow OAuth. (Server flow
is not covered in this tutorial.) In this tutorial, you're not calling
an API that requires the client secret, so the client secret is not
embedded in the `.js` file; you don't use the client secret at all in
this tutorial.

Finally, note that the `config` object contains a version value, which
is a date. You must include a version value each time you make a call to
Foursquare. For more information about this value, see [Versioning
& Internationalization](https://developer.foursquare.com/overview/versioning)
on the Foursquare website.

Now add the code for managing the UI in the page. Copy the following
code and add in the `foursquare.js` file below the `config` object
definition.

```js
 $(document).ready(function() {
     var accessToken = false;
     var hasAuth = accessToken && accessToken.length > 0;
     updateUIWithAuthState(hasAuth);

 });

 function updateUIWithAuthState(hasAuth) {
     if (hasAuth) {
         $(".notsignedin").css('display', 'none');
         $(".signedin").css('display', 'block');
     } else {
         $(".notsignedin").css('display', 'block');
         $(".signedin").css('display', 'none');
     }
 }
```

The `document.ready` function is jQuery code that runs whenever the page
is loaded. For the time being, this code calls the
`updateUIWithAuthState` function, which toggles the visibility of text
in the page by setting CSS style attributes for different `<p>` elements
in the page.

If you load the page into a browser now, you no longer see all the text
on the page. Assuming that you're not logged into Foursquare, you'll see
only this:

![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_not_signed_in_ui.png)

Next
----

In the next part of the tutorial, you'll add JavaScript code that
manages the OAuth sign-in process—a handler for the <span
class="uicontrol">Connect to Foursquare</span> button that takes the
user to Foursquare, and code that gets the access token when the user is
redirected back to your page.

[Web Data Connector OAuth Tutorial Part 4: Add Code for OAuth
Sign-In](wdc_tutorial_oauth_client_add_oauth_authentication.html)

What you'll do
--------------

In this part of the tutorial, you add JavaScript code that manages the
OAuth sign-in process. When a user clicks the <span
class="uicontrol">Connect to Foursquare</span> button, your code
redirects the user to Foursquare, where the user can sign in. After the
user signs in, Foursquare redirects the user back to your web data
connector page. You'll add code to retrieve the OAuth access token that
Foursquare sends back when it redirects the user to your page.

**Note**: A complete code listing for the tutorial is available in [Web
Data Connector OAuth Tutorial: Complete Code
Listing](wdc_tutorial_oauth_client_code_listing.html).

Add code for sign-in
--------------------

Copy the following code and completely overwrite the existing
`document.ready` function.

```js
 $(document).ready(function() {
     var accessToken = parseAccessToken();
     var hasAuth = accessToken && accessToken.length > 0;
     updateUIWithAuthState(hasAuth);

     $("#connectbutton").click(function() {
         doAuthRedirect();
     });
 });
```

There are two changes here, which are both highlighted. The first is
that the `accessToken` value is now set by calling the
`parseAccessToken` function.

The second change is that the `document.ready` function includes a click
handler for the <span class="uicontrol">Connect to Foursquare</span>
button (whose ID in the markup is `connectbutton`). The click handler
calls the `doAuthRedirect` function.

Add code to make a sign-in call to Foursquare
---------------------------------------------

At the bottom of the file, add the following code:

```js
 function doAuthRedirect() {
     var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id='
                              + config.clientId
                              + '&redirect_uri='
                              + config.redirectUri;
     window.location.href = url;
 }
```

This is the `doAuthRedirect` function that's called when users click the
<span class="uicontrol">Connect to Foursquare</span> button. The code
builds the URL for the Foursquare endpoint that you send sign-in
requests to. Notice that the URI includes the client ID and redirect URI
that you got when you registered your app with Foursquare. (You added
this information in the `config` object earlier in the tutorial.)

Add code to parse the access token from the response
----------------------------------------------------

After the user signs in using Foursquare, Foursquare redirects the user
back to your page. The URL that redirects to your page might look like
this:

`http://localhost:8888/Examples/foursquare.html#access_token=X4H5R1BZRDMASHJJUXEUDN7TEYXXD02R3NF7MN2EOMV854R`

To extract the token from the URL, add the following code to the bottom
of the `foursquare.js` file.

```js
 function parseAccessToken() {
     var query = window.location.hash.substring(1);
     var vars = query.split("&");
     var ii;
     for (ii = 0; ii < vars.length; ++ii) {
        var pair = vars[ii].split("=");
        if (pair[0] == "access_token") { return pair[1]; }
     }
     return(false);
 }
```
The code simply walks through the page's URL looking for a parameter
named `access_token` and returns that value.

The page so far
---------------

At this point, the `foursquare.js` file has the following content.
(Remember that you must substitute your own client ID in the `config`
object.)

```js
 var config = {
     clientId: 'YOUR_CLIENT_ID',
     redirectUri: 'http://localhost:8888/Examples/foursquare.html',
     authUrl: 'https://foursquare.com/',
     version: '20150901'
 };

 $(document).ready(function() {
     var accessToken = parseAccessToken();
     var hasAuth = accessToken && accessToken.length > 0;
     updateUIWithAuthState(hasAuth);

     $("#connectbutton").click(function() {
         doAuthRedirect();
     });
 });

 function updateUIWithAuthState(hasAuth) {
     if (hasAuth) {
             $(".notsignedin").css('display', 'none');
         $(".signedin").css('display', 'block');
     } else {
         $(".notsignedin").css('display', 'block');
         $(".signedin").css('display', 'none');
     }
 }

 function doAuthRedirect() {
     var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id='
                              + config.clientId
                              + '&redirect_uri='
                              + config.redirectUri;
     window.location.href = url;
 }

 function parseAccessToken() {
     var query = window.location.hash.substring(1);
     var vars = query.split("&");
     var ii;
     for (ii = 0; ii < vars.length; ++ii) {
        var pair = vars[ii].split("=");
        if (pair[0] == "access_token") { return pair[1]; }
     }
     return(false);
 }
```

Next
----

In the next part of the tutorial, you'll test the Foursquare sign-in
process.

[Web Data Connector OAuth Tutorial Part 5: Test OAuth
Sign-In](wdc_tutorial_oauth_client_test_oauth.html)

What you'll do
--------------

In this part of the tutorial, you test the sign-in code for Foursquare.
You can do this test in the browser without using the simulator that's
part of the Web Data Connector SDK.

Test OAuth sign-in
------------------

You can now test OAuth sign-in.

1.  Start your web server. If you're using the Python development
    server, do this:

    a.  Open a command window and go to the folder where you installed
        the Web Data Connector SDK.

    b.  Run one of these commands:

        (Python 2.x) `python -m SimpleHTTPServer 8888`

        (Python 3.x) `python -m http.server 8888`

    **Note**: We're assuming throughout this tutorial that the web
    server is listening on port 8888 and that the `foursquare.html` page
    is in the `Examples` folder of the SDK installation.

2.  Open a browser window and enter the following URL:

    `http://localhost:8888/Examples/foursquare.html`

    You see the following in your browser:

    ![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_not_signed_in_ui.png)

3.  Click <span class="uicontrol">Connect to Foursquare</span>.

    You see the Foursquare page that prompts you to sign in.

    ![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_foursquare_signin.png)

4.  Sign in and click <span class="uicontrol">Log in and allow</span>.
    Foursquare redirects you back to the web data connector page in
    the browser.

    The URL box in the browser now includes the access token.

    `http://localhost:8888/Examples/foursquare.html#access_token=######...`

    When the web data connector has the token like this, it means that
    the connector is authorized to read your Foursquare info.

Next
----

In the next part of the tutorial, you'll add the code that runs during
the data-gathering phase of the web data connector to get the schema and
the data.

[Web Data Connector OAuth Tutorial Part 6: Get Columns and
Data](wdc_tutorial_oauth_client_data_gathering_code.html)

What you'll do
--------------

So far, all the code you've added was for getting the OAuth token. In
this part of the tutorial you'll add the JavaScript code that all web
data connectors have—code to get the schema (field names and types) for
the data, and to get the data itself. This code is similar to the
equivalent code in the basic tutorial.

**Note**: A complete code listing for the tutorial is available in [Web
Data Connector OAuth Tutorial: Complete Code
Listing](wdc_tutorial_oauth_client_code_listing.html).

Add code to get columns and data
--------------------------------

Copy the following code into the bottom of the `foursquare.js` file.

```js
 //------------- Tableau WDC code -------------//
 var myConnector = tableau.makeConnector();

 myConnector.getColumnHeaders = function() {
     var fieldNames = ["Name", "Latitude", "Longitude", "Checkin Count"];
     var fieldTypes = ["string","float","float","int"];
     tableau.headersCallback(fieldNames, fieldTypes);
 };

 myConnector.getTableData = function(lastRecordToken) {
     var dataToReturn = [];
     var hasMoreData = false;

     var accessToken = tableau.password;
     var connectionUri = getVenueLikesURI(accessToken);

     var xhr = $.ajax({
         url: connectionUri,
         dataType: 'json',
         success: function (data) {
             if (data.response) {
                 var venues = data.response.venues.items;
                 var ii;
                 for (ii = 0; ii < venues.length; ++ii) {
                     var venue = {'Name': venues[ii].name,
                                  'Latitude': venues[ii].location.lat,
                                  'Longitude': venues[ii].location.lng,
                                  'Checkin Count': venues[ii].stats.checkinsCount};
                     dataToReturn.push(venue);
                 }

                 tableau.dataCallback(dataToReturn, lastRecordToken, hasMoreData);
             }
             else {
                 tableau.abortWithError("No results found");
             }
         },
         error: function (xhr, ajaxOptions, thrownError) {
             // If the connection fails, log the error and return an empty set.
             tableau.log("Connection error: " + xhr.responseText + "\n" +
                          thrownError);
             tableau.abortWithError("Error while trying to connect to Foursquare.");
         }
     });
 };

 // Register the tableau connector--call this last
 tableau.registerConnector(myConnector);
```

This code follows the same outline as any web data connector. The code
starts by calling `tableau.makeConnector` to create an instance of the
connector. It then adds functions to define the data schema
(`getColumnHeaders`) and to actually fetch the data (`getTableData`).
When the connector is completely configured, the code calls
`tableau.registerConnector`.

In this tutorial, the `getColumnHeaders` function defines four fields
and corresponding data types. The `getTableData` function is very
similar to the one from the basic tutorial. The code calls a helper
function to create the request URI, and then uses jQuery to make an AJAX
call to the data source. When the data is returned, a function in the
success parameter parses the data, creates JavaScript objects out of
each returned value, and then calls the `tableau.dataCallback` function
to send the data to Tableau.

One difference this time is that the `getTableData` function contains
these lines:

```js
    var accessToken = tableau.password;
    var connectionUri = getVenueLikesURI(accessToken);
```

When the `getTableData` function sends a request to Foursquare, the URL
of the request has to include the access token. You might remember from
the basic tutorial that you can use the `tableau.connectionData`
property to pass values from the interactive (UI) phase of the connector
to the data-gathering phase. (Because the phases run in separate browser
sessions, you can't use other mechanisms to share values between the
phases.) In the basic tutorial, you used `tableau.connectionData` to
pass a stock ticker symbol between phases.

When you're using OAuth, you have the same issue with the access
token—you gather it from the user in the interactive phase, but you need
to use it in the data-gathering phase. You can use the
`tableau.password` property for this purpose. As with
`tableau.connectionData`, it allows you to pass values between phases of
the connector. However, it's designed specifically for sensitive
information like passwords.

Although the code includes a function to extract the access token, you
haven't set the value of the `tableau.password` yet. You'll do that
shortly.

Add the helper function
-----------------------

As in the basic tutorial, the work of creating the URL for the web
request is done using a helper function. Add the following code just
above the existing `parseAccessToken` function.

```js
 function getVenueLikesURI(accessToken) {
     return "https://api.foursquare.com/v2/users/self/venuelikes?oauth_token=" +
             accessToken + "&v=" + config.version;
 }
```

This code builds the URI for the Foursquare `venuelikes` API, including
adding the access token into the URL.

Next
----

In the next part of the tutorial, you'll add code that makes sure that
the web data connector always has credentials available when they're
needed.

[Web Data Connector OAuth Tutorial Part 7: Manage
Credentials](wdc_tutorial_oauth_client_add_oauth_manage_creds_during_data_gathering.html)


What you'll do
--------------

In this part of the tutorial, you add code to make sure that the
connector has an OAuth access token before it makes requests to
Foursquare. If the access token is not available, you display UI in the
connector to let the user sign in again. You'll learn about the
following:

-   Persisting credentials in the `tableau.username` and
    `tableau.password` properties.

-   The authentication (auth) phase of the connector, which occurs if
    Tableau needs credentials in order to refresh an extract.

-   Using the `tableau.alwaysShowAuthUI` property if you're working
    with OAuth.

**Note**: A complete code listing for the tutorial is available in [Web
Data Connector OAuth Tutorial: Complete Code
Listing](wdc_tutorial_oauth_client_code_listing.html).

Sidebar: Credentials in web data connectors
-------------------------------------------

Before you start this part of the tutorial, it's helpful to review how
Tableau manages credentials when a user works with a web data connector
in Tableau. If a connector requires authentication, you add markup and
code to get credentials from the user. When the user loads the web data
connector into Tableau, the connector goes through its interactive phase
(UI phase) and uses your UI to gather information and credentials from
the user. When you store parameter information in the
`tableau.connectionData` property, you store any user credentials in the
`tableau.username` and `tableau.password` properties. For OAuth
authentication, you store the access token in the `tableau.password`
property.

When the user finishes entering information and credentials, Tableau
loads the connector again and the connector goes through its
data-gathering phase. In that phase, Tableau calls the connector's
`getColumnHeaders` and `getTableData` functions. When these functions
make calls to the data source, they can get the OAuth access token from
the `tableau.password` property and use it when constructing requests to
fetch data.

While the user is working in Tableau, the value in the
`tableau.password` property is not persisted between sessions.
Therefore, if the user closes Tableau, re-opens it, and re-loads a
workbook that uses the web data connector, Tableau doesn't have the
access token. Specifically, there's no value in the `tableau.password`
property.

In that case, Tableau calls the connector just to get the credentials
again. This is referred to as the *authentication phase* or *auth
phase*. For connectors that simply get the username and password (such
as a connector that accesses a data source like SQL Server), Tableau can
display a standard sign-in UI. However, Tableau has no built-in UI for
OAuth. Therefore, Tableau has to tell your connector to display the UI
that you've created to let the user sign in.

To indicate to Tableau that your connector will provide the sign-in UI,
you set the `tableau.alwaysShowAuthUI` property to true. You always do
this when the connector uses OAuth, because, as noted, Tableau cannot
display a sign-in UI for OAuth.

In the auth phase, the connector should display *only* the UI that's
required in order to get the user's credentials. In this phase, the
connector doesn't need to ask the user for any other information, such
as query parameter values. (In fact, Tableau ignores any changes that
you make except those to the `tableau.username` and `tableau.password`
properties.) To determine whether your connector is being loaded in auth
phase, you can test the `tableau.phase` property. The following example
shows how you can determine what phase the connector is in.

```js
if (tableau.phase == tableau.phaseEnum.authPhase) {
    // Display OAuth authentication UI
}
```

Manage credentials during the data-gathering phase
--------------------------------------------------

Because you're using OAuth, you have to include custom initialization
logic—that is, you have to include a `tableau.init` function in your web
data connector code. (For web data connectors that don't use OAuth, the
Web Data Connector `.js` library provides a default `init` function, so
you only need to create an `init` function if you need to add custom
initialization code.)

After the call to `tableau.makeConnector`, add the following code:

```js
 myConnector.init = function() {
   var accessToken = parseAccessToken();
   var hasAuth = (accessToken && accessToken.length > 0) ||
                     tableau.password.length > 0;

   if (tableau.phase == tableau.phaseEnum.interactivePhase ||
                        tableau.phase == tableau.phaseEnum.authPhase) {
       if (hasAuth) {
           tableau.password = accessToken;
           if (tableau.phase == tableau.phaseEnum.authPhase) {
               // Auto-submit here if we are in the auth phase
               tableau.submit()
           }
       }
   }

   /* Update UI */
   updateUIWithAuthState(hasAuth);

   if (tableau.phase == tableau.phaseEnum.interactivePhase) {
      if (!hasAuth) {
         $("#getvenuesbutton").css('display', 'none');     }
   }

   if (tableau.phase == tableau.phaseEnum.authPhase) {
     $("#getvenuesbutton").css('display', 'none');
   }

   $("#getvenuesbutton").click(function() {
       tableau.connectionName = "Foursquare Venues Data";
       tableau.alwaysShowAuthUI = true;
       tableau.submit();  // This ends the UI phase
   });

   tableau.initCallback();
 };
```

Code explanation
----------------

The connector's `init` function is called each time that the connector
is loaded. This gives the connector an opportunity to perform any
initialization that the connector requires in each phase. In the `init`
function, you can determine what phase is active by testing the
`tableau.phase` property.

In this connector, one task for the `init` function is to try to get the
access token from the page URL. As you've already seen, during the
interactive phase, the connector redirects to Foursquare, and Foursquare
redirects back to the connector using a URL that includes the access
token. However, when the connector is loaded again for the
data-gathering phase, the page URL does not have the access token in it.

The first section of the `init` code handles this case. Every time the
page is loaded, the code in the `init` function tries to get the access
token from the URL. This succeeds only if the connector is in its
interactive or auth phases, since these phases can prompt the user to
sign in. In those two cases, if the `parseAccessToken` function has
returned an access token, the code sets the `tableau.password` property
to the value of the access token. As you saw earlier, this makes the
access token available to the `getTableData` function for the
data-gathering phase.

Another task for the `init` code is to display the appropriate UI for
the phase that the connector is in. These are the conditions:

-   If the user is not signed in to Foursquare, the text "You are not
    signed in" should be displayed. This is handled with a call to the
    `updateUIWithAuthState` helper function.

-   If the connector is in its interactive phase and if the user is not
    yet signed in, the <span class="uicontrol">Get Venues I Like</span>
    button should be hidden—this button is useful only after the user is
    signed in.

-   Similarly, if the connector is in its auth phase, the only UI that
    the page should display is the button that lets the user sign in. In
    this tutorial, this also consists of hiding the <span
    class="uicontrol">Get Venues I Like</span> button.

You might recognize some of this logic from the `document.ready`
function that you added earlier in the tutorial. This allows you to work
with the connector in a browser, which is useful for testing in the
simulator, as we'll explain in the next part of the tutorial.

Finally, the code in the `init` function handles the user's input in the
interactive phase. In this tutorial, the only interaction is that the
user can click the <span class="uicontrol">Get Venues I Like</span>
button (whose ID is `getvenuesbutton`) after signing in. The click is
handled with a small block of jQuery code.

As in any web data connector, when the user has finished interacting
with the page, your code sets `tableau` object properties like
`connectionName` and `connectionData` (if required), and calls
`tableau.submit` to tell Tableau that the interactive phase is done.

There is one important difference in this `init` function, which is this
line:

`tableau.alwaysShowAuthUI = true;`

This tells Tableau that if the `tableau.password` is missing during
data-gathering phase, Tableau should call the connector in auth phase
and the connector will display the UI that lets the user sign in again.
You always set the `tableau.alwaysShowAuthUI` for a connector that uses
OAuth, and you must set the property in a custom `init` function.

Wrap the code in a function
---------------------------

The last coding task is to wrap the entire contents of the
`foursquare.js` file in an immediately invoked function expression
([IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)).
This adds a measure of security by preventing other linked scripts from
accessing secure information inside `foursquare.js`.

To do this, add the following to the top of the file, above the line
that starts with `var config`:

```js
(function() {
```

This is the opening part of the function.

At the very bottom of the file, add the closing elements for the
function:

```js
})();
```

The page so far
---------------

At this stage of the tutorial, this is what the `foursquare.js` file
looks like.

```js
 (function() {
   var config = {
       clientId: 'IX34GIPHSFDNRAUWUZXHTKFDTA4Q3YJQPDJ11OU4AS1MS3TP',
       redirectUri: 'http://localhost:8888/Examples/foursquare.html',
       authUrl: 'https://foursquare.com/',
       version: '20150901'
   };

   $(document).ready(function() {
       var accessToken = parseAccessToken();
       var hasAuth = accessToken && accessToken.length > 0;
       updateUIWithAuthState(hasAuth);

       $("#connectbutton").click(function() {
           doAuthRedirect();
       });
   });

   function updateUIWithAuthState(hasAuth) {
       if (hasAuth) {
             $(".notsignedin").css('display', 'none');
           $(".signedin").css('display', 'block');
       } else {
           $(".notsignedin").css('display', 'block');
           $(".signedin").css('display', 'none');
       }
   }

   function doAuthRedirect() {
       var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id='
                                + config.clientId
                                + '&redirect_uri='
                                + config.redirectUri;
       window.location.href = url;
   }

   function getVenueLikesURI(accessToken) {
       return "https://api.foursquare.com/v2/users/self/venuelikes?oauth_token=" +
               accessToken + "&v=" + config.version;
   }

   function parseAccessToken() {
       var query = window.location.hash.substring(1);
       var vars = query.split("&");
       var ii;
       for (ii = 0; ii < vars.length; ++ii) {
          var pair = vars[ii].split("=");
          if (pair[0] == "access_token") { return pair[1]; }
       }
       return(false);
   }

   //------------- Tableau WDC code -------------//
   var myConnector = tableau.makeConnector();

   myConnector.init = function() {
     var accessToken = parseAccessToken();
     var hasAuth = (accessToken && accessToken.length > 0) ||
                        tableau.password.length > 0;

     if (tableau.phase == tableau.phaseEnum.interactivePhase ||
                          tableau.phase == tableau.phaseEnum.authPhase) {
         if (hasAuth) {
             tableau.password = accessToken;
             if (tableau.phase == tableau.phaseEnum.authPhase) {
               // Auto-submit here if we are in the auth phase
               tableau.submit()
             }
         }
     }

     updateUIWithAuthState(hasAuth);

     if (tableau.phase == tableau.phaseEnum.interactivePhase) {
        if (!hasAuth) {
         $("#getvenuesbutton").css('display', 'none');     }
     }

     if (tableau.phase == tableau.phaseEnum.authPhase) {
     $("#getvenuesbutton").css('display', 'none');
     }

     $("#getvenuesbutton").click(function() {
       tableau.connectionName = "Foursquare Venues Data";
       tableau.alwaysShowAuthUI = true;
       tableau.submit();  // This ends the UI phase
     });
     tableau.initCallback();
   };

   myConnector.getColumnHeaders = function() {
       var fieldNames = ["Name", "Latitude", "Longitude", "Checkin Count"];
       var fieldTypes = ["string","float","float","int"];
       tableau.headersCallback(fieldNames, fieldTypes);
   };

   myConnector.getTableData = function(lastRecordToken) {
       var dataToReturn = [];
       var hasMoreData = false;

       var accessToken = tableau.password;
       var connectionUri = getVenueLikesURI(accessToken);

       var xhr = $.ajax({
           url: connectionUri,
           dataType: 'json',
           success: function (data) {
               if (data.response) {
                   var venues = data.response.venues.items;
                   var ii;
                   for (ii = 0; ii < venues.length; ++ii) {
                       var venue = {'Name': venues[ii].name,
                                    'Latitude': venues[ii].location.lat,
                                    'Longitude': venues[ii].location.lng,
                                    'Checkin Count': venues[ii].stats.checkinsCount};
                       dataToReturn.push(venue);
                   }

                   tableau.dataCallback(dataToReturn, lastRecordToken, hasMoreData);
               }
               else {
                   tableau.abortWithError("No results found");
               }
           },
           error: function (xhr, ajaxOptions, thrownError) {
               // If the connection fails, log the error and return an empty set.
               tableau.log("Connection error: " + xhr.responseText + "\n" +
                            thrownError);
               tableau.abortWithError("Error while trying to connect to Foursquare.");
           }
       });
   };

   // Register the tableau connector--call this last
   tableau.registerConnector(myConnector);

   })();
```

Next
----

In the next part of the tutorial, you'll test the web data connector
using the simulator. You'll also learn why you cannot use the simulator
alone when your connector uses OAuth.

[Web Data Connector OAuth Tutorial Part 8: Test the Connector in the
Simulator](wdc_tutorial_oauth_client_test_in_simulator.html)


What you'll do
--------------

In this part of the tutorial, you'll test the finished connector in the
simulator that's part of the Web Data Connector SDK.

Test the finished connector in the simulator
--------------------------------------------

You can now test the web data connector in the simulator.

1.  Start the simulator by entering the following in your browser:

    `localhost:88888/simulator/`

    (As before, we're assuming that the server is listening on
    port 8888.)

2.  In the <span class="uicontrol">WDC URL</span> box at the top of the
    simulator, enter the path to the foursquare connector:

    `../Examples/foursquare.html`

3.  Click the <span class="uicontrol">Run Interactive
    Phase</span> button.

    The simulator opens a window and displays the UI for the Foursquare
    web data connector.

    ![]({{ site.baseurl }}/assets/wdc_oauth_tutorial_run_interactive_phase_in_simulator.png)

4.  If the page indicates that you're not logged in to Foursquare, click
    the <span class="uicontrol">Connect to Foursquare</span> button and
    log in.

5.  Click the <span class="uicontrol">Get Venues I Like</span> button.

    The simulator closes the window that displayed the UI phase of the
    connector and returns to the main simulator window. At the bottom of
    the main simulator window, the simulator displays the column names
    and the values for any venues that you've "Liked" on Foursquare.

    ![]({{ site.baseurl }}/assets/wdc_tutorial_oauth_test_in_new_simulator.png)

    Notice also that the simulator has filled the <span
    class="uicontrol">Password</span> box with the authentication token.
    Remember that in your code, when you got the authentication token
    back from Foursquare, you set the `tableau.password` property to the
    token value. When you run the simulator, after the UI phase is done,
    the simulator displays the values of `tableau` object properties.

Foursquare.html page {#html-page}
--------------------

**Note**: This listing includes a reference to the `tableauwdc-1.1.1.js`
To connect to a web data connector that uses that version of the WDC
library, you must be using a recent version of Tableau. For more
information, see [Web Data Connector Library
Versions](wdc-library-versions.html).

```html
<!DOCTYPE.html>
 <html>
 <head>
     <meta charset="utf-8">
     <title>Foursquare Connector</title>
     <meta http-equiv="Cache-Control" content="no-store" />
     <!-- Latest compiled and minified CSS -->
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

     <!-- Optional theme -->
     <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
     <!-- Latest compiled and minified JavaScript -->
     <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"
          type="text/javascript"></script>

     <!-- Latest WDC Library -->
     <script src="https://connectors.tableau.com/libs/tableauwdc-1.1.1.js"
          type="text/javascript"></script>

     <!-- This will contain all of your WDC code -->
     <script src="./foursquare.js" type="text/javascript"></script>
 </head>
 <body>
   <div style="margin: auto; text-align: center; margin-top: 50px; max-width: 300px">
     <!-- These labels will toggle depending on whether the user is authenticated
          or not -->
     <p class="signedin">You are signed in!</p>
     <p class="notsignedin">You are not signed in, please click below to sign in
        to your foursquare account.</p>

     <!-- The connect to foursquare button will have a link added to it in the js-->
     <a href="#" id="connectbutton"><img src="./foursquare_connect.png"
          alt="Login with Foursquare"/></a>
     <br /><br />

     <!-- This button will fetch the user's "Liked" venues once the user is authenticated -->
     <p><a href="#" class="btn btn-primary btn-block" id="getvenuesbutton">
       <span class="glyphicon glyphicon-arrow-down"></span> Get Venues I Like</a>
     </p>
   </div>
 </body>
 </html>
```

Foursquare.js page {.html-page}
------------------

```js
 (function() {
   var config = {
         clientId: 'YOUR_CLIENT_ID',
         redirectUri: 'http://localhost:8888/Examples/foursquare.html',
         authUrl: 'https://foursquare.com/',
         version: '20150901'
   };

   $(document).ready(function() {
       var accessToken = parseAccessToken();
       var hasAuth = accessToken && accessToken.length > 0;
       updateUIWithAuthState(hasAuth);

       $("#connectbutton").click(function() {
           doAuthRedirect();
       });
   });

   function updateUIWithAuthState(hasAuth) {
       if (hasAuth) {
             $(".notsignedin").css('display', 'none');
           $(".signedin").css('display', 'block');
       } else {
           $(".notsignedin").css('display', 'block');
           $(".signedin").css('display', 'none');
       }
   }

   function doAuthRedirect() {
       var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id='
                                + config.clientId
                                + '&redirect_uri='
                                + config.redirectUri;
       window.location.href = url;
   }

   function getVenueLikesURI(accessToken) {
       return "https://api.foursquare.com/v2/users/self/venuelikes?oauth_token=" +
               accessToken + "&v=" + config.version;
   }

   function parseAccessToken() {
       var query = window.location.hash.substring(1);
       var vars = query.split("&");
       var ii;
       for (ii = 0; ii < vars.length; ++ii) {
          var pair = vars[ii].split("=");
          if (pair[0] == "access_token") { return pair[1]; }
       }
       return(false);
   }

   //------------- Tableau WDC code -------------//
   var myConnector = tableau.makeConnector();

   myConnector.init = function() {
     var accessToken = parseAccessToken();
     var hasAuth = (accessToken && accessToken.length > 0) ||
                        tableau.password.length > 0;

     if (tableau.phase == tableau.phaseEnum.interactivePhase ||
                          tableau.phase == tableau.phaseEnum.authPhase) {
       if (hasAuth) {
           tableau.password = accessToken;
           if (tableau.phase == tableau.phaseEnum.authPhase) {
               // Auto-submit here if we are in the auth phase
               tableau.submit()
           }
        }
     }

     updateUIWithAuthState(hasAuth);

     if (tableau.phase == tableau.phaseEnum.interactivePhase) {
        if (!hasAuth) {
         $("#getvenuesbutton").css('display', 'none');     }
     }

     if (tableau.phase == tableau.phaseEnum.authPhase) {
     $("#getvenuesbutton").css('display', 'none');
     }

     $("#getvenuesbutton").click(function() {
       tableau.connectionName = "Foursquare Venues Data";
       tableau.alwaysShowAuthUI = true;
       tableau.submit();  // This ends the UI phase
     });
     tableau.initCallback();
   };

   myConnector.getColumnHeaders = function() {
       var fieldNames = ["Name", "Latitude", "Longitude", "Checkin Count"];
       var fieldTypes = ["string","float","float","int"];
       tableau.headersCallback(fieldNames, fieldTypes);
   };

   myConnector.getTableData = function(lastRecordToken) {
       var dataToReturn = [];
       var hasMoreData = false;

       var accessToken = tableau.password;
       var connectionUri = getVenueLikesURI(accessToken);

       var xhr = $.ajax({
           url: connectionUri,
           dataType: 'json',
           success: function (data) {
               if (data.response) {
                   var venues = data.response.venues.items;
                   var ii;
                   for (ii = 0; ii < venues.length; ++ii) {
                       var venue = {'Name': venues[ii].name,
                                    'Latitude': venues[ii].location.lat,
                                    'Longitude': venues[ii].location.lng,
                                    'Checkin Count': venues[ii].stats.checkinsCount};
                       dataToReturn.push(venue);
                   }

                   tableau.dataCallback(dataToReturn, lastRecordToken, hasMoreData);
               }
               else {
                   tableau.abortWithError("No results found");
               }
           },
           error: function (xhr, ajaxOptions, thrownError) {
               // If the connection fails, log the error and return an empty set.
               tableau.log("Connection error: " + xhr.responseText + "\n" +
                            thrownError);
               tableau.abortWithError("Error while trying to connect to Foursquare.");
           }
       });
   };

   // Register the tableau connector--call this last
   tableau.registerConnector(myConnector);

   })();
```
