// class处理函数
function addClass(dom, classname) { // 添加class
    if (dom == undefined || dom == null) return;
    var classes = dom.className.split(" ");
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].trim() == classname.trim()) {
            return;
        }
    }
    classes.push(classname);
    dom.className = classes.join(' ');
}

function removeClass(dom, classname) { // 移除class
    if (dom == undefined || dom == null) return;
    var classes = dom.className.split(" ");
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].trim() == classname.trim()) {
            classes.splice(i, 1);
            break;
        }
    }
    dom.className = classes.join(' ');
}

// 计算内容高度的辅助函数
var calculateContentHeight = function(ta, scanAmount) {
    var origHeight = ta.style.height,
        height = ta.offsetHeight,
        scrollHeight = ta.scrollHeight,
        overflow = ta.style.overflow;
    /// only bother if the ta is bigger than content
    if (height >= scrollHeight) {
        /// check that our browser supports changing dimension
        /// calculations mid-way through a function call...
        ta.style.height = (height + scanAmount) + 'px';
        /// because the scrollbar can cause calculation problems
        ta.style.overflow = 'hidden';
        /// by checking that scrollHeight has updated
        if (scrollHeight < ta.scrollHeight) {
            /// now try and scan the ta's height downwards
            /// until scrollHeight becomes larger than height
            while (ta.offsetHeight >= ta.scrollHeight) {
                ta.style.height = (height -= scanAmount) + 'px';
            }
            /// be more specific to get the exact height
            while (ta.offsetHeight < ta.scrollHeight) {
                ta.style.height = (height++) + 'px';
            }
            /// reset the ta back to it's original height
            ta.style.height = origHeight;
            /// put the overflow back
            ta.style.overflow = overflow;
            return height;
        }
    } else {
        return scrollHeight;
    }
}

function CodeTextArea(dom) {
    var that = this;
    this.textarea = dom;

    this.container = document.createElement('div'); // 创建一个div包含dom
    this.container.className = "codetextarea";

    this.linenumcontainer = document.createElement('div');
    this.linenumcontainer.className = "linenumbers"
    this.container.appendChild(this.linenumcontainer);

    dom.parentNode.insertBefore(this.container, dom); // 将container插入文档
    dom.className = "textarea";
    this.container.appendChild(dom); // 将dom包含进div中

    this.mouseclicked = false;

    this.currentLine = 0; //当前高亮的行数

    // 添加Listener
    this.textarea.addEventListener("input", function() { // 输入事件
        that.reDraw();
    }, false);

    // 鼠标拖动
    this.textarea.addEventListener("mousedown", function() {
        that.mouseclicked = true;
    }, false);
    this.textarea.addEventListener("mousemove", function() {
        if (that.mouseclicked)
            that.reDraw();
    }, false);
    this.textarea.addEventListener("mouseup", function() {
        that.mouseclicked = false;
    }, false);

    this.textarea.addEventListener("scroll", function() { // 滚动条滚动
        that.reDraw();
    }, false);
    this.reDraw();
}
CodeTextArea.prototype.reDraw = function() {
    var style = style = (window.getComputedStyle) ?
        window.getComputedStyle(this.textarea) : this.textarea.currentStyle;
    var taLineHeight = parseInt(style.lineHeight, 10);
    var taHeight = calculateContentHeight(this.textarea,
        taLineHeight);

    // 计算行数，补充和清理行号
    var numberOfLines = Math.floor(taHeight / taLineHeight);
    while (numberOfLines > this.linenumcontainer.childNodes.length) {
        var linenum = document.createElement('div');
        linenum.className = 'linenum';
        linenum.innerHTML = this.linenumcontainer.childNodes.length + 1;
        this.linenumcontainer.appendChild(linenum);
    }
    while (numberOfLines < this.linenumcontainer.childNodes.length) {
        this.linenumcontainer.removeChild(this.linenumcontainer.lastChild);
    }

    this.linenumcontainer.style.height = style.height; // 设置行号高度与textarea高度相同
    this.linenumcontainer.childNodes[0].style.marginTop = -this.textarea.scrollTop +
        'px'; // 行号滚动
}
CodeTextArea.prototype.setCurrentLine = function(line) {
    line = parseInt(line);
    if (isNaN(line)) return;
    removeClass(this.linenumcontainer.childNodes[this.currentLine - 1],
        "current");
    addClass(this.linenumcontainer.childNodes[line - 1], "current");
    this.currentLine = line;

    // 随当前行滚动
    var style = style = (window.getComputedStyle) ?
        window.getComputedStyle(this.textarea) : this.textarea.currentStyle;
    var taLineHeight = parseInt(style.lineHeight, 10);
    this.textarea.scrollTop = (line - 1) * taLineHeight;
}
CodeTextArea.prototype.addErrorLine = function(line) {
    line = parseInt(line);
    if (isNaN(line) || line < 1) return;
    addClass(this.linenumcontainer.childNodes[line - 1], "error");
}
CodeTextArea.prototype.clearErrorLine = function(line) {
    line = parseInt(line);
    if (isNaN(line) || line < 1) return;
    remove(this.linenumcontainer.childNodes[line - 1], "error");
}
CodeTextArea.prototype.clear = function() {
    this.linenumcontainer.childNodes.forEach(function(item) {
        removeClass(item, "current");
        removeClass(item, "error");
        this.currentLine = 0;
    });
}
