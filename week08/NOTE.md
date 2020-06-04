# 前端进阶训练营第八周总结

## 重学CSS | CSS基本语法,CSS基础机制（二）

### 一. 选择器语法



#### 1.1 简单选择器

- *
- div(标签选择器)  svg|a(命名空间选择器-html部分的知识)
- .class (支持用空格分隔多个)
- \#id  (必须完全匹配)
- [attr=value]  [attr~value]  [attr | value]  (属性选择器)
- :hover  (伪类)
- ::before  (伪元素)



#### 1.2 选择器语法

##### 1.2.1 复合选择器(多个简单选择器的组合，此情况下必须匹配每一个选择器)

- - <简单选择器><简单选择器><简单选择器>
  -  \* 或者div 必须写在最前面， 伪类，伪元素写在最后面



##### 1.2.2 选择器列表

是以逗号分隔的多个选择器

```
/*

*/
div,#id,.class{
}
```

##### 1.2.3 复杂选择器(把复合选择器用一定的操作符链接)

- - <复合选择器><sp><复合选择器>
  - <复合选择器>">"<复合选择器>
  - <复合选择器>"~"<复合选择器>
  - <复合选择器>"+"<复合选择器>
  - <复合选择器>"||"<复合选择器>

###### 1.2.3.1 子孙选择器

```
/*

选中 div 下面 含有  .class 的所有子元素
*/
div .class{
}
```

###### 1.2.3.2 子选择器

只能选择子一级，是一个严格的父子关系

```
/*
选中 div 下面 含有  .class 的一个子元素
*/
div>.class{
}
```

###### 1.2.3.3 兄弟选择器

```
/*

*/
div~.class{
}
```

###### 1.2.3.4 邻居选择器

```
/*

*/
div+.class{
}
```

###### 1.2.3.5 双竖线(level4标准)

table里面去选中一列

```
/*

*/
div||.class{
}
```



### 二. 选择器优先级



> 简单选择器的优先级
>
> 从高到低
>
> 1. 行内
> 2. id
> 3. Class
> 4. 标签
>
> 
>
> 根据 一条 selector中 应用的简单选择器的个数来指定优先级
>
> **当我们用一个非常复杂的规则去选择元素时，最终优先级可以用一个"四元组"来表示**
>
> **[****inline(最高),****,id个数,****class个数,****tag个数]  结果从后往前数(因为最后一位是inline,优先级最高)**



在玩具浏览器中是通过循环计算出优先级的，但是**在CSS 标准中使用一个足够大的N 进制 来进行计算**



> 下面列表中，选择器类型的优先级是递增的：
>
> 1. [类型选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)（例如，`h1`）和伪元素（例如，`::before`）
> 2. [类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) (例如，`.example`)，属性选择器（例如，`[type="radio"]`）和伪类（例如，`:hover`）
> 3. [ID 选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)（例如，`#example`）。
>
> **通配选择符**（universal selector）（[`*`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)）**关系选择符**（combinators）（[`+`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator), [`>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator), [`~`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator), ['` `'](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator), [`||`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Column_combinator)）和 **否定伪类**（negation pseudo-class）（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）对优先级没有影响。（但是，在 `:not()` 内部声明的选择器会影响优先级）。
>
> 您可以访问 https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#Specificity_2  或者 [https://specifishity.com](https://specifishity.com/) 来了解更多关于优先级的详细信息。
>
> 给元素添加的**内联样式** (例如，`style="font-weight:bold"`) 总会覆盖外部样式表的任何样式 ，因此可看作是具有最高的优先级。

**
**

**
**

### 2.1 简单选择器计数

在简单选择器中， 除了 #id, .class， 其他简单选择器的优先级是一样的



1       2

\#id div.a#id{

// ...

} 



[0,2,1,1]



S = 0 * N3+ 2 * N2  + 1 * N1 +1

取N = 1000000

S = 2000001000001



请写出下面选择器的优先级

- div#a.b .c[id=x]

- \#a:not(#b)

- *.a

- div.a

  

正确答案

- [0,1,3,1]
- [0,2,0,0]
- [0,0,1,0]
- [0,0,1,1]



### 解析 div#a.b .c[id=x]

#### 相同的规则的优先级--二者相等

```
<style>
    div#a.b .c[id=x] {
        color: red;
    }

    /*
    优先级相同，后面的规则会覆盖前面的规则
    */
    div#a.b .c[id=x] {
        color: blue;
    }
</style>

<div id='a' class='b'>
    <div class='c' id='x'>
        666
    </div>
</div>
```

#### id选择器 > 属性选择器

```
<style>
    /*
        #x 与  [id=x] 相比，  #x优先级跟高
    */
    div#a.b .c#x {
        color: red;
    }

    div#a.b .c[id=x] {
        color: blue;
    }
</style>

<div id='a' class='b'>
    <div class='c' id='x'>
        666
    </div>
