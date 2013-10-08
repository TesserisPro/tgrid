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

function insertAfter(target, add) {
    if (target.nextSibling == null) {
        target.parentElement.appendChild(add);
    } else {
        target.nextSibling.insertBefore(add);
    }
}
//# sourceMappingURL=utils.js.map
