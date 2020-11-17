虽然本项目名称中出现了gulp，但是，千万不要误导。实际上，gulp只是偏角一隅，本项目不仅支持gulp使用，还支持纯node.js使用，还支持web版使用等。

# QCSS - CSS快速书写和新式CSS压缩小工具

自己弄的一个Node.js小工具，本打算作为私藏水果刀平时随便用用，一番折腾和试用，发现原来是把斩仙刀，可以好好整整推一推。

## 关于QCSS

QCSS是Quick CSS的缩写，寓意是CSS书写快步如飞！

平常我们写CSS是这样：
```CSS
.class-a {
  width: 300px;
  height: 150px;
  position: absolute;
  left: 100px;
  top: 100px;
}
```

如果QCSS书写，则是：

```CSS
.class-a {
  w300; h150; abs; l100; t100;
}
```

少写了好多代码，感觉自己又年轻了许多。

下面视频为QCSS编译为CSS的录屏，实际上书写的时候是一次保存，全部编译，视频为了演示，每写一句编译了一次。

<a href="https://qidian.gtimg.com/acts/2018/5425561/video/qcss2css.mp4" target="_blank" title="播放视频"><img src="https://qidian.qpic.cn/qidian_common/349573/57addd60e3796762aa64b82256eeac7d/0"></a>

QCSS本质上也是个预编译工具，和Less，Stylus工具相比，更专注于CSS快速书写能力，嵌套，函数全部都不支持，但支持自定义变量。

更专注意味着更简单，更高效，同时在书写这一块更极致。

简单高效：基于映射规则的字符替换，无任何依赖，仅几K JS大小，移植到web上几乎无成本；<br>
书写极致：可以自定义属性缩写，还可以自定义属性值缩写，甚至还可以自定义多个CSS声明片段缩写。仅需要分号分隔，px单位默认可缺省。

## 如何使用QCSS？

### 1. 纯node.js使用

项目根目录下的<code>node-qcss.js</code>中有两个变量，为<code>pathSrcQcss</code>和<code>pathDistQcss</code>，分别对应QCSS文件目录和编译出来的CSS文件所在目录。

<img src="https://qidian.qpic.cn/qidian_common/349573/5e64e0fbac92adde29294b74141c831f/0" width="466" height="102">

只要配置这两个路径为你所需要的路径。然后，直接下面这一句就可以使用了：

```JavaScript
node node-qcss
```

直接<code>node-qcss.js</code>这个JS就可以了，可以在任意目录位置，运行后，自动QCSS编译并开启资源监控，非常轻便轻量。

默认<code>node-qcss.js</code>会在同目录下寻找<code>qcss-web</code>这个模块，如果没有，就会直接在线拉取最新的<code>qcss-map</code>和<code>qcss-web</code>这两个模块（只会执行一次）。

因此，实际开发只需要：
1. <code>node-qcss.js</code>放在合适位置；
2. 配置其中<code>pathSrcQcss</code>和<code>pathDistQcss</code>的路径值；
3. <code>node node-qcss</code>运行；

就完成啦，非常简单轻便！

### 2. gulp插件使用

gulp插件核心代码为根目录下的<code>index.js</code>

实际使用，步骤如下：
1. 按照<code>gulp-qcss</code>插件：
```JavaScript
npm install gulp-qcss
```
2. 注册任务：
```JavaScript
var gulp = require('gulp');
var qcss = require('gulp-qcss');
// gulp任务
gulp.task('default', function () {
    gulp.src('src/test.qcss')
        .pipe(qcss())    // 或者.pipe(qcss('sass')) 如果有需要的话，默认是.css后缀
        .pipe(gulp.dest('dist/'));
});
```
然后就可以啦！具体可以参见<code>/test/</code>目录中的测试兼演示。

### 3. web中使用

主要是项目根目录下的<code>qcss-web.js</code>。默认为模块化加载：
```JavaScript
module.exports = function (data) {

}
```

如果希望直连，可以改造下：

```JavaScript
var qcss2css = function (data) {

}
```
其中<code>data</code>指QCSS字符内容，返回的是编译后的CSS字符内容。

如果直连，则依赖的<code>qcss-map.js</code>也要内联到<code>qcss-web.js</code>中。

### 4. postcss使用
本质上Qcss是个解析器，因此，无法作为postcss插件使用。使用示意：

