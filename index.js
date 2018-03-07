/**
 * @description CSS急速书写工具，属性和特性声明全部变成几个简单字母，告别冒号和长长名称
 * @author zhangxinxu(.com)
 */

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var qcss = require('./qcss-web');

// 常量
const PLUGIN_NAME = 'gulp-qcss';

// 插件级别的函数（处理文件）
function qCss(extension) {
    extension = extension || 'css';

    // 创建一个 stream 通道，以让每个文件通过
    var stream = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            var data = file.contents.toString('utf8');

            dataReplace = qcss(data);

            file.contents = Buffer.concat([new Buffer(dataReplace)]);
        }

        // 改变文件后缀
        file.path = gutil.replaceExtension(file.path, '.' + extension);

        // 确保文件进入下一个 gulp 插件
        this.push(file);

        // 告诉 stream 引擎，我们已经处理完了这个文件
        cb();
    });

    // 返回文件 stream
    return stream;
};

// 导出插件主函数
module.exports = qCss;