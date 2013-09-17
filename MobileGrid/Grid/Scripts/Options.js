var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
    (function (TGrid) {
        var Options = (function () {
            function Options(element) {
                this.data = element;
            }
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
