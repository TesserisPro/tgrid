//#region Ckecks with "null" and "undefined".
function isNull(target) {
    return target == null;
}

function isNotNull(target) {
    return target != null;
}
;

function isUndefined(target) {
    return typeof target == "undefined";
}
;

function isNotUndefined(target) {
    return typeof target != "undefined";
}
;

function isNoU(target) {
    return isUndefined(target) || isNull(target);
}
;

function isNotNoU(target) {
    return isNotUndefined(target) && isNotNull(target);
}
;

function isFunction(target) {
    var getType = {};
    return target && getType.toString.call(target) === '[object Function]';
}
//# sourceMappingURL=utils.js.map
