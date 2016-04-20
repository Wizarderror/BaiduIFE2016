function random(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}

var direction = {
    UP: 0,
    DOWN: 180,
    LEFT: 270,
    RIGHT: 90
}

function Map(dom) {
    this.map = []; // 初始化地图布局
    for (var i = 0; i < 10; i++) {
        this.map[i] = [];
    }

    var doms = dom.getElementsByClassName("row");
    this.mapdom = [];
    for (var i = 0; i < 10; i++) {
        this.mapdom[i] = doms[i].getElementsByClassName("square");
    }
}
Map.prototype.build = function(x, y) {
    if (this.map[x][y] == null || this.map[x][y] == undefined) {
        this.map[x][y] = "#ccc";
        this.mapdom[y][x].style['background-color'] = '#ccc';
        return true;
    }
    return false;
}
Map.prototype.brush = function(x, y, color) {
    if (this.map[x][y] != null && this.map[x][y] != undefined) {
        this.map[x][y] = color;
        this.mapdom[y][x].style['background-color'] = color;
        return true;
    }
    return false;
}
Map.prototype.clear = function() {
    for (var i = 0; i < 10; i++) {
        this.map[i] = [];
        for (var j = 0; j < 10; j++) {
            this.mapdom[j][i].style['background-color'] = '#fff';
        }
    }
}
Map.prototype.findPath = function(beginx, beginy, tox, toy) {
    function check(x, y) {
        if (x < 0 || x > 9) return false;
        if (y < 0 || y > 9) return false;
        return true;
    }
    if (!check(beginx, beginy)) return null;
    if (!check(tox, toy)) return null;

    var visited = [];
    for (var i = 0; i < 10; i++) {
        visited[i] = [];
        for (var j = 0; j < 10; j++) {
            if (this.map[i][j] == null || this.map[i][j] == undefined) {
                visited[i][j] = false;
            } else {
                visited[i][j] = true;
            }
        }
    }

    var dire = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];

    var path = [
        [beginx, beginy, null]
    ];
    var route = [];
    var pos = 0;
    visited[beginx][beginy] = true;
    while (pos < path.length) {
        var current = path[pos];
        if (current[0] == tox && current[1] == toy) {
            route.push([tox, toy]);
            var cut = current[2];
            while (cut != null) {
                route.push([path[cut][0], path[cut][1]]);
                cut = path[cut][2];
            }
            return route.reverse();
        }
        var newx;
        var newy;

        for (var i = 0; i < dire.length; i++) {
            newx = current[0] + dire[i][0];
            newy = current[1] + dire[i][1];
            if (check(newx, newy) && !visited[newx][newy]) {
                visited[newx][newy] = true;
                path.push([newx, newy, pos]);
            }
        }
        pos++;
    }
}

