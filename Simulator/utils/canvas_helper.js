export function node(params, alias, data, displayDiv) {
  // Traditional DOM manipulation is used here as a
  // hacky way to not have to force partial redraws
  const div = displayDiv;
  div.innerHTML = '';
  for (const j of params.edges) {
    for (const i of data.edges) {
      if (i.id === j) {
        div.innerHTML += `${i.joinValue} <br>`;
      }
    }
  }
}

export function edge(params, alias, data, displayDiv) {
  const div = displayDiv;
  if (params.nodes.length === 0) {
    for (const i of data.edges) {
      if (i.id === params.edges[0]) {
        div.innerHTML = i.joinValue;
      }
    }
  }
}
