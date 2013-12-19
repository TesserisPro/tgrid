var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var FooterViewModel = (function () {
            function FooterViewModel(totalCount, selectedItem, currentPage, totalPages) {
                this.totalCount = totalCount;
                this.selectedItem = selectedItem;
                this.currentPage = currentPage;
                this.totalPages = totalPages;
            }
            return FooterViewModel;
        })();
        TGrid.FooterViewModel = FooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=FooterViewModel.js.map
