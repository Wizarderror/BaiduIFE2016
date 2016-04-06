/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityinput = document.getElementById('aqi-city-input');
    var qualityinput = document.getElementById('aqi-value-input');

    var city = cityinput.value.trim();
    var quality = qualityinput.value.trim();

    // 判断输入城市长度，是否为中文及大小写字母
    if (city.length == 0 || !/^[\u4e00-\u9fa5_a-zA-Z]+$/.test(city)) {
        cityinput.style.boxShadow = "0 0 8px rgba(255, 0, 0, 1)"; // 提示错误，设置阴影为红色
        cityinput.focus(); // 设置焦点
        return;
    } else {
        cityinput.style.boxShadow = "none";
    }

    // 判断输入空气质量长度，是否全是数字
    if (quality.length == 0 || !/^[0-9]*$/.test(quality)) {
        qualityinput.style.boxShadow = "0 0 8px rgba(255, 0, 0, 1)";
        qualityinput.focus();
        return;
    } else {
        qualityinput.style.boxShadow = "none";
    }

    aqiData[city] = parseInt(quality);
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = document.getElementById('aqi-table');
    table.innerHTML = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";

    for (var city in aqiData) {
        table.innerHTML += ("<tr><td>" + city + "</td><td>" + aqiData[city] +
            "</td><td><button>删除</button></td></tr>");
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    // do sth.
    // console.log(this.parentNode.parentNode.childNodes[0].innerHTML);
    var delcity = this.parentNode.parentNode.childNodes[0].innerHTML;
    delete aqiData[delcity];
    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById('add-btn').addEventListener("click", function() {
        addBtnHandle();
    });
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    document.getElementById('aqi-table').addEventListener("click", function(e) {
        // 委托父节点处理子节点的点击事件
        var target = e.target;
        if (target.tagName === "BUTTON") { // 判断点击的是不是按钮
            delBtnHandle.call(target); // 通过call方式修改this指向
            // delBtnHandle(target);
        }
    });
}

init();
