/**
 * 压缩qcss和css
 * 以及css和html类名压缩
 * 运行：node compress
 */

const fs = require('fs');
stat = fs.stat;

const path = require('path');
const url = require('url');


let urlQcss = './src/taobao.qcss';
let urlQcssMini = './src/taobao-min.qcss';
let urlQcssCl = './src/taobao-min-cl.qcss';

let urlCss = './dist/css/taobao.css';
let urlCssMini = './dist/css/taobao-min.css';
let urlCssCl = './dist/css/taobao-min-cl.css';

let urlHtml = './dist/taobao.html';
let urlHtmlCl = './dist/taobao-cl.html';


({
    /**
     * css, qcss文件压缩
     * @return {[type]} [description]
     */
    eventCssMini: function (from, to, callback) {
        fs.readFile(from, 'utf8', (err, data) => {
            let length = data.length;

            //去除注释
            data = data.replace(/\/\*((.|\n|\t)*?)\*\//g,"")
            //除去首尾空格
            .replace(/(\s)*{\s*/g,"{").replace(/(\s)*}\s*/g,"}")
            //去除样式间空格
            .replace(/(\s)*;\s*/g,";")
            //去除样式名称后面空格
            .replace(/:(\s)*/g,":")
            //去除换行符
            .replace(/(\n|\t)+/g,"")
            //去除末尾分号
            .replace(/;}/g,"}");

            fs.writeFile(to, data, function () {
                console.log(from + '压缩为' + to + '成功，压缩率为：' + Math.round(10000 * (length - data.length) / length) / 100 + '%');
                callback && callback();
            });
        });
    },
    /**
     * 类名压缩
     * @return {[type]} [description]
     */
    eventClassNameMini: function () {
        var self = this;

        // 类名压缩的映射数据
        self.hashClassName = {};
        // 类名压缩序号
        self.indexClassName = 0;

         fs.readFile(urlQcssMini, 'utf-8', (err, data) => {
            let length = data.length;
            data = self.CSSclassNameReplace(data);

            // 写入CSS压缩数据
            fs.writeFile(urlQcssCl, data, function () {
                console.log(urlQcssMini + '类名压缩成功，压缩率为：' + Math.round(10000 * (length - data.length) / length) / 100 + '%');
            });
        });

        fs.readFile(urlCssMini, 'utf-8', (err, data) => {
            let length = data.length;
            data = self.CSSclassNameReplace(data);

            // 写入CSS压缩数据
            fs.writeFile(urlCssCl, data, function () {
                console.log(urlCssMini + '类名压缩成功，压缩率为：' + Math.round(10000 * (length - data.length) / length) / 100 + '%');
            });

            // HTML类名同步更新
            fs.readFile(urlHtml, 'utf-8', (err, data) => {
                console.log(urlHtml + '类名替换中...');
                data = data.replace(/class\s*=\s*"(.*?)"/g, function(matchs, $1) {
                    // console.log($1);
                    return 'class="' + $1.split(' ').map(function(className) {
                        if (self.hashClassName[className]) {
                            return self.hashClassName[className];
                        }
                        return className;
                    }).join(' ') + '"';
                });
                // 写入压缩后的HTML
                fs.writeFile(urlHtmlCl, data, function () {
                    console.log(urlHtmlCl + '类名压缩成功');
                });
            });

        });
    },
    /**
     * 类名压缩参与字母
     * @type {Array}
     */
    seedClassName: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],

    // 按照序号返回类名
    getClassName: function () {
        var self = this;

        var seedClassName = self.seedClassName;
        var indexClassName = self.indexClassName;

        var length = seedClassName.length;


        var left = indexClassName % length, loop = Math.floor(indexClassName / length), repeat = loop % length;

        var className = '';

        var char1 = seedClassName[repeat].toUpperCase(), char2 = seedClassName[left].toUpperCase();

        if (loop >= length) {
            char1 = char1.toLowerCase();

        }
        if (loop >= length * 2) {
            char2 = char1.toLowerCase();
        }
        if (loop >= length * 3) {
            console.log('超出2027数目限制，增加数字支持');
            char2 = char2 + (indexClassName - 2027);
        }

        indexClassName++;

        self.seedClassName = seedClassName;
        self.indexClassName = indexClassName;

        return char1 + char2;
    },

    // CSS类名压缩
    CSSclassNameReplace: function (data) {
        var self = this;
        // 不参与压缩的类名
        var arrClassNameIgnore = [''];

        console.log('CSS压缩类名缓存中...');
        return data.replace(/\.[a-z][a-z0-9]*(?:[\-\_]\w+)*/gi, function(matchs) {
            matchs = matchs.replace('.', '');

            if (self.hashClassName[matchs]) {
                return '.' + self.hashClassName[matchs];
            } else if (arrClassNameIgnore.indexOf(matchs) === -1) {
                var shortName = self.getClassName();
                self.hashClassName[matchs] = shortName;
                return '.' + shortName;
            }
            return '.' + matchs;
        });
    },
    /**
     * 事件入口
     * @return {[type]} [description]
     */
    init: function () {
        var self = this;

        self.eventCssMini(urlQcss, urlQcssMini, function () {
            self.eventCssMini(urlCss, urlCssMini, function () {
                self.eventClassNameMini();
            });
        });
    }
}).init();