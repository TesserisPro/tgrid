//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files(the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
var TesserisPro;
(function (TesserisPro) {
    // 1. The above copyright notice and this permission notice shall be included in all
    //    copies or substantial portions of the Software.
    //
    // 2. Any software that fully or partially contains or uses materials covered by
    //    this license shall notify users about this notice and above copyright.The
    //    notification can be made in "About box" and / or site main web - page footer.The
    //    notification shall contain name of Tesseris Pro company and name of the Software
    //    covered by current license.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    // PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    // SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    //
    //=====================================================================================
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
                this.$scope.changePage = function (pageNumber) {
                    return _this.changePage(pageNumber);
                };
                this.$scope.goToPreviousPagesBlock = function () {
                    return _this.goToPreviousPagesBlock();
                };
                this.$scope.goToNextPagesBlock = function () {
                    return _this.goToNextPagesBlock();
                };
                this.$scope.goToFirstPage = function () {
                    return _this.goToFirstPage();
                };
                this.$scope.goToLastPage = function () {
                    return _this.goToLastPage();
                };
            };

            AngularFooterViewModel.prototype.setTotalCount = function (totalCount) {
                var _this = this;
                this.totalCount = totalCount;
                if (this.$scope != null) {
                    this.$scope.totalCount = totalCount;
                    var self = this;
                    setTimeout(function () {
                        return _this.$scope.$apply();
                    }, 1);
                }
            };

            AngularFooterViewModel.prototype.setSelectedItem = function (selectedItem) {
                var _this = this;
                this.selectedItem = selectedItem;
                if (this.$scope != null) {
                    this.$scope.selectedItem = selectedItem;
                    setTimeout(function () {
                        return _this.$scope.$apply();
                    }, 1);
                }
            };

            AngularFooterViewModel.prototype.setCurrentPage = function (currentPage) {
                var _this = this;
                this.currentPage = currentPage;
                if (this.$scope != null) {
                    this.$scope.currentPage = currentPage;
                    var self = this;
                    setTimeout(function () {
                        return _this.$scope.$apply();
                    }, 1);
                }
            };

            AngularFooterViewModel.prototype.setTotalPages = function (totalPages) {
                var _this = this;
                this.totalPages = totalPages;
                if (this.$scope != null) {
                    this.$scope.totalPages = totalPages;
                    var self = this;
                    setTimeout(function () {
                        return _this.$scope.$apply();
                    }, 1);
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

            AngularFooterViewModel.prototype.apply = function () {
                var _this = this;
                setTimeout(function () {
                    return _this.$scope.$apply();
                }, 1);
            };

            AngularFooterViewModel.prototype.goToPreviousPagesBlock = function () {
                var previousBlockPage = this.$scope.currentPage - this.grid.options.pageSlide - 1;
                if (previousBlockPage > 0 && previousBlockPage != null && previousBlockPage != undefined) {
                    this.grid.selectPage(previousBlockPage);
                } else {
                    this.grid.selectPage(0);
                }
            };

            AngularFooterViewModel.prototype.goToNextPagesBlock = function () {
                var nextBlockPage = this.$scope.currentPage + this.grid.options.pageSlide - 1;
                if (nextBlockPage < this.$scope.totalPages && nextBlockPage != null && nextBlockPage != undefined) {
                    this.grid.selectPage(nextBlockPage);
                } else {
                    this.grid.selectPage(this.$scope.totalPages - 1);
                }
            };

            AngularFooterViewModel.prototype.goToFirstPage = function () {
                this.grid.selectPage(0);
            };

            AngularFooterViewModel.prototype.goToLastPage = function () {
                this.grid.selectPage(this.$scope.totalPages - 1);
            };
            return AngularFooterViewModel;
        })();
        TGrid.AngularFooterViewModel = AngularFooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularFooterViewModel.js.map
