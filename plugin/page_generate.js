/**
 * 生成模拟html页面
 * 1.读取静态页面
 * 2.修改页面代码
 * 3.生成新的模拟html页面
 */
var fs = require("fs");
var insertScript = "<div id=\"wechat-ad\"><script id=\"QQCOM_Button1\" src=\"dia-min.js\"></script></div>";

var file = process.argv[2] || "";
if (file) {
    process_file(__dirname + "/../original/" + file);
}

function process_file(file) {
    console.log(file);
    var html = readHtml(file);
    html = editHtml(html);
    file = file.replace("/original/", "/demo/");
    generateHtml(html, file);
}

function readHtml(file) {
    var html = fs.readFileSync(file, "utf8");
    return html;
}

function editHtml(html) {
    var pos_body = html.toLowerCase().indexOf("</body>");
    var newhtml = html.substr(0, pos_body) + insertScript + html.substr(pos_body);
    return newhtml;
}

function generateHtml(html, file) {
    fs.writeFileSync(file, html, "utf8");
}