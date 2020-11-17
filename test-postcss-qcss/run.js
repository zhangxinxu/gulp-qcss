// postcss中运行qcss测试
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