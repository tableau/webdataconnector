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
    for (const i of this.tables) {
      if (!i.id) {
        this.errors.push('Missing ID for Table');
      }
      if (!i.alias) {
        this.errors.push('Missing Alias for Table');
      }
    }
    for (const i of this.joins) {
      if (!i.left) {
        this.errors.push('Missing Left Member for Table');
      } else {
        if (!i.left.tableAlias) {
          this.errors.push('Missing Left Table Alias');
        }
        if (!i.left.columnId) {
          this.errors.push('Missing Left Column Id');
        }
      }
      if (!i.left) {
        this.errors.push('Missing Right Member for Table');
      } else {
        if (!i.right.tableAlias) {
          this.errors.push('Missing Right Table Alias');
        }
        if (!i.right.columnId) {
          this.errors.push('Missing Right Column Id');
        }
      }
      if (!i.joinType) {
        this.errors.push('Missing Join Type for Table');
      }
    }
    this.checkJoins();
  } // end validate()

  checkJoins() {
    for (const i of this.tables) {
      this.tableVisitMap[i.alias] = false;
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
    for (const i of this.joins) {
      if (i.left.tableAlias === alias) {
        // Mark the join as visited by using the serialized object as the key
        this.joinsVisitMap[JSON.stringify(i)] = true;

        if (i.left.tableAlias === i.right.tableAlias) {
          this.errors.push(`Joining ${i.left.tableAlias} on itself!`);
        }
        if (!this.tableVisitMap[i.right.tableAlias]) {
          this.recurseTree(i.right.tableAlias);
        }
      }
    }
  } // end recurseTree()
}

StandardConnections.propTypes = {
  data: PropTypes.object.isRequired,
};


export default StandardConnections;
