module.exports = function (data) {
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
        bds: 'border-style: ',
        bdw: 'border-width: ',
        bdc: 'border-color: ',
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
        ti: 'text-indent: ',
        cl: 'clear: both',
        abs: 'position: absolute',
        rel: 'position: relative',
        fix: 'position: fixed',
        op: 'opacity: ',
        z: 'zoom: ',
        zx: 'z-index: ',
        h: 'height: ',
        w: 'width: ',
        minw: 'min-width: ',
        maxw: 'max-width: ',
        minh: 'min-height: ',
        maxh: 'max-height: ',
        lh: 'line-height: ',
        v: 'vertical-align: ',
        vt: 'vertical-align: top',
        vm: 'vertical-align: middle',
        vb: 'vertical-align: bottom',
        poi: 'cursor: pointer',
        def: 'cursor: default',
        tex: 'cursor: text',
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
        tsl: 'transition: ',
        bs: 'box-shadow: ',
        ts: 'text-shadow: ',
        con: 'content: ',
        center: 'position: absolute; top: 0; bottom: 0; right: 0; left: 0; margin: auto',
        ell: 'text-overflow: ellipsis; white-space: nowrap; overflow: hidden',
        clip: 'position: absolute; clip: rect(0 0 0 0)'
    };

    var valueMap = {
        a: 'auto',
        s: 'solid',
        d: 'dashed',
        tt: 'transparent',
        cc: 'currentColor',
        n: 'normal',
        c: 'center',
        rx: 'repeat-x',
        ry: 'repeat-y',
        no: 'no-repeat',
        ih: 'inherit',
        l: 'left',
        t: 'top',
        r: 'right',
        b: 'bottom'
    };

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
                    return (multiple || '').split(' ').map(function (parts) {
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
                            } else if (/^(?:zx|op|z|fw)$/.test(key) == false && parts != '0' && /^calc/.test(multiple.trim()) == false) {
                                parts = parts + 'px';
                            }
                        } else if (key == 'tsl') {
                            // transition过渡
                            parts = (keyMap[parts] || parts).replace(':', '').trim();
                        } else if (key != 'a') {
                            // CSS动画不对值进行替换
                            parts = valueMapCustom[parts] || valueMap[parts] || parts;
                        }
                        return parts;
                    }).join(' ');
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
    }).replace(/^\s{8}/gm, '    ').replace(/^\s{4}\}/gm, '}');

    // base64 back
    dataReplace = dataReplace.replace(/%%%%%%/g, ';base64,')
    // url back
    .replace(/#@#@#/g, '://');

    return dataReplace;
};