---
title: WDC Lifecycle and Phases
layout: docs
---

This document explains the overall lifecycle  of a Tableau Web Data Connector. It is recommended that you understand the
material from the Get Started section before diving into this material.

A WDC is always run with an associated phase.  Tableau loads
the connector inside a web browser at different times and in distinct phases.
This document will explain each of these phases and when each one runs.

* TOC
{:toc}


Lifecycle diagram {#diagram}
--------------------------------------------------

At a high level, the WDC lifecycle is as follows:

<img class="img-responsive docs-img" src="{{ site.baseurl }}/assets/wdc_flow.png" alt="">

**Note**: This is slightly simplified.
For example, `shutdown` and `shutdownCallback` were left out, but both
of these events take place at the end of each phase as well (they mirror
`init` and `initCallback`).

Interactive phase: Interact with the user {#phase-one}
--------------------------------------------------

- Tableau launches the web data connector in the interactive phase.  This
    could be Tableau Desktop, or the Simulator.

    In the interactive phase, the following actions occur:

    - The connector's init method is called by Tableau. A connector will have a default
      init method if not provided by the WDC Developer (see [Custom
      Initialization  and Shutdown for more details]({{ site.baseurl }}/docs/wdc_custom_init_and_shutdown.html)).

    - The connector calls the passed in initCallback to tell Tableau it has finished initialization.

    - The connector waits for interaction to be completed by the end user.  This could entail waiting for
      the user authenticate, waiting for the user to enter some sort of data in a form, and more.
      This is optional, if a connector has no need for user input, it can call submit() immediately.

    - The connector calls the function tableau.submit(), which tells Tableau that the connector
      is ready to finish the interactive phase.

Gather data phase: Fetch data from a web source {#phase-two}
-------------------------

- After the interactive phase has been completed, Tableau will launch the web data connector
    in a new, headless (meaning without UI) browser session.  The connector will now be in the
    gather data phase.  This phase can be launched from Tableau Desktop, Tableau Server, Tableau Online,
    or the Simulator.

    In the gather data phase, the following actions occur:

    - The connector’s init method is called by Tableau, just as it was in the interactive phase.
      The connector may want to take different action in the init method in the gather data phase than
      it did in the interactive phase.  At any time, the current phase of the connector can be read
      through the [tableau.phase]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.tableau.phase)
      property.

    - The connector calls the passed in initCallback to tell Tableau it has finished initialization.

    - Tableau first calls the
      [getSchema]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.webdataconnector.getschema)
      method, which you define for your connector to map web data to table columns in Tableau.

    - The connector will call schemaCallback with a schema object, which passes
      the connector's schema back to Tableau.

    - Tableau then calls the [getData]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.webdataconnector.getdata)
      method of the connector to get the actual data. The getData method will be called by Tableau once for each table
      that has been selected by the end user. For example, if a user drags out two tables
      from the web data connector into the join canvas in Tableau, getData will be called
      twice.

    - The getData method receives a table object as a parameter.  In the getData
      method, the WDC needs to fetch data for that specific table from the web data source,
      and use the [table.appendRows]({{ site.baseurl }}/docs/api_ref#webdataconnectorapi.table.appendrows)
      method to pass data for that table back to Tableau.

    - Once all the data has been fetched for the current table, the WDC should call the passed
      in dataDoneCallback().  At this point, Tableau will go back and call getData for another
      table if necessary.  If not, the WDC flow is completed and data can now be
      analyzed within Tableau.

    **Note**: For connectors with multiple tables, there is no deterministic order for the calls to the `getData` method.
    However, the base table in a join (the top and leftmost table) will always have its `getData` method called first.

Authentication phase: Display authentication UI when needed {#phase-three}
--------------------------------------------------------------

The authentication phase is an optional phase which Tableau uses to refresh extracts that require authentication. Rather
than reload the connector and get the schema again, Tableau runs the authentication phase to only display the user
interface required for authentication.

**Note**: This is not really a third phase, because it does not follow the other
two; it's an alternative to the first phase.

In this mode, the connector should display only the UI that is required in order to get an updated
token.  Updates to properties other than `tableau.username` and `tableau.password`
will be ignored during this phase.

For more information, on how to use the authentication phase, see
[WDC Authentication]({{ site.baseurl }}/docs/wdc_authentication.html).


Pass data between phases
------------------------

Often it is necessary to pass data from one phase to another.
For example, you might want to store user input from the interaction phase and use the input in the get data phase to build personalized requests to an API.

You can store data that you want to pass between phases using the `tableau.connectionData` property.
The property can only store data as a string, so if you want to store JavaScript objects, you must serialize and deserialize the data.

For example, to store a JavaScript object as a string, you might run the following code:

```
tableau.connectionData = JSON.stringify(example_data);
```

Then, to convert the string back into a JavaScript object, you might run the following code:

```
JSON.parse(tableau.connectionData);
```

For an example of how you might use this in a web data connector, see the [Multiple Tables Tutorial]({{ site.baseurl }}/docs/wdc_multi_table_tutorial).
