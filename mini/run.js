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
        console.log('extra.qcss压缩成功，尺寸减小了：' + Math.round(10000 * (length - data.length) / length) / 100 + '%');
    });
});