let currentStateIndex = 0; // a means of keeping track of what the most recently created piece of state is
let stateStore = []; // a single source of truth for all state
let roots = null; // a means of keeping track of the root VDOM node and anchor DOM element to render it in, for rerendering

// This functions job, in brief, is to make the DOM reflect the information in the VDOM
export function render(vdomNode, domElement) {
  if (!roots) roots = [vdomNode, domElement]; // this condition only is met once, the first time render is called
  // if the VDOM node's tag is a component function, then that function needs to be called again to regenerate the VDOM node fresh
  // if not the logic expressed within that function won't be applied
  if (typeof vdomNode.tag === "function") {
    // the freshly created VDOM node returned from the component is what we actually want to render.
    const freshVdomNode = vdomNode.tag(vdomNode.props);
    render(freshVdomNode, domElement);
  }
  else {
    let newElement;
    if (typeof vdomNode === 'string' || typeof vdomNode === 'number') {
      // sometimes VDOM nodes are just primitives. This can happen at a leaf node of the VDOM tree.
      // in those cases appending the right information to the DOM is simpler, but needs to be handled differently, like so
      newElement = document.createTextNode(String(vdomNode)); 
    } else {
      // this step converts the VDOM node into a DOM element
      newElement = document.createElement(vdomNode.tag);
      // here the props attached to the VDOM node are converted to appropriate DOM element attributes
      Object.entries(vdomNode.props || {}).forEach(([name, value]) => {
        if (name === "style") {
          // here inline styles are applied individually
          // since the `.styles` attribute of DOM elements isn't a regular object, doing something like, `newElement.setAttribute("styles", { color: "red" });` does not work
          Object.entries(value).forEach(([styleName, styleValue]) => {
            newElement.style[styleName] = styleValue;
          });
        } else if (name.startsWith("on") && name.toLowerCase() in window) {
          // this enforces the arbitrary convention that props beginning with "on" represent event listener callbacks which need to be registered
          newElement.addEventListener(name.toLowerCase().slice(2), value);
        } else if (name !== "children") {
          // all other non-children props are applied in the most straightforward way
          newElement.setAttribute(name, value);
        }
      });
      // the following conditional handles how `render` repeats the process, propagating down the VDOM recursively so that the entire VDOM is converted to DOM elements
      if (Array.isArray(vdomNode.props.children)) {
        // in cases where a VDOM node has many children each of those children need to be rendered as children of the DOM element that corresponds to the current VDOM node
        // so, for each the `render` function must be called like so
        Array.from(vdomNode.props.children).forEach((childVdomNode) => render(childVdomNode, newElement));
      } else if (vdomNode.props.children) {
        // when only one child is present on the VDOM node, there is no need to try to loop over each child, there isn't even an array to loop over
        render(vdomNode.props.children, newElement);
      }
    }
    // finally, append the newly created element to the anchor element
    domElement.appendChild(newElement);
  }
};

// this is crucial for dynamically rendering the page, without this any app created with the framework cannot change
// a big part of a frameworks job is deciding when to rerender, so without a function to do it, the framework can't do its job
function rerender() {
  // it's necessary to have a clean slate to rerender the VDOM into. Otherwise you'll end up with duplicate DOM elements
  roots[1].innerHTML = "";
  // it's necessary to resent our reference to which piece of state that was most recently made back to the first piece since the entire app is about to get made fresh
  currentStateIndex = 0;
  // now calling render with the established roots of the app rerenders the app
  render(roots[0], roots[1]);
  // optional optimization to remove stale state
  stateStore = stateStore.slice(0, currentStateIndex);
}

// the function users of the framework invoke to create a new piece of state within their components
export function makeState(initialValue) {
  // storing a copy of the index of the current piece of state associate with this call of `makeState` in the closure,
  // so that the updater function created on any given invocation knows which index in the store it's supposed to update.
  // put another way, this reserves this specific index in the store to this particular piece of state.
  const thisStateIndex = currentStateIndex;
  // incrementing the global index past the newly created state's reserved index.
  currentStateIndex++;
  // if nothing was in this state previously, put the initial value there, otherwise ignore the initial value that was passed in
  if (stateStore[thisStateIndex] === undefined) stateStore[thisStateIndex] = initialValue;
  // defining the function that will be used to change this particular piece of state, such that the framework can handle updating the store and rerendering
  function updater(newValue) {
    // if the updater is called but the value of the state hasn't changed, there's really no need to do anything
    if (stateStore[thisStateIndex] !== newValue) {
      // updating the value
      stateStore[thisStateIndex] = newValue;
      // instigating a rerender
      rerender();
    }
  }
  // returning the value in the store and the updater so the user of the framework can access the current value of this piece of state, and can update it
  return [stateStore[thisStateIndex], updater];
}