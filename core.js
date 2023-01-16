var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _OnionPipe_middlewares, _OnionPipe_lastResolve;
import { compose } from './koa-compose-esm.js';
var OnionPipe = /** @class */ (function () {
    function OnionPipe(initParams) {
        if (initParams === void 0) { initParams = {}; }
        _OnionPipe_middlewares.set(this, []);
        _OnionPipe_lastResolve.set(this, void 0);
        this.params = {};
        this.params = initParams;
    }
    OnionPipe.prototype.on = function (fn) {
        var _this = this;
        if (typeof fn !== 'function') {
            console.warn('[warning] Middleware stack must be an array!');
            return;
        }
        // @ts-ignore
        var _fn = function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        __classPrivateFieldSet(_this, _OnionPipe_lastResolve, resolve, "f");
                        var callFn = fn(ctx, next);
                        if (!(callFn instanceof Promise)) {
                            callFn = Promise.resolve();
                        }
                        callFn.then(function () {
                            if (__classPrivateFieldGet(_this, _OnionPipe_lastResolve, "f") !== resolve) {
                                resolve();
                            }
                        });
                    })];
            });
        }); };
        __classPrivateFieldGet(this, _OnionPipe_middlewares, "f").push(_fn);
        return this;
    };
    OnionPipe.prototype.emit = function () {
        var fn = compose(__classPrivateFieldGet(this, _OnionPipe_middlewares, "f"));
        fn(this.params);
        return this;
    };
    OnionPipe.prototype.off = function () {
        var _a;
        (_a = __classPrivateFieldGet(this, _OnionPipe_lastResolve, "f")) === null || _a === void 0 ? void 0 : _a.call(this, '');
        return this;
    };
    return OnionPipe;
}());
export { OnionPipe };
_OnionPipe_middlewares = new WeakMap(), _OnionPipe_lastResolve = new WeakMap();
export default OnionPipe;
