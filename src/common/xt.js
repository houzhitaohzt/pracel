/**
 * Created by iyimu on 2017/4/17.
 */
export const ignoreEquals = 'ignore_equals';
export const continuFormLabel = "s_label";
export const continueFormIgnore = 's_ignore_label';
export const continueFormKey = 's_';

import date from './Date';

export default class Xt {
    static date = date;
    static base64Chars = {
        encode: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        decode: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
            7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],
    };

    static  _seed = 1;

    static noop() {
        //null function
    }

    static guid() {
        return this._seed++;
    }

    static base64decode(str) {
        let c1, c2, c3, c4, cary = this.base64Chars.decode;
        let i, len, out;
        str = "" + str;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            do {
                c1 = cary[str.charCodeAt(i++) & 0xff]
            } while (i < len && c1 === -1);
            if (c1 === -1) break;
            do {
                c2 = cary[str.charCodeAt(i++) & 0xff]
            } while (i < len && c2 === -1);

            if (c2 === -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 === 61) return out;
                c3 = cary[c3]
            } while (i < len && c3 === -1);
            if (c3 === -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 === 61) return out;
                c4 = cary[c4]
            } while (i < len && c4 === -1);

            if (c4 === -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
        }
        return out
    }

    static base64encode(str) {
        let out, i, len, base64EncodeChars = this.base64Chars.encode;
        let c1, c2, c3;
        str = str + "";
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;

            if (i === len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break
            }
            c2 = str.charCodeAt(i++);
            if (i === len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F)
        }
        return out
    }

    /**
     * Check the obj whether is function or not
     * @param {*} obj
     * @returns {boolean}
     */
    static isFunction(obj) {
        return typeof obj === 'function';
    }

    /**
     * Check the obj whether is number or not
     * @param {*} obj
     * @returns {boolean}
     */
    static isNumber(obj) {
        return typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]';
    }

    /**
     * Check the obj whether is string or not
     * @param {*} obj
     * @returns {boolean}
     */
    static isString(obj) {
        return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
    }

    /**
     * Check the obj whether is array or not
     * @param {*} obj
     * @returns {boolean}
     */
    static isArray(obj) {
        return Array.isArray(obj) ||
            (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
    }

    /**
     * Check the obj whether is undefined or not
     * @param {*} obj
     * @returns {boolean}
     */
    static isUndefined(obj) {
        return typeof obj === 'undefined';
    }

    /**
     * Check the obj whether is undefined or null
     * @param {*} obj
     * @returns {boolean}
     */
    static isEmpty(obj) {
        return typeof obj === 'undefined' || obj === null;
    }

    /**
     * Check the obj whether is object or not
     * @param {*} obj
     * @returns {boolean}
     */
    static isObject(obj) {
        return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
    }

    /**
     * 用undefined封装对象
     * @param exp 表达式, 是否替换对象所有值为 {obj} 中的值
     * @param obj 取值数据对象
     * @param params 取值字段列表
     * @returns {{}}
     */
    static assignUnNull(exp, obj = {}, params = []) {
        let newObj = {};
        params.forEach(da => {
            let key = this.getFormIgnoreKey(da);
            if (exp && key in obj) newObj[da] = obj[key];
            else newObj[da] = undefined;
        });
        return newObj;
    }

    /**
     * 获取表单真实的key, 就是剔除 s_ : s_label => label
     * @param key
     * @returns {*}
     */
    static getFormIgnoreKey(key) {
        return key.indexOf(continueFormKey) === 0 ? key.replace(continueFormKey, '') : key;
    }

    /**
     * 获取默认值initialValue表单用
     * @param exp 表达式, 是否替换对象所有值为 {obj} 中的值
     * @param obj obj 取值数据对象
     * @param params params 取值字段列表
     * @param {String|Function} s_label 下拉框 option 所需的 s_label 取值 {obj}
     * @param defaultValue 默认s_label值
     * @param form 表单对象
     * @returns {{}}
     */
    static getInitValue(exp, obj = {}, params = [], s_label = 's_label', defaultValue = undefined, form) {
        let newObj = this.assignUnNull(exp, obj, params);
        let value = defaultValue;
        if (exp) {
            if (this.isString(s_label)) {
                value = obj[s_label];
            } else if (this.isFunction(s_label)) {
                value = s_label(obj);
            }
        }
        newObj['s_label'] = value;
        form && params.length && form.getFieldProps(this.getFormIgnoreKey(params[0]), {initialValue: newObj});
        return newObj;
    }

    /**
     * 获取默认值initialValue表单用
     * @param exp 表达式, 是否替换对象所有值为 {obj} 中的值
     * @param obj obj 取值数据对象
     * @param params params 取值字段列表
     * @param {String|Function} s_label 下拉框 option 所需的 s_label 取值 {obj}
     * @param defaultValue 默认s_label值
     * @param form 表单对象
     * @param s_ignore_label 取值是否去的对象
     * @returns {{}}
     * */

    static getInitObjValue (exp, obj = {},  fileName = [], s_label = "s_label", defaultValue = undefined, form) {
        let newObj = obj;
        let value = defaultValue;
        if(exp){
            if (this.isString(s_label)) {
                value = obj[s_label];
            } else if (this.isFunction(s_label)) {
                value = s_label(obj);
            }
        }
        newObj['s_label'] = value;
        newObj['s_ignore_label'] = true;
        form && form.getFieldProps(this.getFormIgnoreKey(fileName[0]), {initialValue: newObj});
        return newObj;
    }

    /**
     * 初始化对象下拉框的 initialValue
     * @param exp 表达式, 是否替换对象所有值为 {obj} 中的值
     * @param obj 取值数据对象
     * @param params 取值字段列表
     * @param {String|Function} s_label 下拉框 option 所需的 s_label 取值 {obj}
     * @param form
     * @returns {{}}
     */
    static initSelectValue(exp, obj, params, s_label, form, s_ignore_label = false) {
        if(s_ignore_label) return this.getInitObjValue(exp, obj, params, s_label, undefined, form);
        return this.getInitValue(exp, obj, params, s_label, undefined, form);
    }

    /**
     * 初始化label的 initialValue
     * @param exp 表达式, 是否替换对象所有值为 {obj} 中的值
     * @param obj 取值数据对象
     * @param params 取值字段列表
     * @param {String|Function} [s_label] 下拉框 option 所需的 s_label 取值 {obj}
     * @param [form]
     * @returns {{}}
     */
    static initLabelValue(exp, obj, params, s_label, form) {
        return this.getInitValue(exp, obj, params, s_label, '', form);
    }

    /**
     * 根据keys 获取object中的值
     * object= {a: {b: {c: 'c', c1: 'c1'}, b1: 'b1'}, a1: 'a1'}
     * keys = "a.b.c"
     * console.log(getItemValue(object, keys)) === 'c'
     * @param {Object} object 取值对象
     * @param {String} keys 取值表达式
     * @param {*} [defaultValue]
     * @returns {*}
     */
    static getItemValue(object, keys, defaultValue) {
        if (this.isEmpty(object)) return defaultValue;
        let k = keys.split(".");
        let value = {};
        for (let vk of k) {
            value = value[vk] || object[vk];
            if (!value) break;
        }
        return this.isEmpty(value) ? defaultValue : value;
    }

    /**
     * 根据条件值判断原始值与范围值是否成立
     * @param {*} originalValue 原始比对数据
     * @param {*} rangeValue 范围值
     * @param {String} exp
     * @returns {boolean}
     */
    static conditionJudge(originalValue, rangeValue, exp) {
        let range = this.isArray(rangeValue) ? rangeValue : [rangeValue];
        switch (exp) {
            case '==':
                return !!~range.indexOf(originalValue);
            case '===':
                return !!~range.findIndex(da => da === originalValue);
            case '!=':
                return !~range.indexOf(originalValue);
            case '!==':
                return !~range.findIndex(da => da === originalValue);
            case '<>':
                return range.length === 2 && originalValue < parseFloat(range[0]) && originalValue > parseFloat(range[1]);
            case '><':
                return range.length === 2 && originalValue > parseFloat(range[0]) && originalValue < parseFloat(range[1]);
            default:
                break;
        }
        return false;
    }

    /**
     * 组值条件判断
     * condition = {key: 'key', value: 5, exp: '==='}
     * @param {Object} object
     * @param {Array|Object} condiAry
     */
    static condition(object, condiAry) {
        let lastCodi = false;
        condiAry = this.isArray(condiAry) ? condiAry : [condiAry];
        for (let i = 0, j = condiAry.length; i < j; i++) {
            let codi = condiAry[i];
            if (this.isString(codi)) {
                if (lastCodi && codi === 'or') {
                    return true;
                }
                if (!lastCodi && codi === 'and') {
                    return false;
                }
            } else {
                lastCodi = this.conditionJudge(this.getItemValue(object, codi.key), codi.value, codi.exp);
            }
        }
        return lastCodi;
    }

    /**
     * 根据条件创建React.Node
     * let abc = {a: 1, b: 2}
     * xt.conditionComponents(abc, [
     *      {
     *          visible: true,//外部控制, default true
     *          condition: {key: 'a', value: 1, exp: '=='},
     *          content: <i>A</i>
     *      },
     *      {
     *          visible: false,
     *          condition: [
     *              {key: 'a', value: 1, exp: '=='},
     *              'and',
     *              {key: 'b', value: 2, exp: '=='}
     *          ],
     *          content: <i>B</i>
     *      },
     *      {
     *          visible: true,
     *          condition: [
     *              {key: 'a', value: 2, exp: '=='},
     *              {key: 'b', value: 2, exp: '=='}
     *          ],
     *          content: <i>C</i>
     *      }
     * ])
     * 输出: <i>A</i>, <i>B</i>
     * @param {Object} object
     * @param {Array} condiCompAry [{content: React.Node, condition: Array|String}]
     * @returns {Array}
     */
    static conditionComponents(object, condiCompAry) {
        let comp = [];
        condiCompAry.forEach(da => {
            let {condition, visible = true, content} = da;
            if (visible && (this.isEmpty(condition) || this.condition(object, condition))) {
                comp.push(content);
            }
        });
        return comp;
    }

    /**
     * React 渲染判断
     * ignore_equals 可忽略本次对象的判断
     * @param nObj
     * @param oObj
     * @returns {boolean}
     */
    static equalsObject(nObj, oObj) {
        if (this.isEmpty(nObj) || this.isEmpty(oObj)) return nObj === oObj;
        let entries = Object.entries(nObj);
        for (let [key, value] of entries) {
            if (this.isFunction(value)) continue;
            if (key === 'ignore_equals' && value !== false) return true;

            if (this.isArray(value) && this.isArray(oObj[key])) {
                let oAry = oObj[key];
                if (value.length !== oAry.length) return true;
                for (let i = 0, j = value.length; i < j; i++) {
                    if (this.equalsObject(value[i], oAry[i])) {
                        return true;
                    }
                }
            } else if (this.isObject(value)) {
                if (!oObj[key] || (!value['$$typeof'] && this.equalsObject(value, oObj[key]))) {
                    return true;
                }
            } else if (value !== oObj[key]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 下拉框如果是对象,就用这个验证
     * @param rule
     * @param value
     * @param callback
     * @param source
     * @param options
     */
    static selectObjValidateRules() {
        let that = this;
        return (rule, value, callback, source, options) => {
            let errors = [];
            if (that.isEmpty(value)) {
                errors.push(rule.field + " is required");
            } else if (that.isObject(value)) {
                if (that.isEmpty(value.s_label)) {
                    errors.push(rule.field + ".s_label is required");
                }
            }
            callback(errors);
        };
    }

    static formatFormData(postData) {
        let newData = {};
        for (let key in postData) {
            let da = postData[key];
            if (Array.isArray(da) && da.length && this.isObject(da[0])) {
                for (let i = 0, j = da.length; i < j; i++) {
                    for (let yj in da[i]) {
                        newData[`${key}[${i}].${yj}`] = da[i][yj];
                    }
                }
            } else if (this.isObject(da)) {
                for (let yj in da) {
                    newData[`${key}.${yj}`] = da[yj];
                }
            } else {
                newData[key] = da;
            }
        }
        return newData;
    }

    /**
     * 获取url 参数
     * @param qs
     * @param href
     * @returns {string}
     */
    static getQueryParameter(qs, href) {
        let s = href || location.href;
        s = s.replace("?", "?&").split("&");//这样可以保证第一个参数也能分出来
        let re = "";
        for (let i = 1; i < s.length; i++)
            if (s[i].indexOf(qs + "=") === 0)
                re = s[i].replace(qs + "=", "");//取代前面的参数名，只剩下参数值

        return re;
    }

    /**
     * 吧 url 参数转换为对象
     * @param url
     * @returns {string}
     */
    static parseQueryParameter(url) {
        let s = url.substr(url.indexOf("?") + 1, url.length);
        let us = s.split("&");
        let re = {};
        for (let i = 0, j = us.length; i < j; i++) {
            let s1 = us[i], s2 = s1.split("=");
            if (s2.length > 1 && s2[0]) re[s2[0]] = s1.substr(s1.indexOf("=") + 1, s1.length);
        }
        return re;
    }

    /**
     * 取url搜索条件过滤
     * @param {number} [pageSize]
     * @param {string} [url]
     * @returns {{}}
     */
    static getQuerySearch(pageSize = 20, url) {
        let searchUrl = decodeURIComponent(this.getQueryParameter("searchField"));
        let searchData = this.parseQueryParameter(searchUrl);

        Object.keys(searchData).forEach(key => {
            let data = searchData[key];
            if (data.indexOf(",") !== -1){
                searchData[key] = data.split(",").splice(0, 20).toString(",");
            }
        });
        return searchData;
    }

    /**
     *
     * @param {String} msg
     * @param args
     * @returns {*}
     */
    static string(msg, ...args) {
        for (let i = 0; i < args.length; i++) {
            msg = msg.replace(/(%s)|(%d)/, args[i]);
        }
        return msg;
    }

    /**
     * 获取字符串长度, 中文算2个.
     * @param str
     */
    static getStrSize(str) {
        return str.replace(/[^\x00-\xff]/g, "aa").length;
    }

    static _strOffsetSpan = null;

    /**
     * 获取字符串在html中显示的width
     * @param str
     * @returns {number|*}
     */
    static getStrOffsetWidth(str) {
        let span = this._strOffsetSpan = this._strOffsetSpan || document.body.appendChild(document.createElement('span'));
        span.style.visibility = 'hidden';
        span.innerHTML = str;
        return span.offsetWidth;
    }

    /**
     * 保留小数
     * @param num
     * @param rank
     * @returns {number}
     */
    static signFigures (num, rank = 2) {
        if(!num) return(0);
        const sign = num / Math.abs(num);
        const number = num * sign;
        let temp = rank - 1 - Math.floor(Math.log10(number));
        let ans;
        if (temp > 0) {
            ans = parseFloat(number.toFixed(temp));
        } else if (temp < 0) {
            temp = Math.pow(10, temp);
            ans = Math.round(number / temp) * temp;
        } else {
            ans = Math.round(number);
        }
        return (ans * sign);
    };

    /**
     * 复制字符串到剪贴板
     * @param text
     */
    static clipboardCopy (text: string) {
        let element = document.createElement("span");
        element.innerText = text;
        // element.style.display = 'none';
        document.body.appendChild(element);
        if (element.hasAttribute('contenteditable')) element.focus();

        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        try{
            document.execCommand('copy');
        } catch (e) {
            alert("Not supported copy!");
        }
        document.body.removeChild(element);
    };

    /**
     * 正则表达式
     * @type {{positiveNonZero: RegExp}}
     */
    static pattern = {
        positiveNonZero: /^[1-9]\d*(\.\d+)?$|0\.\d*[1-9]\d*$/,
        positiveInteger: /^[1-9]\d*$/,
        positiveZero: /^[1-9]\d*(\.\d+)?$|0(\.\d*[1-9]\d*)?$/,

    };

    /**
     * 替换字符串
     * "-{a}-".replaceTm({a: 1});
     * "-1-"
     * @param str
     * @param $data
     * @returns {*}
     */
    static stringTm(str, $data) {
        if (!$data) return str;

        return str.replace(new RegExp('({[A-Za-z_]+[\w-]*})', 'g'), function ($1) {
            return $data[$1.replace(/[{}]+/g, '')]
        })
    }
}

window.xt = Xt;
