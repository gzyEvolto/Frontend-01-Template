export class Timeline {
  constructor() {
    this.animations = [];
    this.requestID = null;
    this.state = "inited";
    //this值保留
    this.tick = () => {
      let t = Date.now() - this.startTime;
      // console.log("tick");
      //结束动画管理
      let animations = this.animations.filter(
        (animation) => !animation.finished
      );
      for (let animation of animations) {
        let {
          object,
          property,
          template,
          start,
          end,
          duration,
          timingFunction,
          delay,
          addTime,
        } = animation;
        let progression = timingFunction((t - delay - addTime) / duration); //0-1之间的数 进展 百分比
        if (t > duration + delay + addTime) {
          progression = 1;
          animation.finished = true;
        }

        // let value = start + progression * (end - start); //
        let value = animation.valueFromProgression(progression);
        object[property] = template(value);
      }
      if (animations.length) {
        this.requestID = requestAnimationFrame(this.tick);
      }
    };
  }
  //每帧执行的函数
  //this值不固定
  //   tick() {

  //   }

  pause() {
    if (this.state !== "playing") {
      return;
    }
    this.state = "paused";
    //取消下一个tick
    this.pauseTime = Date.now();
    if (this.requestID !== null) {
      cancelAnimationFrame(this.requestID);
    }
  }

  resume() {
    if (this.state !== "paused") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  start() {
    if (this.state !== "inited") {
      return;
    }
    this.state = "playing";
    //简单时间线
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    if (this.state === "playing") {
      this.pause();
    }
    this.animations = [];
    this.requestID = null;
    this.state = "inited";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    this.animations.push(animation);
    animation.finished = false;
    if (this.state === "playing") {
      animation.startTime =
        startTime !== void 0 ? startTime : Date.now() - this.startTime;
    } else {
      animation.startTime = startTime !== void 0 ? startTime : 0;
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0; //(默认值0)
    this.timingFunction = timingFunction;
    //   timingFunction ||
    //   ((start, end) => {
    //     //线性插值
    //     return (t) => start + (t / duration) * (end - start);
    //   });
    //ease
  }
  valueFromProgression(progression) {
    return this.start + progression + (this.end - this.start);
  }
}

export class colorAnimation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0; //(默认值0)
    this.timingFunction = timingFunction;
    //   timingFunction ||
    //   ((start, end) => {
    //     //线性插值
    //     return (t) => start + (t / duration) * (end - start);
    //   });
    //ease
  }
  valueFromProgression(progression) {
    return {
      r: this.start.r + progression + (this.end - this.start.r),
      g: this.start.g + progression + (this.end - this.start.g),
      b: this.start.b + progression + (this.end - this.start.b),
      a: this.start.a + progression + (this.end - this.start.a),
    };
  }
}

/* 

let animation = new Animation(object,property,start,end,duration,delay,timingFunction)
let animation2 = new Animation(object,property,start,end,duration,delay,timingFunction)
//一个帧里产生多个函数调用性能不过关，使用时间线控制(任何动画库都是时间线这一基础抽象概念)
let timeline = new Timeline;

timeline,add(animation);
timeline,add(animation2);
timeline.start()
timeline.pause()
timeline.resume()
timeline.stop()

// animation.start()
// animation2.start()

// animation.pause()
// animation.resume()

// animation.stop()


setTimeout
setInterval
requestAnimation

*/
