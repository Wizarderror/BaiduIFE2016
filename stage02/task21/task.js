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

function makeDomNode(value) {
    var ele = document.createElement("div");
    ele.className = "item";
    ele.title = value;
    ele.innerHTML = html2Escape(value);
    return ele;
}
// 检查是否有相同的dom
function check(dom, value) {
    var ret = false;
    dom.childNodes.forEach(function(item) {
        if (getNodeValue(item) == value) {
            ret = true;
        }
    });
    return ret;
}
// 获取node节点的值
function getNodeValue(node) {
    return node.title;
}
// 向dom结尾添加value
function append(dom, value) {
    var value = value.trim();
    if (value.length > 0 && !check(dom, value)) {
        var element = makeDomNode(value);
        dom.appendChild(element);
    }
}
// 按照分隔符分割字符串
function split(str) {
    return str.split(/[\n, \t，　]/);
}
// 从dom中删除ele节点
function remove(dom, ele) {
    dom.removeChild(ele);
}
// 从dom中删除第一个子节点
function removeFirst(dom) {
    dom.removeChild(dom.firstChild);
}

var splitkeycode = [188 /*逗号*/ , 13 /*回车*/ , 32 /*空格*/ ];
window.onload = function() {
    var taglist = document.getElementById("tags");
    var taginput = document.getElementById("text-input-tags");
    var hobbyinput = document.getElementById("text-input-hobby");
    var hobbyadd = document.getElementById("btn-add-hobby");
    var hobbylist = document.getElementById("hobbies");
    taginput.addEventListener("keydown",
        function(e) {
            if (splitkeycode.indexOf(e.keyCode) != -1) {
                append(taglist, taginput.value.trim());
                taginput.value = "";
                e.preventDefault(); // 阻止默认按键行为
                // 超过10个删除第一个
                while (taglist.childNodes.length > 10) {
                    removeFirst(taglist);
                }
            }
        });
    taglist.addEventListener("click", function(e) {
        if (e.target.className == 'item') {
            remove(taglist, e.target);
        }
    });
    hobbyadd.addEventListener("click", function() {
        split(html2Escape(hobbyinput.value)).forEach(function(item) {
            var value = item.trim();
            if (value.length > 0 && !check(hobbylist, value)) {
                append(hobbylist, value);
                while (hobbylist.childNodes.length > 10) {
                    removeFirst(hobbylist);
                }
            }
        });
    });
}
