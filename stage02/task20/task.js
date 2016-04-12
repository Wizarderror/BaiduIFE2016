// HTML转义
function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[c];
    });
}
// 转义还原HTML
function escape2Html(str) {
    var arrEntities = {
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'amp': '&',
        'quot': '"'
    };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
        return arrEntities[t];
    });
}

// 创建一个包含value的div节点
function makeDomNode(value) {
    var ele = document.createElement("div");
    ele.className = "item";
    ele.title = escape2Html(value);
    ele.innerHTML = value;
    return ele;
}
// 按照分隔符分割字符串
function split(str) {
    return str.split(/[\n, \t]/);
}
// 获取node节点的值
function getNodeValue(node) {
    return node.title;
}
// 在dom的左侧插入value节点
function insertLeft(dom, value) {
    split(html2Escape(value)).forEach(function(item) {
        var value = item.trim();
        if (value.length > 0) {
            var element = makeDomNode(value);
            dom.insertBefore(element, dom.firstChild);
        }
    });
}
// 在dom的右侧插入value节点
function insertRight(dom, value) {
    split(html2Escape(value)).forEach(function(item) {
        var value = item.trim();
        if (value.length > 0) {
            var element = makeDomNode(value);
            dom.appendChild(element);
        }
    });
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

window.onload = function() {
    var seq = document.getElementById("tags");
    seq.innerHTML = ""; // 清空队列

    var input = document.getElementById("text-input");

    // 对应设置事件监听
    document.getElementById("btn-left-in").addEventListener("click",
        function() {
            insertLeft(seq, input.value);
        });
    document.getElementById("btn-right-in").addEventListener("click",
        function() {
            insertRight(seq, input.value);
        });
    document.getElementById("btn-left-out").addEventListener("click",
        function() {
            // 不含子节点时不进行删除操作
            if (seq.childNodes.length == 0) {
                return;
            }
            var value = removeLeft(seq);
            alert(value);
        });
    document.getElementById("btn-right-out").addEventListener("click",
        function() {
            if (seq.childNodes.length == 0) {
                return;
            }
            var value = removeRight(seq);
            alert(value);
        });
    seq.addEventListener("click", function(e) {
        var target = e.target;
        // 判断点击的是否为item节点
        if (target.className == "item") {
            var value = removeElement(seq, target);
            alert(value);
        }
    });
    document.getElementById("btn-search").addEventListener("click",
        function() {
            var searchword = document.getElementById("text-search").value
                .trim();
            if (searchword.length > 0) {
                seq.childNodes.forEach(function(item) {
                    item.innerHTML = getNodeValue(
                        item).split(searchword).map(
                        html2Escape).join(
                        "<span>" + html2Escape(searchword) +
                        "</span>");
                });
            }
        });
}
