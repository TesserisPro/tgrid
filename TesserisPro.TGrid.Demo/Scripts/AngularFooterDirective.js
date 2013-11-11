function GetAngularBinding() {
    return angular.module('TGrid', []).
    directive('footer', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function ($scope, $element) {
                $scope.totalCount = 256;
                $scope.$apply();
            },
            template:
               '<span> TotalCount:</span>' +
               '<span>{{totalCount}}</span>.',

            replace: true
        };
    })
};