var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var FilterDescriptor = (function () {
            function FilterDescriptor(path, values, condition) {
                this.path = path;
                this.value = values;
                this.condition = condition;
            }
            return FilterDescriptor;
        })();
        TGrid.FilterDescriptor = FilterDescriptor;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=FilterDescriptor.js.map
