/// <reference path="../Options.ts" />
/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />

module TesserisPro.TGrid {

    var app = angular.module("myApp", []);
    app.controller("Ctrl", Controller);

    class Controller {
        constructor(private $scope: any) {
            $scope.nameColumnTitle = "name"
            $scope.items = [
                { "name": "First ", "key": "Last" },
                { "name": "Second", "key": "Last 1" }];
        }
    }
}