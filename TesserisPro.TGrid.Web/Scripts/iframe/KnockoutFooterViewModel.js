var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../IFooterViewModel.ts" />
    (function (TGrid) {
        var KnockoutFooterViewModel = (function () {
            function KnockoutFooterViewModel(totalCount, selectedItem, currentPage, totalPages, grid) {
                this.totalCount = ko.observable(totalCount);
                this.selectedItem = ko.observable(selectedItem);
                this.currentPage = ko.observable(currentPage);
                this.totalPages = ko.observable(totalPages);
                this.grid = grid;
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

            KnockoutFooterViewModel.prototype.changePage = function (viewPageNumber) {
                if (this.totalPages() != undefined && this.totalPages() != null && this.totalPages() < viewPageNumber) {
                    this.grid.selectPage(this.totalPages() - 1);
                } else if (viewPageNumber < 1) {
                    this.grid.selectPage(0);
                } else {
                    this.grid.selectPage(viewPageNumber - 1);
                }
                this.grid.selectPage(viewPageNumber - 1);
            };
            return KnockoutFooterViewModel;
        })();
        TGrid.KnockoutFooterViewModel = KnockoutFooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutFooterViewModel.js.map
