import React, { Component, PropTypes } from 'react';
import { Button,
         FormControl,
         OverlayTrigger,
         Popover,
         Glyphicon } from 'react-bootstrap';
import _ from 'underscore';

import CollapsibleTable from './CollapsibleTable.jsx';

//----------------------Table Preview---------------------//
// Component which contains a preview of both the metadata
// and data tables a connector returns
//-------------------------------------------------------//

class TablePreview extends Component {
  constructor(props) {
    super(props);
    this.MAX_ROWS = Infinity;
    this.METADATA_HEADER = [
      'ID',
      'TYPE',
      'ALIAS',
      'DESCRIPTION',
    ];

    this.freshFetch = this.freshFetch.bind(this);
    this.incrementalRefresh = this.incrementalRefresh.bind(this);
    this.filteredFetch = this.filteredFetch.bind(this);
    this.handleJoinFilterChange = this.handleJoinFilterChange.bind(this);
  }

  render() {
    if (!this.props || !this.props.tableInfo) return null;

    const joinFilterTooltip = (
        <Popover
          id="joinFilterTooltip"
          title="Join Filtering"
        >
          Join Filtering is a new WDC feature that a WDC to optimize getting data for connections with two or more joined tables.
          This feature allows a table to receive a list of primary keys that were collected in another table to which this table is joined.
          See the WDC &nbsp;
          <a href="http://tableau.github.io/webdataconnector/ref/api_ref.html#webdataconnectorapi.tableau" target="_blank">
            documentation
          </a>
          &nbsp;for more details
        </Popover>
    );

    const tableInfo = this.props.tableInfo;
    const tableData = this.props.tableData;
    const tableNames = this.props.tableNames;
    const columnMap = this.props.columnMap;
    const joinFilters = this.props.joinFilters;
    const hasFilterData = this.props.hasFilterData;
    
    // Build up dropdown options for Join Filter dropdowns
    let tableNameOptions, columnMapOptions;
    if (hasFilterData) {
      tableNameOptions = tableNames.map(function(option) {
          return (
              <option value={option}>
                  {option}
              </option>
          )
      });
      
      var selectedTable = joinFilters.selectedTable;
      columnMapOptions = columnMap[selectedTable].map(function(option) {
          return (
              <option value={option}>
                  {option}
              </option>
          )
      });
    }

    const hasData = tableData.length > 0;
    const canIncrementalUpdate = hasData && (tableInfo.incrementColumnId);

    const incColumn = (tableInfo.incrementColumnId) ?
    tableInfo.incrementColumnId : 'None';

    // Prep table of columnInfos for this TablePreview
    let columnTableHeader = this.METADATA_HEADER;
    let columnElements = this.getMetadataElements(tableInfo);

    // Prep table of actual data for this TablePreview
    let dataTableHeader = this.getDataHeader(tableInfo);
    let dataElements = this.getDataElements(tableData, dataTableHeader);

    let canFilter = this.props.showAdvanced && !this.props.fetchInProgress && hasFilterData

    return (
      <div className={`table-preview-${tableInfo.id}`}>
        <h4>
          {`[[${tableInfo.id}].[${tableInfo.alias}]]`}
        </h4>
        {
          tableInfo.incrementColumnId ?
            <p> {tableInfo.description} </p>
              : null
        }
        {
          tableInfo.incrementColumnId ?
            <p> {`Incremental Refresh Column: ${incColumn}`} </p>
              : null
        }
        <CollapsibleTable
          name="Column Metadata"
          header={columnTableHeader}
        >
          {columnElements}
        </CollapsibleTable>
        {
          hasData ?
            <CollapsibleTable
              name="Table Data"
              header={dataTableHeader}
            >
              {dataElements}
            </CollapsibleTable>
            : null
        }
        {
          !this.props.fetchInProgress ?
            <Button
              className="fetch-btn"
              onClick={this.freshFetch}
              bsStyle="success"
            >
              Fetch Table Data
            </Button> :
            <Button
              className="fetch-btn"
              disabled
              bsStyle="success"
            >
              Fetching Table Data...
            </Button>
        }
        {
          canIncrementalUpdate ?
            <Button
              className="incremental-fetch-btn"
              onClick={this.incrementalRefresh}
              style={{ marginLeft: '4px' }}
            >
              Incremental Update
            </Button>
            : null
        }
        {
          canFilter ?
            <div
              style={{ display: 'inline'}}
            >
              <FormControl
                  componentClass="select"
                  id="selectedTable"
                  value={this.props.joinFilters.selectedTable}
                  onChange={this.handleJoinFilterChange}
                  style={{ marginLeft: '4px', width: "100px", display: 'inline' }}
                >
                {tableNameOptions}
              </FormControl>
              <FormControl
                  componentClass="select"
                  id="selectedColumn"
                  value={this.props.joinFilters.selectedColumn}
                  onChange={this.handleJoinFilterChange}
                  style={{ marginLeft: '4px', width: "100px", display: 'inline' }}
                >
                {columnMapOptions}
              </FormControl>
              <Button
                className="filtered-fetch-btn"
                onClick={this.filteredFetch}
                style={{ marginLeft: '4px' }}
              >
                Filtered Fetch
              </Button>
              <OverlayTrigger trigger="click" rootClose placement="top" overlay={joinFilterTooltip}>
                <small style={{ marginLeft: 10 }}>
                  <Glyphicon glyph="glyphicon glyphicon-info-sign" />
                </small>
              </OverlayTrigger>
            </div>
            : null
        }
        <hr />
      </div>
    );
  }

