'use strict'
// 辅助函数
// 生成a,b的随机数
function random(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}

// 日志控制
var logdom;

function log(level, message) {
    var color;
    switch (level) {
        case "error":
            color = 'red';
            break;
        case "success":
            color = "green";
            break;
        case "warning":
            color = "orange";
            break;
        default:
            color = "#ccc";
    }
    var messagediv = document.createElement('div');
    messagediv.style.color = color;
    messagediv.appendChild(document.createTextNode(message));
    logdom.appendChild(messagediv);

    console.log("%c " + message, "color:" + color);
}

// 转换器Adapter
function Adapter() {

}
Adapter.prototype.encode = function(msg) {
    msg = JSON.parse(msg);
    var data = 0;
    data = (data | msg.id);
    switch (msg.commond) {
        case 'start':
            data = ((data << 4) | 1);
            break;
        case 'stop':
            data = ((data << 4) | 2);
            break;
        case 'destory':
            data = ((data << 4) | 12);
            break;
        default:
            log("error", "未知指令 " + msg.commond);
            return null;
    }

    return data;
}
Adapter.prototype.decode = function(msg) {

    var data = {};
    data.ackid = msg >> 8;
    data.id = ((msg & 255) >> 4);
    switch (msg & 15) {
        case 1:
            data.commond = 'start';
            break;
        case 2:
            data.commond = 'stop';
            break;
        case 12:
            data.commond = 'destory';
            break;
        default:
            return null;
    }

    return JSON.stringify(data);
}

// 传输介质 Mediator
function Mediator() {
    this.subscribes = []; // 接收消息的对象
}
Mediator.prototype.publish = function(msg) { // 发布消息
    var rand = Math.random();
    if (rand < 0.3) { // 消息丢失模拟
        log("warning", "发送的消息消失在了虚空之中，再也回不来了");
        return;
    }

    var that = this;
    // 延时1000ms后通知接受者
    setTimeout(function() {
        that.subscribes.forEach(function(item) {
            item.receive(msg); // 通知接收消息
        });
    }, 1000);
}
Mediator.prototype.addSubscriber = function(obj) { //添加消息接受者
    this.subscribes.push(obj);
}
Mediator.prototype.removeSubscriber = function(obj) { //移除消息接受者
    var pos = this.subscribes.indexOf(obj);
    if (pos != -1) {
        this.subscribes.splice(pos, 1);
    }
}

// 传输介质 BUS
// 消息格式
function BUS() {
    this.subscribes = []; // 接收消息的对象
    this.acklist = []; // 已经发送还没有ack的数据，格式 [消息id, 消息内容, 消息发送时间，是否确认]
    this.msgid = 0;
}
BUS.prototype.update = function(time) { // 检查是否有未收到确认的消息
    var republish = []; //需要重新确认的消息
    var cnt = 0;
    for (var i = 0; i < this.acklist.length; i++) {
        if (this.acklist[i][3] === true) { // 已经确认的消息
            // do nothing
        } else {
            if (new Date().getTime() - this.acklist[i][2] > 1000) { // 超时消息，记录下来需要重发
                republish.push(this.acklist[i]);
            } else {
                this.acklist[cnt++] = this.acklist[i]; // 还在存活期的消息
            }
        }
    }
    // 清理无用的消息
    while (this.acklist.length > cnt) {
        this.acklist.pop();
    }
    // 重新发送消息
    for (var i = 0; i < republish.length; i++) {
        log("warning", "未收到消息确认，发送的消息可能丢失了，重新发送");
        this.publish(republish[i][1]);
    }
}
BUS.prototype.publish = function(msg) { // 发布消息

    var that = this;
    var data = ((this.msgid << 8) | msg);

    this.acklist.push([this.msgid, msg, new Date().getTime(), false]);

    this.msgid++;

    var rand = Math.random();
    if (rand < 0.1) { // 消息丢失模拟
        return;
    }

    // 延时300ms后通知接受者
    setTimeout(function() {
        that.subscribes.forEach(function(item) {
            item.receive(data); // 通知接收消息
        });
    }, 300);
}
BUS.prototype.addSubscriber = function(obj) { //添加消息接受者
    this.subscribes.push(obj);
}
BUS.prototype.removeSubscriber = function(obj) { //移除消息接受者
    var pos = this.subscribes.indexOf(obj);
    if (pos != -1) {
        this.subscribes.splice(pos, 1);
    }
}
BUS.prototype.ack = function(ackid) { // 确认消息收到
    var that = this;
    for (var i = 0; i < that.acklist.length; i++) {
        var data = that.acklist[i];
        if (data[0] === ackid) {
            this.acklist[i][3] = true; //标记为确认
            break;
        }
    }

}

