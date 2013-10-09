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

function insertAfter(refElem, elem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}
//# sourceMappingURL=utils.js.map
