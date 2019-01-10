---
title: WDC Authentication
layout: docs
---

Many connectors require authentication to connect to a data source.
For these connectors, you must handle authentication in your connector code and create a form interface to prompt users for authentication information.
Separately, the WDC also includes logic that you can use for re-authentication as a convenience.
This topic describes how to re-authenticate users for connectors that have already run.

* TOC
{:toc}

Types of authentication {#auth-types}
-------------------------------------

Authentication types are used to help users re-authenticate.
The WDC API supports the following authentication types:

- `basic`. User name and password authentication.
- `custom`. Other authentication methods, including OAuth for example.
- `none`. No authentication is required. If you do not specify an authentication type, `none` is assumed.

A connector should set its auth type in a custom init method.
For example:

```javascript
  // Init function for connector, called during every phase
  myConnector.init = function(initCallback) {
      tableau.authType = tableau.authTypeEnum.custom;
      initCallback();
  }
```

For connectors that require authentication, the auth type must be set.  Otherwise,
Tableau will not know how to re-authenticate the user when the user is un-authenticated, which is a common scenario.
For example, passwords (or tokens) should be stored in the tableau.password property.  The contents of this property
are not ever written to disk.  So when a user opens a saved workbook that is attached to a WDC data source,
there will not a be a password for that source.  

In that case, if the user wishes to refresh the extract, re-authentication needs to happen first.  When
the user tries to refresh the data source, one of three things can happen depending on the value of authType.

- If authType is `none`, then nothing will happen. 

- If authType is `basic`, Tableau will show a standard username/password dialog.

    <img class="img-responsive docs-img" src="{{ site.baseurl }}/assets/wdc_basic_auth.png" alt="">

- If authType is `custom`, Tableau will launch the web data connector in a special Auth Phase (see the following section).

After that, the tableau.username and tableau.password property will both have values, and the extract
can now be refreshed. 

***Note***: authType in part replaced alwaysShowAuthUI from version 1 of the API.


The WDC Auth Phase {#auth-phase}
------------------------
The WDC has two primary phases, as described in the [WDC Lifecycle and Phases]({{ site.baseurl }}/docs/wdc_phases.html)
section.  But there is a third phase that is only relevant for WDCs that use an auth type of `custom`. 
The auth phase is more of an alternative to the interactive phase than a separate phase. 

The auth phase will be displayed by Tableau in two scenarios: 

- The WDC uses authType `custom`, the current user is un-authenticated (as described above, 
  when opening an existing workbook), and the user attempts to refresh the extract or edit the connection.

- The WDC developer calls [tableau.abortForAuth]({{ site.baseurl }}/docs/api_ref.html#webdataconnectorapi.tableau.abortforauth).

    This method is provided so that the developer can explicitly tell Tableau the current user is un-authenticated.
    For example, this can be helpful when working with OAuth.  In some scenarios, the access token used to get resources
    from an API can expire or be revoked.  In that scenario, before fetching data, the WDC would want to call this method
    in order to re-authenticate the user.  For more information, see the **OAuthProxyExample** connector included in the SDK. 
    
    **IMPORTANT:** This function must be called from the init method during the gather data phase.  Additionally, this function only works when called from a fresh instance of Tableau.  I.e. if you call this immediately after creating the connection, the call will fail.  This is not ideal behavior, but the intended scenario for this function is when called from opening a workbook from scratch (when the auth token is no longer available).  
    
    
In the auth phase of the WDC, any changes to properties other than tableau.password and tableau.username will
be ignored.  Thus, it is a best practice to only show the UI that is necessary to re-authenticate the user,
and then auto-submit the connector for the user once they have been authenticated.
For example, in the **OAuthProxyExample** this is how this
is handled in the custom init method:

```javascript
  // Init function for connector, called during every phase but
  // only called when running inside the simulator or tableau
  myConnector.init = function(initCallback) {
      tableau.authType = tableau.authTypeEnum.custom;

      // If we are in the auth phase we only want to show the UI needed for auth
      if (tableau.phase == tableau.phaseEnum.authPhase) {
        $("#getvenuesbutton").css('display', 'none');
      }

      if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {
        // If API that WDC is using has an enpoint that checks
        // the validity of an access token, that could be used here.
        // Then the WDC can call tableau.abortForAuth if that access token
        // is invalid.
      }

      var accessToken = Cookies.get("accessToken");
      console.log("Access token is '" + accessToken + "'");
      var hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
      updateUIWithAuthState(hasAuth);

      initCallback();

      // If we are not in the data gathering phase, we want to store the token
      // This allows us to access the token in the data gathering phase
      if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
          if (hasAuth) {
              tableau.password = accessToken;

              if (tableau.phase == tableau.phaseEnum.authPhase) {
                // Auto-submit here if we are in the auth phase
                tableau.submit()
              }

              return;
          }
      }
  };
```

Advanced: Auth Purpose Mechanism {#auth-purpose}
------------------------------------
Understanding the content in the **OAuthProxyExample** included with the SDK is
recommended before proceeding on with this or the following section.  That tutorial contains helpful terminology
that is used without explanation here.

Specifically for data sources that use OAuth as an authorization mechanism, there is a special
enum in the API that can be useful for making a highly scalable connector.  This is an advanced technique
and can be safely ignored in many scenarios.

The motivation for this property stems from the fact that many OAuth providers only allow a limited
number of access tokens to be valid at a given time.  For example, certain OAuth providers allow 25 
access tokens to be valid for a given user/client pair.  If a 26th access token were to be issued, the 1st access
token would become invalid.  For certain OAuth providers, this number may be even smaller.  We have seen OAuth providers that only allow
1 access token to be valid at a given time for any user/client pair. 

Given this, the following scenario could occur if the WDC was using a source that only allowed one valid access token:

- A user creates a data source with your WDC (1 access token is created and associated with that data source).

- The user publishes the data source to Server and enables automatic refreshes.

- The user creates a second data source (2nd access token is created, rendering the first one invalid).  

- The automatic refresh on server would now fail because the associated access token is invalid.

In order to get around this problem, you can associate all data sources created from Tableau Desktop with
a given client, and all data sources refreshed on Tableau Server with another client.  To do this, in your WDC
you can use the [tableau.authPurpose]({{ site.baseurl }}/docs/ref_home.html#webdataconnectorapi.tableau.authpurpose)
to read which context your WDC is currently running in.  If that context is `ephemeral` then the WDC is 
being run from Tableau Desktop.  If the context is `enduring`, then the WDC is being run on Tableau Server during
an automated refresh.  You can use this property to set the client ID appropriately when performing OAuth flows.

It is also important that your connector sets the tableau.username property to be whatever identity is 
associated with an access token (most commonly an email or username).  This will allow Tableau to share access
tokens between data sources on Server so that even if the OAuth provider restricts you to n valid access tokens, 
you can support more than n data sources.


Advanced: Authentication on Server {#server-auth}
------------------------
Currently, there is no way to re-authenticate a data source from Tableau Server directly.

For example, if you build a connector that uses OAuth as an authorization mechanism, each data source
will have an associated access token.  But these access tokens can expire, 
and when that happens, the data source would no longer be usable.

Luckily, with OAuth (and often there is a parallel with other types of authorization and authentication mechanisms),
there is a way to refresh these access tokens programmatically.  For OAuth specifically, we recommend
fully implementing the refresh flow so that when an access token expires, the refresh token
can be used to get a new, valid access token.
