/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
// 数据结构
// chartData = {
//      cityid : {
//          week: {
//              weekid:[data, dataSetLength]
//          }
//      }
// }
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

// 生成单个柱状图形
function getChartDiv(data) {
    var width = 10;
    var color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16))
        .slice(-6); // 随机颜色

    if (pageState.nowGraTime == "week") {
        width = 20;
    } else if (pageState.nowGraTime == "month") {
        width = 40;
    } else {
        width = 10;
    }

    return "<div class='chart-data' style='width:" + width +
        "px;background-color:" + color + ";height:" + data + "px' title='数据：" +
        data + "'></div>";
}

/**
 * 渲染图表
 */
function renderChart() {
    if (pageState.nowSelectCity == -1) {
        pageState.nowSelectCity = 0;
    }
    var chartHolder = document.getElementsByClassName("aqi-chart-wrap")[0];

    chartHolder.innerHTML = "";
    for (var id in chartData[pageState.nowSelectCity][pageState.nowGraTime]) {
        var data = chartData[pageState.nowSelectCity][pageState.nowGraTime][id];
        chartHolder.innerHTML += getChartDiv(data[0] / data[1]);

    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var changed = false;
    if (this.value != pageState.nowGraTime) {
        changed = true;
    }
    if (changed) {
        // 设置对应数据
        pageState.nowGraTime = this.value;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var changed = false;
    if (pageState.nowSelectCity != this.selectedIndex) {
        changed = true;
    }
    if (changed) {
        // 设置对应数据
        pageState.nowSelectCity = this.selectedIndex;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radios = document.getElementsByName("gra-time");
    for (var i = 0; i < radios.length; i++) {
        var item = radios[i];
        item.addEventListener("click", function(e) {
            graTimeChange.call(e.target);
        });
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var value = 0;
    var selector = document.getElementById('city-select');
    selector.length = 0; //清空selector
    for (var city in aqiSourceData) {
        selector.add(new Option(city, value));
        value++;
    }

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    selector.addEventListener("change", function(e) {
        citySelectChange.call(e.target);
    });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var cityid = 0;
    for (var city in aqiSourceData) {
        var citydata = aqiSourceData[city];
        var daycnt = 0;
        chartData[cityid] = {};
        chartData[cityid]["day"] = {};
        chartData[cityid]["week"] = {};
        chartData[cityid]["month"] = {};
        for (var date in citydata) {
            var thismonth = new Date(date).getMonth();
            chartData[cityid]["day"][daycnt] = [];
            chartData[cityid]["day"][daycnt][0] = citydata[date];
            chartData[cityid]["day"][daycnt][1] = 1;

            var week = parseInt(daycnt / 7);
            if (week in chartData[cityid]["week"]) {
                chartData[cityid]["week"][week][0] += citydata[date];
                chartData[cityid]["week"][week][1]++;
            } else {
                chartData[cityid]["week"][week] = [];
                chartData[cityid]["week"][week][0] = citydata[date];
                chartData[cityid]["week"][week][1] = 1;
            }

            if (thismonth in chartData[cityid]["month"]) {
                chartData[cityid]["month"][thismonth][0] += citydata[date];
                chartData[cityid]["month"][thismonth][1]++;
            } else {
                chartData[cityid]["month"][thismonth] = [];
                chartData[cityid]["month"][thismonth][0] = citydata[date];
                chartData[cityid]["month"][thismonth][1] = 1;
            }
            daycnt++;
        }
        cityid++;
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

init();
