var gulp = require("gulp");
var merge = require("./gulp-template-merge");
var rename = require("gulp-rename");
var uglify2 = require("gulp-uglify");
var wrapper = require("gulp-wrapper");

gulp.task("default", function() {
    //配置
    /**
     * xx_temp.js
     *
     */
    //生成源码
    //压缩
    //开发版本,发布版本
    //发送到线上环境
    //生成md5
    //生成diff

});

gulp.task("merge", function(cb) {
    var stream = gulp.src("../../projs/mqq/src/*_temp.js")
    //合并
    .pipe(merge())
    //重命名，合并后的文件名为xxx_raw.js
    .pipe(rename(function(path) {
        path.basename = path.basename.replace("_temp", "_raw");
    }))
    //合并输出到目录
    .pipe(gulp.dest("../../projs/mqq/dist"));
    return stream;
});

var currentTime = function() {
    var s = '',
        t = new Date;
    var y = t.getYear() < 1900 ? 1900 + t.getYear() : t.getYear();
    return y + "-" + (t.getMonth() * 1 + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
}

//dia_raw.js->dia-min.js文件
gulp.task("wx_online", ["merge", "wx_report", "wx_click"], function() {
    online("min");
});
gulp.task("wx_debug", ["merge", "wx_report", "wx_click"], function() {
    online("min",true);
});
gulp.task("mqq", ["merge", "wx_report", "wx_click"], function() {
    online("mqq-min");
});
gulp.task("mqq_debug", ["merge", "wx_report", "wx_click"], function() {
    online("mqq-min",true);
});

function online(version,debug) {
    gulp.src(["./src/*_raw.js"])
    //改名
    .pipe(rename(function(path) {
        path.basename = path.basename.replace("_raw", "-" + version);
    }))
    //使用uglify2压缩混淆
    .pipe(uglify2({
        "output": {
            "ascii_only": true,
            max_line_len: 1024
        },
        "compress": {
            pure_funcs: debug?[]:[ 'console.log','alert' ],
            "unused": true,
            "dead_code": true,
            "global_defs": {
                "DEBUG": false,
                "DIA_VERSION": version
            }
        }
    }))
    // 添加时间戳等附属信息
    .pipe(wrapper({
        "header": ";/*" + currentTime() + "*/"
    }))
    //输出
    .pipe(gulp.dest("./dist/"))
    //也输出一份到demo中验证
    .pipe(gulp.dest("./demo/"))
    //输出到adnew目录
    .pipe(gulp.dest("F:\\adnew\\newsapp"));;
}

function dev(version) {
    gulp.src("./src/*_raw.js")
    //改名
    .pipe(rename(function(path) {
        path.basename = path.basename.replace("_raw", "-" + version);
    }))
    //封装
    .pipe(wrapper({
        "header": "const DEBUG=true;const DIA_VERSION='" + version + "';"
    }))
    //输出到demo和dist目录
    .pipe(gulp.dest("./demo/"));
}

gulp.task("wx_report", ["merge"], function() {
    online("report");
});

gulp.task("wx_click", ["merge"], function() {
    online("click");
});

gulp.task("wx_dev", ["merge"], function() {
    dev("report");
    dev("click");
    dev("min");
});
