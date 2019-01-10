var webdriver_chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var should = require('should');
var express = require("express");
var path = require("path");
var config = require('./config.js');

var app = express();

describe('General Simulator Tests', function(){
  let driver;
  let server;
  let simulatorWindow;
  let timeout = 60000;
  this.timeout(timeout);

  // run setup once before tests
  before(function(done) {
    //Spin up file server
    app.use(express.static(path.join(__dirname, "../../../")));
    server = app.listen(config.port);

    driver = new webdriver.Builder()
      .withCapabilities({
        browserName: "chrome"
      })
      .setChromeOptions(new webdriver_chrome.Options().headless())
      .build();

    // open simulator page
    driver.get('http://localhost:' + config.port + '/Simulator?src=srcQuery').then(function() {
      simulatorWindow = driver.getWindowHandle();
      done();
    });
  });

  // run clean up once after tests
  after(function(done) {
    server.close();
    driver.quit().then(done);
  });

  it("The Simulator Should Have It's Components", function(done){
    driver.findElements({className: 'navbar'})
      .then(function (elements) {
        elements.should.not.be.empty();
      });
    driver.findElements({className: 'address-bar'})
      .then(function (elements) {
        elements.should.not.be.empty();
      });
    driver.findElements({className:'run-connector'})
      .then(function (elements) {
        elements.should.not.be.empty();
      });
    driver.findElements({className:'interactive-phase'})
      .then(function (elements) {
        elements.should.not.be.empty();
        done();
      });
  })

  it("Should Have Set Src Query Url", function(done){
    const wdcUrl = 'srcQuery';
    driver.findElement({id:'address-input'})
      .then(function (addressBar) {
        return addressBar.getAttribute("value");
      })
      .then(function(url) {
        url.should.be.equal(wdcUrl);
        done();
      });
  })

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
        driver.sleep(500);
        return addressBar.getAttribute("value");
      })
      .then(function(url) {
        url.should.be.equal(wdcUrl);
        done();
      });
  })

  it("Should be Able to Enter WDC Attributes", function(done){
    const testString = "test";
    driver.findElement({id:'connectionName'})
      .then(function (element) {
        return element.sendKeys(testString);
      })
      .then(function() {
        return driver.findElement({id:'connectionData'})
      })
      .then(function (element) {
        return element.sendKeys(testString);
      })
      .then(function() {
        return driver.findElement({id:'username'})
      })
      .then(function (element) {
        return element.sendKeys(testString);
      })
      .then(function() {
        return driver.findElement({id:'password'})
      })
      .then(function (element) {
        element.sendKeys(testString);
        done();
      });
  });

  it("Should Be Able to Open Advanced Settings", function(done) {
    driver.findElement({className:'advanced-btn'})
      .then(function(btn) {
        return btn.click();
      })
      .then(function() {
        return driver.wait(until.elementsLocated({ className: 'advanced' }), timeout);
      })
      .then(function (elements) {
        elements.length.should.be.above(0);
        done();
      });
  })

  it("Should be Able to Enter Interactive Mode", function(done){
    driver.findElement({ id: 'interactive-btn' })
      .then(function (btn) {
        return btn.click();
      })
      .then(function() {
        driver.sleep(100);
        driver.switchTo().window('wdc');
        done();
      })
  });

  it("Should have Transfered the Attributes", function(done){
    let defaultLang = 'en-us';
    const testString = "test";
    driver.sleep(1000);
    driver.executeScript(function (){return tableau})
      .then(function(tableau) {
        tableau.connectionName.should.be.equal(testString);
        tableau.connectionData.should.be.equal(testString);
        tableau.username.should.be.equal(testString);
        tableau.password.should.be.equal(testString);
        return driver.wait(until.elementLocated({ id: 'submitButton' }), timeout);
      })
      .then(function(btn) {
        return btn.click();
      })
      .then(function(btn) {
        driver.switchTo().window(simulatorWindow);
        done();
      });
  })

  it("Should Have Set WDC Attrs", function(done){
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
  })

  it("Should Have Preview Table", function(done){
    driver.findElements({className: 'table-preview-Column'})
      .then(function (elements) {
        elements.should.not.be.empty();
        done()
      });
  })

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
