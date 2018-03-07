module.exports = function (data) {
    var dataMap = require('./qcss-map');
    const cssmin = require('./mini/cssmin');
    // key转换
    var keyMap = dataMap.keyMap;
    var valueMap = dataMap.valueMap;

    // 键值位置调换，同时去空格
    var objKeyMap = {}, objValueMap = {};
    for (var keyKeyMap in keyMap) {
        objKeyMap[keyMap[keyKeyMap].replace(/:\s+/g, ':').replace(/;\s+/g, ';')] = keyKeyMap;
    }
    for (var keyValueMap in valueMap) {
        objValueMap[valueMap[keyValueMap].replace(/:\s+/g, ':').replace(/;\s+/g, ';')] = keyValueMap;
    }

    // 先去注释等进行压缩
    data = cssmin(data);

    // CSS属性键值分离
    var dataReplace = data.replace(/\{([\w\W]*?)\}/g, function (matchs, $1) {
        var prefix = '{', suffix = '}';

        // 查询语句处理
        if (/\{/.test($1)) {
            suffix = '}';
            prefix = '{' + $1.split('{')[0] + '{';
            $1 = $1.split('{')[1];
        }
        // 替换
        // 分号是分隔符
        return prefix + $1.split(';').map(function (state) {
            // state声明例如display:block
            if (!state) {
                return '';
            }
            // 首先，是否完整匹配
            if (objKeyMap[state]) {
                return objKeyMap[state];
            }

            // 然后键值和属性值分别匹配
            var arrKeyValue = state.split(':');
            if (arrKeyValue.length == 1) {
                return state;
            }

            var key = arrKeyValue[0] + ':', value = state.replace(key, '');

            // key的处理
            if (objKeyMap[key]) {
                key = objKeyMap[key];

                // 有一些属性的值不处理
                if (key == 'con' || key == 'a') {
                    return key + ' ' + value;
                }
            }

            // value中的关键字替换和px单位缺省
            // value复杂场景示意
            // url(example.jpg) no-repeat calc(100% - 30px) bottom, linear-gradient(to top, #333, #999);
            value = (value || '').split(',').map(function (multiple) {
                // multiple可能值举例
                // 0 1px
                // 1px solid #ddd;
                // inset 1px 1px rgba(0,0,0,.04)
                // url(http://image.zhangxinxu.com/example.jpg) no-repeat left bottom
                // calc不处理
                if (/^calc/.test(multiple.trim())) {
                    return multiple;
                }
                return (multiple || '').split(/\s+/).map(function (parts) {
                    // 如果有关键字匹配，直接返回
                    if (objValueMap[parts]) {
                        return objValueMap[parts];
                    }

                    // px单位缺省
                    if (key == 'tsl') {
                        // transition过渡可以使用键值替换
                        return objKeyMap[parts + ':'] || parts;
                    }

                    if (/\d+px$/.test(parts)) {
                        var num = parts.replace('px', '');
                        // line-height
                        // 小尺寸line-height px不缺省
                        if (key == 'lh' && num < 5) {
                            return parts;
                        }
                        return num;
                    }
                    return parts;
                }).join(' ');
            }).join(',');

            if (/^[a-z]/.test(value)) {
                return key + ' ' + value;
            }
            return key + value;
        }).join(';') + suffix;
    });

    return dataReplace;
};