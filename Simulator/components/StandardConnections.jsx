import React, { Component, PropTypes } from 'react';
import { Tabs,
         Tab } from 'react-bootstrap';

import Validator from './StandardConnectionValidator.jsx';
import JoinViz from './JoinViz.jsx';

//-------------------Standard Connections-----------------//
// Component which contains the validation and preview
// for standard connections
//-------------------------------------------------------//

class StandardConnections extends Component {
  constructor(props) {
    super(props);
    this.alias = props.data.alias;
    this.tables = props.data.tables;
    this.joins = props.data.joins;
    this.tableVisitMap = {};
    this.joinsVisitMap = {};
    this.nsAlias = props.data.alias.replace(/\s+/g, '-');
    this.errors = [];
    this.validate();
  }

  render() {
    const joinViz = (<JoinViz alias={this.alias} joins={this.joins} tables={this.tables} />);
    return (  //outer class defines children div css
      <Tabs defaultActiveKeyactiveKey={1} id={`${this.nsAlias}-tabs`} animation={false}>
        <Tab eventKey={1} title="Validation"><Validator errors={this.errors} /></Tab>
        <Tab eventKey={2} title="Joins">{joinViz}</Tab>
      </Tabs>
    );
  }

  validate() {
    if (!this.alias) {
      this.errors.push('No Alias');
    }
    for (const table of this.tables) {
      if (!table.id) {
        this.errors.push('Missing ID for Table');
      }
      if (!table.alias) {
        this.errors.push('Missing Alias for Table');
      }
    }
    for (const join of this.joins) {
      if (!join.left) {
        this.errors.push('Missing Left Member for Table');
      } else {
        if (!join.left.tableAlias) {
          this.errors.push('Missing Left Table Alias');
        }
        if (!join.left.columnId) {
          this.errors.push('Missing Left Column Id');
        }
      }
      if (!join.left) {
        this.errors.push('Missing Right Member for Table');
      } else {
        if (!join.right.tableAlias) {
          this.errors.push('Missing Right Table Alias');
        }
        if (!join.right.columnId) {
          this.errors.push('Missing Right Column Id');
        }
      }
      if (!join.joinType) {
        this.errors.push('Missing Join Type for Table');
      }
    }
    this.checkJoins();
  } // end validate()

  checkJoins() {
    for (const table of this.tables) {
      this.tableVisitMap[table.alias] = false;
    }
    this.recurseTree(this.tables[0].alias);
    Object.keys(this.tableVisitMap).map((key) => {
      if (!this.tableVisitMap[key]) { this.errors.push(`[${key}] table is unvisited`); }
      return true;
    });
    if (Object.keys(this.joinsVisitMap).length !== this.joins.length) {
      this.errors.push('Not all joins visited!');
    }
  }

  recurseTree(alias) {
    this.tableVisitMap[alias] = true;
    for (const join of this.joins) {
      if (join.left.tableAlias === alias) {
        // Mark the join as visited by using the serialized object as the key
        this.joinsVisitMap[JSON.stringify(join)] = true;

        if (join.left.tableAlias === join.right.tableAlias) {
          this.errors.push(`Joining ${join.left.tableAlias} on itself!`);
        }
        if (!this.tableVisitMap[join.right.tableAlias]) {
          this.recurseTree(join.right.tableAlias);
        }
      }
    }
  } // end recurseTree()
}

StandardConnections.propTypes = {
  data: PropTypes.object.isRequired,
};


export default StandardConnections;
