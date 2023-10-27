let currentStateIndex = 0; 
let stateStore = []; 
let roots = null; 

export function render(vdomNode, domElement) {
  if (!roots) roots = [vdomNode, domElement];   

  if (typeof vdomNode.tag === "function") {
    const freshVdomNode = vdomNode.tag(vdomNode.props);
    render(freshVdomNode, domElement);
  }
  else {
    let newElement;
    if (typeof vdomNode === 'string' || typeof vdomNode === 'number') {    
      newElement = document.createTextNode(String(vdomNode)); 
    } else {
      newElement = document.createElement(vdomNode.tag);
      Object.entries(vdomNode.props || {}).forEach(([name, value]) => {
        if (name === "style") {
          Object.entries(value).forEach(([styleName, styleValue]) => {
            newElement.style[styleName] = styleValue;
          });
        } else if (name.startsWith("on") && name.toLowerCase() in window) {
          newElement.addEventListener(name.toLowerCase().slice(2), value);
        } else if (name !== "children") {
          newElement.setAttribute(name, value);
        }
      });
      
      if (Array.isArray(vdomNode.props.children)) {
        Array.from(vdomNode.props.children).forEach((childVdomNode) => render(childVdomNode, newElement));
      } else if (vdomNode.props.children) {
        render(vdomNode.props.children, newElement);
      }
    }
    domElement.appendChild(newElement);
  }
};

function rerender() {
  roots[1].innerHTML = "";
  currentStateIndex = 0;
  render(roots[0], roots[1]);
  stateStore = stateStore.slice(0, currentStateIndex);
}

export function makeState(initialValue) {
  const thisStateIndex = currentStateIndex;
  currentStateIndex++;
  
  if (stateStore[thisStateIndex] === undefined) stateStore[thisStateIndex] = initialValue;
  
  function updater(newValue) {
    if (stateStore[thisStateIndex] !== newValue) {
      stateStore[thisStateIndex] = newValue;
      rerender();
    }
  }
  return [stateStore[thisStateIndex], updater];
}