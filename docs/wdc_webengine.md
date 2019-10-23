---
title: Troubleshoot WDC WebEngine Issues in Tableau 2019.4 and later
layout: docs
---
Prior to Tableau 2019.4, Web Data Connectors used an internal browser in Tableau called Qt WebKit. In Tableau 2019.4 and later, Web Data Connectors use Qt WebEngine (a Chromium-based browser). Qt WebEngine is a significant upgrade over previous browser and WDC developers will benefit from this upgrade with the ability to use modern JavaScript, and Chrome developer tools for debugging WDC code. However,
some customers might experience problems using their existing connectors in Tableau 2019.4 (and later) because of the change from Qt WebKit to Qt WebEngine in Tableau. This topic describes some of these issues and provides possible solutions.

---

* TOC
{:toc}

---

### Before you begin

Before diagnosing problems, be sure to launch Tableau Desktop with debugging enabled  (`--remote-debugging-port=9000` option) and check for console messages. These will also be written to the Tableau log file (regular log file on Tableau Desktop; the `tabprotosrv` logs on Tableau Server).

### `tableau.exe -DebugWDC` doesn't work

**Resolution:** Under WebEngine, we use regular Chrome to debug WDCs. Launch Tableau with `--remote-debugging-port=9000` in order to debug it. You no longer need to launch an additional window for debugging.

### Chrome debugging doesn't work when refreshing the extract

**Resolution:** Developers might find it challenging staying "connected" to a remote debugging session in Chrome when performing refreshes. This is because Tableau disconnects the connection before performing a refresh of an extract, causing the Chromium debugging session to be reset and a new Chromium page instance used in the new connection. The recommended way to debug getSchema and getData are through the Tableau data pane: after dragging out a table to the join area, connect to Chrome debug tools, set your breakpoints, and then click "Update Now".

### `wdclib` version not supported

**Details:** In Tableau 2019.4, we no longer support older versions of `wdclib` (the WDC SDK library). This includes version 1.0, 1.1, 2.0.0, 2.0.1. See [WDC Versions]({{site.baseurl}}/docs/wdc_library_versions.html).

**Resolution:** WDCs that use an old version of `wdclib` need to upgrade to the latest version. If you are a developer of a Web Data Connector, refer to the migration guide for the steps to upgrade from version 1.x, see [Upgrading from WDC Version 1.x]({{ site.baseurl }}\docs\wdc_upgrade). If you are already using a 2.x library, you should be able to just upgrade to a newer version of the library (for example, `wdclib-2.3.latest.js`). For more information, see [WDC Versions]({{ site.baseurl }}\docs\wdc_library_versions).

### JavaScript console errors, such as `not a valid WDC` or `tableau.XXX not a valid object`

**Details:** WDCs under WebKit were initialized in a synchronous manner, which prevented their code from executing until all bootstrapping code was complete. Under WebEngine, it is not possible to make this guarantee. If your WDC attempts to use the `window.tableau` object before the `init` method is called,problems might occur due to the API not being fully initialized.

**Resolution:** For many WDCs, simply upgrading to the latest `wdclib` will help. We have released patched versions of 2.1.x, 2.2.x, and 2.3.x to accommodate this. Make sure the WDC is using `wdclib-2.1.latest.js`, `wdclib-2.2.latest.js`, or `wdclib-2.3.latest.js`. It is important that WDC developers be aware that they still may not reliably use the `window.tableau` object until the WDC has been initialized. For example, it is illegal to use `window.tableau.log` before the WDC has been initialized. There is no resolution to this latter issue; WDCs should simply not do this.

### Mixed-mode HTTP(S) errors

**Details**: Under WebKit used in Tableau 2019.3 and earlier, mixed-mode HTTP and HTTPS calls were legal. That is, a WDC was able to make an AJAX request from an HTTPS host to a HTTP host. In Tableau 2019.4 and later, WebEngine reports errors when this occurs.

**Resolution:** Always use HTTPS endpoints. Do not use mixed-mode.

### Problem: Cookies are not preserved between instances of the WDC connection dialog.

**Details:** Previously cookies may have been preserved under Qt WebKit WDC connection dialog instances. This was never intentionally supported and does not work with Qt WebEngine.

**Resolution:** Don't rely on cookies. Use `tableau.connectionData` to pass data and expect users may need to re-authenticate if you don't preserve session data.

### Problem: Can't find WDC logs

**Details:** WDC emits all sorts of helpful logging information, in addition to log messages written through the tableau.log JavaScript API.

**Resolution:** WDC logging information has moved. In Tableau Desktop, the WDC logging can be found in the regular log file. On Tableau Server, the WDC logging remains in `tabprotosrv` log.

### Problem: help my WDC doesn't work and I can't do anything to fix it! Can I still use WebKit (the old browser engine)?

**Details:** Some customers may get stuck working with broken connectors. In a pinch, they can roll back Tableau to use WebKit.

**Resolution:** Customers can revert to WebKit in a WDC legacy mode. This support will not last forever. To enable this, customers need to set LegacyWdcMode to true in the general Settings group for the current Tableau version in their registry/plist. This applies to both Desktop and Server.
