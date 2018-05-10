module.exports = function (data) {
    var dataMap = require('./qcss-map');
    // key转换
    var keyMap = dataMap.keyMap;

    var valueMap = dataMap.valueMap;

    // 计算出文件中设置的映射
    var valueMapCustom = {};

    data.replace(/\/\*([\w\W]*?)\*\//, function (matchs, $1) {
        $1.split(';').forEach(function (parts) {
            var needPart = parts.split('$')[1];
            if (needPart && needPart.split(/=|:/).length == 2) {
                var keyValue = needPart.split(/=|:/);
                if (keyValue[1].trim() && keyValue[0].trim()) {
                    valueMapCustom[keyValue[0].trim()] = keyValue[1].trim();
                }
            }
        });
    });

    // base64 protect
    data = data.replace(/;base64,/g, '%%%%%%');
    // url protect
    data = data.replace(/:\/\//g, '#@#@#');

    var dataReplace = data.replace(/\{([\w\W]*?)\}/g, function (matchs, $1) {
        // 删除声明块中的/**/注释
        $1 = $1.replace(/\/\*([\w\W]*?)\*\//g, '');

        // 格式美化需要的变量
        var space = '    ';
        var prefix = '{\n' + space, suffix = '\n}';

        // 查询语句处理
        if (/\{/.test($1)) {
            suffix = '\n' + space + '}';
            space = space + space;
            prefix = '{' + $1.split('{')[0] + '{\n' + space;

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
            // state指一段声明，例如f 20，此时下面的key是f, value是20
            return state.replace(/^([a-z]+)(.*)$/g, function (matchs, key, value) {
                // 值主要是增加单位，和一些关键字转换
                // 1. 逗号
                value = (value || '').split(',').map(function (multiple) {
                    // calc计算里面值不处理
                    var arrCalc = multiple.match(/calc\([\w\W]*?\)/g) || [''];
                    multiple = multiple.replace(/calc\([\w\W]*?\)/g, 'calc()');

                    var arrMultipleCalc = (multiple || '').trim().split(' ').map(function (parts) {
                        parts = parts.trim();
                        if (!parts) {
                            return '';
                        }

                        if (key == 'l') {
                            key = 'left: ';
                        } else if (key == 't') {
                            key = 'top: ';
                        } else if (key == 'r') {
                            key = 'right: ';
                        } else if (key == 'b') {
                            key = 'bottom: ';
                        }

                        if (!isNaN(parts)) {
                            // 数值自动加px单位
                            // 不包括行高
                            if (key == 'lh' && parts < 5) {
                                return parts;
                            } else if (/^(?:zx|op|z|fw)$/.test(key) == false && parts != '0') {
                                parts = parts + 'px';
                            }
                        } else if (key == 'trn') {
                            // transition过渡
                            parts = (keyMap[parts] || parts).replace(':', '').trim();
                        } else if (key != 'a') {
                            // CSS动画不对值进行替换
                            parts = valueMapCustom[parts] || valueMap[parts] || parts;
                        }
                        return parts;
                    }).join(' ').split('calc()');
                    // calc还原
                    return arrMultipleCalc.map(function (parts, index) {
                        return parts + (arrCalc[index] || '');
                    }).join('');
                }).join(', ');

                // 键转换
                if (/:/.test(key) == false) {
                    key = keyMap[key] || key + ': ';
                }
                value = value.trim();
                // 对齐美化
                if (!value) {
                    key = key.split(';').map(function (beauty) {
                        return beauty.trim().replace(/:\s+/, ': ');
                    }).join(';\n' + space);
                }

                return key + value;
            });
        }).join(';\n' + space).trim() + suffix;
    }).replace(/\w\{/g, function (matchs) {
        return matchs.replace('{', ' {');
    }).replace(/\}(\.|#|\:|\[|\w)/g, function (matchs) {
        return matchs.replace('}', '}\n');
    });

    // base64 back
    dataReplace = dataReplace.replace(/%%%%%%/g, ';base64,')
    // url back
    .replace(/#@#@#/g, '://');

    return dataReplace;
};