</div>
```

#### class选择器=== 属性选择器

```
<style>
    /*
        .d 与  [id=x] 相比，  二者优先级是一致的
        */

    div#a.b .c.d {
        color: red;
    }

    div#a.b .c[id=x] {
        color: blue;
    }
</style>

<div id='a' class='b'>
    <div class='c d' id='x'>
        666
    </div>
</div>
<style>
    /*
        .d 与  [id=x] 相比，  二者优先级是一致的
        */

    div#a.b .c.d {
        color: blue;
    }

    div#a.b .c[id=x] {
        color: red;
    }
</style>

<div id='a' class='b'>
    <div class='c d' id='x'>
        666
    </div>
</div>
```

### 解析 #a:not(#b)

#### 伪类是不参与优先级计算的

```
<style>
    /*
       伪类是不参与优先级计算的
       但是，在 :not() 内部声明的选择器会影响优先级

      MDN中说到(https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)
      可以利用这个伪类提高规则的优先级。例如， #foo:not(#bar) 和 #foo 会匹配相同的元素，
      但是前者的优先级更高。
    */
    #a:not(#b) {
        color: green;
    }

    #a {
        color: black;
    }
</style>

<div id='x' class='b'>
    <div class='c d' id='a'>
        666
    </div>
</div>
<style>
    /*
       伪类是不参与优先级计算的
      
    */
    #a:not(#b) {
        color: green;
    }

    #x #a {
        color: black;
    }
</style>

<div id='x' class='b'>
    <div class='c d' id='a'>
        666
    </div>
</div>
```

### 解析 *.a 与 div.a

#### `*` 号不会影响优先级

```
<style>
    /*
       * 号不会影响优先级
      
    */
    div.a {
        color: brown;
    }

    *.a {
        color: green;
    }
</style>

<div id='x' class='b'>
    <div class='a' id='a'>
        666
    </div>
</div>
```



1. 复杂选择器的优先级就是把每个简单选择器的优先级加起来吗？  是的！
2. transform 不会改变别的元素， 只会改变自身元素位置，会改变重绘，
3. css 有继承吗？ 是指子元素属性与父元素属性的继承， 不是 面向对象说到的继承



## 三 . 伪类

### 链接/行为

- [`:any-link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:any-link)
- [`:link(未访问的超链接)`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:link)` `[`:visited(已访问的超链接)`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited)
- [`:hover(鼠标悬停状态)`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover)
- [`:active(鼠标点击的状态--可以被键盘触发)`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:active)
- [`:focus(--可以被键盘触发)`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus)
- [`:target`](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Using_the_:target_selector)



focus表示元素获得光标焦点时使用的颜色，主要用于文本框输入文字时使用（鼠标松开时显示的颜色）。

active表示当所指元素处于激活状态（鼠标在元素上按下还没有松开）时所显示的颜色。



伪类的顺序应为link--visited--hover--focus--active。

```
a:link { color: blue; }          /* 未访问链接 */
a:visited { color: purple; }     /* 已访问链接 */
a:hover { background: yellow; }  /* 用户鼠标悬停 */
a:active { color: red; }         /* 激活链接 */

p:active { background: #eee; }   /* 激活段落 */
```

### 树形结构

- [`:empty`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:empty)
- [`:nth-child()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)
- [`:nth-last-child()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-last-child)
- [`:first-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-child)  [`:last-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-child)  [`:only-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-child)



在玩具浏览器中，在startTag的时候去做computeCSS，

 `:nth-last-child()`  

[`:last-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-child)  至少要到endtag之后的下一个token是什么

`:only-child `  至少要到标签结束的时候，再往后扫一个token，才能知道是不是 此伪类对应的元素

是无法实现的，**在真实代码场景中不建议使用，**

#### CSS回溯问题



### 逻辑型

- [`:not`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)
- [`:where`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:where) [` :has`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:has)



not中加复杂选择器， 可以这样使用



## 四.伪元素

- [`::before`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before)
- [`::after`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after)
- [`::firstline`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line)
- [`::firstletter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter)



```
<div >
<::before/>   
    content content content content
    content content content content
    content content content content
    content content content content
 <::after/>   
</div>
```



```
<div >
<::first-letter/>c</::first-letter> ontent content content content
    content content content content
    content content content content
    content content content content 
</div>
<div>
<::first-line/>content content content content </::first-line>
    content content content content
    content content content content
    content content content content 
</div>
```



![img](https://cdn.nlark.com/yuque/0/2020/svg/382504/1591027251680-b487287c-57b4-401b-a904-2569f1ca9333.svg)

![img](https://cdn.nlark.com/yuque/0/2020/svg/382504/1591027251677-6db1cf0f-b113-4ae2-9d80-d49e16b33292.svg)

## 思考：

- 为什么 first-letter 可以设置 display:block 之类的，而 first-line 不行呢？



float脱离正常流与 first-line的定义矛盾了。会脱离文档流，会再次选择剩下的第一行，会出现无限循环,,....



- first-line为什么能改字体

## 重学CSS | 排版与排版相关属性,绘制与绘制相关属性