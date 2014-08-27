(function () {
    'use strict';

     angular.module('TGrid', [])
    .directive('tGrid', TGrid.Angular.Directive)
    .directive('ngShowInFocus', function () {
        return {
            replace: true,
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$watch(attr.ngShowInFocus, function (value) {
                    if (value) {
                        element.css('display', 'block');
                        element.focus();
                    } else {
                        element.css('display', 'none');
                    }
                });
            }
        };
    });
})();