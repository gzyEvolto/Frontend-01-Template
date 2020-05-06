# 前端进阶训练营第四周总结

## 重学JavaScript|结构化

本节课重点讲述了**事件循环**，**宏任务**和**微任务**。

### 事件循环

事件循环机制：**要想在线程运行过程中，能接受并执行新的任务，就要采用事件循环机制**。

### 消息队列

**消息队列是一种数据结构，可以存放要执行的任务**。它符合队列“**先进先出**”的特点，也就是说**要添加任务的话，添加到队列的尾部；要取出任务的话，从队列头部去取**。

### 宏任务

- 渲染事件（如解析 DOM、计算布局、绘制）；
- 用户交互事件（如鼠标点击、滚动页面、放大缩小等）；
- JavaScript 脚本执行事件；
- 网络请求完成、文件读写完成事件。

### 微任务

**异步回调的执行时机是在主函数执行结束之后、当前宏任务结束之前执行回调函数，这通常都是以微任务形式体现的。**

**微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。**

在现代浏览器里面，产生微任务有两种方式。

第一种方式是使用 MutationObserver 监控某个 DOM 节点，然后再通过 JavaScript 来修改这个节点，或者为这个节点添加、删除部分子节点，当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务。

第二种方式是使用 Promise/async&await(async函数会隐式返回一个promise实例)，当调用 Promise.resolve() / Promise.reject() /await的时候，也会产生微任务。

通过 DOM 节点变化产生的微任务或者使用 Promise 产生的微任务都会被 JavaScript 引擎按照顺序保存到微任务队列中。

- 微任务和宏任务是绑定的，每个宏任务在执行时，会创建自己的微任务队列。
- 微任务的执行时长会影响到当前宏任务的时长。比如一个宏任务在执行过程中，产生了 100 个微任务，执行每个微任务的时间是 10 毫秒，那么执行这 100 个微任务的时间就是 1000 毫秒，也可以说这 100 个微任务让宏任务的执行时间延长了 1000 毫秒。所以你在写代码的时候一定要注意控制微任务的执行时长。
- 在一个宏任务中，分别创建一个用于回调的宏任务和微任务，无论什么情况下，微任务都早于宏任务执行。

参考资料：李兵老师的《浏览器工作原理与实践》

### 相关知识点总结

- 其实所有的JS代码都是一个微任务，只是哪些微任务构成了一个宏任务；执行在JS引擎里的就是微任务，执行在JS引擎之外的就是宏任务，循环宏任务的工作就是事件循环。

- 事件循环不属于JavaScript引擎实现的东西，而是由浏览器或NodeJS宿主环境实现的

- 一个宏任务里的同步代码可以理解为微任务，只不过比宏任务里的异步代码的微任务优先入队。

- 微任务是没有优先级的，一个宏任务中只存在一个微任务队列，根据入队时间决定微任务顺序，列表里的所有微任务执行完才会执行下一个宏任务。

- Promise的then方法以及async函数里的await（await相当于语法上的then，then在分号之后）会将一个微任务入队，添加在微任务队列的最后。

- 如果遇到throw Error，后面的宏任务微任务还执行吗?
  还执行，只打断一个微任务，不会把后面的都干掉，还可以catch

- ECMAScript相关章节：RunJobs（P.104）

  > 拿浏览器举例：setTimeout、setInterval 这种其实不是 JS 语法本身的 API，是 JS 的宿主浏览器提供的 API， 所以是宏任务。 而 Promise 是 JS 本身自带的 API，这种就是微任务。
  >
  > 总结：宿主提供的方法是宏任务，JS 自带的是微任务

### 事件循环代码执行顺序解析

```javascript
  async function afoo() {
    console.log('-2')
    await new Promise((resolve) => resolve())
    console.log('-1')
    await new Promise((resolve) => resolve())
    console.log('-0.5')
  }
  new Promise((resolve) => (console.log('0'), resolve())).then(
    () => (
      console.log('1'),
      new Promise((resolve) => resolve()).then(() => console.log('1.5'))
    )
  )

  setTimeout(function () {
    console.log('2')
    new Promise((resolve) => resolve()).then(console.log('3'))
  }, 0)
  console.log('4')
  console.log('5')
  afoo()
//0
//4
//5
//-2
//1
//-1
//1.5
//-0.5
//Promise {<resolved>: undefined}
//2
//3

```

- 宏任务1：
  - 微任务1（同步代码）：0, 4, 5, -2
    - 入队1（0执行后），-1（-2执行后）
  - 微任务2：1
    - 入队1.5（1执行后）
  - 微任务3：-1
    - 入队-0.5（-1执行后）
  - 微任务4：1.5
  - 微任务5：-0.5
- 宏任务2：
  - 微任务1：2
  - 微任务2：3

### 同学提供代码分析

```javascript
  new Promise((res) => res()).then(() => {
    setTimeout(() => {
      console.log(1)
    }, 1000)
  }, console.log(0)) // 这里是then的第二个参数
  console.log(2)
//0
//2
//undefined
//1
```

↑ 障眼法：console.log(0)是then的参数，属于同步代码

```javascript
  async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
  }
  async function async2() {
    console.log('async2')
  }
  async1()
  new Promise(function (resolve) {
    console.log('promise1')
    resolve()
  }).then(function () {
    console.log('promise2')
  })
//async1 start（同步代码）
//async2（同步代码，入队async1 end）
//promise1（同步代码，入队promise2）
//async1 end（第二个微任务）
//promise2（第三个微任务）
//Promise {<resolved>: undefined}
```



