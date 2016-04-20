var direction = {
    UP: 0,
    DOWN: 180,
    LEFT: 270,
    RIGHT: 90
}

function Role(dom) {
    this.direction = direction.UP;
    this.x = 4;
    this.y = 7;

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
Role.prototype.compileAndRun = function(inst) {
    if (inst == '') return true; // 空指令，算作执行成功
    var args = inst.trim().split(' ');
    switch (args[0]) {
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
    var role = new Role(roledom);

    document.getElementById("btn-go").addEventListener("click", function() {
        var inst = document.getElementById("text-instruction").value;
        if (inst.trim() == 'GO') {
            role.instGO();
        } else if (inst.trim() == 'TUN LEF') {
            role.instTUNLEF();
        } else if (inst.trim() == 'TUN RIG') {
            role.instTUNRIG();
        } else if (inst.trim() == 'TUN BAC') {
            role.instTUNBAC();
        } else if (inst.trim() == 'TRA LEF') {
            role.instTRALEF();
        } else if (inst.trim() == 'TRA TOP') {
            role.instTRATOP();
        } else if (inst.trim() == 'TRA RIG') {
            role.instTRARIG();
        } else if (inst.trim() == 'TRA BOT') {
            role.instTRABOT();
        } else if (inst.trim() == 'MOV LEF') {
            role.instMOVLEF();
        } else if (inst.trim() == 'MOV TOP') {
            role.instMOVTOP();
        } else if (inst.trim() == 'MOV RIG') {
            role.instMOVRIG();
        } else if (inst.trim() == 'MOV BOT') {
            role.instMOVBOT();
        }
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
    document.getElementById("btn-refresh").addEventListener("click",
        function() {
            location.reload();
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
}
