// --- helper function -----
function addClass(dom, classname) {
    if (dom == null || dom == undefined) return;
    var list = dom.className.split(" ");
    if (list.indexOf(classname) == -1) {
        list.push(classname);
    }
    dom.className = list.join(" ");
}

function removeClass(dom, classname) {
    if (dom == null || dom == undefined) return;
    var list = dom.className.split(" ");
    var pos = list.indexOf(classname);
    if (pos != -1) {
        list.splice(pos, 1);
    }
    dom.className = list.join(" ");
}
Array.prototype.remove = function(ele) {
    var pos = this.indexOf(ele);
    if (pos != -1) {
        this.splice(pos, 1);
    }
    return pos;
}

// ----------------------tree-----------------------
// 节点类
function Node(data, dom) {
    this.data = data; // 节点数据
    this.parent = null; // 节点的父节点
    this.childs = []; // 节点的孩子节点
    this.dom = dom; // 节点对应的dom
}
Node.prototype.addChild = function(data) {
    var newdom = document.createElement('div');
    newdom.appendChild(document.createTextNode(data));
    this.dom.appendChild(newdom);
    var node = new Node(data, newdom);
    node.parent = this;
    this.childs.push(node);
    newdom.treenode = node;
    return node;
}

function Tree(id, dom) {
    var newdom = document.createElement('span');
    newdom.id = id;
    var node = new Node("", newdom);
    dom.appendChild(newdom);
    this._root = node;
}
Tree.prototype.getRoot = function() {
    return this._root;
}
Tree.prototype.dfsNode = function() {
    var list = [];

    function dfs(node) {
        list.push(node.dom);
        for (var i = 0; i < node.childs.length; i++) {
            dfs(node.childs[i]);
        }
    }
    dfs(this._root.childs[0]);
    return list;
}
Tree.prototype.bfsNode = function() {
    var list = [];

    function bfs(node) {
        var nodelist = [];
        nodelist.push(node);
        while (nodelist.length > 0) {
            var now = nodelist.shift();
            list.push(now.dom);
            for (var i = 0; i < now.childs.length; i++) {
                nodelist.push(now.childs[i]);
            }
        }
    }

    bfs(this._root.childs[0]);
    return list;
}

// animation
var animdata;
var lastanimdom;
var findvalue;

function anim() {
    removeClass(lastanimdom, "active");
    if (animdata.length > 0) {
        lastanimdom = animdata.shift();
        addClass(lastanimdom, "active");
        if (findvalue == lastanimdom.childNodes[0].data) {
            alert("found it");
            return;
        }
        setTimeout(anim, 500);
    } else {
        alert("not found");
    }
}

function doAnimation(data, value) {
    animdata = data;
    findvalue = value;
    lastanimdom = data[0];
    anim();
}

function clearClass(tree, classname) {
    tree.dfsNode().forEach(function(item) {
        removeClass(item, classname);
    });
}

// -------- build tree -------
var data = ['Super', ['Car', ['Apple', ['Pear'],
            ['Pig'],
            ['Cola'],
            ['Soccor']
        ],
        ['Phone'],
        ['', ['Book'],
            ['School']
        ]
    ],
    ['Note', ['Human', ['Code'],
            ['Operate'],
            ['Man']
        ],
        ['Program', ['Element', ['Cat']],
            ['Glass']
        ]
    ],
    ['fish']
];

function buildTree(data, node) {
    var father = node.addChild(data[0]);
    for (var i = 1; i < data.length; i++) {
        buildTree(data[i], father);
    }
}
//------------------add remove------------
var clickeddom = null;

// -- init --

window.onload = function() {
    var tree = new Tree("tree", document.getElementById('tree'));
    buildTree(data, tree.getRoot());

    document.getElementById("btn-dfs").addEventListener("click", function() {
        clearClass(tree, 'active');
        doAnimation(tree.dfsNode(), document.getElementById(
            "text-input").value.trim());
    });
    document.getElementById("btn-bfs").addEventListener("click", function() {
        clearClass(tree, 'active');
        doAnimation(tree.bfsNode(), document.getElementById(
            "text-input").value.trim());
    });

    document.getElementById("tree").childNodes[0].addEventListener("click",
        function(e) {
            if (e.target == tree.getRoot().dom) {
                return;
            }
            removeClass(clickeddom, "selected");
            clickeddom = e.target;
            addClass(clickeddom, "selected");
        });

    document.getElementById("btn-add").addEventListener("click", function() {
        if (clickeddom == null || clickeddom == undefined) {
            alert("please select something to add to");
            return;
        }
        clickeddom.treenode.addChild(document.getElementById(
            "text-input").value.trim());
    });
    document.getElementById("btn-delete").addEventListener("click",
        function() {
            if (clickeddom == null || clickeddom == undefined) {
                alert("please select something to delete");
                return;
            }
            if (clickeddom == tree.getRoot().dom.childNodes[0]) {
                alert("can't remove root");
                return;
            }
            clickeddom.parentNode.removeChild(clickeddom);
            clickeddom.treenode.parent.childs.remove(clickeddom.treenode);
            clickeddom = null;
        });
}
