import React, { Component, PropTypes } from 'react';
import { Button,
         ControlLabel,
         FormControl,
         Modal } from 'react-bootstrap';
import _ from 'underscore';

//----------------------Join Filter----------------------//
// Component which allows user to configure a join filter
// and then run a filtered fetch
//-------------------------------------------------------//

class JoinFilter extends Component {
  constructor(props) {
    super(props);

    this.handleJoinFilterChange = this.handleJoinFilterChange.bind(this);
    this.fetchAndClose = this.fetchAndClose.bind(this);
    this.setIsActive = this.setIsActive.bind(this);
  }

  render() {
    const filtertableTableNames = this.props.filtertableTableNames;
    const filterableColumnMap = this.props.filterableColumnMap;
    const filterInfo = this.props.filterInfo;

    const canFilter = filtertableTableNames.length > 0;

    // Build up dropdown options for Join Filter dropdowns
    let tableNameOptions;
    let filterableColumnMapOptions;
    let fkMapOptions;

    if (canFilter) {
      tableNameOptions = filtertableTableNames.map(option =>
        <option value={option}>
          {option}
        </option>
      );

      let selectedTable = filterInfo.selectedTable;
      if (_.isEmpty(selectedTable)) {
        // Set a default if user has never selected a table filter for this table
        selectedTable = filtertableTableNames[0];
      }

      filterableColumnMapOptions = filterableColumnMap[selectedTable].map(option =>
        <option value={option}>
          {option}
        </option>
      );

      fkMapOptions = this.props.tableColumns.map(option =>
        <option value={option.id}>
          {option.id}
        </option>
      );
    }

    return (
      this.props.isActive ?
        <Modal show={this.props.isActive} onHide={this.setIsActive}>
          <Modal.Header closeButton>
            <Modal.Title>Configure Join Filter - {this.props.tableId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ControlLabel> Table Filter: </ControlLabel>
              <FormControl
                componentClass="select"
                id="selectedTable"
                value={this.props.filterInfo.selectedTable}
                onChange={this.handleJoinFilterChange}
                style={{ marginBottom: '4px' }}
              >
                {tableNameOptions}
              </FormControl>
              <ControlLabel> Column Filter: </ControlLabel>
              <FormControl
                componentClass="select"
                id="selectedColumn"
                value={this.props.filterInfo.selectedColumn}
                onChange={this.handleJoinFilterChange}
                style={{ marginBottom: '4px' }}
              >
                {filterableColumnMapOptions}
              </FormControl>
              <ControlLabel> Foreign Key: </ControlLabel>
              <FormControl
                componentClass="select"
                id="selectedFK"
                value={this.props.filterInfo.selectedFK}
                onChange={this.handleJoinFilterChange}
                style={{ marginBottom: '4px' }}
              >
                {fkMapOptions}
              </FormControl>
              <h5>
                What's this?
              </h5>
              <p>
                Join Filtering is a v2.2+ WDC feature that allows a WDC to optimize fetching data
                for connections with two or more joined tables. In Tableau, if a WDC table A is
                filterable (as defined in WDC metadata), then when table B is joined to table A, the
                getData method for table B will be passed additional data when called.
                This additional data is a list of all distinct primary keys that were fetched in the
                getData method of table A.  Using these keys, table B's getData method is able to
                only fetch records having foreign keys matching one of the input primary keys.
                <br /><br />
                This is simulated by allowing you to selected filters in this menu and then run a
                "Filtered Fetch". Example: if you click "Filtered Fetch" with the above parameters,
                the getData method of the&nbsp;<strong>{this.props.tableId}</strong>&nbsp;
                table will be called. In the table parameter of getData, table.isJoinFiltered
                will be true. The list of primary keys passed will be available in
                table.filterValues, and will be an array the unique values
                the&nbsp;<strong>{this.props.filterInfo.selectedColumn}</strong>&nbsp;column of
                the&nbsp;<strong>{this.props.filterInfo.selectedTable}</strong>&nbsp;table.
                The&nbsp;<strong>{this.props.filterInfo.selectedFK}</strong>&nbsp;represents
                the key on which the&nbsp;<strong>{this.props.tableId}</strong>&nbsp;table is being
                joined to the&nbsp;<strong>{this.props.filterInfo.selectedTable}</strong>&nbsp;
                table.
              </p>
              <br />
              <h5>
                Why are certain tables missing?
              </h5>
              <p>
                You can only filter on tables which have data already fetched in the simulator.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setIsActive}>Cancel</Button>
            <Button
              className="filtered-fetch-btn"
              onClick={this.fetchAndClose}
              style={{ marginLeft: '4px' }}
              bsStyle="success"
            >
                Filtered Fetch
            </Button>
          </Modal.Footer>
        </Modal> :
        <Button
          onClick={this.setIsActive}
          style={{ marginLeft: 4 }}
          disabled={!canFilter}
        >
          Configure Filtered Fetch
        </Button>
    );
  }

  handleJoinFilterChange(e) {
    const newFilters = { ...this.props.filterInfo, [e.target.id]: e.target.value };
    this.props.setFilterInfo(newFilters);
  }

  fetchAndClose() {
    this.props.filteredFetch();
    this.setIsActive();
  }

  setIsActive() {
    this.props.setIsActive(!this.props.isActive);
  }
}

JoinFilter.proptypes = {
  tableColumns: PropTypes.array.isRequired,
  filtertableTableNames: PropTypes.array.isRequired,
  filterableColumnMap: PropTypes.object.isRequired,
  filterInfo: PropTypes.shape({
    selectedTable: PropTypes.string.isRequired,
    selectedColumn: PropTypes.string.isRequired,
    selectedFK: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  setFilterInfo: PropTypes.func.isRequired,
  setIsActive: PropTypes.func.isRequired,
  filteredFetch: PropTypes.func.isRequired,
  tableId: PropTypes.func.isRequired,
};

export default JoinFilter;
