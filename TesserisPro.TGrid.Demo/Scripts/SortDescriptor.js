var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var SortDescriptor = (function () {
            function SortDescriptor(column, asc) {
                this.column = column;
                this.asc = asc;
            }
            return SortDescriptor;
        })();
        TGrid.SortDescriptor = SortDescriptor;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=SortDescriptor.js.map
