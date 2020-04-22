# 第二周总结

## 本周总结

本周winter老师从编程语言的通识个hi来引导我们思考js可能会如何设计语言的模式，并且老师也写了个产生式设计的语言demo。

作为计算机相关专业的人，科学计数法，进制换算，存储方式忘得差不多了，而且UTF-8/16/32字符集标准和ASCII码也只是在工作中少有的遇到相关乱码问题，从来没有深究和整理，通过课程才知道这些规范的意义，进行系统的学习。

## 课程笔记整理

### 编程语言通识与JavaScript语言设计

#### 按语法分类

* 非形式语言
  * 中文
* 形式语言
  * 0型: 无限制文法
    * 等号左边不止一个 <a><b> ::= "c"
  * 1型: 上下文相关文法
    * "a"<b>"c"::="a""x""c"
  * 2型: 上下文无关文法
    * js, 大部分情况是上下文无关
  * 3型: 正则文法
    * 限制表达能力

#### 产生式 BNF

```
"a"
"b"
<Program>: = ("a"+ | <Program> "b"+)+


整数连加
"+"
<Number>: "0" | "1" ... "9"
<Deciamal>: "0" | (("1" ~ "9") <Number>+)
<Expression>: <Deciamal> ("+" <Deciamal>)+
<Expression>: Deciamal | (<Expression> "+" <Deciamal>)

四则运算
<PrimaryExpression> = <DecimalNumber> |
"(" <LogicalExpression> ")"


<MultiplicativeExpression> = <PrimaryExpression> |
<MultiplicativeExpression> "*" <PrimaryExpression>|
<MultiplicativeExpression> "/" <PrimaryExpression>


<AdditiveExpression> = <MultiplicativeExpression> |
<AdditiveExpression> "+" <MultiplicativeExpression>|
<AdditiveExpression> "-" <MultiplicativeExpression>

逻辑判断
<LogicalExpression> = <AdditiveExpression> |
<LogicalExpression> "||" <AdditiveExpression> |
<LogicalExpression> "&&" <AdditiveExpression>

```

终结符, 如: "+"
非终结符: 如:  <LogicalExpression>

#### 图灵完备性

