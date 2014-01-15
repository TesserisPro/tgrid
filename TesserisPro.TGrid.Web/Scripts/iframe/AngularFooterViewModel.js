var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="../IFooterViewModel.ts" />
    (function (TGrid) {
        var AngularFooterViewModel = (function () {
            function AngularFooterViewModel(grid) {
                this.totalCount = 0;
                this.selectedItem = null;
                this.currentPage = 1;
                this.totalPages = 1;
                this.grid = grid;
            }
            AngularFooterViewModel.prototype.setScope = function (scope) {
                var _this = this;
                this.$scope = scope;
                this.$scope.totalCount = this.totalCount;
                this.$scope.selectedItem = this.selectedItem;
                this.$scope.currentPage = this.currentPage;
                this.$scope.totalPages = this.totalPages;
                this.$scope.grid = this.grid;
                this.$scope.viewPageNumber = "";
                this.$scope.changePage = function (pageNumber) {
                    return _this.changePage(pageNumber);
                };
            };

            AngularFooterViewModel.prototype.setTotalCount = function (totalCount) {
                this.totalCount = totalCount;
                if (this.$scope != null) {
                    this.$scope.totalCount = totalCount;
                    this.$scope.$apply();
                }
            };

            AngularFooterViewModel.prototype.setSelectedItem = function (selectedItem) {
                this.selectedItem = selectedItem;
                if (this.$scope != null) {
                    this.$scope.selectedItem = selectedItem;
                    this.$scope.$apply();
                }
            };

            AngularFooterViewModel.prototype.setCurrentPage = function (currentPage) {
                this.currentPage = currentPage;
                if (this.$scope != null) {
                    this.$scope.currentPage = currentPage;
                    this.$scope.$apply();
                }
            };

            AngularFooterViewModel.prototype.setTotalPages = function (totalPages) {
                this.totalPages = totalPages;
                if (this.$scope != null) {
                    this.$scope.totalPages = totalPages;
                    this.$scope.$apply();
                }
            };

            AngularFooterViewModel.prototype.changePage = function (viewPageNumber) {
                if (this.$scope.totalPages != undefined && this.$scope.totalPages != null && this.$scope.totalPages < viewPageNumber) {
                    this.grid.selectPage(this.$scope.totalPages - 1);
                } else if (viewPageNumber < 1) {
                    this.grid.selectPage(0);
                } else {
                    this.grid.selectPage(viewPageNumber - 1);
                }
            };
            return AngularFooterViewModel;
        })();
        TGrid.AngularFooterViewModel = AngularFooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularFooterViewModel.js.map
