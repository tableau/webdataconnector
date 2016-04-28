---
layout: page
title: What Happens at Run Time (Phases of a Web Data Connector) 
base: docs
---

When you use Tableau to connect to a web data connector, Tableau
interacts with the HTML page in phases.

-   [First phase: Interact with the user (if necessary)](#phase-one)

-   [Second phase: Gather data](#phase-two)

-   [Alternative phase: Display authentication UI
    (refresh extract)](#phase-three)

First phase: Interact with the user (if necessary) {#phase-one}
--------------------------------------------------

The first phase is the interactive phase: it provides a chance for the
web data connector page to interact with the user. Tableau (Tableau
Desktop or Tableau Server) begins by loading the connector page. If your
connector needs to initialize resources, the code can include an
initialization function.

The important aspect of this phase is that the connector can display UI
that's defined in the connector file. In the HTML UI, the user specifies
values that you need later for fetching the data. For example, the HTML
UI might let the user enter a date range or a stock ticker symbol,
select the name of a city from a list, and so on. If the data source
requires authentication, the connector can also prompt the user for
credentials during this phase.

Any information that the page gathers from the user and that's needed
later has to be put into a property that's managed by Tableau Desktop or
Tableau Server. This is important; the two phases of the web data
connector interaction happen in entirely separate browser contexts, so
there is no other mechanism (like global variables or cookies) that your
code can use to persist and pass information between the phases.

At the end of this phase, your code calls a function to submit the
values from the user to Tableau and let Tableau know that this phase is
concluded. If your code includes a shutdown function, Tableau then calls
the shutdown function, which lets your code close resources and perform
other cleanup.

Here's a summary of the interactive (first) phase:

1.  In Tableau Desktop, the user enters the URL for the connector and
    Tableau loads the connector page.

2.  Code in the connector creates a connector object and registers it
    with Tableau.

3.  The connector's HTML page displays UI to gather information from
    the user. If the connector does not need to prompt the user for
    values, no UI is displayed.

4.  The code for the first phase runs. If the connector gathered
    information from the user, the information is stored in a Tableau
    property for use in subsequent phases.

Second phase: Gather data {#phase-two}
-------------------------

The second phase is the data-gathering phase. When Tableau needs to get
the data from your connector, it loads the connector a second time. As
noted earlier, this is an entirely new instance of the web data
connector.

During this phase, Tableau asks the web data connector for two types of
information: the data schema and the data itself. Tableau calls a
function in your code to get the schema—column names and data types of
the data that the web data connector will provide.

Tableau then calls another function in the page to get the actual data.
Your code performs the steps required in order to get the data. If the
user provided information during the interactive phase, your code can
get the user's values from Tableau and use those values in your data
queries.

After the connector code has gathered the data, it passes the data to
Tableau. If necessary, your code can fetch data and return it to Tableau
in chunks. This might be the case if the data source you're querying
returns only a limited number of records with each call. If the
connector gathers data in chunks, it passes each chunk to Tableau; when
all the data is gathered, the connector passes the last chunk to Tableau
and indicates that there is no more data.

After Tableau has the schema and all the data, Tableau creates an
extract that can be used to create visualizations.

Here's a summary of the data-gathering (second) phase:

1.  Tableau loads the connector page.

2.  Tableau calls a function to get the column names and column
    data types.

3.  Tableau calls a function to get the data itself. If necessary,
    Tableau calls this function multiple times until your code indicates
    that the data is complete.

4.  Tableau loads the data into a view.

Alternative phase: Display authentication UI (refresh extract) {#phase-three}
--------------------------------------------------------------

An alternative phase can occur if the connector is invoked in order to
refresh a data extract that the connector created. When an extract must
be refreshed, Tableau does not need to change the schema, but it might
need to make a call to the external data source for authentication.
(This is not really a third phase, because it does not follow the other
two; it's an alternative to the first phase.)

If the connection uses basic or digest authentication, Tableau displays
a dialog box that asks the user for a user name and password. However,
if the connector is using OAuth for authentication, and if the OAuth
token has expired when the extract is refreshed, Tableau invokes the web
data connector in the authentication phase. In this mode, the connector
should display only the UI that is required in order to get an updated
token.

See also
--------

[How a Web Data Connector Works](wdc_how_it_works.html)
