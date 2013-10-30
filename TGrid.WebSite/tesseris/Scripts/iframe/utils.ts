//#region Ckecks with "null" and "undefined".
function isNull(target: any): boolean {
    return target == null;
}

function isNotNull(target: any): boolean {
    return target != null;
};

function isUndefined(target: any): boolean {
    return typeof target == "undefined";
};

function isNotUndefined(target: any): boolean {
    return typeof target != "undefined";
};

function isNoU(target: any): boolean {
    return isUndefined(target) || isNull(target);
};

function isNotNoU(target: any): boolean {
    return isNotUndefined(target) && isNotNull(target);
};

function isFunction(target: any): boolean {
    var getType = {};
    return target && getType.toString.call(target) === '[object Function]';
}

function insertAfter(refElem:any, addingElem: any):void {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(addingElem, next);
    } else {
        return parent.appendChild(addingElem);
    }
}

function insertBefore(refElem: any, addingElem: any): void {
    var parent = refElem.parentNode;
    return parent.insertBefore(addingElem, refElem);
}

function getMemberValue(target: any, path: string): any {
    if (path == null || path.length == 0) {
        return target;
    }

    var pathNames = path.split('.');
    var value = target;
    while (pathNames.length > 0) {
        value = value[pathNames[0]];
        pathNames.splice(0, 1);
    }

    return value;
}

//#endregion