import React, { Component, PropTypes } from 'react';
import '../vis.js';


class JoinViz extend Component {
  constructor(props) {
    super(props);
    this.tables = props.tables;
    this.joins = props.joins;
  }

  render() {
    return (
      <div id="join"/>
      <div className="joins" ref={ (input) =>
        draw(input);
      }/>
    );
  }

  draw(input) {
    var tables = objs.tables;
    var joins = objs.joins;
    var network = null;

    var container = input;
    var data = {  nodes: [],
                  edges: []  };
    var tableMap = {};
    for(var i = 0; i < tables.length; i++) {
      data.nodes.push({
        id: i,
        label: tables[i].alias
      });
      tableMap[tables[i].alias] = i;
    }
    for(var i = 0; i < joins.length; i++) {
      data.edges.push({
        from: tableMap[joins[i].left.tableAlias],
        to: tableMap[joins[i].right.tableAlias],
        title: "[" + joins[i].left.tableAlias + "].[" + joins[i].left.columnId + "] " + joins[i].joinType + " joined with " + "[" + joins[i].right.tableAlias + "].[" + joins[i].right.columnId + "]"
      })
    }
    var options = {
      layout: {
        hierarchical: { direction: "LR" }
      },
      nodes: {
        borderWidth: 8,
        borderWidthSelected: 12,
        color: {
          border: "#e1e1e1",
          background: "#e1e1e1",
          highlight: "#2dcc97",
          hover: "#cbcbcb"
        },
        font: { color: "#000000" },
        shape: "box",
        shapeProperties: { borderRadius: 0 }
      },
      edges: {
        color: {
          color: "#355c80",
          highlight: "#2dcc97",
          hover: "#00b180"
        },
        smooth: {
          enabled: true,
          type: "cubicBezier",
          roundness: .6
        }
      },
      interaction: { hover: true }
    };
    network = new vis.Network(container, data, options);
    network.on('selectNode', function(params) {
      document.getElementById("join").innerHTML = "";
      for(let j = 0; j < params.edges.length; j++) {
        for(let i = 0; i < data.edges.length; i++) {
          if(data.edges[i].id == params.edges[j]) {
            document.getElementById("join").innerHTML += data.edges[i].title + "<br>";
          }
        }
      }
    });
    network.on('selectEdge', function(params) {
      if(params.nodes.length == 0){
        for(let i = 0; i < data.edges.length; i++) {
          if(data.edges[i].id == params.edges[0]) {
            document.getElementById("join").innerHTML = data.edges[i].title;
          }
        }
      }
    });
  }
}

JoinViz.propTypes = {
  tables = PropTypes.array.isRequired,
  joins = PropTypes.array.isRequired
}

export default JoinViz;
