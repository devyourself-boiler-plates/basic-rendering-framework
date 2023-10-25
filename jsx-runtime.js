export const jsx = (tag, props) => {
  if (typeof tag === "function") {
    const element = tag(props);
    element.componentFunction = tag;
    return element;
  }
  return { tag, props };
};

export const jsxs = jsx;