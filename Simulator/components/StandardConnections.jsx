import React, { Component, PropTypes } from 'react';
import { Navigation } from 'react-bootstrap';

import Validator from './StandardConnectionValidator.jsx';
import JoinViz from './JoinViz.jsx';

//-------------------Standard Connections-----------------//
// Component which contains the validation and preview
// for standard connections
//-------------------------------------------------------//

class StandardConnection extends components {
  constructor(props) {
    super(props);
    this.alias = props.data.alias;
    this.tables = props.data.tables;
    this.joins = props.data.joins;
    this.tableVisitMap = {};
    this.joinsVisitMap = {};
    this.errors = [];
    this.viewSwitch = true;
    this.validate();
  }

  render() {
    if (!this.tables && !this.joins) return null;

    return (  //outer class defines children div css
      <div className = {`standard-connections-${this.alias}`}>
        <h4>{this.alias}</h4>
        <Nav bsStyle="tabs" activeKey="1" onSelect = {this.handleSelect}>
          <NavItem eventKey="1">Validation</NavItem>
          <NavItem eventKey="2">Joins</NavItem>
        </Nav>
        {this.props.viewSwitch ? <JoinViz joins={this.joins} tables={this.tables}/> : <Validator errors={this.errors}/>}
      </div>

    );
  }
  handleSelect(eventKey) {
    event.preventDefault();
    switch(eventKey) {
    case 1: this.viewSwitch = false;
            break;
    case 2: this.viewSwitch = true;
            break;
    }
  }
  validate() {
    if (!this.alias) {
      this.errors.push("No Alias");
    }
    for (let i in this.tables) {
      if (!this.tables[i].id) {
        this.errors.push("Missing ID for Table");
      }
      if (!this.tables[i].alias) {
        this.errors.push("Missing Alias for Table");
      }
    }
    for (let i in this.joins) {
      if (!this.joins[i].left) {
        this.errors.push("Missing Left Member for Table");
      }
      else {
        if (!this.joins[i].left.tableAlias) {
          this.errors.push("Missing Left Table Alias");
        }
        if (!this.joins[i].left.columnId) {
          this.errors.push("Missing Left Column Id");
        }
      }
      if (!this.joins[i].left) {
        this.errors.push("Missing Right Member for Table");
      }
      else {
        if (!this.joins[i].right.tableAlias) {
          this.errors.push("Missing Right Table Alias");
        }
        if (!this.joins[i].right.columnId) {
          this.errors.push("Missing Right Column Id");
        }
      }
      if (!this.joins[i].joinType) {
        this.errors.push("Missing Join Type for Table");
      }
    }
    checkJoins();
  } // end validate()

  checkJoins() {
    for (let i in this.tables) {
      this.tableVisitMap[this.tables[i].alias] = false;
    }
    this.recurseTree(alias);
    for (let [table, visited] of this.tableVisitMap.entries()){
      if (visited) { this.errors.push(`[${table}] table is unvisited`) }
    }
    if (Object.keys(joinsVisitMap).length != this.joins.length) {
      this.errors.push("Not all joins visited!");
    }
  }

  recurseTree(alias) {
    this.tableVisitMap[alias] = true;
    for (let i in this.joins)
    {
      if (this.joins[i].left.tableAlias == alias) {
        // Mark the join as visited by using the serialized object as the key
        this.joinsVisitMap[JSON.stringify(this.joins[i])] = true;

        if (this.joins[i].left.tableAlias == this.joins[i].right.tableAlias) {
          this.errors.push(`Joining ${this.joins[i].left.tableAlias} on itself!`);
        }
        if (!tableVisitMap[this.joins[i].right.tableAlias]) {
          recurseTree(this.joins[i].right.tableAlias);
        }
      }
    }
  } // end recurseTree()
}

StandardConnections.propTypes = {
  data: PropTypes.object.isRequired;
}


export default StandardConnections;
