/**
 * @description CSS急速书写工具，属性和特性声明全部变成几个简单字母，告别冒号和长长名称
 * @author zhangxinxu(.com)
 */

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// 常量
const PLUGIN_NAME = 'gulp-qcss';

// 插件级别的函数（处理文件）
function qCss(extension) {
  // key转换
  var keyMap = {
    dn: 'display: none',
    di: 'display: inline',
    dib: 'display: inline-block',
    db: 'display: block',
    dt: 'display: table',
    dtc: 'display: table-cell',
    m: 'margin: ',
    ml: 'margin-left: ',
    mt: 'margin-top: ',
    mr: 'margin-right: ',
    mb: 'margin-bottom: ',
    ma: 'margin: auto',
    mla: 'margin-left: auto',
    mra: 'margin-right: auto',
    p: 'padding: ',
    pl: 'padding-left: ',
    pt: 'padding-top: ',
    pr: 'padding-right: ',
    pb: 'padding-bottom: ',
    l: 'float: left',
    r: 'float: right',
    bg: 'background: ',
    bgc: 'background-color: ',
    bgi: 'background-image: ',
    bgr: 'background-repeat: ',
    bgp: 'background-position: ',
    c: 'color: ',
    bd: 'border: ',
    bdl: 'border-left: ',
    bdr: 'border-right: ',
    bdt: 'border-top: ',
    bdb: 'border-bottom: ',
    br: 'border-radius: ',
    bbb: 'box-sizing: border-box',
    o: 'outline: ',
    f: 'font-size: ',
    ff: 'font-family: ',
    fs: 'font-style: ',
    fw: 'font-weight: ',
    b: 'font-weight: bold',
    i: 'font-style: italic',
    n: 'font-weight: normal; font-style: normal',
    tdl: 'text-decoration: underline',
    tdn: 'text-decoration: none',
    tc: 'text-align: center',
    tl: 'text-align: left',
    tr: 'text-align: right',
    tj: 'text-align: justify',
    cl: 'clear: both',
    abs: 'position: absolute',
    rel: 'position: relative',
    fix: 'position: fixed',
    op: 'opacity: ',
    z: 'zoom: ',
    zx: 'z-index: ',
    h: 'height: ',
    w: 'width: ',
    lh: 'line-height: ',
    v: 'vertical-align: ',
    vt: 'vertical-align: top',
    vm: 'vertical-align: middle',
    vb: 'vertical-align: bottom',
    poi: 'cursor: pointer',
    def: 'cursor: default',
    ovh: 'overflow: hidden',
    ova: 'overflow: auto',
    vh: 'visibility: hidden',
    vv: 'visibility: visible',
    prew: 'white-space: pre-wrap',
    pre: 'white-space: pre',
    nowrap: 'white-space: nowrap',
    bk: 'word-break: break-all',
    bkw: 'word-wrap: break-word',
    ws: 'word-spacing: ',
    ls: 'letter-spacing: ',
    a: 'animation: ',
    tsf: 'transform: ',
    tsl: 'translation: ',
    bs: 'box-shadow: ',
    ts: 'text-shadow: ',
    center: 'position: absolute; top: 0; bottom: 0; right: 0; left: 0; margin: auto',
    ell: 'text-overflow: ellipsis; white-space: nowrap; overflow: hidden',
    clip: 'position: absolute; clip: rect(0 0 0 0)'
  };

  var valueMap = {
    s: 'solid',
    d: 'dashed',
    tt: 'transparent',
    cc: 'currentColor',
    n: 'normal',
    c: 'center',
    rx: 'repeat-x',
    ry: 'repeat-y',
    no: 'no-repeat',
    l: 'left',
    t: 'top',
    r: 'right',
    b: 'bottom'
  };

  extension = extension || 'css';

  // 创建一个 stream 通道，以让每个文件通过
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([new Buffer(file.contents.toString('utf8').replace( /\{([\w\W]*?)\}/g, function (matchs, $1) {
        var prefix = '{', suffix = '}';
        // 查询语句处理
        if (/\{/.test($1)) {
          prefix = '{' + $1.split('{')[0] + '{';

          $1 = $1.split('{')[1];
        }
        // 替换
        // 分号是分隔符
        return prefix + $1.split(';').map(function (state) {
          state = state.trim();
          if (!state) {
            return '';
          }
          if (state.indexOf(':') != -1) {
            return state;
          }
          return state.replace(/^([a-z]+)(.*)$/g, function (matchs, key, value) {
            // 值主要是增加单位，和一些关键字转换
            value = (value || '').split(' ').map(function (parts) {
              parts = parts.trim();
              if (!parts) {
                return '';
              }

              if (!isNaN(parts)) {
                // 数值自动加px单位
                if (/^zx|op|z|fw$/.test(key) == false && parts != '0') {
                  parts = parts + 'px';
                }
              } else if (key == 'tsl') {
                parts = (keyMap[parts] || parts).replace(':', '').trim();
              } else if (key != 'a') {
                // CSS动画不对值进行替换
                parts = valueMap[parts] || parts;
              }

              return parts;
            }).join(' ');

            // 键转换
            key = keyMap[key] || key;

            return key + value.trim();
          });
        }).join('; ').trim() + suffix;
      }))]);
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