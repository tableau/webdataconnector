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

We have a very lightweight submission process for this community portal.
One of the requirements for submission to the community section is that 
your connector is hosted online somewhere so that others can use it.
This document will also provide some guidance to how to easily host your connectors
(and for free!). Please read on for details.

-   [Submitting to the Community Portal](#portal)

-   [Suggested methods for connector hosting](#hosting)


Submitting to the Community Portal {#portal}
----------------------------------

After building and testing your web data connector, you can submit it to the
[Community Connector]({{ site.baseurl }}/community/community_home.html) section.

To do this, all you need to do is submit a pull request to the master branch
with some relevant information about your connector.  This will require that you have 
a GitHub account. Once you have a GitHub account, just follow these steps to get
your connector into the Community portal:

1. Fork the [web data connector](https://github.com/tableau/webdataconnector) repository.

2. Run the following command to check out the gh-pages branch which hosts the WDC documentation and community connector portal:
   `git checkout gh-pages`

3. Navigate to the `community` directory and open the `community_connectors.json` file in a text editor.

4. Create a new JSON entry for your connector like the following:
   
   ```js
   {
       "name": "My Cool Connector",
       "url": "https://xyz.com/connector.html",
       "author": "Me",
       "github_username": "",
       "tags": ["v_2.0"],
       "description": "This connector is really cool",
       "source_code": "github.com/Me/MyConnector"
   }  
   ```

   - Name, url, and author are all required.
      
   - A tag for the version of the WDC API used, description, github_username, and source_code are encouraged by not required.  Please limit the description to a short sentence or two.

5. Submit a pull request from your fork to the `gh-pages` branch of the official repo at
   [github.com/tableau/webdataconnector](https://github.com/tableau/webdataconnector/tree/dev).
   See the [GitHub documentation](https://help.github.com/articles/using-pull-requests/)
   for details on submitting pull requests.


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
