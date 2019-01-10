var webdriver_chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var should = require('should');
var express = require("express");
var path = require("path");
var config = require('./config.js');

var app = express();

describe('Earthquake USGS Connector', function(){
  var driver;
  var server;
  let timeout = 60000;
  this.timeout(timeout);

  // run setup once before tests
  before(function(done) {
    // Spin up file server
    app.use(express.static(path.join(__dirname, "../../../")));
    server = app.listen(config.port);

    // create driver
    driver = new webdriver.Builder()
      .withCapabilities({
        browserName: "chrome"
      })
      .setChromeOptions(new webdriver_chrome.Options().headless())
      .build();

    // open simulator page
    driver.get('http://localhost:' + config.port + '/Simulator').then(function() {
      done();
    });
  });

  // run cleanup once after tests
  after(function(done) {
    server.close();
    driver.quit().then(done);
  });

  it("Should be Able to Enter a Url", function(done){
    let addressBar;
    const wdcUrl = '../Examples/html/earthquakeUSGS.html';
    driver.findElement({id:'address-input'})
      .then(function (element) {
        addressBar = element;
        return addressBar.clear();
      })
      .then(function() {
        return addressBar.sendKeys(wdcUrl);
      })
      .then(function() {
        return addressBar.getAttribute("value");
      })
      .then(function(url) {
        url.should.be.equal(wdcUrl);
        done();
      });
  });

  it("Should be Able to Enter Interactive Mode", function(done){
    let simulatorWindow = driver.getWindowHandle()
    driver.findElement({ id: 'interactive-btn' })
      .then(function (btn) {
        return btn.click();
      })
      .then(function() {
        return driver.switchTo().window('wdc');
      })
      .then(function() {
        return driver.wait(until.elementLocated({ id: 'submitButton' }), timeout);
      })
      .then(function(btn) {
        return btn.click();
      })
      .then(function(btn) {
        driver.switchTo().window(simulatorWindow);
        done();
      });
  });

  it("Should Have Set to WDC Attrs", function(done){
    const correctName = 'USGS Earthquake Feed';
    driver.sleep(750);
    driver.findElement({id:'connectionName'})
      .then(function(field) {
        return field.getAttribute("value");
      })
      .then(function(connectionName) {
        connectionName.should.be.equal(correctName);
        done();
      });
  });

  it("Should Have Preview Table", function(done){
    driver.findElements({className: 'table-preview-Column'})
      .then(function (elements) {
        elements.should.not.be.empty();
        done()
      });
  });

  it("Should Fetch Data", function(done){
    driver.findElement({ className: 'fetch-btn' })
      .then(function (btn) {
        return btn.click();
      })
      .then(function () {
        return driver.wait(until.elementsLocated({ className: 'data-row' }), timeout);
      })
      .then(function (elements) {
        elements.length.should.be.above(0);
        done();
      });
  });
});