// 飞船
function Ship(id, dom, energy, power) {
    this.id = id;
    this.isrunning = false; // 飞船是否正在运行
    this.energy = 100; // 飞船能源
    this.deg = random(0, 360); // 飞船位置，随机生成一个位置
    this.degv = power.speed; // 飞船飞行速度
    this.consume = power.consume; // 飞船能源消耗速率
    this.produce = energy.produce; // 飞船能源补充速率

    this.looksdom = dom; // 飞船的样子

    this.adapter = new Adapter(); // 适配器
}
Ship.prototype.update = function(time) {
    // 宇宙来更新飞船数据 - time 宇宙经过的时间

    // 补充能量
    this.energy += this.produce * (time / 1000.0);
    if (this.energy > 100) {
        this.energy = 100;
    }
    if (this.isrunning) { // 运行的时候消耗能量
        this.energy -= this.consume * (time / 1000.0);
        this.deg += this.degv * (time / 1000.0);
    }
    if (this.energy <= 0) { //能量消耗完毕，停止运行
        this.isrunning = false;
        this.energy = 0;
    }

    this.looksdom.update(this); //更新飞船视图
}
Ship.prototype.start = function() { // 开始飞行
    if (this.isrunning) {
        log("error", "飞船" + this.id + "正在飞行");
    } else {
        log("success", "飞船" + this.id + "飞行成功");
    }
    this.isrunning = true;
}
Ship.prototype.stop = function() { // 停止飞行
    if (!this.isrunning) {
        log("error", "飞船" + this.id + "已停止");
    } else {
        log("success", "飞船" + this.id + "停飞成功");
    }
    this.isrunning = false;
}
Ship.prototype.destory = function() { // 销毁指令
    destoryShip(this);
    log("success", "飞船" + this.id + "已销毁");
}
Ship.prototype.receive = function(msg) { // 接收消息

    var msg = this.adapter.decode(msg);

    var message = JSON.parse(msg); // 解码消息
    if (message.id != this.id) { // 消息主体不对，抛弃消息
        return;
    }
    mediator.ack(message.ackid); // 确认消息收到
    // 执行命令
    if (message.commond == 'start') {
        this.start();
    } else if (message.commond == 'stop') {
        this.stop();
    } else if (message.commond == 'destory') {
        this.destory();
    } else {
        log("error", "无效命令指令： " + message.commond);
    }
}

// 飞船动力系统
// 代号a1 前进号（速率30px/s，能耗5%/s）
function PowerA1() {
    this.speed = 30;
    this.consume = 5;
}
// 代号a2 奔腾号（速率50px/s，能耗7%/s）
function PowerA2() {
    this.speed = 50;
    this.consume = 7;
}
// 代号a3 超越号（速率80px/s，能耗9%/s）
function PowerA3() {
    this.speed = 80;
    this.consume = 9;
}
// 动力工厂
function getPowerByID(id) {
    switch (id) {
        case 'a1':
            return new PowerA1();
        case 'a2':
            return new PowerA2();
        case 'a3':
            return new PowerA3();
        default:
            return null;
    }
}

// 飞船能源系统
// 代号b1 劲能型（补充能源速度2%/s）
function EnergyB1() {
    this.produce = 2;
}
// 代号b2 光能型（补充能源速度3%/s）
function EnergyB2() {
    this.produce = 3;
}
// 代号b3 永久型（补充能源速度4%/s）
function EnergyB3() {
    this.produce = 4;
}
// 能源工厂
function getEnergyByID(id) {
    switch (id) {
        case 'b1':
            return new EnergyB1();
        case 'b2':
            return new EnergyB2();
        case 'b3':
            return new EnergyB3();
        default:
            return null;
    }
}

