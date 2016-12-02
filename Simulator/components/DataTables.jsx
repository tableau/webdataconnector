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

    // This sets up the data about what tables/columns are
    // available for use in a join filter.
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
    const defaultFilterInfo = {
      selectedTable: defaultTable,
      selectedColumn: defaultColumn,
      selectedFK: defaultColumn,
    };

    const needsDefaultFilters = (_.isEmpty(this.props.filterInfo.selectedTable));

    let currentFilterInfo = needsDefaultFilters ? defaultFilterInfo : this.props.filterInfo;
    let activeFilterData = [];
    const selectedTableData = tables[currentFilterInfo.selectedTable].data;

    if (!_.isEmpty(selectedTableData)) {
      selectedTableData.forEach(row => {
        activeFilterData.push(row[currentFilterInfo.selectedColumn]);
      });

      // We only want unique keys
      activeFilterData = _.uniq(activeFilterData);
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
        filterInfo={currentFilterInfo}
        hasActiveJoinFilter={(this.props.activeJoinFilter === key)}
        setFilterInfo={this.props.setFilterInfo}
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
  filterInfo: PropTypes.object.isRequired,
  activeJoinFilter: PropTypes.string,
  setActiveJoinFilter: PropTypes.func.isRequired,
  setFilterInfo: PropTypes.func.isRequired,
};

export default DataTables;
