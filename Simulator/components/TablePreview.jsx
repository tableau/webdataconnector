import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
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
  }

  render() {
    if (!this.props || !this.props.tableInfo) return null;

    const tableInfo = this.props.tableInfo;
    const tableData = this.props.tableData;

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
        <hr />
      </div>
    );
  }

  incrementalRefresh() {
    this.fetchData(true);
  }

  freshFetch() {
    this.fetchData(false);
  }

  fetchData(isIncremental) {
    const tableInfo = this.props.tableInfo;
    const tableData = this.props.tableData;
    const tablesAndIncValues = [];

    const lastElement = tableData[tableData.length - 1];

    let incrementValue;
    if (isIncremental && lastElement) {
      incrementValue = lastElement[tableInfo.incrementColumnId];
    }

    tablesAndIncValues.push({ tableInfo, incrementValue });

    // getTableCallback takes (tablesAndIncValues, isFreshFetch)
    this.props.getTableDataCallback(tablesAndIncValues, !isIncremental);
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
};

export default TablePreview;

