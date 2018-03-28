/**
 * Created by iyimu on 2017/5/22.
 */

const CONST_USER = "CONST_USER";
const CONST_USER_AGENT = "CONST_USER_AGENT";
const CONST_TOKEN = "CONST_TOKEN";
const CONST_TOKEN2 = "CONST_TOKEN2";
const CONST_FONT_SIZE = "CONST_FONT_SIZE";

export const devLcPort = '5000';
export const defaultPort = devLcPort !== location.port ? location.port : 80;
export const defaultHost = '192.168.1.33' + ":" + defaultPort;
import xt from './xt';
import { emitter } from './EventEmitter';

const sessionKey = `^(${CONST_USER}|${CONST_TOKEN})$`;
const dataKey = {
    CONST_USER: "_user",
    CONST_TOKEN: "_token",
};
window.addEventListener("storage", (event) => {
    let key = event.key;
    if (~key.search(sessionKey)) {
        if (event.newValue) {
            sessionStorage.setItem(key, event.newValue);
        } else {
            sessionStorage.removeItem(key);
            WebData[dataKey[key]] = null;
            emitter.emit("storage-remove", key);
        }
    }
});

export default class WebData {

    static _user = null; //用户登录后的信息
    static _token = null; //
    static _userAgent = null;

    //未读广播数量
    static _broadcastCount = 0;
    //未读系统消息数量
    static _sysMsgCount = 0;
    //所有未读消息数量
    static _totalChatCount = 0;

    static _foodingProtocol = null;
    static _foodingHostName = null;
    static _foodingHostURI = null;
    static _foodingHostRpRUI = null;

    static _fontSize = 12;

    static _currentFrame = null;
    static _menuList = null;

    static get menuList() {
        return this._menuList;
    }

    static set menuList(value) {
        this._menuList = value;
    }

    static get fontSize() {
        return parseInt(localStorage.getItem(CONST_FONT_SIZE) || this._fontSize);
    }

    static set fontSize(value) {
        localStorage.setItem(CONST_FONT_SIZE, value);
        this._fontSize = value;
    }

    static get currentFrame() {
        return this._currentFrame;
    }

    static set currentFrame(value) {
        this._currentFrame = value;
    }

    static get userAgent() {
        if (!this._userAgent) {
            let agent = localStorage.getItem(CONST_USER_AGENT);
            if (agent) this._userAgent = JSON.parse(decodeURIComponent(xt.base64decode(agent)));
        }
        return this._userAgent || {};
    }

    static set userAgent(userAgent) {
        if (userAgent) {
            localStorage.setItem(CONST_USER_AGENT, xt.base64encode(encodeURIComponent(JSON.stringify(userAgent))));
        } else {
            localStorage.removeItem(CONST_USER_AGENT);
        }
        this._userAgent = userAgent;
    }

    static get broadcastCount() {
        return this._broadcastCount;
    }

    static set broadcastCount(value) {
        this._broadcastCount = value;
        emitter.emit("WD-broadcastCount", value);
    }

    static get sysMsgCount() {
        return this._sysMsgCount;
    }

    static set sysMsgCount(value) {
        this._sysMsgCount = value;
        emitter.emit("WD-sysMsgCount", value);
    }

    static get totalChatCount() {
        return this._totalChatCount;
    }

    static set totalChatCount(value) {
        this._totalChatCount = value;
        emitter.emit("WD-totalChatCount", value);
    }

    /**
     * 根据用户查找对应的数据
     * @param name
     * @returns {*}
     */
    static findUserAgent(name) {
        let user = this.userAgent[name];
        return user ? {name, ...user} : null;
    }

    /**
     * 保存用户的密码
     * @param name
     * @param [pwd]
     */
    static setUserAgent(name, pwd) {
        let userAgent = this.userAgent;
        if (!pwd) {
            userAgent[name] = {pwd: '', dt: Date.now()};
        } else {
            userAgent[name] = {pwd, dt: Date.now()};
        }
        this.userAgent = userAgent;
    }

    static getLastLoginUser() {
        let user, name;
        for (let [key, value] of Object.entries(this.userAgent)) {
            if (!user || value.dt >= user.dt) {
                user = value;
                name = key;
            }
        }
        return name ? {name, ...user} : null;
    }

    static get user() {
        if (!this._user) {
            let user = sessionStorage.getItem(CONST_USER) || (this.getCookie(CONST_TOKEN) === localStorage.getItem(CONST_TOKEN2) ? localStorage.getItem(CONST_USER): null);
            if (user) {
                this._user = JSON.parse(decodeURIComponent(xt.base64decode(user)));
            }
        }
        return this._user;
    }