// 宇宙时间线
function Space() {
    this.objects = []; // 宇宙中的对象们
    this.islive = false;
}
Space.prototype.addObject = function(obj) { // 对象出生
    this.objects.push(obj);
}
Space.prototype.removeObject = function(obj) { // 对象消亡
    var pos = this.objects.indexOf(obj);
    if (pos != -1) {
        this.objects.splice(pos, 1);
    }
}
Space.prototype.run = function() {
    var timespace = 100; // 时间是不连续的
    var that = this;
    // 宇宙诞生
    this.islive = true;

    function mainloop() { // 宇宙每天都要工作
        that.objects.forEach(function(obj) {
            obj.update(timespace); // 万事万物随时间变化
        });
        if (that.islive) {
            setTimeout(mainloop, timespace); // 宇宙每100ms巡视一次
        }
    }
    mainloop();
}
Space.prototype.stop = function() { // 销毁宇宙
        this.islive = false;
    }
    // 控制台
function Commonder() {
    this.notebook = {}; // 记录着飞船的小秘密
    this.count = 0; // 已发射飞船的数量
    this.adapter = new Adapter(); // 适配器
}
Commonder.prototype.commondRun = function(shipid) { // 下达【开始飞行】指令
    log("info", "对飞船" + shipid + "下达【开始飞行】指令");
    var message = {};
    message.id = shipid;
    message.commond = "start";
    mediator.publish(this.adapter.encode(JSON.stringify(message)));

    // 记录当前飞船状态，并修改控制面板
    var shipstate = this.notebook[shipid];
    shipstate[0] = true;
    shipstate[1].childNodes[1].disabled = shipstate[0];
    shipstate[1].childNodes[2].disabled = !shipstate[0];
}
Commonder.prototype.commondStop = function(shipid) { // 下达【停止飞行】指令
    log("info", "对飞船" + shipid + "下达【停止飞行】指令");
    var message = {};
    message.id = shipid;
    message.commond = "stop";
    mediator.publish(this.adapter.encode(JSON.stringify(message)));

    // 记录当前飞船状态，并修改控制面板
    var shipstate = this.notebook[shipid];
    shipstate[0] = false;
    shipstate[1].childNodes[1].disabled = shipstate[0];
    shipstate[1].childNodes[2].disabled = !shipstate[0];
}
Commonder.prototype.commondDestory = function(shipid) { // 下达【销毁】指令
    log("info", "对飞船" + shipid + "下达【销毁】指令");
    var message = {};
    message.id = shipid;
    message.commond = "destory";
    mediator.publish(this.adapter.encode(JSON.stringify(message)));

    // 清理控制面板
    consoledom.removeChild(this.notebook[shipid][1]);
    this.notebook[shipid] = null;
    this.count--;
}
Commonder.prototype.commondNewShip = function(energyid, powerid) {
    if (this.count >= 4) {
        log("info", "不能再发射新的飞船了");
        return;
    }
    this.count++;
    // 创建飞船
    var shipid = 0;
    while (!(this.notebook[shipid] == null || this.notebook[shipid] ==
            undefined)) {
        shipid++; // 找到未被使用的id
    }

    createShip(shipid, energyid, powerid);

    // 创建飞船控制面板
    var shipcommond = window.makecommonddom(shipid); // 创建飞船视图
    consoledom.appendChild(shipcommond);
    this.notebook[shipid] = [false, shipcommond]; // 当前飞行状态和控制面板状态
    log("success", "发射了飞船" + shipid);
}

