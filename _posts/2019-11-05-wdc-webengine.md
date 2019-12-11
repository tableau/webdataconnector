---
title: "Web Data Connectors use QT WebEngine browser starting in Tableau 2019.4"
abstract: "In Tableau 2019.4 and later, Web Data Connectors use an internal browser called QT WebEngine. This change offers WDC developers and users the features and capabilities available to modern browsers."
---


Prior to Tableau 2019.4, Web Data Connectors used an internal browser in Tableau called Qt WebKit. In Tableau 2019.4 and later, Web Data Connectors use Qt WebEngine (a Chromium-based browser). The Qt WebEngine is a significant upgrade over the previous browser and provides better support for HTML5 and modern JavaScript tools.

Because of the change, users and developers of some WDCs might encounter issues. For more information, see [Troubleshoot WDC WebEngine Issues in Tableau 2019.4 and later]({{site.baseurl}}/docs/wdc_webengine.html).

In addition, the debugging process for WDCs has changed. Developers will now be able to use the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools){:target="_blank"}{:ref="noopener"} for debugging. For  more information, see the [Debugging a WDC in Tableau Desktop 2019.4 (and later)]({{site.baseurl}}/docs/wdc_debugging.html#debug-chrome).

If you are curious to see what new features are available with the new Chromium-based browser in Tableau 2019.4, you can open the Web Data Connector dialog box in Tableau, and point to the HTML5 test site (`https://html5test.com`). Note that this test site is not a WDC. The HTML5Test is a web site that reports the browser's compatibility with the HTML5 standards.

![HTML5test]({{site.baseurl}}/assets/html5test_wdc_WebEngine.png){:height="25%" width="25%"}