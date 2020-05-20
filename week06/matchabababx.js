// 作业：使用状态机完成“abababx”的处理

function match(String) {
    let state = start;
    for (let c of String) {
        state = state(c);
    }
    return start === end;
}

function start(c) {
    if (c === 'a') {
        return foundA1;
    } else {
        return start;
    }
}

function end(c) {
    return end;
}

function foundA1(c) {
    if (c === 'b') {
        return foundB1;
    } else {
        return start(c);
    }
}

function foundB1(c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start(c);
    }
}

function foundA2(c) {
    if (c === 'b') {
        return foundB2;
    } else {
        return start(c);
    }
}

function foundB2(c) {
    if (c === 'a') {
        return foundA3;
    } else {
        return start(c);
    }
}

function foundA3(c) {
    if (c === 'b') {
        return foundB3;
    } else {
        return start(c);
    }
}

function foundB3(c) {
    if (c === 'x') {
        return end;
    } else {
        return foundB2(c);
    }
}

console.log(match('I am grootabbabababx'));