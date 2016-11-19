import React, { Component, PropTypes } from 'react';
import TablePreview from './TablePreview.jsx';

// Actions
import * as simulatorActions from '../actions/simulator_actions';

//----------------------Data Tables---------------------//
// Component which contains the tablePreviews for each
// table
//------------------------------------------------------//

class DataTables extends Component {
  constructor(props) {
    super(props);
    const dispatch = this.props.dispatch;

    this.setJoinFilters = (attrs) =>
      dispatch(simulatorActions.setJoinFilters(attrs));

    this.getTableDataWithFilters = this.getTableDataWithFilters.bind(this);
  }
  
  render() {
    const tables = this.props.tables;

    let tablePreviewElements = [];
    let tableNames = [];
    let columnMap = {};

    let hasFilterData = false;

    // Set up data about table and column filters for Join Filtering
    Object.keys(tables).map(key => {
      // We can only filter on a table if it has data already
      if (tables[key].data.length > 0) {
        hasFilterData = true;
        tableNames.push(key);
            
        columnMap[key] = [];
        tables[key].schema.columns.map(column => {
          columnMap[key].push(column.id);
        });
      }
    });

    // Couldn't find a supported way to pass default prop values
    // that depended on other prop data.  Below sets default joinFilters. 
    let joinFilterDefaults = this.props.joinFilters;
    if (joinFilterDefaults.selectedTable === "") {
      if (hasFilterData) {
        joinFilterDefaults.selectedTable = tableNames[0];
        joinFilterDefaults.selectedColumn = columnMap[tableNames[0]][0];
      }
    }

    // map each table to a preview element
    tablePreviewElements = Object.keys(tables).map(key =>
      <TablePreview
        key={key}
        tableInfo={tables[key].schema}
        tableData={tables[key].data}
        getTableDataCallback={this.getTableDataWithFilters}
        fetchInProgress={this.props.fetchInProgress}
        showAdvanced={this.props.showAdvanced}
        columnMap={columnMap}
        tableNames={tableNames}
        joinFilters = {joinFilterDefaults}
        setJoinFilters={this.setJoinFilters}
        hasFilterData={hasFilterData}
      />
    );

    return (
      <div className="table-section">
        {tablePreviewElements}
      </div>
    );
  }

  getTableDataWithFilters(tablesAndIncValues, isIncremental, isFiltered) {
    const filterTable = this.props.tables[this.props.joinFilters.selectedTable];
    const columnFilter = this.props.joinFilters.selectedColumn;

    let filteredData, filterInfo;

    if (isFiltered) {
      filteredData = filterTable.data.map(function(row) {
        return row[columnFilter];
      });
      
      filterInfo = {
        column: columnFilter,
        values: filteredData
      }
    }

    // getTableCallback takes (tablesAndIncValues, isFreshFetch, filteredData)
    this.props.getTableDataCallback(tablesAndIncValues, !isIncremental, filterInfo);
  }
}

DataTables.propTypes = {
  tables: PropTypes.object.isRequired,
  getTableDataCallback: PropTypes.func.isRequired,
  fetchInProgress: PropTypes.bool.isRequired,
  showAdvanced: PropTypes.bool.isRequired,
  joinFilters: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default DataTables;