// 视图控制
var track = 200; // 轨道半径
window.onresize = function() {
    // 改变屏幕重新调整地球位置
    earth.x = document.body.scrollWidth / 2;
    earth.y = document.body.scrollHeight / 2;
    earth.style.top = (earth.y - 100) + "px";
    earth.style.left = (earth.x - 250) + "px"
}
window.makeshipdom = function() { //创建飞船视图
    var shipdom = document.createElement('div');
    shipdom.className = "ship";
    var textdom = document.createElement('div');
    textdom.className = 'info';
    shipdom.appendChild(textdom);
    var progressdom = document.createElement('div');
    progressdom.className = 'progress';
    shipdom.appendChild(progressdom);
    shipdom.update = function(ship) {
        this.childNodes[0].innerHTML = ship.id + " - " +
            parseInt(ship.energy) +
            "%";
        this.childNodes[1].style.width = parseInt(ship.energy) +
            "%";
        this.style.transform = "rotate(" + parseInt(ship.deg) +
            "deg)";
        this.style.top = (earth.y - Math.sin((ship.deg + 90) /
            180.0 *
            Math.PI) * track - 10) + "px";
        this.style.left = (earth.x - Math.cos((ship.deg + 90) /
            180.0 *
            Math.PI) * track - 200) + "px";
    }
    return shipdom;
}
window.makecommonddom = function(shipid) { //创建飞船shipid的操控面板
    var commonddom = document.createElement('div');
    commonddom.id = shipid;
    commonddom.appendChild(document.createTextNode("对飞船" + shipid +
        "下达命令："));
    // 开始飞行按钮
    var buttonstart = document.createElement('input');
    buttonstart.type = 'button';
    buttonstart.value = "开始飞行";
    buttonstart.addEventListener("click", function() {
        shipStart(shipid);
    });
    commonddom.appendChild(buttonstart);
    // 停止飞行按钮
    var buttonstop = document.createElement('input');
    buttonstop.type = 'button';
    buttonstop.value = "停止飞行";
    buttonstop.disabled = true;
    buttonstop.addEventListener("click", function() {
        shipStop(shipid);
    });
    commonddom.appendChild(buttonstop);
    // 销毁按钮
    var buttondestory = document.createElement('input');
    buttondestory.type = 'button';
    buttondestory.value = "销毁";
    buttondestory.addEventListener("click", function() {
        shipDestory(shipid);
    });
    commonddom.appendChild(buttondestory);
    return commonddom;
}

//创建飞船
function createShip(shipid, energyid, powerid) {
    var shipdom = window.makeshipdom(); // 飞船视图初始化
    shipdom.id = shipid;
    var energy = getEnergyByID(energyid); // 飞船能源
    var power = getPowerByID(powerid); // 飞船动力
    var ship = new Ship(shipid, shipdom, energy, power); // 飞船初始化
    spacedom.appendChild(shipdom); // 添加dom
    space.addObject(ship); // 添加对象
    mediator.addSubscriber(ship) //添加消息接收

    log("info", "飞船" + shipid + "主体创建完毕");
}
//销毁飞船
function destoryShip(ship) {
    space.removeObject(ship);
    mediator.removeSubscriber(ship);
    spacedom.removeChild(ship.looksdom);

    log("info", "飞船" + ship.id + "主体销毁完毕");
}

// 控制台命令
// 飞船飞行
function shipStart(shipid) {
    commonder.commondRun(shipid);
}
// 飞船停止
function shipStop(shipid) {
    commonder.commondStop(shipid);
}
// 飞船销毁
function shipDestory(shipid) {
    commonder.commondDestory(shipid);
}
//初始化
var earth; // 地球
var space; // 宇宙
var mediator; // 消息传递介质
var commonder; // 控制台
var spacedom; // 宇宙视图区域
var consoledom; //控制台面板
window.onload = function() {
    // 地球居中
    earth = document.getElementById('earth');
    earth.x = document.body.scrollWidth / 2;
    earth.y = document.body.scrollHeight / 2;
    earth.style.top = (earth.y - 100) + "px";
    earth.style.left = (earth.x - 250) + "px"

    // 宇宙运行
    space = new Space();
    space.run();

    // 通信装置
    //mediator = new Mediator();
    mediator = new BUS();
    space.addObject(mediator); // 让宇宙帮忙清理消息

    // 控制台
    commonder = new Commonder();

    // dom初始化
    logdom = document.getElementById("output");
    spacedom = document.getElementById("space");
    consoledom = document.getElementById("console");
    document.getElementById("btn-new-ship").addEventListener(
        "click",
        function() {
            var energyid = document.getElementById('b').value;
            var powerid = document.getElementById('a').value;
            commonder.commondNewShip(energyid, powerid);
        });

    // 初始化完成
    log("info", "系统初始化完成");
}
