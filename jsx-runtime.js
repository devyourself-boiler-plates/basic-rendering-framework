// Babel needs this function to create VDOM nodes from parsed JSX
export const jsx = (tag, props) => {
  return { tag, props };
};

// Babel also needs a second alias to the function above (apparently).
// The reason for this amounts to, "that how the Babel developers made it"
export const jsxs = jsx;