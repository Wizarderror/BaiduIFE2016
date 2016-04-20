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
Role.prototype.instGO = function() {
    switch ((this.direction % 360 + 360) % 360) {
        case direction.UP:
            this.y -= 1;
            if (this.y < 0) this.y = 0;
            break;
        case direction.DOWN:
            this.y += 1;
            if (this.y > 9) this.y = 9;
            break;
        case direction.LEFT:
            this.x -= 1;
            if (this.x < 0) this.x = 0;
            break;
        case direction.RIGHT:
            this.x += 1;
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
Role.prototype.instTRALEF = function() {
    this.x -= 1;
    if (this.x < 0) this.x = 0;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTRATOP = function() {
    this.y -= 1;
    if (this.y < 0) this.y = 0;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTRARIG = function() {
    this.x += 1;
    if (this.x > 9) this.x = 9;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instTRABOT = function() {
    this.y += 1;
    if (this.y > 9) this.y = 9;
    this.dom.moveTo(this.x, this.y);
}
Role.prototype.instMOVLEF = function() {
    this.direction = direction.LEFT;
    this.x -= 1;
    if (this.x < 0) this.x = 0;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instMOVTOP = function() {
    this.direction = direction.UP;
    this.y -= 1;
    if (this.y < 0) this.y = 0;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instMOVRIG = function() {
    this.direction = direction.RIGHT;
    this.x += 1;
    if (this.x > 9) this.x = 9;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}
Role.prototype.instMOVBOT = function() {
    this.direction = direction.DOWN;
    this.y += 1;
    if (this.y > 9) this.y = 9;
    this.dom.moveTo(this.x, this.y);
    this.dom.transform(this.direction);
}

window.onload = function() {
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
