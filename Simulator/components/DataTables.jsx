import React, { Component, PropTypes } from 'react';
import TablePreview from './TablePreview.jsx';
import _ from 'underscore';

//----------------------Data Tables---------------------//
// Component which contains the tablePreviews for each
// table
//------------------------------------------------------//

class DataTables extends Component {
  render() {
    const tables = this.props.tables;

    let tablePreviewElements = [];
    let filtertableTableNames = [];
    let filterableColumnMap = {};

    // Set up data about table and column filters for Join Filtering
    Object.keys(tables).forEach(key => {
      // We can only filter on a table if it has data already
      if (tables[key].data.length > 0) {
        filtertableTableNames.push(key);

        filterableColumnMap[key] = [];
        tables[key].schema.columns.forEach(column => {
          filterableColumnMap[key].push(column.id);
        });
      }
    });

    const defaultTable = Object.keys(tables)[0];
    const defaultColumn = tables[defaultTable].schema.columns[0].id;
    const defaultJoinFilters = {
      selectedTable: defaultTable,
      selectedColumn: defaultColumn,
      selectedFK: defaultColumn,
    };

    const needsDefaultFilters = (_.isEmpty(this.props.joinFilters.selectedTable));

    let currentJoinFilters = needsDefaultFilters ? defaultJoinFilters : this.props.joinFilters;
    let activeFilterData = [];
    const selectedTableData = tables[currentJoinFilters.selectedTable].data;

    if (!_.isEmpty(selectedTableData)) {
      selectedTableData.forEach(row => {
        activeFilterData.push(row[currentJoinFilters.selectedColumn]);
      });
    }

    // map each table to a preview element
    tablePreviewElements = Object.keys(tables).map(key =>
      <TablePreview
        key={key}
        tableInfo={tables[key].schema}
        tableData={tables[key].data}
        getTableDataCallback={this.props.getTableDataCallback}
        fetchInProgress={this.props.fetchInProgress}
        showAdvanced={this.props.showAdvanced}
        filtertableTableNames={filtertableTableNames}
        filterableColumnMap={filterableColumnMap}
        joinFilters={currentJoinFilters}
        hasActiveJoinFilter={(this.props.activeJoinFilter === key)}
        setJoinFilters={this.props.setJoinFilters}
        setActiveJoinFilter={this.props.setActiveJoinFilter}
        activeFilterData={activeFilterData}
      />
    );

    return (
      <div className="table-section">
        {tablePreviewElements}
      </div>
    );
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
