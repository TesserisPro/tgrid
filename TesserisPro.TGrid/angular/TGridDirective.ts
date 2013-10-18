/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>

module TGrid.Angular {
    export class Directive {
        constructor() {
            var directive: ng.IDirective = {};
            directive.restrict = 'E';
            directive.compile = function (element, attrs) {
                var strTemplate = element[0].innerHTML + "<div>append text</div>"
            element.replaceWith(strTemplate);
            }
        return directive;
        }
    }
}
//components.directive('tGrid', function () {
//    var directiveObj = {
//        compile: function (element, attrs) {
//            var strTemplate = element[0].innerHTML + "<div>append text</div>"
//            element.replaceWith(strTemplate);
//        },
//        scope: {
//            provider: '@'
//        },
//        restrict: 'E'
//    };
//    return directiveObj;
//});
