var through = require("through2");
console.log('----merge----')
console.log(through)
var path = require("path");
console.log(path)

const PLUGIN_NAME = "gulp-template-merge";

function merge(jsfiles) {
    //console.log(jsfiles);
    var stream = through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }
        if (file.isBuffer()) {
            // console.log(file.path);
            // console.log(path.dirname(file.path));
            var ret = generate(file.path, path.dirname(file.path));
            var buf = new Buffer(ret);
            file.contents = buf;
            // console.log(ret);
            this.push(file);
            return callback();
        }
        if (file.isStream()) {
            this.emit("error", new PluginError(PLUGIN_NAME, "Steams are not supported!"));
            return callback();
        }
    }).on("end", function() {
        console.log(PLUGIN_NAME + " process over!");
    });
    return stream;
}

/**
 * python版本的build脚本缺点：
 * 1.不能体现模块之前的依赖关系，单纯将模块替换成相应文件
 * 2.不支持模块嵌套，所有文件顺序替换
 *
 * 该版本build.js，将以上2点进行优化
 */
var fs = require("fs");
var _ = require("underscore");
var path = require("path");
var os = require("os");

//var config = require("./jsbuild/crystal_config").getConfig();
//console.log(config);
//return;

//读取模板文件
function readTemplate(template_file) {
    var template_content = '';
    //console.log(template_file);
    try {
        template_content = fs.readFileSync(template_file, 'utf8');
    } catch (e) {
        //console.log(e);
    }
    return template_content;
}

function loadTemplate(template_file) {;
    //TODO
}

//分析依赖关系
function parseRequire(comment_header) {
    /**
     * "* require:xxx,xxx,xxx" 必须写在模板文件开头
     */
    //var comment_header = template_content.split(os.EOL,30);  //截取前30行注释
    //console.log(comment_header)
    var modules = [];
    _.each(comment_header, function(n, i) {
        var pos = n.indexOf("* require:");
        if (pos > -1) {
            modules = n.substr(pos + 10).split(",");
        }
        var namespacepos = n.indexOf("* namespace:");
        if (namespacepos > -1) {
            namespace = n.substr(namespacepos + 12);
        }
        var namepos = n.indexOf("* name:");
        if (namepos > -1) {
            name = n.substr(namepos + 7);
        }
    });
    var modules = _.map(modules, function(n) {
        if (n.indexOf(".") > -1) {
            return n;
        }
        //console.log(namespace);
        return namespace + "." + n;
    });
    //console.log(namespace)
    //console.log(name);
    //console.log(modules);
    return {
        'namespace': namespace.trim(),
        'name': name,
        'requires': modules
    };
}

//加载模块并替换
function generate(file, root, platform, params) {
    // console.log("generate:", arguments);
    var template_file = file;
    //console.log(__filename,template_file);
    if (!fs.existsSync(template_file)) {
        console.log(template_file, ",File Not Exists");
        return false;
    }
    //压缩模版文件所在目录
    var code_root = root;
    var content = readTemplate(template_file).split("\n");
    // console.log(content);
    var ret = parseRequire(content.slice(0, 30));
    // console.log(ret);
    var require_modules = ret['requires'];
    //console.log(require_modules);
    var namespace = ret['namespace'];
    var name = ret['name'];

    var ret = _.map(content, function(row) {
        //var r = row.replace('\S','');
        if (/\{PARAM\d\}/i.test(row)) {
            var t = row.match(/\{PARAM(\d)\}/);
            // console.log(params);
            // console.log(t);
            var replace_str = params["param" + t[1]].substr(1, params["param" + t[1]].length - 2);
            row = row.replace(/\{PARAM\d\}/g, replace_str);
            //console.log(row);
        } else if (row.indexOf("//{cry_") > -1) {
            //console.log("Find module");
            var matches = row.match(/\/\/\{([^\(]*)?(\(.*\))?\}/);
            // console.log(matches[1]);
            var targetModule = matches[1].substr(4);
            if (typeof matches[2] !== 'undefined') {
                var p = matches[2].substr(1, matches[2].length - 2).split(",");
                var c = {
                    "param0": p[0],
                    "param1": p[1]
                };
            }
            if (targetModule.indexOf(".") > -1) {;
            } else {
                targetModule = namespace + "." + targetModule;
            }
            var targetFlag = _.contains(require_modules, targetModule);
            var file = '';
            //暂时不需要在head处加require指示
            targetFlag = true;
            //console.log(targetFlag);
            var config = {
                platform: namespace
            };
            // console.log(config);
            if (targetFlag) {
                // console.log(targetModule,namespace)
                newtargetModule = targetModule.replace(namespace, config.platform);
                file = code_root + path.sep + newtargetModule.replace(".", path.sep) + ".js";
                // console.log("File1:", file);
                if (!fs.existsSync(file)) {
                    file = code_root + path.sep + targetModule.replace(".", path.sep) + ".js";
                }
                //如果对应平台目录下没有该模块文件，则加载core目录下对应模块文件
                if (!fs.existsSync(file)) {
                    newtargetModule = targetModule.replace(namespace, "core");
                    file = code_root + path.sep + newtargetModule.replace(".", path.sep) + ".js";
                }
                //console.log(path.dirname(file));
                // console.log("File2:", file);
                var content = generate(file, root, platform); //此处实现了递归
                if (!content) content = "";
                //console.log(file);
                //console.log(content);
                return content;
            } else {
                return row;
            }
        }
        return row;
    });
    //console.log(require_modules);
    return ret.join(os.EOL);
}

// exports.merge = generate;

// /**
//  * 主程序流程
//  *
//  * 1.遍历原始文件的模版文件(_temp.js结尾)，获取合并后的代码
//  * 2.将代码写入目标文件中
//  */

// if(!fs.existsSync(config.root)) {
//   console.log("Directory root Not Exists, please check config file!");
// } else {
//   _.each(config.original,function(n,i) {
//     var target_code = generate(config.root+path.sep+n.replace(".js","_temp.js"));
//     var target_file = config.root+path.sep+n;
//     fs.writeFileSync(target_file,target_code,"utf8");
//   });
//   compile();
// }
module.exports = merge;
