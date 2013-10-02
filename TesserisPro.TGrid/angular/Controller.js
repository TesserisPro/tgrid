var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../Options.ts" />
    /// <reference path="../Scripts/typings/angularjs/angular.d.ts" />
    (function (TGrid) {
        var app = angular.module("myApp", []);
        app.controller("Ctrl", Controller);

        var Controller = (function () {
            function Controller($scope) {
                this.$scope = $scope;
                $scope.nameColumnTitle = "name";
                $scope.items = [
                    { "name": "First ", "key": "Last" },
                    { "name": "Second", "key": "Last 1" }
                ];
            }
            return Controller;
        })();
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Controller.js.map
