var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="../IFooterViewModel.ts" />
    (function (TGrid) {
        var AngularFooterViewModel = (function () {
            function AngularFooterViewModel(totalCount, selectedItem, currentPage, totalPages) {
                this.totalCount = totalCount;
                this.selectedItem = selectedItem;
                this.currentPage = currentPage;
                this.totalPages = totalPages;
            }
            AngularFooterViewModel.prototype.setTotalCount = function (totalCount) {
                this.totalCount = totalCount;
            };

            AngularFooterViewModel.prototype.setSelectedItem = function (selectedItem) {
                this.selectedItem = selectedItem;
            };

            AngularFooterViewModel.prototype.setCurrentPage = function (currentPage) {
                this.currentPage = currentPage;
            };

            AngularFooterViewModel.prototype.setTotalPages = function (totalPages) {
                this.totalPages = totalPages;
            };
            return AngularFooterViewModel;
        })();
        TGrid.AngularFooterViewModel = AngularFooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularFooterViewModel.js.map
