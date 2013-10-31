var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var GroupHeaderDescriptor = (function () {
            function GroupHeaderDescriptor(value, level, collapse) {
                if (typeof collapse === "undefined") { collapse = false; }
                this.collapse = collapse;
                this.value = value;
                this.level = level;
            }
            return GroupHeaderDescriptor;
        })();
        TGrid.GroupHeaderDescriptor = GroupHeaderDescriptor;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=GroupHeaderDescriptor.js.map
