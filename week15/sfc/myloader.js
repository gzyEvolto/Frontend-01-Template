var parser = require("./parser");

module.exports = function (source, map) {
  console.log(source);
  console.log(parser.parseHTML(source));
  // console.log("my loader is running!!!!!!!!\n", this.resourcePath);
  // console.log(tree.children[1].children[0].content);

  let template = null;
  let script = null;

  for (let node of tree.children) {
    if (node.tagName == "template")  {
      template = node.children.filter(e => e.type != 'text')[0];
    }
    if (node.tagName == "script") {
      script = node.children[0].content;
    }
  }

  let visit = (node) => {
    let attrs = {};
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map(node => visit(node));
    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  } 

  visit(template);

  let r = `
import {createElement, Text, Wrapper} from "./createElement";
export class Carousel {
  render() {
    return ${visit(template)};
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
  setAttribute(name, value) {
    this[name] = value;
  }
}
  `;
  return r;
};
