// ----------------------tree-----------------------
// 节点类
function Node(data, dom) {
    this.data = data; // 节点数据
    this.parent = null; // 节点的父节点
    this.leftChild = null; // 节点的左儿子
    this.rightChild = null; // 节点的右儿子
    this.dom = dom; // 节点对应的dom
}
Node.prototype.addChild = function(data) {
    var newdom = document.createElement('div');
    var node = new Node(data, newdom);
    node.parent = this;
    if (this.leftChild == null) {
        this.leftChild = node;
        this.dom.appendChild(newdom);
    } else if (this.rightChild == null) {
        this.rightChild = node;
        this.dom.appendChild(newdom);
    }
}

// 树类
function Tree(data, dom) {
    var newdom = document.createElement('div');
    var node = new Node(data, newdom);
    dom.appendChild(newdom);
    this._root = node;
}
Tree.prototype.getRoot = function() {
    return this._root;
}
Tree.prototype.iterator = function(type) {
    if (type == 'dlr') {
        return new DLRIteartor(this);
    } else if (type == 'ldr') {
        return new LDRIterator(this);
    } else if (type == 'lrd') {
        return new LRDIterator(this);
    }
    return new DLRIteartor(this);
}

// 迭代器类
// 前序遍历
function DLRIteartor(tree) {
    this._tree = tree;
    this.current = tree.getRoot();
    this.stack = [];
    this.cursor = 0;
}
DLRIteartor.prototype.next = function() {
    if (this.cursor == 0) {
        this.current = this._tree.getRoot();
        this.cursor++;
    } else {
        if (this.current.leftChild != null) {
            this.stack.push(0);
            this.current = this.current.leftChild;
            this.cursor++;
        } else if (this.current.rightChild != null) {
            this.stack.push(1);
            this.current = this.current.rightChild;
            this.cursor++;
        } else {
            while (this.stack.length > 0) {
                var state = this.stack.pop();
                this.current = this.current.parent;
                if (state == 0 && this.current.rightChild != null) {
                    this.stack.push(1);
                    this.current = this.current.rightChild;
                    this.cursor++;
                    break;
                }
            }
            if (this.stack.length == 0) this.current = null;
        }
    }
    return this.current;
}
DLRIteartor.prototype.peek = function() {
    return this.current;
}

// 中序遍历
function LDRIterator(tree) {
    this._tree = tree;
    this.current = tree.getRoot();
    this.stack = [];
    this.cursor = 0;

    while (true) {
        if (this.current.leftChild != null) {
            this.current = this.current.leftChild;
            this.stack.push(0);
        } else {
            this.stack.push(1);
            break;
        }
    }
}
LDRIterator.prototype.peek = function() {
    return this.current;
}
LDRIterator.prototype.next = function() {
    if (this.cursor == 0) {
        this.cursor++;
        return this.current;
    }
    var foundnext = false;
    while (!foundnext) {
        var state = this.stack.pop();
        if (state != 1)
            this.current = this.current.parent;
        if (state == 0) {
            this.stack.push(1);
            foundnext = true;
            this.cursor++;
        } else if (state == 1) {
            if (this.current.rightChild != null) {
                this.stack.push(2);
                this.current = this.current.rightChild;
                while (true) {
                    if (this.current.leftChild != null) {
                        this.current = this.current.leftChild;
                        this.stack.push(0);
                    } else {
                        break;
                    }
                }
                foundnext = true;
                this.cursor++;
            }
        } else {
            if (this.stack.length == 0) {
                break;
            }
        }
    }
    if (foundnext) return this.current;
    return null;
}

// 后序遍历
function LRDIterator(tree) {
    this._tree = tree;
    this.current = tree.getRoot();
    this.stack = [];
    this.cursor = 0;

    while (true) {
        if (this.current.leftChild != null) {
            this.current = this.current.leftChild;
            this.stack.push(0);
        } else if (this.current.rightChild != null) {
            this.current = this.current.rightChild;
            this.stack.push(1);
        } else {
            this.stack.push(2);
            break;
        }
    }
}
LRDIterator.prototype.peek = function() {
    return this.current;
}
LRDIterator.prototype.next = function() {
    if (this.cursor == 0) {
        this.cursor++;
        return this.current;
    }
    var foundnext = false;
    while (!foundnext) {
        var state = this.stack.pop();
        if (state != 2) {
            this.current = this.current.parent;
        }
        if (state == 0) {
            if (this.current.rightChild != null) {
                this.current = this.current.rightChild;
                this.stack.push(1);
                while (true) {
                    if (this.current.leftChild != null) {
                        this.current = this.current.leftChild;
                        this.stack.push(0);
                    } else if (this.current.rightChild != null) {
                        this.current = this.current.rightChild;
                        this.stack.push(1);
                    } else {
                        this.stack.push(2);
                        break;
                    }
                }
                this.cursor++;
                foundnext = true;
            } else {
                this.stack.push(2);
                this.cursor++;
                foundnext = true;
            }
        } else if (state == 1) {
            this.stack.push(2);
            this.cursor++;
            foundnext = true;
        } else {
            if (this.stack.length == 0) {
                break;
            }
        }
    }
    if (foundnext) return this.current;
    return null;
}

// -- 建树 --
var x = 1;

function buildTree(rootnode, depth) {
    if (depth <= 0) return;
    rootnode.addChild(x);
    x++;
    rootnode.addChild(x);
    x++;
    buildTree(rootnode.leftChild, depth - 1);
    buildTree(rootnode.rightChild, depth - 1);
}
// -- 遍历动画 --
var iter;
var timer;

function walkthrough() {
    var node = iter.peek();
    node.dom.className = "";
    node = iter.next();
    if (node != null) {
        console.log(node.data);
        node.dom.className = "active";
        timer = setTimeout(walkthrough, 500);
    } else {
        console.log("tree size: " + iter.cursor);
    }
}
// ----------------init--------------------------
window.onload = function() {
    var tree = new Tree("0", document.getElementById('tree'));
    buildTree(tree.getRoot(), 3);
    document.getElementById("btn-dlr").addEventListener("click", function() {
        clearTimeout(timer);
        iter = tree.iterator("dlr");
        walkthrough();
    });
    document.getElementById("btn-ldr").addEventListener("click", function() {
        clearTimeout(timer);
        iter = tree.iterator("ldr");
        walkthrough();
    });
    document.getElementById("btn-lrd").addEventListener("click", function() {
        clearTimeout(timer);
        iter = tree.iterator("lrd");
        walkthrough();
    });
}
