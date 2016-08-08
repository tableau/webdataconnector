import React, { Component, PropTypes } from 'react';
import * as vis from 'vis';
import * as consts from '../utils/consts';

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

    // visOptions located in the consts.js file
    network = new vis.Network(container, data, consts.visOptions);
    network.on('selectNode', (params) => {
      // Traditional DOM manipulation is used here as a
      // hacky way to not have to force partial redraws
      const elementId = `validation-${this.nsAlias}`;
      document.getElementById(elementId).innerHTML = '';
      for (const j of params.edges) {
        for (const i of data.edges) {
          if (i.id === j) {
            document.getElementById(elementId).innerHTML += `${i.joinValue} <br>`;
          }
        }
      }
    });
    network.on('selectEdge', (params) => {
      if (params.nodes.length === 0) {
        for (const i of data.edges) {
          if (i.id === params.edges[0]) {
            document.getElementById(`validation-${this.nsAlias}`).innerHTML = i.joinValue;
          }
        }
      }
    });
  }
}

JoinViz.propTypes = {
  alias: PropTypes.string.isRequired,
  tables: PropTypes.array.isRequired,
  joins: PropTypes.array.isRequired,
};

export default JoinViz;
