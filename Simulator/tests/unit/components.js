import React from 'react';
import { shallow } from 'enzyme';

import sinon from 'sinon';
import should from 'should';

import SimulatorNavbar from '../../components/SimulatorNavbar.jsx';
import AddressBar from '../../components/AddressBar.jsx';
import StartConnectorGroup from '../../components/StartConnectorGroup.jsx';
import SimulatorAttributes from '../../components/SimulatorAttributes.jsx';
import DataTables from '../../components/DataTables.jsx';
import TablePreview from '../../components/TablePreview.jsx';
import CollapsibleTable from '../../components/CollapsibleTable.jsx';
import GatherDataFrame from '../../components/GatherDataFrame.jsx';

import * as consts from '../../utils/consts.js';

// Component Tests
describe("Components", function() {
  describe("SimulatorNavbar", function() {
    let spy = sinon.spy();
    let navbar;
    let instance;

    it("Should Render", function () {
      navbar = shallow(
        <SimulatorNavbar
          showAdvanced={false}
          setShowAdvanced={spy}
        />);
      navbar.should.be.ok();
      instance = navbar.instance();
    });

    it("Should Handle Clicks Correctly", function () {
      const event = { target: { value: 'click' } };
      instance.handleAdvancedClick(event);
      spy.calledOnce.should.be.true();
      spy.calledWith(true).should.be.true();
    });
  });

  describe("AddressBar", function() {
    let spy = sinon.spy();
    let addressBar;
    let instance;

    it("Should Render", function () {
      addressBar = shallow(
        <AddressBar
          addressBarUrl=""
          mostRecentUrls={["url", "otherUrl"]}
          disabled={ false }
          setAddressBarUrl={ spy }
          resetSimulator={ ()=>{} }
        />
      );

      instance = addressBar.instance();
      addressBar.should.be.ok();
    });

    it("Should Handle Clicks Correctly", function () {
      const inputEvent = { target: { value: 'url' } };
      const selectEvent = "newUrl";
      instance.handleAddressBarUrlInput(inputEvent);
      instance.handleAddressBarUrlSelect(selectEvent);
      spy.calledTwice.should.be.true();
      spy.calledWith("url").should.be.true();
      spy.calledWith("newUrl").should.be.true();
    });
  });

  describe("StartConnectorGroup", function() {
    let spy = sinon.spy();
    let startConnectorGroup;
    let instance;

    it("Should Render", function () {
      startConnectorGroup = shallow(
        <StartConnectorGroup
          isInProgress={false}
          interactivePhaseInProgress={false}
          isWDCUrlEmpty={false}
          startAuthPhase={()=>{}}
          startInteractivePhase={()=>{}}
          cancelCurrentPhase={()=>{}}
          setWdcShouldFetchAllTables={spy}
        />
      );

      instance = startConnectorGroup.instance();
      startConnectorGroup.should.be.ok();
    });

    it("Should Handle Clicks Correctly", function () {
      const event = { target: { checked: true } };
      instance.handleShouldFetchAllChange(event);
      spy.calledOnce.should.be.true();
      spy.calledWith(true).should.be.true();
    });
  });

  describe("SimulatorAttributes", function() {
    let spy = sinon.spy();
    let simulatorAttributes;
    let instance;

    it("Should Render", function () {
      simulatorAttributes = shallow(
        <SimulatorAttributes
          disabled={false}
          setWdcAttrs={spy}
          wdcAttrs={{
            connectionName: "",
            connectionData: "",
            username: "",
            password: "",
            platformOS: "",
            platformVersion: "",
            platformEdition: "",
            platformBuildNumber: "",
            authPurpose: "",
            locale: "en-us",
          }}
        />
      );

      instance = simulatorAttributes.instance();
      simulatorAttributes.should.be.ok();
    });

    it("Should Handle Input Correctly", function () {
      const event = { target: { id: "connectionName", value: "name"} };
      const newAttrs = {
        connectionName: "name",
        connectionData: "",
        username: "",
        password: "",
        platformOS: "",
        platformVersion: "",
        platformEdition: "",
        platformBuildNumber: "",
        authPurpose: "",
        locale: "en-us",
      };

      instance.handleAttrChange(event);
      spy.calledOnce.should.be.true();
      spy.calledWith(newAttrs).should.be.true();
    });
  });

  describe("DataTables", function() {
    let spy = sinon.spy();
    let dataTables;

    it("Should Render", function () {
      let tables = {
        1: {
          schema: {
            id: 1,
            columns: [{
              id: "x",
              dataType: "int",
            }],
          },
          data: []
        },
        2: {
          schema: {
            id: 2,
            columns: [{
              id: "x",
              dataType: "int",
            }],
          },
          data: []
        }
      };

      dataTables= shallow(
        <DataTables
          fetchInProgress={false}
          getTableDataCallback={()=>{}}
          tables={tables}
        />
      );
      dataTables.should.be.ok();
    });

    it("Should Render Correct Number of Tables", function () {
      let previewElements = dataTables.find("TablePreview");
      previewElements.should.have.length(2);
    });
  });

  describe("TablePreview", function() {
    let spy = sinon.spy();
    let tablePreview;
    let instance;
    let tableInfo = {
      id: 1,
      incrementColumnId: "idx",
      columns: [{
        id: "idx",
        dataType: "int",
      }]
    };
    let tableData = [{ "idx": 0 }];

    it("Should Render", function () {
      tablePreview = shallow(
        <TablePreview
          tableInfo={tableInfo}
          tableData={tableData}
          getTableDataCallback={spy}
          fetchInProgress={false}
        />
      );

      instance = tablePreview.instance();
      let incBtn = tablePreview.find(".incremental-fetch-btn");
      incBtn.should.have.length(1);
      tablePreview.should.be.ok();
    });

    it("Should Fetch The Right Data", function () {
      instance.freshFetch();
      instance.incrementalRefresh();
      spy.calledTwice.should.be.true();
      spy.calledWith([{ tableInfo, incrementValue: undefined }], true).should.be.true();
      spy.calledWith([{ tableInfo, incrementValue: 0 }], false).should.be.true();
    });

    it("Should Have the Right Column Info", function () {
      const columnRows = tablePreview.find(".metadata-row");
      columnRows.containsAllMatchingElements([
        <td> idx </td>,
        <td> int </td>,
        <td> - </td>,
        <td> - </td>,
        <td> - </td>,
        <td> - </td>,
      ]);
    });

    it("Should Have the Right Data Info", function () {
      const dataRows = tablePreview.find(".data-row");
      dataRows.containsAllMatchingElements([
        <td> 0 </td>,
      ]);
    });

    it("Should Render Correctly Without Data", function () {
      tablePreview = shallow(
        <TablePreview
          tableInfo={tableInfo}
          tableData={[]}
          getTableDataCallback={spy}
          fetchInProgress={false}
        />
      );
      tablePreview.should.be.ok();
    });

    it("Should Render Correctly Without Incremental Data", function(){
      let tableInfo = {
        id: 1,
        columns: [{
          id: "idx",
          dataType: "int",
        }]
      };

      tablePreview = shallow(
        <TablePreview
          tableInfo={tableInfo}
          tableData={tableData}
          getTableDataCallback={spy}
          fetchInProgress={false}
        />
      );
      tablePreview.should.be.ok();
    });

    it("Should Render Correctly With Fetch in Progress", function(){
      tablePreview = shallow(
        <TablePreview
          tableInfo={tableInfo}
          tableData={tableData}
          getTableDataCallback={spy}
          fetchInProgress={true}
        />
      );
      let fetchBtn = tablePreview.find('.fetch-btn');
      fetchBtn.prop("disabled").should.be.true();
      tablePreview.should.be.ok();
    })
  });

  describe("CollapsibleTable", function() {
    let collapsibleTable;
    let instance;

    it("Should Render", function () {
      collapsibleTable = shallow(
        <CollapsibleTable
          name="Table Data"
          header={["idx"]}
          children={<td> 0 </td>}
        />);
      collapsibleTable.should.be.ok();
    });

    it("Start Uncollapsed", function () {
      collapsibleTable.state("collapsed").should.be.false();
    });

    it("Should Collapse On Click", function () {
      instance = collapsibleTable.instance();
      instance.toggleCollapse();
      collapsibleTable.state("collapsed").should.be.true();
    });
  });

  describe("GatherDataFrame", function() {
    let spy = sinon.spy();
    let gatherDataFrame;

    it("Should Render", function () {
      gatherDataFrame = shallow(
        <GatherDataFrame
          wdcUrl="url"
          setWindowAsGatherFrame={spy}
        />
      );
      gatherDataFrame.should.be.ok();
    });
  });
});
