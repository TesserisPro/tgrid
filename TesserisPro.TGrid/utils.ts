//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// software and associated documentation files(the "Software"), to deal in the Software 
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
  
// 1. The above copyright notice and this permission notice shall be included in all 
//    copies or substantial portions of the Software.
//
// 2. Any software that fully or partially contains or uses materials covered by 
//    this license shall notify users about this notice and above copyright.The 
//    notification can be made in "About box" and / or site main web - page footer.The 
//    notification shall contain name of Tesseris Pro company and name of the Software 
//    covered by current license.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//=====================================================================================


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

function isObservable(target: any): boolean {
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

function hideElement(target: HTMLElement): void {
    target.style.display = "none";
}

function unhideElement(target: HTMLElement): void {
    target.style.display = "";
}

function addClass(target: HTMLElement, className: string) {
    var classBefore = target.getAttribute("class");
    var classAfter;
    if (classBefore != null && classBefore.length > 0) {
        if (classBefore.indexOf(className) == -1) {
            classAfter = classBefore.concat(" ").concat(className);
        } else {
            classAfter = classBefore;
        }
    } else {
        classAfter = className;
    }
    target.setAttribute("class", classAfter);
}

function removeClass(target: HTMLElement, className: string) {
    var classBefore = target.getAttribute("class");
    if (classBefore != null && classBefore.length > 0) {
        var classesArray = classBefore.split(" ");
        var indexOfClass;
        for (var i = 0; i < classesArray.length; i++) {
            if (classesArray[i] == className) {
                classesArray.splice(i, 1);
                i--;
            }
        }
        var classAfter = classesArray.join(" ");
        target.setAttribute("class", classAfter);
    } 
}
function containsClass(target: HTMLElement, className: string): boolean {
    if (target != null) {
        var currentClasses = target.getAttribute("class");
        if (currentClasses != null && currentClasses.indexOf(className) != -1) {
            return true;
        } else {
            return false;
        }
    }
}

//#endregion