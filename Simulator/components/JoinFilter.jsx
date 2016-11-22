import React, { Component, PropTypes } from 'react';
import { Button,
         ControlLabel,
         FormControl,
         OverlayTrigger,
         Popover,
         Glyphicon } from 'react-bootstrap';
import _ from 'underscore';

//----------------------Join Filter----------------------//
//
//-------------------------------------------------------//

class JoinFilter extends Component {
  constructor(props) {
    super(props);

    this.handleJoinFilterChange = this.handleJoinFilterChange.bind(this);
  }

  render() {
    const joinFilterTooltip = (
      <Popover
        id="joinFilterTooltip"
        title="Join Filtering"
      >
        Join Filtering is a new WDC feature that a WDC to optimize getting data for
        connections with two or more joined tables. This feature allows a table to
        receive a list of primary keys that were collected in another table to which
        this table is joined. See the WDC &nbsp;
        <a href="http://tableau.github.io/webdataconnector/ref/api_ref.html#webdataconnectorapi.tableau" target="_blank">
          documentation
        </a>
        &nbsp;for more details
      </Popover>
    );

    const tableNames = this.props.tableNames;
    const columnMap = this.props.columnMap;
    const joinFilters = this.props.joinFilters;

    const canFilter = tableNames.length > 0;

    // Build up dropdown options for Join Filter dropdowns
    let tableNameOptions;
    let columnMapOptions;
    debugger;
    if (canFilter) {
      tableNameOptions = tableNames.map(option =>
        <option value={option}>
          {option}
        </option>
      );
      
      let selectedTable = joinFilters.selectedTable;
      if (_.isEmpty(selectedTable)) {
        // Set a default if user has never selected a table filter for this table
        selectedTable = tableNames[0];
      }

      columnMapOptions = columnMap[selectedTable].map(option =>
        <option value={option}>
          {option}
        </option>
      );
    }

    return (
      canFilter ?
        <div
          style={{ display: 'inline' }}
        >
          <FormControl
            componentClass="select"
            id="selectedTable"
            value={this.props.joinFilters.selectedTable}
            onChange={this.handleJoinFilterChange}
            style={{ marginLeft: '4px', width: '100px', display: 'inline' }}
          >
            {tableNameOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            id="selectedColumn"
            value={this.props.joinFilters.selectedColumn}
            onChange={this.handleJoinFilterChange}
            style={{ marginLeft: '4px', width: '100px', display: 'inline' }}
          >
            {columnMapOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            id="selectedFK"
            value={this.props.joinFilters.selectedFK}
            onChange={this.handleJoinFilterChange}
            style={{ marginLeft: '4px', width: '100px', display: 'inline' }}
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
    );
  }

  handleJoinFilterChange(e) {
    const newFilters = { ...this.props.joinFilters, [e.target.id]: e.target.value };
    this.props.setJoinFilters(newFilters);
  }
}

JoinFilter.proptypes = {
  tableNames: PropTypes.array.isRequired,
  columnMap: PropTypes.object.isRequired,
  joinFilters: PropTypes.shape({
    selectedTable: PropTypes.string.isRequired,
    selectedColumn: PropTypes.string.isRequired,
    selectedFK: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  setJoinFilters: PropTypes.func.isRequired,
  setIsActive: PropTypes.func.isRequired,
};

export default JoinFilter;
