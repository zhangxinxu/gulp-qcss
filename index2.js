var postcss = require('postcss');
var qcss = require('./qcss-web.js');

module.exports = postcss.plugin('postcss-qcss', function (options) {
  return function (css, result) {
    var oldCssText = css.toString();
    var newCssText = qcss(oldCssText);
    var newCssObj = postcss.parse(newCssText);
    result.root = newCssObj;
  };
});