import React, { Component, PropTypes } from 'react';
import { Table, Collapse, Button } from 'react-bootstrap';

//----------------------Collapsible Table---------------------//
// Component which wraps the react bootstrap table to creat
// a table with the UI elements necessary to collapse it.
//-----------------------------------------------------------//

class CollapsibleTable extends Component {
  constructor(props) {
    super(props);
    // Let table control its own toggle state
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.state = { collapsed: false };
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    let incRowKey = 1;
    // Map header names to th elements
    const headers = this.props.header.map(headerName =>
      <th key={incRowKey++}>
        {headerName}
      </th>
    );

    return (
      <div className={`table-preview-${this.props.name}`}>
        <h5> {this.props.name} </h5>
        <Button
          onClick={this.toggleCollapse}
          style={{ marginBottom: 10 }}
        >
          {this.state.collapsed ? 'Show' : 'Hide'}
        </Button>
        <Collapse in={!this.state.collapsed}>
          <div>
            <Table
              bordered
              condensed
              striped
            >
              <thead>
                <tr>
                  {headers}
                </tr>
              </thead>
              <tbody>
                {this.props.children}
              </tbody>
            </Table>
          </div>
        </Collapse>
      </div>
    );
  }
}

CollapsibleTable.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.array.isRequired,
  children: PropTypes.node,
};

export default CollapsibleTable;
