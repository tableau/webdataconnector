import React, { Component, PropTypes } from 'react';
import TablePreview from './TablePreview.jsx';

//----------------------Data Tables---------------------//
// Component which contains the tablePreviews for each
// table
//------------------------------------------------------//

class DataTables extends Component {
  constructor(props) {
    super(props);
    this.getTableDataWithFilters = this.getTableDataWithFilters.bind(this);
  }

  render() {
    const tables = this.props.tables;

    let tablePreviewElements = [];
    let tableNames = [];
    let columnMap = {};

    // Set up data about table and column filters for Join Filtering
    Object.keys(tables).forEach(key => {
      // We can only filter on a table if it has data already
      if (tables[key].data.length > 0) {
        tableNames.push(key);

        columnMap[key] = [];
        tables[key].schema.columns.forEach(column => {
          columnMap[key].push(column.id);
        });
      }
    });

    // Give a default selected table filter

    // map each table to a preview element
    tablePreviewElements = Object.keys(tables).map(key =>
      <TablePreview
        key={key}
        tableInfo={tables[key].schema}
        tableData={tables[key].data}
        getTableDataCallback={this.getTableDataWithFilters}
        fetchInProgress={this.props.fetchInProgress}
        showAdvanced={this.props.showAdvanced}
        tableNames={tableNames}
        columnMap={columnMap}
        joinFilters={this.props.joinFilters}
        hasActiveJoinFilter={(this.props.activeJoinFilter === key)}
        setJoinFilters={this.props.setJoinFilters}
        setActiveJoinFilter={this.props.setActiveJoinFilter}
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

    let filteredData;
    let filterInfo;

    if (isFiltered) {
      filterTable.data.forEach(row => {
        filteredData.push(row[columnFilter]);
      });

      filterInfo = {
        column: columnFilter,
        values: filteredData,
      };
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

  // Join filtering props
  joinFilters: PropTypes.object.isRequired,
  activeJoinFilter: PropTypes.string,
  setActiveJoinFilter: PropTypes.func.isRequired,
  setJoinFilters: PropTypes.func.isRequired,
};

export default DataTables;
