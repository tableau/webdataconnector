---
title: Hosting and Submitting to the Community Portal
layout: docs
---

Submit your connector to the [Community Connector]({{ site.baseurl }}/community/)
portal to share your work with other developers. To make it easier for others to use your connector,
we ask that you include a link to a hosted version of your connector.

If you don't have a hosted version yet, see our [suggestions for hosting](#hosting).

Submitting to the Community Portal {#portal}
----------------------------------

**Note:** Before you submit a connector, you'll need a Github account.

1. Click on the link below to go to our list of connectors:

   <https://github.com/tableau/webdataconnector/blob/master/community/community_connectors.json>

1. Click the **Edit** icon on the right.

   !["Use the Github web interface to submit a pull request."]({{ site.baseurl }}/assets/submit_connector.gif)

1. Create a new JSON entry for your connector with a name, author, and URL to a hosted version.

   Optionally, you can enter a description, Github user name, link to the source code, and tag for the version of the WDC API.

   For example, you might enter the following:

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

1. Scroll to the bottom of the page and enter a description for your change.

1. Click the **Propose file change** button at the bottom of the page.

1. Click the **Create pull request** button.

1. Confirm your changes on the next page, then click **Create pull request** one more time.

   That's it! A member of our web data connector team will review your changes and merge them into the repository.


Suggestions for hosting your connector {#hosting}
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

    Check out their tutorial for more details:
    [Heroku Tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)
