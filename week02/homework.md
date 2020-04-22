## 写一个正则表达式 匹配所有 Number 直接量

```javascript
/^(0|[1-9]\d*)\.\d*([eE][+-]?\d)?|0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+$/
```



## 写一个 UTF-8 Encoding 的函数

```js
function UTF8_Encoding(string){ {
  const codes = encodeURIComponent(string)
  const bytes = []

  for (let i = 0; i < codes.length; i++) {
    const c = codes.charAt(i)
    if (c === '%') {
      const hex = codes.charAt(i + 1) + codes.charAt(i + 2)
      const hexVal = parseInt(hex, 16)
      bytes.push(hexVal)
      i += 2
    } else {
      bytes.push(c.charCodeAt(0))
    }
  }
  return bytes
}
```



## 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
let doubleStringReg = /"(([^\"\\\n\r\u2028\u2029])|\u2028|\u2029|\\([^0-9xu]|0|x[0-9a-fA-F]{2}|((u[0-9a-fA-F]{4})|(u\{([0-9a-fA-F]{5}|10[0-9a-fA-F]{3}[0-9a-eA-E])\})))|\\(\\n\\r\\u2028\\u2029))*"/
let SingleStringReg = /'(([^\'\\\n\r\u2028\u2029])|\u2028|\u2029|\\([^0-9xu]|0|x[0-9a-fA-F]{2}|((u[0-9a-fA-F]{4})|(u\{([0-9a-fA-F]{5}|10[0-9a-fA-F]{3}[0-9a-eA-E])\})))|\\(\\n\\r\\u2028\\u2029))*'/
```

