let currentStateIndex = 0;
let stateStore = [];
let roots = null;

export function render(component, element) {
  if (!roots) roots = [component, element];
  let child;
  if (typeof component === 'string' || typeof component === 'number') {
    child = document.createTextNode(String(component));
  } else {
    child = document.createElement(component.tag);
    Object.entries(component.props || {}).forEach(([name, value]) => {
      if (name === "style") {
        Object.entries(value).forEach(([styleName, styleValue]) => {
          child.style[styleName] = styleValue;
        });
      } else if (name.startsWith("on") && name.toLowerCase() in window) {
        child.addEventListener(name.toLowerCase().slice(2), value);
      } else if (name !== "children") {
        child.setAttribute(name, value);
      }
    });
    if (Array.isArray(component.props.children)) {
      Array.from(component.props.children).flat().filter((x) => !!x).forEach((node) => render(node, child));
    } else if (component.props.children) {
      render(component.props.children, child);
    }
  }
  element.appendChild(child);
};

function rerender() {
  roots[1].innerHTML = "";
  currentStateIndex = 0;
  const component = roots[0].componentFunction ?
    roots[0].componentFunction(roots[0].props):
    roots[0];
  render(component, roots[1]);
  stateStore = stateStore.slice(0, currentStateIndex);
}

export function makeState(initialValue) {
  const i = currentStateIndex;
  currentStateIndex++;
  if (stateStore[i] === undefined) stateStore[i] = initialValue;
  function updater(newValue) {
    if (stateStore[i] !== newValue) {
      stateStore[i] = newValue;
      currentStateIndex = 0;
      rerender();
    }
  }
  return [stateStore[i], updater];
}