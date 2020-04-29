### convertStringToNumber

```javascript
function convertStringToNumber(string, x = 10) {
    // 数字直接量正则
    let reg = /^(?:(?:0|[1-9]\d*)\.\d*|\.\d+|(?:0|[1-9]\d*))(?:[eE][-+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/;
    if(reg.test(string) == false)  return NaN;

    let chars = string.split('');
    let number = 0;
    let i = 0;

    // 处理二进制、八进制和十六进制
    if(chars.length > 2 && chars[0] === '0') {
        if(chars[1] == 'b' || chars[1] == 'B') x = 2
        if(chars[1] == 'o' || chars[1] == 'O') x = 8
        if(chars[1] == 'x' || chars[1] == 'X') x = 16

        i = 2
        while(i < chars.length) {
            number = number * x;
            let codeCount = chars[i].codePointAt(0) - '0'.codePointAt(0);
            if(codeCount >= 10) codeCount = 10 + chars[i].toLowerCase().codePointAt(0) - 'a'.codePointAt(0)
            number += codeCount;
            i++;
        }
        return number;
    }
    
    // 只处理十进制
    x = 10
    while(i < chars.length && chars[i] != '.' && chars[i] != 'e' && chars[i] != 'E') {
        number = number * x;
        number += chars[i].codePointAt(0) - '0'.codePointAt(0);
        i++;
    }
    if(chars[i] == '.') i++

    let fraction = 1;
    while(i < chars.length && chars[i] != 'e' && chars[i] != 'E') {
        fraction = fraction / x;
        number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
        i++
    }
    if(chars[i] == 'e' || chars[i] == 'E') i++
    if(chars[i] == '+') i++

    let sign = 1
    if(chars[i] == '-') {
        i++;
        sign = -1;
    }

    
    let exponent = 0
    while(i < chars.length) {
        exponent = exponent * x;
        exponent += chars[i].codePointAt(0) - '0'.codePointAt(0);
        i++
    }

    return number * 10 ** (sign * exponent);
}
```



### convertNumberToString

```javascript
function convertNumberToString(number, x = 10) {
  if (x < 2 || x > 36)
    throw new Error("radix must be between 2 and 36");
  if (number=='0') return 0
  if (isNaN(Math.floor(number))) return NaN;
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const signs = {
    "1": "",
    "-1": "-",
  };
  let symbol = sign(number);
  number = Math.abs(number);
  let integer = Math.floor(number);
  let decimal = number - integer;
  let integerString = "";
  let decimalString = "";
  while (integer > 0) {
    let n = integer % x;
    integerString = `${alphabet[n]}${integerString}`;
    integer = Math.floor(integer / x);
  }
  if (decimal) {
    while (decimal && decimalString.length <= 56) {
      decimal *= x;
      decimalString += alphabet[`${Math.floor(decimal)}`];
      decimal -= Math.floor(decimal);
    }
  }
  return `${signs[symbol]}${integerString ? integerString : 0}${
    decimalString ? "." + decimalString : ""
  }`;
  function sign(number) {
    if (number !== 0 && !number) return undefined;
    if (number === 0) {
      return 1 / number === Infinity
        ? 1
        : 1 / number === -Infinity
        ? -1
        : undefined;
    }
    return number / Math.abs(number);
  }
}
```