```js
let qcss = require('../qcss-web.js');
const postcss = require('postcss');
const fs = require('fs')

let parse = (css, opts = {}) => {
    return postcss.parse(qcss(css), opts);
}

fs.readFile(__dirname + '/src/test.qcss', 'utf-8', (err, css) => {
    postcss([{
        postcssPlugin: 'postcss-qcss'
    }]).process(css, {
        from: __dirname + '/src/test.qcss', 
        to: __dirname + '/dest/test.css',
        parser: parse
    })
    .then(result => {
        fs.writeFile(__dirname + '/dest/test.css', result.css, (err) => {
            if (!err) {
                console.log('dest/test.css编译成功');
            }
        })
    }).catch(error => {
        console.error(error)
    })
})
```

详见 ./test-postcss-qcss/run.js

可以执行下面的命令体验：

```js
npm install

node test-postcss-qcss/run
```

## QCSS实现的原理

本质上就是个正则替换。

我们对HTML字符进行转义的时候，会这么处理，一个映射对象，一个正则替换，如下：

```JavaScript
var keyMap = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;'
};
xxx.replace(/<|&|>/g, function(matchs) {
  return keyMap[matchs];
});
```

QCSS的实现也是如此：

```JavaScript
keyMap = {
  dn: 'display: none',
  db: 'display: block',
  m: 'margin: ',
  ml: 'margin-left: ',
  …
};
css = qcss.replace(/* 替换细节 */);
```

## QCSS的映射规则

· QCSS支持CSS属性缩写替换，例如：<code>width -&gt; w</code>
· QCSS支持CSS声明缩写替换，例如：<code>display: none -&gt; dn</code>
· QCSS支持多个CSS声明替换，例如：<code>text-overflow: ellipsis; white-space: nowrap; overflow: hidden -&gt; ell</code>

不仅如此，QCSS还支持属性值关键字的映射，例如：<code>color: currentColor -&gt; c cc</code>，前面的<code>c</code>是<code>color</code>属性的缩写，后面的<code>cc</code>是<code>currentColor</code>关键字的缩写。

完整映射规则可参见：<code>/qcss-map.js</code>

内置的规则为自己多年缩写习惯，很多命名都是借鉴zxx.lib.css[https://github.com/zhangxinxu/zxx.lib.css] 由于不是粉色的（指人民币），不可能所有人都喜欢这样的命名规则，所以，建议可以根据自己的习惯和喜好进行修改，添加。

## QCSS的其他功能

QCSS还支持自定义属性值变量，变量的声明是在注释中，变量名<code>$</code>开头，可以使用等号或冒号连接变量值，例如：

```CSS
/*
$blue = #00a050;
$light = #eee;
$font: 'Microsoft yahei';
*/
```

会替换下面这个：
```CSS
.class { bg light; ff font;}
```
为下面这样：
```CSS
.class { 
    background: #eee;
    font-family: 'Microsoft yahei'
}
```

## QCSS衍生出的超高压缩比CSS压缩工具css2qcss

根据实际测试，QCSS文件比CSS文件体积可以小30%~50%（试选择器复杂度），很多人会表示，反正最后上线的都是CSS文件，哪怕你QCSS文件小80%也没有意义啊，其实不然。

由于Service Worker的存在，我们可以把QCSS直接注册在浏览器中，于是我们可以直接请求<code>.qcss</code>文件，节省流量传输。

为此，我特意写了个创新的CSS压缩工具，<code>css2qcss.js</code>，可以把目前的标准的CSS文件全部压缩成QCSS这种缩写形式，配合Service Worker，就可以让网站在CSS资源这块的传输小30%~50%，注意，这是相比压缩的CSS文件的数据，如果是开发版的CSS，则压缩率甚至可以到60%，比JavaScript主流压缩工具还要厉害。

该压缩工具核心方法见：<code>/css2qcss.js</code>，依赖映射模块<code>/qcss-map.js</code>和CSS压缩模块<code>/mini/cssmin.js</code>。

然后自己想要压缩文件的时候，读写文件即可，具体案例可参见：https://github.com/zhangxinxu/gulp-qcss/blob/master/mini/run.js

代码如下：

```JavaScript
/**
 * 压缩测试的脚本
 */
const fs = require('fs');
const css2qcss = require('../css2qcss');

fs.readFile('./test/extra.css', 'utf8', (err, data) => {
    let length = data.length;
    //去除注释
    data = css2qcss(data);

    fs.writeFile('./test/extra.qcss', data, function () {
        console.log('extra.qcss压缩成功，尺寸减小了：' + 
          Math.round(10000 * (length - data.length) / length) / 100 + 
        '%');
    });
});
```

