---
title: WDC Custom Initialization and Shutdown
layout: docs
---

Your code might need to open a resource or perform a setup task for the
data source. If so, you can run initialization code that is invoked at
the beginning of each phase. If you don't need custom initialization
logic, you don't need to do anything; code in the Tableau JavaScript
library includes default initialization logic for you.

To implement custom initialization, you create an
[init]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.webdataconnector.init) function for your connector. In the
function, run your initialization code. When initialization is complete,
call the passed in [initCallback]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.initcallback)
to tell Tableau that initialization is finished, as in this example:

```js
    myConnector.init = function(initCallback){
        // Your init code here
        initCallback();
    };
```

One typical scenario for using custom initialization code is to tell tableau about
the auth needs of your connector.  Please see
[WDC Authentication]({{ site.baseurl }}/docs/wdc_authentication.html)
for details on this.

Similarly, if your connector needs to perform custom shutdown logic, you
create a [shutdown]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.webdataconnector.shutdown) function for the
connection. When the shutdown process is complete, call the passed in
[shutdownCallback]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.shutdowncallback),
as in this example:

```js
    myConnector.shutdown = function(shutdownCallback) {
        // Your shutdown code here
        shutdownCallback();
    }
```

As with initialization, if you don't need custom shutdown logic, you can
leave this out, because the code in the Tableau JavaScript library takes
care of it for you.

The initialization or shutdown code is called once per phase. The code
is called during the interaction phase and again during the
gather data phase. If your initialization or shutdown code depends on
which phase the connector is in, you can test the
[tableau.phase]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.phaseenum) property. This
property returns a string value that indicates the phase that the
connector is in: <span
class="api-command-ref">tableau.phaseEnum.interactivePhase</span>, <span
class="api-command-ref">tableau.phaseEnum.gatherDataPhase</span>, or
<span class="api-command-ref">tableau.phaseEnum.authPhase</span>. The
following example shows how to use this property.

```js
myConnector.init = function(initCallback) {
   initCallback();
   if(tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
        tableau.submit();
    }
};
```

### Running the connector without user interaction {#run-without-interaction}

If your connector doesn't require user input, you don't need to create a user interface for your connector. You just
need to call `tableau.submit` when the connector has finished initializing. Include the following code to run a
connector without user interaction:

```js
myConnector.init = function(initCallback) {
    initCallback();
    tableau.submit();
};
```

