import React, { Component, PropTypes } from 'react';
import TablePreview from './TablePreview.jsx';

//----------------------Data Tables---------------------//
// Component which contains the tablePreviews for each
// table
//------------------------------------------------------//

class DataTables extends Component {
  render() {
    let tablePreviewElements = [];
    const tables = this.props.tables;

    // map each table to a preview element
    tablePreviewElements = Object.keys(tables).map(key =>
      <TablePreview
        key={key}
        tableInfo={tables[key].schema}
        tableData={tables[key].data}
        getTableDataCallback={this.props.getTableDataCallback}
        fetchInProgress={this.props.fetchInProgress}
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
};

export default DataTables;
