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
    const joinFilters = this.props.joinFilters;

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

      let selectedTable = joinFilters.selectedTable;
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
            <Modal.Title>Configure Join Filter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ControlLabel> Table Filter: </ControlLabel>
              <FormControl
                componentClass="select"
                id="selectedTable"
                value={this.props.joinFilters.selectedTable}
                onChange={this.handleJoinFilterChange}
                style={{ marginBottom: '4px' }}
              >
                {tableNameOptions}
              </FormControl>
              <ControlLabel> Column Filter: </ControlLabel>
              <FormControl
                componentClass="select"
                id="selectedColumn"
                value={this.props.joinFilters.selectedColumn}
                onChange={this.handleJoinFilterChange}
                style={{ marginBottom: '4px' }}
              >
                {filterableColumnMapOptions}
              </FormControl>
              <ControlLabel> Foreign Key: </ControlLabel>
              <FormControl
                componentClass="select"
                id="selectedFK"
                value={this.props.joinFilters.selectedFK}
                onChange={this.handleJoinFilterChange}
                style={{ marginBottom: '4px' }}
              >
                {fkMapOptions}
              </FormControl>
              <h5>
                What's this?
              </h5>
              <p>
                Join Filtering is a new WDC feature that a WDC to optimize getting data for
                connections with two or more joined tables. This feature allows a table to
                receive a list of primary keys that were collected in another table to which
                this table is joined. See the WDC&nbsp;
                <a href="http://tableau.github.io/webdataconnector/ref/api_ref.html#webdataconnectorapi.tableau" target="_blank">
                  documentation
                </a>
                &nbsp;for more details.
              </p>
              <h5>
                Why are certain tables missing?
              </h5>
              <p>
                You can only filter on tables that you have fetched
                data for already in the simulator.
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
    const newFilters = { ...this.props.joinFilters, [e.target.id]: e.target.value };
    this.props.setJoinFilters(newFilters);
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
  joinFilters: PropTypes.shape({
    selectedTable: PropTypes.string.isRequired,
    selectedColumn: PropTypes.string.isRequired,
    selectedFK: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  setJoinFilters: PropTypes.func.isRequired,
  setIsActive: PropTypes.func.isRequired,
  filteredFetch: PropTypes.func.isRequired,
};

export default JoinFilter;