  incrementalRefresh() {
    this.fetchData(true, false);
  }

  freshFetch() {
    this.fetchData(false, false);
  }

  filteredFetch() {
    this.fetchData(false, true);
  }

  handleJoinFilterChange(e) {
    const newFilters = { ...this.props.joinFilters, [e.target.id]: e.target.value };
    this.props.setJoinFilters(newFilters);
  }

  fetchData(isIncremental, isFiltered) {
    const tableInfo = this.props.tableInfo;
    const tableData = this.props.tableData;
    const tablesAndIncValues = [];

    const lastElement = tableData[tableData.length - 1];

    let incrementValue;
    if (isIncremental && lastElement) {
      incrementValue = lastElement[tableInfo.incrementColumnId];
    }

    tablesAndIncValues.push({ tableInfo, incrementValue });

    // getTableCallback takes (tablesAndIncValues, isFreshFetch, isFiltered)
    this.props.getTableDataCallback(tablesAndIncValues, !isIncremental, isFiltered);
  }

  getMetadataElements(tableInfo) {
    let columnTableRowKey = 1;
    const columnElements = tableInfo.columns.map((columnInfo) => {
      const row = [];
      let cells = [];
      row[0] = columnInfo.id;
      row[1] = columnInfo.dataType;
      row[2] = (columnInfo.alias) ? columnInfo.alias : '-';
      row[3] = (columnInfo.description) ? columnInfo.description : '-';

      cells = row.map((cellVal) =>
        <td key={columnTableRowKey++}> {cellVal} </td>
      );

      return (
        <tr
          className="metadata-row"
          key={columnTableRowKey++}
        >
          {cells}
        </tr>
      );
    });
    return columnElements;
  }

  getDataHeader(tableInfo) {
    return tableInfo.columns.map(col => col.id);
  }

  getDataElements(tableData, schema) {
    let dataTableRowKey = 0;
    let dataTableColKey = 0;
    let dataElements = [];
    let cells = [];
    let cellValue;

    if (tableData) { // We may not fetched any data yet
      dataElements = tableData.slice(0, this.MAX_ROWS).map(row => {
        dataTableColKey = 0;
        cells = schema.map((header) => {
          // We can accept either an array of objects or an array of arrays
          // First we check for the object case
          if (_.isUndefined(row[header])) {
            if (_.isUndefined(row[dataTableColKey])) {
              // If it's not an object, and there is no value in the
              // array for this index, use a placeholder
              cellValue = '-';
            } else {
              // This is an array and there is a value
              cellValue = row[dataTableColKey];
            }
          } else {
            // This is the object condition, grab the value from the map.
            cellValue = row[header];
          }
          return <td key={dataTableColKey++}> {String(cellValue)} </td>;
        });
        return (
          <tr
            className="data-row"
            key={dataTableRowKey++}
          >
            {cells}
          </tr>
        );
      });
    }
    return dataElements;
  }
}

TablePreview.proptypes = {
  tableInfo: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  getTableDataCallback: PropTypes.func.isRequired,
  fetchInProgress: PropTypes.bool.isRequired,
  showAdvanced: PropTypes.bool.isRequired,
  tableNames: PropTypes.array.isRequired,
  columnMap: PropTypes.object.isRequired,
  joinFilters: PropTypes.shape({
    selectedTable: PropTypes.string.isRequired,
    selectedColumn: PropTypes.string.isRequired,
  }).isRequired,
  setJoinFilters: PropTypes.func.isRequired,
  hasFilterData: PropTypes.bool.isRequired,
};

export default TablePreview;

