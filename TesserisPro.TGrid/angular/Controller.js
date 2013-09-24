var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../Options.ts" />
    (function (TGrid) {
        var Controller = (function () {
            function Controller(element, $scope, options) {
                this.$scope = $scope;
                this.$scope.Headers = options.columnHeaders;
                this.$scope.Data = options.columnDataField;
            }
            return Controller;
        })();
        TGrid.Controller = Controller;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Controller.js.map