    static set user(user) {
        if (user) {
            let baseUser = xt.base64encode(encodeURIComponent(JSON.stringify(user)));
            sessionStorage.setItem(CONST_USER, baseUser);
            localStorage.setItem(CONST_USER, baseUser);
            localStorage.setItem(CONST_TOKEN2, this.token);
        } else {
            sessionStorage.removeItem(CONST_USER);
            localStorage.removeItem(CONST_USER);
            localStorage.setItem(CONST_TOKEN2, '');
        }
        this._user = user;
    }

    static get token() {
        if (!this._token) this._token = sessionStorage.getItem(CONST_TOKEN) || localStorage.getItem(CONST_TOKEN);
        return this._token || '';
    }

    static set token(token) {
        sessionStorage.setItem(CONST_TOKEN, token);
        localStorage.setItem(CONST_TOKEN, token);
        this._token = token;
        this.setCookie(CONST_TOKEN, token);
    }

    static set foodingHostName(hostName) {
        if (hostName) {
            localStorage.setItem('FoodingHostName', hostName)
        } else {
            localStorage.removeItem('FoodingHostName');
        }
        this._foodingHostName = hostName;
        this.setIFrameLocation();
    }

    static get foodingHostName() {
        if (!this._foodingHostName) this._foodingHostName = localStorage.getItem("FoodingHostName");
        return this._foodingHostName || (location.port === devLcPort ? defaultHost : location.host);
    }

    static get foodingProxyName (){
        let local = 'localhost';
        return location.hostname === local ? (( href )=> {
            if( !!~href.indexOf(".33")) return `${local}:${devLcPort}/33`;
            // else if( !!~href.indexOf(":3443")) return `${local}:${devLcPort}/3443`;
            else if( !!~href.indexOf(".75")) return `${local}:${devLcPort}/75`;
            // else if( !!~href.indexOf(":7443") ) return `${local}:${devLcPort}/7443`;
            else return href;
        })(WebData.foodingHostName): this.foodingHostName;
    }

    static get foodingProtocol() {
        return !!~this.foodingProxyName.indexOf('://') ? '' : location.protocol + "//";
    }

    static set foodingHostURI(uri) {
        if (uri) {
            localStorage.setItem('FoodingHostURI', uri)
        } else {
            localStorage.removeItem('FoodingHostURI');
        }
        this._foodingHostURI = uri;
    }

    static get foodingHostURI() {
        if (!this._foodingHostURI) this._foodingHostURI = localStorage.getItem('FoodingHostURI');
        return this._foodingHostURI || '';
    }

    static set foodingHostRpRUI(value) {
        if (value) {
            localStorage.setItem('FoodingHostRpRUI', value)
        } else {
            localStorage.removeItem('FoodingHostRpRUI');
        }
        this._foodingHostRpRUI = value;
    }

    static get foodingHostRpRUI() {
        if (!this._foodingHostRpRUI) this._foodingHostRpRUI = localStorage.getItem('FoodingHostRpRUI');
        return this._foodingHostRpRUI || '';
    }

    static setIFrameLocation() {
        window.location.foodingOrigin = WebData.foodingProtocol + WebData.foodingHostName;
    }

    /**
     * 设置 Cookie
     * @param key
     * @param value
     */
    static setCookie (key, value) {
        if ( !key || !value) return;
        let cookie = document.cookie, newCookie = "";
        if(cookie !== ''){
            if(cookie.indexOf(key) === -1){
                newCookie += `;${key}=${value}`;
            } else {
                let cookieRp = da => {
                    let ck = da.split("=");
                    let k = ck[0] || '', v = ck[1] || '';
                    if(k === key)  v = value || '';
                    newCookie += `${k}=${v};`;
                };
                if(cookie.indexOf(";") === -1){
                    cookieRp(cookie)
                } else {
                    cookie.split(";").forEach(cookieRp);
                }
            }
        } else {
            newCookie = `${key}=${value};`;
        }
        document.cookie = newCookie;
    }

    static getCookie (key){
        let cookie = document.cookie, value = null;
        if(cookie !== ''){
            let cookieRp = da => {
                let ck = da.split("=");
                let k = ck[0] || '', v = ck[1] || '';
                if(k === key) {
                    value = v;
                }
            };
            if(cookie.indexOf(";") === -1){
                cookieRp(cookie);
            } else {
                cookie.split(";").forEach(cookieRp);
            }
        }
        return value;
    }

    static logout() {
        this.user = null;
        this.token = null;
        this.menuList = null;
    }
}
window.location.token = () => WebData.token;
window.location.foodingHostURI = () => WebData.foodingHostURI;
window.location.foodingHostRpRUI = () => WebData.foodingHostRpRUI;
WebData.setIFrameLocation();
