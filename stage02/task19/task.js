// 创建一个包含value的div节点
function makeDomNode(value) {
    var ele = document.createElement("div");
    ele.className = "item";
    ele.title = value;
    ele.style.height = value + "px";
    return ele;
}
// 获取node节点的值
function getNodeValue(node) {
    return node.innerHTML;
}
// 在dom的左侧插入value节点
function insertLeft(dom, value) {
    var element = makeDomNode(value);
    dom.insertBefore(element, dom.firstChild);
}
// 在dom的右侧插入value节点
function insertRight(dom, value) {
    var element = makeDomNode(value);
    dom.appendChild(element);
}
// 从dom的左侧删除value节点
function removeLeft(dom) {
    var value = getNodeValue(dom.firstChild);
    dom.removeChild(dom.firstChild);
    return value;
}
// 从dom的右侧删除value节点
function removeRight(dom) {
    var value = getNodeValue(dom.lastChild);
    dom.removeChild(dom.lastChild);
    return value;
}
// 从dom中删除ele节点
function removeElement(dom, ele) {
    var value = getNodeValue(ele);
    dom.removeChild(ele);
    return value;
}
// 交换两个ele节点
function swap(dom, ele1, ele2) {
    var a = dom.childNodes[ele1];
    var b = dom.childNodes[ele2];
    dom.insertBefore(b, a);
}
// 比较两个ele的高度
function compare(dom, ele1, ele2) {
    var a = dom.childNodes[ele1];
    var b = dom.childNodes[ele2];
    if (a.offsetHeight > b.offsetHeight) return 1;
    else if (a.offsetHeight < b.offsetHeight) return -1;
    return 0;
}
// 冒泡排序，delay为动画延时
function bubblesort(seq, delay) {
    var i = 0;
    var j = 0;
    var finish = false;
    var length = seq.childNodes.length;

    function next() {
        if (j >= (length - i - 1)) {
            i++;
            j = 0;
        }
        if (i >= length - 1) {
            finish = true;
            return;
        }
        if (compare(seq, j, j + 1) > 0) {
            swap(seq, j, j + 1);
        }
        j++;
        setTimeout(next, delay);
    }
    setTimeout(next, delay);
}

// 阻塞线程式休眠，弃用
function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
}
// 随机数，从a到b
function random(a, b) {
    return Math.ceil(Math.random() * (b - a) + a);
}

window.onload = function() {
    var seq = document.getElementById("seq");
    seq.innerHTML = ""; // 清空队列

    var input = document.getElementById("text-num");

    // 对应设置事件监听
    document.getElementById("btn-left-in").addEventListener("click",
        function() {
            // 判断是否为空或不为数字
            if (input.value.trim() == '' || isNaN(input.value)) {
                return;
            }
            // 判断数值范围是不是在10到100之间
            var value = parseInt(input.value);
            if (value < 10 || value > 100) {
                return;
            }
            // 超出60个数字提示
            if (seq.childNodes.length >= 60) {
                alert("最多可以插入60个");
                return;
            }
            insertLeft(seq, value);
        });
    document.getElementById("btn-right-in").addEventListener("click",
        function() {
            if (input.value.trim() == '' || isNaN(input.value)) {
                return;
            }
            var value = parseInt(input.value);
            if (value < 10 || value > 100) {
                return;
            }
            if (seq.childNodes.length >= 60) {
                alert("最多可以插入60个");
                return;
            }
            insertRight(seq, value);
        });
    document.getElementById("btn-left-out").addEventListener("click",
        function() {
            // 不含子节点时不进行删除操作
            if (seq.childNodes.length == 0) {
                return;
            }
            var value = removeLeft(seq);
        });
    document.getElementById("btn-right-out").addEventListener("click",
        function() {
            if (seq.childNodes.length == 0) {
                return;
            }
            var value = removeRight(seq);
        });
    document.getElementById("btn-clear").addEventListener("click", function() {
        // 清空
        seq.innerHTML = "";
    });
    document.getElementById("btn-random-add").addEventListener("click",
        function() {
            //随机生成10个数值插入
            for (var i = 0; i < 10; i++) {
                if (seq.childNodes.length >= 60) {
                    return;
                }
                var value = random(10, 100);
                insertRight(seq, value);
            }
        });
    document.getElementById("btn-bubble-sort").addEventListener("click",
        function() {
            // 开始冒泡排序，动画延时5 ms
            bubblesort(seq, 5);
        });

    seq.addEventListener("click", function(e) {
        var target = e.target;
        // 判断点击的是否为item节点
        if (target.className == "item") {
            var value = removeElement(seq, target);
        }
    });
}
