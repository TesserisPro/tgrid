define(["require", "exports"], function(require, exports) {
    var controller = (function () {
        function controller($scope, options) {
            this.$scope = $scope;
            this.$scope.Headers = options.columnHeaders;
            this.$scope.Data = options.columnDataField;
        }
        return controller;
    })();
    exports.controller = controller;
});
//# sourceMappingURL=Controller.js.map
