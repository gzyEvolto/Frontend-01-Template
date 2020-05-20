# 前端进阶训练营第六周总结

## 浏览器工作原理 | 有限状态机

### 应用场景

1. 做游戏，如:敌人的AI
2. 在编译原理中构建AST
3. 正则表达式的实现，如:处理字符串
4. 描述一些算法

### 描述

- 每一个状态都是一个机器

- - 正在每一个机器里，我们可以做计算，存储，输出...
  - 所有的这些机器接受的输入都是一致的
  - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是一个纯函数(无副作用)

- 每一个机器都知道下一个状态

- - 每个机器都有确定的下一个状态(Moore)
  - 每个机器根据输入决定下一个状态(Mealy)

### JS中的有限状态机

```javascript
// 每一个函数是一个状态
function state(input) // 函数参数就是输入
{
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  return next; // 返回值作为下一个状态
}

// 以下是调用
while(input) {
  // 获取输入
  state = state(input); // 把状态机的返回值作为下一个状态
}
```

## 浏览器工作原理 | HTTP协议+语法与词法分析（三）

### HTML的解析-词法分析

#### 第一步

- 为了方便文件管理，把parser拆分到单独的文件中
- parser接受HTML文本作为参数，返回一颗DOM树

#### 第二步-创建状态机

[HTML标准文档--Tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)

JavaScript的词法在标准中都是通过产生式进行定义。

html的词法却在 HTML标准中 直接写出伪代码(在状态机中在定义了各种状态)

- 使用FSM实现HTML的分析
- 在HTML标准中，已经规定了HTML的状态
- 我们的弯矩浏览器只挑选某一部分状态进行实现

#### 第三步-解析标签

- 主要的标签有: 开始标签，结束标签，自封闭标签
- 这一步暂时忽略对属性的处理

#### 第四步-创建元素

- 在状态机中，除了状态迁移，还需要加入业务逻辑
- 在标签结束状态提交标签token

#### 第五步-处理属性

- 属性值分为 单引号，双引号，无引号三种写法，因此需要较多的状态处理
- 处理属性的方式跟标签类似
- 属性结束时，我们把属性加到标签token上

#### 第六步-构建DOM树

- 从标签构建DOM树的基本技巧是使用**栈**
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
- 自封闭节点可视为入栈后立即出栈
- 任何元素的父元素是它入栈前的栈顶

#### 第七部-处理文本节点

- 文本节点与自封闭节点处理类似
- 多个文本节点需要合并

## 浏览器工作原理 | CSS计算，排版,渲染，合成（一）

### 第一步-收集CSS规则

收集style里面的文本内容

- 遇到style标签的时候，把CSS规则保存起来
- 代码中通过 CSS parser库来分析CSS规则
- 需要仔细研究 CSS parser库解析CSS后生成的格式

### 第二步-添加调用

- 当我们创建一个元素后，必须立即计算CSS
- 理论上，当我们分析一个元素时，所有CSS规则已经收集完毕
- 在真实的浏览器中，可能遇到写在body标签内的style标签，需要重新CSS计算的情况

重排(Reflow)：当渲染树的一部分必须更新并且节点的尺寸发生了变化，浏览器会使渲染树中受到影响的部分失效，并重新构造渲染树。

重绘(Repaint)：是在一个元素的外观被改变所触发的浏览器行为，浏览器会根据元素的新属性重新绘制，使元素呈现新的外观。比如改变某个元素的背景色、文字颜色、边框颜色等等

重排:  重排一定会触发重绘

重新计算CSS： 必然造成重排

**如果把style标签写在了 元素标签之后，就会导致 重新计算CSS，导致界面闪动。因此最好把 style放在所有标签之前**

### 第三步-获取父元素序列

- 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
- 从上一步骤的stack，可以获取本元素所有的父元素
- 因为首先获取的是"当前元素"，所以获得和计算父元素匹配的顺序是从内向外

**CSS规则的最后一项一定是匹配当前元素，因此最后一项一定是优先处理

先计算 #myid,然后一级一级往上找  

### 第四步-拆分选择器

- 选择器也要从当前元素向外排列
- 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

#### 选择器分类

- 简单选择器
- 复合选择器
- 父子选择器
- 子孙选择器
- 兄弟选择器
- 伪类选择器
- 伪元素选择器
- 原子选择器

行内样式如何匹配

行内样式已经存在当前元素上了，只需要匹配style标签中的样式， 最后再把 style标签内的样式与行内样式进行合并

### 第五步-计算选择器与元素匹配

- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器

### 第六步-生成computed属性

- 一旦选择匹配，就应用选择器到元素上，形成computedStyle

### 第七步-Specificit

[css优先级-MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div a {
            color: green;
        }

        a {
            color: red;
        }
        /*这个是最高的额*/
        a#y {
            color: yellow;
        }

        a.x {
            color: palevioletred
        }
    </style>
</head>
<!--

-->

<body>
    <div>
        <a href="" class='x' id="y">name</a>
    </div>
</body>

</html>
```

首先必须知道简单选择器的优先级

从高到低排列有

1. 行内
2. id
3.  Class
4. 标签

根据 一条 selector中 应用的简单选择器的个数来指定优先级

**当用一个非常复杂的规则去选择元素时，最终优先级可以用一个"四元组"来表示**

**[tag个数,class个数,id个数,inline(最高)]  结果从后往前数(因为最后一位是inline,优先级最高)**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* [3,2,1,0]  123  优先级更高*/
        body div.container a.x#y {
            color: yellow;
        }

        /* [3,1,1,0]  113 */
        body div a.x#y {
            color: green;
        }
    </style>
</head>

<body>
    <div class='container'>
        <a href="" class='x' id="y">name</a>
    </div>
</body>

</html>
```



