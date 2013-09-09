//utilities
function isNull(target) {
    return target == null;
};

function isNotNull(target) {
    return target != null;
};

function isUndefined(target) {
    return typeof target == "undefined";
};

function isNotUndefined(target) {
    return typeof target != "undefined";
};

function isNoU(target) {
    return isUndefined(target) && isNull(target);
};

function isNotNoU(target) {
    return isNotUndefined(target) && isNotNull(target);
};

//sort
function CompareByProperty(a, b, propertyName) {
    return a[propertyName].toString().localeCompare(b[propertyName]);
}

function CompareByPropertyValue(a, b, propertyName) {
    return a[propertyName]().toString().localeCompare(b[propertyName]());
}