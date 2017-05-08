The OAuth proxy example is an example of how to create a WDC that uses OAuth 2.0 for authentication.

 There are a few steps you need to follow to run the sample locally:

 1.  In this folder (OAuthProxyExample), run 'npm install'.
 2.  Create a developer app on foursquare's developer site (https://developer.foursquare.com/).
        - Make note of the ClientId and ClientSecret for your app.
 3. Still on the foursquare developer site, configure your app by adding the following string
    to the "Redirect URI(s)" field: "http://localhost:3333/redirect"

    If you wish to run your application on another port or on a hosted site, you will need
    to add further redirect URIs to this configuration.

 4. In config.js, replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with the values from step 2.
 5. In public/foursquare.js, replace "YOUR_CLIENT_ID" with the value from step 2.
 6. Run 'npm start' from this folder.
 

You will now have the sample WDC hosted at localhost:3333/index.html.  Enter that URL
into the WDC simulator or into Tableau to use the connector.