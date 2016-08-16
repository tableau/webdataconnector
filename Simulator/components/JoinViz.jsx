import React, { Component, PropTypes } from 'react';
import * as vis from 'vis';
import * as consts from '../utils/consts';
import * as clickedOn from '../utils/canvas_helper';

class JoinViz extends Component {
  constructor(props) {
    super(props);
    this.alias = props.alias;
    this.tables = props.tables;
    this.joins = props.joins;
    this.nsAlias = props.alias.replace(/\s+/g, '-');
  }

  render() {
    return (
      <div className="standard-connection-viz">
        <div
          className="standard-connection-joins"
          id={`viz-${this.nsAlias}`}
          ref={(input) => { this.draw(input); }}
        />
        <div className="standard-connection-errors">
          <h4>Selected Joins</h4>
          <div id={`validation-${this.nsAlias}`}>
          </div>
        </div>
      </div>
    );
  }

  draw(input) {
    const tables = this.tables;
    const joins = this.joins;
    let network = null;

    const container = input !== null ? input : document.getElementById(`viz-${this.nsAlias}`);
    const data = { nodes: [],
                   edges: [] };
    const tableMap = {};
    tables.forEach((table, i) => {
      data.nodes.push({
        id: i,
        label: table.alias,
      });
      tableMap[table.alias] = i;
    });
    joins.forEach(join => {
      const l = `[${join.left.tableAlias}].[${join.left.columnId}]`;
      const r = `[${join.right.tableAlias}].[${join.right.columnId}]`;
      data.edges.push({
        from: tableMap[join.left.tableAlias],
        to: tableMap[join.right.tableAlias],
        joinValue: `[${l} ${join.joinType} joined with [${r}]]`,
      });
    });
    const displayDiv = document.getElementById(`validation-${this.nsAlias}`);

    // visOptions located in the consts.js file
    network = new vis.Network(container, data, consts.visOptions);
    network.on('selectNode', (params) => {
      clickedOn.node(params, this.nsAlias, data, displayDiv);
    });
    network.on('selectEdge', (params) => {
      clickedOn.edge(params, this.nsAlias, data, displayDiv);
    });
  }
}

JoinViz.propTypes = {
  alias: PropTypes.string.isRequired,
  tables: PropTypes.array.isRequired,
  joins: PropTypes.array.isRequired,
};

export default JoinViz;
