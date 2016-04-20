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
    switch (this.direction) {
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
    this.direction = (this.direction % 360 + 360) % 360;
    this.dom.transform(this.direction);
}
Role.prototype.instTUNRIG = function() {
    this.direction += 90;
    this.direction = (this.direction % 360 + 360) % 360;
    this.dom.transform(this.direction);
}
Role.prototype.instTUNBAC = function() {
    this.direction += 180;
    this.direction = (this.direction % 360 + 360) % 360;
    this.dom.transform(this.direction);
}

window.onload = function() {
    var roledom = document.getElementById("man");
    roledom.moveTo = function(x, y) {
        this.style.top = (y * 50) + 'px';
        this.style.left = (x * 50) + 'px';
    }
    roledom.transform = function(deg) {
        this.style.transform = "rotate(" + deg + "deg)";
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
}
