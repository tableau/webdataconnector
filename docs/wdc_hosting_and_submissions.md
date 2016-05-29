---
layout: page
title: Hosting and Submitting to Community Portal
base: docs
---

After building a web data connector, why not share it with the community?
The [Community Connector]({{ site.baseurl }}/community/community_home.html) 
section is designed to showcase the work that other developers have done with the WDC Platform.
It also provides a place for others to browse and explore what
connectors have already been built. 

The process for submitting to the community portal is lightweight. One
requirement for submission to the community section is that your connector is
hosted online somewhere so that others can use it. This document will also
provide some guidance to how to easily host your connectors (and for free!).
Please read on for details.

-   [Submitting to the Community Portal](#portal)

-   [Suggested methods for connector hosting](#hosting)


Submitting to the Community Portal {#portal}
----------------------------------

After building and testing your web data connector, you can list it in the
[Community Connector]({{ site.baseurl }}/community/community_home.html) section.

To do this, all you need to do is publish your connector to npmjs.com using
a few special attributes in your connector's `package.json` file. This will
require that you have an [npm account](https://www.npmjs.com/signup). Once you
have an npm account, just follow these steps to get your connector into the
Community portal:

1. If your connector doesn't already have one, create a file called [package.json](https://docs.npmjs.com/getting-started/using-a-package.json)
   in the root of your project.

2. At a bare minimum, your `package.json` file should include the following
   properties.

   ```json
   {
     "name": "my-unique-connector-name-wdc",
     "homepage": "https://my-unique-connector-wdc.herokuapp.com",
     "keywords": [
       "tableau-wdc"
     ]
   }
   ```

   In particular, the following _must_ be satisfied for your connector to appear:

   - The `name` of your connector must end in `-wdc`.
   - The `homepage` of your connector must point to hosted version of your WDC.
   - The `keywords` array must contain `tableau-wdc` as one of its elements.

3. If desired, you may provide additional detail about your connector like so:

   ```json
   {
      "name": "my-unique-connector-name-wdc",
      "description": "Short description of the type of data exposed by your connector.",
      "homepage": "https://my-unique-connector-wdc.herokuapp.com",
      "version": "1.0.0",
      "keywords": [
        "tableau-wdc",
        "my-unique-connector",
        "service-connected-to"
      ],
      "repository": {
        "type": "git",
        "url": "https://github.com/my-handle/my-connector-wdc.git"
      }
   }
   ```

   - The `description` of your connector will be displayed along side your WDC
     and its contents are used as part of the search feature.
   - You should follow [semantic versioning](http://semver.org/) in the `version`
     property of your connector.
   - Additional `keywords` can be provided to improve your WDC's discoverability.
   - If your connector is open source, you can provide `repository` details.
   - Additionally, any information included in your connector's `README.md` file
     will also be used as part of the Community portal's search feature.

4. Once your `package.json` is ready, publish your connector to npmjs.com using
   the [following guide](https://docs.npmjs.com/getting-started/publishing-npm-packages).

As an example, you can look at the [Star Wars API WDC](https://www.npmjs.com/package/swapi-wdc)
and [its corresponding package.json](https://github.com/tableau-mkt/swapi-wdc/blob/master/package.json#L1) file.


Suggested methods for connector hosting {#hosting}
---------------------------------------

There are several free hosting services that you can use for connector.  You can host
your connector anywhere you please, but we have two suggested locations that we have
seen to be the easiest to use.  

1. Host your static content on GitHub pages.

    If your connector is composed of client side code only (just HTML/CSS/JS files),
    you can host your content for free on GitHub Pages (This is actually what's hosting the documentation
    you are currently reading!).  

    GitHub Pages makes it really easy to host content, especially if your connector code
    is already on GitHub.  Check out their tutorial for details: [pages.github.com/](https://pages.github.com)

2. Host your node app on Heroku.

    If your connector contains a sever component, like the Node Proxy sample, 
    you can host your connector for free on Heroku.  There are certain usage restrictions; for example
    their free tier requires the connector to be offline for a few hours a day. 

    Check out their tutorial for more details: [Heroku Tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)
