var globalProperties = [
    // Value Properties of the Global Object
    // "Infinity",
    // "undefined",
    // "NaN",
    // Function Properties of the Global Object
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    // Constructor Properties of the Global Object
    "Array",
    "ArrayBuffer",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Number",
    "Object",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Proxy",
    "Promise",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "SharedArrayBuffer",
    "Function",
    "Symbol",
    "String",
    "SyntaxError",
    "TypeError",
    "URIError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    // Other Properties of the Global Object
    "Reflect",
    "Atomics",
    "JSON",
    "Math",
  ];
  var set = new Set();
  var queue = [];
  for (var p of globalProperties) {
    queue.push({
      path: [p],
      object: this[p],
    });
  }
  let current;
  while (queue.length) {
    current = queue.shift();
    console.log(current.path.join("."));
    if (set.has(current.object)) {
      continue;
    }
    set.add(current.object);
    for (let p of Object.getOwnPropertyNames(current.object)) {
      var property = Object.getOwnPropertyDescriptor(current.object, p);
      if (
        property.hasOwnProperty("value") &&
        ((property.value != null && typeof property.value === "object") ||
          typeof property.value === "object") &&
        property.value instanceof Object
      ) {
        queue.push({
          path: current.path.concat([p]),
          object: property.value,
        });
      }
      if (property.hasOwnProperty("get") && typeof property.get === "function") {
        queue.push({
          path: current.path.concat([p]),
          object: property.get,
        });
      }
      if (property.hasOwnProperty("set") && typeof property.set === "function") {
        queue.push({
          path: current.path.concat([p]),
          object: property.set,
        });
      }
    }
  }