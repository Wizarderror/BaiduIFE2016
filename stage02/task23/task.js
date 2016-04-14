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
    return node;
}

function Tree(data, dom) {
    var newdom = document.createElement('div');
    var node = new Node(data, newdom);
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
    lastanimdom.className = "";
    if (animdata.length > 0) {
        lastanimdom = animdata.shift();
        lastanimdom.className = "active";
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

function clearClass(tree) {
    tree.dfsNode().forEach(function(item) {
        item.className = "";
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

window.onload = function() {
    var tree = new Tree("tree", document.getElementById('tree'));
    buildTree(data, tree.getRoot());

    document.getElementById("btn-dfs").addEventListener("click", function() {
        clearClass(tree);
        doAnimation(tree.dfsNode(), document.getElementById(
            "text-input").value.trim());
    });
    document.getElementById("btn-bfs").addEventListener("click", function() {
        clearClass(tree);
        doAnimation(tree.bfsNode(), document.getElementById(
            "text-input").value.trim());
    });
}
