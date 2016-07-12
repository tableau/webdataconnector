---
title: Use a WDC in Tableau Desktop
layout: docs
---

> **Important**: Version 2.0 of the WDC is in beta and is incompatible with the currently released versions of Tableau.
> To try the new WDC in Tableau as soon as possible, sign up for the [beta program](http://www.tableau.com/getbeta) to get
> early access to Tableau 10.0.

To use a WDC in Tableau Desktop, complete the following steps:

1. On the start page, in the **Connect** pane, click **More Servers... > Web Data Connector**.

   ![]({{ site.baseurl }}/assets/wdc_desktop_select_wdc_as_connector.png)

1. Enter the URL of a WDC and press Enter.

   ![]({{ site.baseurl }}/assets/wdc_desktop_enter_url.png)

   **Important**: Make sure that you enter the URL of a WDC, and not the URL of the data that you're trying to connect
   to. For example, if you want to connect to Facebook data, you might enter `www.example.com/myFacebookWDC.html`.

1. Tableau loads the WDC page where you can enter any input required by your WDC.

1. Tableau calls your WDC code, downloads data, and displays it in the **Data Source** pane.
