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
// 传输介质
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

// 飞船
function Ship(id, dom) {
    this.id = id;
    this.isrunning = false; // 飞船是否正在运行
    this.energy = 100; // 飞船能源
    this.deg = random(0, 360); // 飞船位置，随机生成一个位置
    this.degv = 15; // 飞船飞行速度
    this.consume = 5; // 飞船能源消耗速率
    this.produce = 2; // 飞船能源补充速率

    this.looksdom = dom; // 飞船的样子
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
    var message = JSON.parse(msg); // 解码消息
    if (message.id != this.id) { // 消息主体不对，抛弃消息
        return;
    }
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
}
Commonder.prototype.commondRun = function(shipid) { // 下达【开始飞行】指令
    log("info", "对飞船" + shipid + "下达【开始飞行】指令");
    var message = {};
    message.id = shipid;
    message.commond = "start";
    mediator.publish(JSON.stringify(message));

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
    mediator.publish(JSON.stringify(message));

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
    mediator.publish(JSON.stringify(message));

    // 清理控制面板
    consoledom.removeChild(this.notebook[shipid][1]);
    this.notebook[shipid] = null;
    this.count--;
}
Commonder.prototype.commondNewShip = function() {
    if (this.count >= 4) {
        log("info", "不能再发射新的飞船了");
        return;
    }
    this.count++;
    // 创建飞船
    var shipid = random(0, 100);
    while (!(this.notebook[shipid] == null || this.notebook[shipid] ==
            undefined)) {
        // 生成一个不存在的编号
        shipid = random(0, 100);
    }
    createShip(shipid);

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
        this.childNodes[0].innerHTML = ship.id + " - " + parseInt(ship.energy) +
            "%";
        this.childNodes[1].style.width = parseInt(ship.energy) + "%";
        this.style.transform = "rotate(" + parseInt(ship.deg) + "deg)";
        this.style.top = (earth.y - Math.sin((ship.deg + 90) / 180.0 *
            Math.PI) * track - 10) + "px";
        this.style.left = (earth.x - Math.cos((ship.deg + 90) / 180.0 *
            Math.PI) * track - 200) + "px";
    }
    return shipdom;
}
window.makecommonddom = function(shipid) { //创建飞船shipid的操控面板
    var commonddom = document.createElement('div');
    commonddom.id = shipid;
    commonddom.appendChild(document.createTextNode("对飞船" + shipid + "下达命令："));
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
function createShip(shipid) {
    var shipdom = window.makeshipdom(); //飞船视图初始化
    shipdom.id = shipid;
    var ship = new Ship(shipid, shipdom); // 飞船初始化
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
    mediator = new Mediator();

    // 控制台
    commonder = new Commonder();

    // dom初始化
    logdom = document.getElementById("output");
    spacedom = document.getElementById("space");
    consoledom = document.getElementById("console");
    document.getElementById("btn-new-ship").addEventListener("click",
        function() {
            commonder.commondNewShip();
        });

    // 初始化完成
    log("info", "系统初始化完成");
}
