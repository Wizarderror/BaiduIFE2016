// --- helper function -----
function addClass(dom, classname) {
    if (dom == null || dom == undefined) return;
    if (dom.className == null || dom.className == undefined) return;
    var list = dom.className.split(" ");
    if (list.indexOf(classname) == -1) {
        list.push(classname);
    }
    dom.className = list.join(" ");
}

function removeClass(dom, classname) {
    if (dom == null || dom == undefined) return;
    if (dom.className == null || dom.className == undefined) return;
    var list = dom.className.split(" ");

    var pos = list.indexOf(classname);
    if (pos != -1) {
        list.splice(pos, 1);
    }
    dom.className = list.join(" ");
}

function containClass(dom, classname) {
    if (dom == null || dom == undefined) return false;
    if (dom.className == null || dom.className == undefined) return false;
    var list = dom.className.split(" ");
    if (list.indexOf(classname) == -1) {
        return false;
    }
    return true;
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
function Node(data, dom, contentdom) {
    this.data = data; // 节点数据
    this.parent = null; // 节点的父节点
    this.childs = []; // 节点的孩子节点
    this.dom = dom; // 节点对应的dom
    this.contentdom = contentdom; // 子节点被放置的dom
}
Node.prototype.addChild = function(data) {
    var newdom = document.createElement('div');
    var titledom = document.createElement('div');
    titledom.appendChild(document.createTextNode(data));
    titledom.className = "title";
    newdom.appendChild(titledom);
    var contentdom = document.createElement('div');
    contentdom.className = "content";
    newdom.appendChild(contentdom);

    this.contentdom.appendChild(newdom);
    var node = new Node(data, newdom, contentdom);
    node.parent = this;
    this.childs.push(node);
    if (this.childs.length > 0) {
        addClass(this.dom, "folder");
    }
    newdom.treenode = node;
    return node;
}
Node.prototype.removeChild = function(node) {
    this.childs.remove(node);
    this.contentdom.removeChild(node.dom);
}

function Tree(id, dom) {
    var newdom = document.createElement('span');
    newdom.id = id;
    var node = new Node("", newdom, newdom);
    dom.appendChild(newdom);
    this._root = node;
}
Tree.prototype.getRoot = function() {
    return this._root;
}
Tree.prototype.search = function(data) {
    var result = null;

    function dfs(node) {
        if (node.data == data) {
            result = node;
            return;
        }
        for (var i = 0; i < node.childs.length; i++) {
            dfs(node.childs[i]);
            if (result != null) return;
        }
    }
    dfs(this._root.childs[0]);
    return result;
}

function openNode(node) {
    var dom = node.dom;
    addClass(dom, "opened");
    while (dom.parentNode != null && dom.parentNode.parentNode != null) {
        dom = dom.parentNode.parentNode;
        addClass(dom, "opened");
    }
}

function clearFound(dom) {
    removeClass(dom, "found");
    for (var i = 0; i < dom.childNodes.length; i++) {
        clearFound(dom.childNodes[i]);
    }
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

    document.getElementById("btn-dfs").addEventListener("click",
        function() {
            var result = tree.search(document.getElementById(
                "text-input").value.trim());
            if (result != null) {
                clearFound(tree.getRoot().dom);
                openNode(result);
                addClass(result.dom.childNodes[0], "found");
            } else {
                alert("not found");
            }
        });

    document.getElementById("tree").childNodes[0].addEventListener(
        "click",
        function(e) {
            // 只有title能被选中
            if (!containClass(e.target, "title")) {
                return;
            }
            removeClass(clickeddom, "selected");
            clickeddom = e.target;
            addClass(clickeddom, "selected");
            if (!containClass(e.target.parentNode, "opened")) {
                addClass(e.target.parentNode, "opened");
            } else {
                removeClass(e.target.parentNode, "opened");
            }
        });

    document.getElementById("btn-add").addEventListener("click",
        function() {
            if (clickeddom == null || clickeddom == undefined) {
                alert("please select something to add to");
                return;
            }
            clickeddom.parentNode.treenode.addChild(document.getElementById(
                "text-input").value.trim());
            openNode(clickeddom.parentNode.treenode);
        });
    document.getElementById("btn-delete").addEventListener("click",
        function() {
            if (clickeddom == null || clickeddom == undefined) {
                alert("please select something to delete");
                return;
            }
            if (clickeddom.parentNode == tree.getRoot().dom.childNodes[
                    0]) {
                alert("can't remove root");
                return;
            }
            clickeddom.parentNode.treenode.parent.removeChild(
                clickeddom.parentNode.treenode);
            clickeddom = null;
        });
}
