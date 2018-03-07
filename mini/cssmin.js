/**
 * 简单的CSS压缩方法
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
module.exports = function (data) {
    return data.replace(/\/\*((.|\n|\t)*?)\*\//g, '')
    //除去首尾空格
    .replace(/(\s)*{\s*/g,"{").replace(/(\s)*}\s*/g, '}')
    //去除样式间空格
    .replace(/(\s)*;\s*/g, ';')
    //去除样式名称后面空格
    .replace(/:(\s)*/g, ':')
    //去除换行符
    .replace(/(\n|\t)+/g, '')
    //去除末尾分号
    .replace(/;}/g, '}').trim();
};