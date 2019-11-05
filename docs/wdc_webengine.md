---
title: Troubleshoot WDC WebEngine Issues in Tableau 2019.4 and later
layout: docs
---
Prior to Tableau 2019.4, Web Data Connectors used an internal browser in Tableau called Qt WebKit. In Tableau 2019.4 and later, Web Data Connectors use Qt WebEngine, a Chromium-based browser. The Qt WebEngine is a significant upgrade over the previous internal browser and WDC developers will benefit from being able to use modern JavaScript tools and practices that improve the user interface and user interactions. The new browser provides better support for HTML5 and allows developers to use modern debugging tools and the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools){:target="_blank"}{:ref="noopener"} for debugging WDC code.

However, because of the internal browser change, some customers might experience problems using their existing connectors in Tableau 2019.4 and later. This topic describes some of these issues and provides possible solutions.

---

* TOC
{:toc}

---

### Before you begin

Before diagnosing problems, be sure to launch Tableau Desktop with debugging enabled  (`--remote-debugging-port=9000` option) and check for console messages. For more information, see [Debugging in the Simulator and the Debugger]({{site.baseurl}}/docs/wdc_debugging.html).

The console messages will also be written to the Tableau log file (regular log file on Tableau Desktop; the `tabprotosrv` logs on Tableau Server). To open the WDC in the debugger, open a new Chrome browser instance and set the URL to `localhost:9000`. Select the WDC in the browser and begin debugging. For  more information, see [Debugging a WDC in Tableau Desktop 2019.4 (and later)]({{site.baseurl}}/docs/wdc_debugging.html#debug-chrome).

---

### Starting Tableau using `tableau.exe -DebugWDC` doesn't work

**Resolution:** Starting with Tableau 2019.4, you can use the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools){:target="_blank"}{:ref="noopener"} to debug WDCs. You no longer use the built-in debugger that was available in earlier versions of Tableau (before Tableau 2019.4). See [Debugging a WDC in Tableau Desktop 2019.4 (and later)]({{site.baseurl}}/docs/wdc_debugging.html#debug-chrome).

---

### Debugging connection was closed (when refreshing the extract)

**Resolution:** When performing data refreshes, you might find it challenging to stay connected to a remote debugging session using the Chrome Developer Tools. This is because Tableau disconnects the debugging connection before performing a refresh of an extract, causing the debugging session to be reset, which requires that you open a new instance of the Chrome Developer Tools to make the new connection. The recommended way to debug the `getSchema` and `getData` methods is to use the Tableau Data pane and then set breakpoints in the Developer Tools.

1. Start Tableau (with remote debugging enabled and connect to your WDC (see [Debugging a WDC in Tableau Desktop 2019.4 (and later)]({{site.baseurl}}/docs/wdc_debugging.html#debug-chrome)).  

1. In the Data pane, drag out a table to the join area (if it is not there already).

1. Connect the Chrome Developer Tools to your WDC. Set your breakpoints on the `getSchema` and `getData` methods, and then click **Update Now**.

---

### The WDC library (`wdclib`) version not supported

**Details:** Starting with Tableau 2019.4, Tableau no longer supports older versions of `wdclib` (the WDC library). This includes WDC versions 1.0, 1.1, 2.0.0, and 2.0.1. For more information, see [WDC Versions]({{site.baseurl}}/docs/wdc_library_versions.html).

**Resolution:** WDCs that use an old version of `wdclib` need to upgrade to the latest version. If you are a developer of a Web Data Connector, refer to the migration guide for the steps to upgrade from version 1.x, see [Upgrading from WDC Version 1.x]({{site.baseurl}}\docs\wdc_upgrade.html). If you are already using a 2.x library, you should be able to just upgrade to a newer version of the library (for example, `wdclib-2.3.latest.js`). For more information, see [WDC Versions]({{ site.baseurl }}\docs\wdc_library_versions).

---

### JavaScript console errors, such as `not a valid WDC` or `tableau.XXX not a valid object`

**Details:** In Tableau 2019.3 and earlier, Web Data Connectors use QT WebKit as the internal browser and are initialized in a synchronous manner, which prevents the WDC code from executing until all bootstrapping code is complete. With QT WebEngine, the Chromium-based internal browser used in Tableau 2019.4 and later, it is not possible to make this guarantee. If your WDC attempts to use the `window.tableau` object before the `init` method is called, problems might occur as the API is not fully initialized.

**Resolution:** For many WDCs, simply upgrading to the latest `wdclib` library will help. We have released patched versions of 2.1.x, 2.2.x, and 2.3.x to accommodate this. Make sure your WDC is using the latest version of one of those libraries: `wdclib-2.1.latest.js`, `wdclib-2.2.latest.js`, or `wdclib-2.3.latest.js`. You should also be aware that the WDC can't reliably use the `window.tableau` object until after the WDC has been initialized. For example, it is illegal to use `window.tableau.log` before the WDC has been initialized. There is no resolution to this latter issue; WDCs should simply not do this.

---

### Mixed-mode HTTP(S) errors

**Details**: In Tableau 2019.3 and earlier, which use the QT WebKit internal browser, mixed-mode HTTP and HTTPS calls are legal. That is, a WDC is able to make an AJAX request from an HTTPS host to a HTTP host. In Tableau 2019.4 and later, the Chromium-based QT WebEngine browser reports errors when the WDC attempts mixed-mode calls.

**Resolution:** Always use HTTPS endpoints. Do not use mixed-mode.

---

### Cookies are not preserved between instances of the WDC connection dialog

**Details:** In Tableau 2019.3 and earlier, cookies might have been preserved under Qt WebKit WDC connection dialog instances. This was never intentionally supported and does not work in Tableau 2019.4 and later, which use the Chromium-based Qt WebEngine browser.

**Resolution:** Don't rely on cookies. Use `tableau.connectionData` to pass data and expect users may need to re-authenticate if you don't preserve session data.

---

### Help my WDC doesn't work and I can't do anything to fix it! Can I still use WebKit (the old browser engine) in Tableau 2019.4?

**Details:** Some customers might need to use a WDC that is broken in Tableau 2019.4 and later because of the internal browser change. As a temporary fix, they can use the old Qt WebKit internal browser by using a legacy mode setting.

**Resolution:** Customers can revert to Qt WebKit browser in WDC legacy mode. This support will not last forever. To enable this, customers need to set `LegacyWdcMode` to true (`1`) in the general Settings group for the current Tableau version in their registry/plist. This setting applies to both Tableau Desktop and Tableau Server.

**Windows**: As an administrator on the computer where Tableau is installed, make a backup of the registry file before you make any changes to it.

1. Open the Registry Editor (`regedit.exe`)

1. Add and set the `LegacyWdcMode` registry key to `1`.  The registry value is a `DWORD`.

    Registry key location: `HKEY_LOCAL_MACHINE\SOFTWARE\Tableau\Tableau <version>\Settings\LegacyWdcMode`

**macOS**

* Run the following command from the Terminal command prompt:

    `defaults write com.tableau.tableau-<TABLEAU VERSION>.plist Settings.Extensions.LegacyWdcMode "1"`

    For example in Tableau Desktop 2019.4, use this command:

    `defaults write com.tableau.tableau-2019.4.plist Settings.LegacyWdcMode "1"`