[wiki](https://zh.wikipedia.org/wiki/%E5%9C%96%E9%9D%88%E5%AE%8C%E5%82%99%E6%80%A7)

* 命令式 -- 图灵机
  * goto
  * if while
* 声明式 -- lambda
  * 递归
  * 分治

#### 类型系统

* 动态静态
* 强类型弱类型
* 复合类型
* 子类型
  * 逆变/协变



### 重学 JavaScript | 词法，类型

### unicode字符集

`Unicode（统一码、万国码、单一码）是计算机科学领域里的一项业界标准，包括字符集、编码方案等。Unicode 是为了解决传统的字符编码方案的局限而产生的，它为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。`

#### ASCII码

`ASCII ((American Standard Code for Information Interchange): 美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统，主要用于显示现代英语和其他西欧语言。它是最通用的信息交换标准，并等同于国际标准ISO/IEC 646。ASCII第一次以规范标准的类型发表是在1967年，最后一次更新则是在1986年，到目前为止共定义了128个字符。在写代码的时候，Atom最好只用ASCII范围内的。`

任何语言都需要兼容ASCII

unicode 0-128位区间兼容ASCII

js只支持unicode

block就是unicode里的分块

##### 关键block 

U+4E00 ~ U+9FFF：CJK Chinese Japanese Korean三合一

- 有一些增补区域（extension）

U+0000 - U+FFFF：BMP 超过四位十六进制

```js
String.fromCodePoint
```

```javascript
“”.CodePointAt
```

两个场景： 变量名 字符串也能用

block区块与unicode强相关

##### categories（分类）

letter字母 titlecase 标题强制大写

unicode里所有的space在js里都是合法空格

词法分析lexcial阶段 找四个顶级元素

### Atom

#### InputElemnt 词

- WhiteSpace 空白符

  - \<TAB\> // tab 键产生的空白，制表符 '\t'
  - \<VT\> // 纵向制表符 '\v'
  - \<FF\> // 换页符 formfeed
  - \<SP\> // 普通空格
  - \<NBSP\> // 不分词空格 no-break space
  - \<ZWNBSP\> // zero width no-break space 零宽不分词空格
    - BOM （已经被淘汰的技术）bit order mask，通过在文件开头加入一个 ZWNBSP（U+FEFF 零宽空格）,然后通过看收到的是 FE FF 或 FF FE 来判断是什么格式,淘宝最佳实践：每个文件开头都要打空格避免Bom。
  - \<USP\> // Unicode 里的空白

- LineTerminator 换行符

  - \<LF\> // line feed 换行 '\n'
  - \<CR\> // carriage return 回车 '\r'
  - \<LS\> // line separator 分行符，超出 Ascii 编码
  - \<PS\> // paragraph separator 分段符，超出 Ascii 编码

- Comment 注释

  - 注释里不能用\u 转义*，/*\u002a/这样是识别不出\u002a 为\*的。注释就是分为单行和多行。

    ```
    //单行注释
    /*
    多行注释
    */
    ```

  *上面三个在js中是无效的

- Token 有效字符

  - IdentifierName // 标识符与关键字，必须以 UnicodeIDStart 字符（英文大小写、中文等）、_、\$开头。其它位置以 UnicodeIDContinue、_、\$、\<ZWNJ\>零宽非连接符、\<ZWJ\>零宽连接符。最佳实践是都只使用 Ascii 范围内。

    - Keywords // 关键字 let var class 等
    - Identifier // 标识符
      - 实际写出的有意义的，用作变量名的部分，js在词法扫描的时初始全认为是idtifier，语法解析的时候才会细分
      - 变量名 不能跟关键字重名，有一个特殊的 get ,get 能当做变量名，然而在属性里却又能成为关键字
      - 属性名 可以跟关键字重名，如 a.this = 2
    - Future reserved Keywords // 保留字符
      - enum

  - Punctuator // 符号 - + = （ ）等

  - Literal // 直接量, true false null 1 2 3 等

    - Number // 数字

      - IEEE 754 Double Float
        - Sign (1) 符号位
        - Exponent (11) 指数位
        - Fraction (52) 有效数位
      - Number-Grammar // 语法
        - 整数写法 0 \| 0. \| .0 \| 1e3(指数，e E 都可以)
          - 二进制 0b 开头
          - 八进制 0o
          - 十进制
          - 十六进制 0x
      - Number-Practice 最佳实践
        - Safe Integer 安全整数 Number.MAX_SAFE_INTEGER
        - Float Compare 浮点精度，浮点比对数 Number.EPSILON，Math.abs(0.1 + 0.2 - 0.3) \<= Number.EPSILON

    - String // 字符串

      - Character // 字符

      - Code Point // 码点

      - Encoding // 字符集

        - ASCII // 0-128
        - Unicode // 万国码，js 里只认 Unicode
          - UTF-8
          - UTF-16
          - UTF-32
        - UCS // Unicode 的子集，U+0000 - U+FFFF,bmp范围
        - GB // 国标，兼容 ASCII 和大部分中文
          - GB2312
          - GBK(GB13000)
          - GB18030
        - ISO-8859 // 欧洲国家的大部分字符
        - BIG5 // 繁体中文字符

      - String-Grammar // 语法

        - "abc" // 双引号

          - 任何非双引号与反斜杠
          - " ' \ b f n r t v ,这几个字符以外的字符跟在\后面就是表示自身。这几个字符跟在\后面是有特定意义的。

        - 'abc' // 单引号

        - ``abc ``//template 模板

          ```javascript
          `i said :"${s}"`
          `i said :"${
          s
          }"`
          ```

          解析规则：

          - 第一部分以反引号`为开头，${结尾
          - 第二部分是js代码
          - 第三部分以}开头，反引号`结尾

    - Boolean // 布尔

      - true
      - false

    - Null

    - Undefined

    - Object

    - Symbol

    - 正则表达式直接量

      - /a/ 能算除号的地方就是除号，其它的算正则

  - undefined ：一个无法修改的全局变量名，但是它能在其它作用域使用和赋值。它是一个运行时的东西。

  - null ：，无法定义与声明，就如一个直接量一样。





<TAB>有独立的一个字符

制表符

js中使用 "\t"可以打印出tab空白

U+0009

<VT>纵向制表符 在js里是“\v”

<FF>form feed  10

<SP>

<NBSP>

u+00a0 160 no-break

普通空格 分词 换行按词

使用nbsp可以换行不断开词

大端法 小端法

U+2028 U+2029不要用 超出了ascii之外

js最佳实践是限制在ascii之内

bmp（Basic Multikinngual Plane）范围

排版相关的 不渲染

<ZWNJ> 零宽连接符

<ZWJ>零宽非连接符

代码混淆可以用上



运行时部分

array buffer

typedarray

