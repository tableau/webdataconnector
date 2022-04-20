---
title: What's New in 3.0
layout: docs3
---
{% include prelim_note.md %}

The web data connector version 3.0 is a complete rewrite of the web data connector model used in previous versions. Web data connector 3.0 offers developers extended flexibility and a streamlined toolset to create connectors for web-based data that isn’t easily retrieved using conventional ODBC or JDBC drivers. With the Web Data Connector 3.0 SDK, you can build connectors to virtually any web data source faster and more easily than ever before.

The web data connector 3.0 framework revamps the web data connector developer experience by eliminating the hosting overhead of the previous versions. This provides integrated authentication capabilities and modernizes the SDK tools, libraries, and API. These changes reduce the complexity for building a new web data connector.

Additionally, with the new framework, web data connectors appear as named connections in the product and can be distributed through the Tableau Extension Gallery. This makes them more discoverable and usable across the Tableau platform.

## Extensible Protocol Server

In version 3.0, we introduce the extensible protocol server (EPS). EPS is the server that runs your web data connector. An EPS-based connector is a web application that doesn’t require a web server.

## Taco Toolkit

To help you build and configure your EPS-based web data connector, we also created the Taco Toolkit. The Taco Toolkit is a command-line interface (CLI) that you use to create, build, and package your EPS-based connector.