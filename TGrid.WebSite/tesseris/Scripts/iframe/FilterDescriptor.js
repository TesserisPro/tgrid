var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var FilterDescriptor = (function () {
            function FilterDescriptor(path, values, condition, operation, children) {
                this.path = path;
                this.value = values;
                this.condition = condition;
                this.children = children != undefined ? children : new Array();
                this.operation = operation != undefined ? operation : TGrid.FilterOperation.And;
            }
            return FilterDescriptor;
        })();
        TGrid.FilterDescriptor = FilterDescriptor;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=FilterDescriptor.js.map
