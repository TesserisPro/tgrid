var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var SortDescriptor = (function () {
            function SortDescriptor(path, asc) {
                this.path = path;
                this.asc = asc;
            }
            return SortDescriptor;
        })();
        TGrid.SortDescriptor = SortDescriptor;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=SortDescriptor.js.map
