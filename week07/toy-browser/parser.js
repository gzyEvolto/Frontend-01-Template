const css = require("css");
const EOF = Symbol("EOF"); // EOF: End Of File
const layout = require("./layout.js");

let currentToken = null;
let currentAttibute = null;

let stack = [{ type: "document", children: [] }];
let currentTextNode = null;

let rules = [];

function addCSSRules(text) {
  let ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!element.attributes || !selector) {
    return false;
  }
  if (selector.charAt(0) === "#") {
    let attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    let attr = element.attributes.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
}

//选择器优先级
function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    let parts = part.split(/(?=[.#])/);
    parts.forEach((item) => {
      if (item.charAt(0) == "#") {
        p[1] += 1;
      } else if (item.charAt(0) == ".") {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    });
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];

  return sp1[3] - sp2[3];
}

function computeCSS(element) {
  let elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) continue;

    let j = 1; // 之所以从1开始是因为当前元素匹配的判断依据在上面做了
    for (let i = 0; i < elements.length; i++) {
      if ((match(elements[i]), selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      let sp = specificity(rule.selectors[0]);
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          for (let k = 0; k < 4; k++) {
            computedStyle[declaration.property][declaration.value][k] += sp[k];
          }
        }
      }
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    computeCSS(element);

    top.children.push(element);

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      if (top.tagName == "style") {
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }
    layout(top);
    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

// html内容开始
function data(c) {
  if (c == "<") {
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}
// 标签开始
function tagOpen(c) {
  if (c == "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    emit({
      type: "text",
      content: c,
    });
    return;
  }
}
// 结束标签的标签名
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == ">") {
  } else if (c == EOF) {
  } else {
  }
}
// 标签名
function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}
// 标签属性名之前
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == ">" || c == "/" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    // 抛错
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
// 标签属性名之后
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "=") {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
// 属性名
function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}
// 属性值之前
function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == '"') {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
    // return data
  } else {
    return UnquotedAttributeValue(c);
  }
}
// 双引号属性值
function doubleQuotedAttributeValue(c) {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
// 单引号属性值
function singleQuotedAttributeValue(c) {
  if (c == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}
// 属性值引号之后
function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
// 无引号属性值
function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}
// 自闭合标签
function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == "EOF") {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
};
