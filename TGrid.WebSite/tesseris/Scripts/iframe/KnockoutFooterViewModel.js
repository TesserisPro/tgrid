var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../IFooterViewModel.ts" />
    (function (TGrid) {
        var KnockoutFooterViewModel = (function () {
            function KnockoutFooterViewModel(totalCount, selectedItem, currentPage, totalPages) {
                this.totalCount = ko.observable(totalCount);
                this.selectedItem = ko.observable(selectedItem);
                this.currentPage = ko.observable(currentPage);
                this.totalPages = ko.observable(totalPages);
            }
            KnockoutFooterViewModel.prototype.setTotalCount = function (totalCount) {
                this.totalCount(totalCount);
            };

            KnockoutFooterViewModel.prototype.setSelectedItem = function (selectedItem) {
                this.selectedItem(selectedItem);
            };

            KnockoutFooterViewModel.prototype.setCurrentPage = function (currentPage) {
                this.currentPage(currentPage);
            };

            KnockoutFooterViewModel.prototype.setTotalPages = function (totalPages) {
                this.totalPages(totalPages);
            };
            return KnockoutFooterViewModel;
        })();
        TGrid.KnockoutFooterViewModel = KnockoutFooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutFooterViewModel.js.map