function Role(dom, map) {
    this.map = map;

    this.direction = direction.UP;
    this.x = 0;
    this.y = 0;

    this.dom = dom;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instGO = function(step) {
    if (step == undefined) step = 1;
    switch ((this.direction % 360 + 360) % 360) {
        case direction.UP:
            this.y -= step;
            if (this.y < 0) this.y = 0;
            break;
        case direction.DOWN:
            this.y += step;
            if (this.y > 9) this.y = 9;
            break;
        case direction.LEFT:
            this.x -= step;
            if (this.x < 0) this.x = 0;
            break;
        case direction.RIGHT:
            this.x += step;
            if (this.x > 9) this.x = 9;
            break;
        default:
            console.log("unknown direction: " + this.direction);
    }
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTUNLEF = function() {
    this.direction -= 90;
    this.dom.transform(this.direction);
}
Role.prototype.instTUNRIG = function() {
    this.direction += 90;
    this.dom.transform(this.direction);
}
Role.prototype.instTUNBAC = function() {
    this.direction += 180;
    this.dom.transform(this.direction);
}
Role.prototype.instTRALEF = function(step) {
    if (step == undefined) step = 1;
    this.x -= step;
    if (this.x < 0) this.x = 0;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTRATOP = function(step) {
    if (step == undefined) step = 1;
    this.y -= step;
    if (this.y < 0) this.y = 0;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTRARIG = function(step) {
    if (step == undefined) step = 1;
    this.x += step;
    if (this.x > 9) this.x = 9;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTRABOT = function(step) {
    if (step == undefined) step = 1;
    this.y += step;
    if (this.y > 9) this.y = 9;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instMOVLEF = function(step) {
    if (step == undefined) step = 1;
    this.direction = direction.LEFT;
    this.x -= step;
    if (this.x < 0) this.x = 0;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instMOVTOP = function(step) {
    if (step == undefined) step = 1;
    this.direction = direction.UP;
    this.y -= step;
    if (this.y < 0) this.y = 0;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instMOVRIG = function(step) {
    if (step == undefined) step = 1;
    this.direction = direction.RIGHT;
    this.x += step;
    if (this.x > 9) this.x = 9;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instMOVBOT = function(step) {
    if (step == undefined) step = 1;
    this.direction = direction.DOWN;
    this.y += step;
    if (this.y > 9) this.y = 9;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instBUILD = function() {
    var buildx = this.x;
    var buildy = this.y;
    switch ((this.direction % 360 + 360) % 360) {
        case direction.UP:
            buildy -= 1;
            break;
        case direction.DOWN:
            buildy += 1;
            break;
        case direction.LEFT:
            buildx -= 1;
            break;
        case direction.RIGHT:
            buildx += 1;
            break;
        default:
            console.log("unknown direction: " + this.direction);
    }
    if (buildx < 0 || buildx > 9) {
        console.log("can't bulid.");
        return;
    }
    if (buildy < 0 || buildy > 9) {
        console.log("can't build.");
        return;
    }
    if (!this.map.build(buildx, buildy)) {
        console.log("already have build.");
    }
}
Role.prototype.instBRU = function(color) {
    var buildx = this.x;
    var buildy = this.y;
    switch ((this.direction % 360 + 360) % 360) {
        case direction.UP:
            buildy -= 1;
            break;
        case direction.DOWN:
            buildy += 1;
            break;
        case direction.LEFT:
            buildx -= 1;
            break;
        case direction.RIGHT:
            buildx += 1;
            break;
        default:
            console.log("unknown direction: " + this.direction);
    }
    if (buildx < 0 || buildx > 9) {
        console.log("can't brush.");
        return;
    }
    if (buildy < 0 || buildy > 9) {
        console.log("can't brush.");
        return;
    }
    if (!this.map.brush(buildx, buildy, color)) {
        console.log("nothing to brush.");
    }
}
Role.prototype.instMOVETO = function(x, y) {
    var that = this;
    var path = this.map.findPath(this.x, this.y, x - 1, y - 1);
    if (path == null) {
        console.log("can't find path from (" + (this.x + 1) + "," + (this.y +
            1) + ") to (" + x + "," + y + ")");
        return;
    }
    this.x = x - 1;
    this.y = y - 1;

    var pos = 0;
    var timeout = Math.floor(1000 / path.length);

    function walk() {
        that.dom.moveTo(path[pos][0], path[pos][1]);
        pos++;
        if (pos < path.length) {
            setTimeout(walk, timeout);
        }
    }
    walk();
}
Role.prototype.reset = function() {
    this.x = 0;
    this.y = 0;
    this.direction = direction.UP;
    this.map.clear();
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.compileAndRun = function(inst) {
    if (inst == '') return true; // 空指令，算作执行成功
    var args = inst.trim().split(' ');
    switch (args[0]) {
        case 'MOVE': // 关键字为MOVE
            if (args.length != 3) return false;
            var target = args[2].split(',');
            target[0] = parseInt(target[0]);
            target[1] = parseInt(target[1]);
            if (!isNaN(target[0]) && !isNaN(target[1])) {
                this.instMOVETO(target[0], target[1]);
                return true;
            }
            return false;
        case 'BRU': // 关键字为BRU
            if (args.length != 2) return false;
            this.instBRU(args[1]);
            return true;
        case 'BUILD': // 关键字为BUILD
            this.instBUILD();
            return true;
        case 'GO': // 关键字为GO
            if (args[1] == undefined) this.instGO(); //只有一个参数，向前一步
            else {
                var step = parseInt(args[1]); // 将参数转换成整数
                if (isNaN(step)) return false;
                this.instGO(step); // 执行
            }
            return true;
        case 'TUN':
            if (args.length != 2) return false; // 参数必须为2个
            if (args[1] == 'LEF') {
                this.instTUNLEF();
            } else if (args[1] == 'RIG') {
                this.instTUNRIG();
            } else if (args[1] == 'BAC') {
                this.instTUNBAC();
            } else {
                // console.log("unknown instruction: " + inst);
                return false;
            }
            return true;
        case 'TRA':
            var step;
            if (args.length == 2) step = 1; // 两个参数将步长设置为1
            else {
                step = parseInt(args[2]);
                if (isNaN(step)) return false; // 步长错误
            }
            if (args[1] == 'LEF') {
                this.instTRALEF(step);
            } else if (args[1] == 'TOP') {
                this.instTRATOP(step);
            } else if (args[1] == 'RIG') {
                this.instTRARIG(step);
            } else if (args[1] == 'BOT') {
                this.instTRABOT(step);
            } else {
                // console.log("unknown instruction: " + inst);
                return false;
            }
            return true;
        case 'MOV':
            var step;
            if (args.length == 2) step = 1; // 两个参数将步长设置为1
            else {
                step = parseInt(args[2]);
                if (isNaN(step)) return false; // 步长错误
            }
            if (args[1] == 'LEF') {
                this.instMOVLEF(step);
            } else if (args[1] == 'TOP') {
                this.instMOVTOP(step);
            } else if (args[1] == 'RIG') {
                this.instMOVRIG(step);
            } else if (args[1] == 'BOT') {
                this.instMOVBOT(step);
            } else {
                // console.log("unknown instruction: " + inst);
                return false;
            }
            return true;
        default:
            // console.log("unknown instruction: " + inst);
            return false;
    }
    return false;
}

window.onload = function() {
    var codetextarea = new CodeTextArea(document.getElementById('instbat')); // 初始化代码框

    var roledom = document.getElementById("man");
    roledom.moveTo = function(x, y) {
        this.style.top = (y * 50) + 'px';
        this.style.left = (x * 50) + 'px';
    }
    roledom.transform = function(deg) {
        this.style.transform = "rotateZ(" + deg + "deg)";
    }

    var map = new Map(document.getElementsByClassName('ground')[0]); //地图
    var role = new Role(roledom, map);

    document.getElementById("btn-go").addEventListener("click", function() {
        var inst = document.getElementById("text-instruction").value;
        role.compileAndRun(inst);
    });

    var isrunbat = false; // 当前是否正在执行脚本
    document.getElementById("btn-gobat").addEventListener("click", function() {
        if (isrunbat) return; // 有正在执行的脚本，退出
        isrunbat = true;
        var insts = document.getElementById("instbat").value.split(
            '\n');
        codetextarea.clear();

        var i = 0; // 当前正在执行的指令

        function run() {
            var result = role.compileAndRun(insts[i]);
            codetextarea.setCurrentLine(i + 1);
            if (!result) {
                codetextarea.addErrorLine(i + 1);
            }
            i++;
            if (i < insts.length) { // 指令是否执行完毕
                setTimeout(run, 1000); // 每隔1000ms执行一条指令
            } else {
                isrunbat = false;
                codetextarea.setCurrentLine(0);
            }
        }
        run();
    });
    document.getElementById("btn-reset").addEventListener("click",
        function() {
            role.reset();
        });
    document.getElementById("btn-randombuild").addEventListener("click",
        function() {
            for (var i = 0; i < 10; i++) {
                var x = random(0, 10);
                var y = random(0, 10);
                map.build(x, y);
            }
        });

    /* 测试按钮 */
    document.getElementById("btn-t1").addEventListener("click", function() {
        role.instGO();
    });
    document.getElementById("btn-t2").addEventListener("click", function() {
        role.instTUNLEF();
    });
    document.getElementById("btn-t3").addEventListener("click", function() {
        role.instTUNRIG();
    });
    document.getElementById("btn-t4").addEventListener("click", function() {
        role.instTUNBAC();
    });
    document.getElementById("btn-t5").addEventListener("click", function() {
        role.instTRALEF();
    });
    document.getElementById("btn-t6").addEventListener("click", function() {
        role.instTRATOP();
    });
    document.getElementById("btn-t7").addEventListener("click", function() {
        role.instTRARIG();
    });
    document.getElementById("btn-t8").addEventListener("click", function() {
        role.instTRABOT();
    });
    document.getElementById("btn-t9").addEventListener("click", function() {
        role.instMOVLEF();
    });
    document.getElementById("btn-t10").addEventListener("click", function() {
        role.instMOVTOP();
    });
    document.getElementById("btn-t11").addEventListener("click", function() {
        role.instMOVRIG();
    });
    document.getElementById("btn-t12").addEventListener("click", function() {
        role.instMOVBOT();
    });
    document.getElementById("btn-t13").addEventListener("click", function() {
        role.instBUILD();
    });
}
