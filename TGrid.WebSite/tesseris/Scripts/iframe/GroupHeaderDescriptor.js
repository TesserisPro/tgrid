var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var GroupHeaderDescriptor = (function () {
            function GroupHeaderDescriptor(value, level, collapse, filterDescriptor) {
                this.collapse = collapse;
                this.value = value;
                this.level = level;
                this.filterDescriptor = filterDescriptor;
            }
            return GroupHeaderDescriptor;
        })();
        TGrid.GroupHeaderDescriptor = GroupHeaderDescriptor;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=GroupHeaderDescriptor.js.map
