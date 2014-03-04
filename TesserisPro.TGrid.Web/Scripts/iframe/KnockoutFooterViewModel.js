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
                this.totalCount(Math.floor(totalCount));
            };

            KnockoutFooterViewModel.prototype.setSelectedItem = function (selectedItem) {
                this.selectedItem(selectedItem);
            };

            KnockoutFooterViewModel.prototype.setCurrentPage = function (currentPage) {
                this.currentPage(Math.floor(currentPage));
            };

            KnockoutFooterViewModel.prototype.setTotalPages = function (totalPages) {
                this.totalPages(Math.floor(totalPages));
            };

            KnockoutFooterViewModel.prototype.changePage = function (viewPageNumber) {
                var _this = this;
                (function () {
                    var pageNumber = parseInt(viewPageNumber);
                    if (isNaN(pageNumber)) {
                        return;
                    }
                    if (_this.totalPages() != undefined && _this.totalPages() != null && pageNumber > _this.totalPages()) {
                        _this.grid.selectPage(_this.totalPages() - 1);
                        return;
                    }
                    if (pageNumber < 1) {
                        _this.grid.selectPage(0);
                    } else {
                        _this.grid.selectPage(pageNumber - 1);
                    }
                })();
            };

            KnockoutFooterViewModel.prototype.goToPreviousPagesBlock = function () {
                var previousBlockPage = this.currentPage() - this.grid.options.pageSlide - 1;
                if (previousBlockPage > 0 && previousBlockPage != null && previousBlockPage != undefined) {
                    this.grid.selectPage(previousBlockPage);
                } else {
                    this.grid.selectPage(0);
                }
            };

            KnockoutFooterViewModel.prototype.goToNextPagesBlock = function () {
                var nextBlockPage = this.currentPage() + this.grid.options.pageSlide - 1;
                if (nextBlockPage < this.totalPages() && nextBlockPage != null && nextBlockPage != undefined) {
                    this.grid.selectPage(nextBlockPage);
                } else {
                    this.grid.selectPage(this.totalPages() - 1);
                }
            };

            KnockoutFooterViewModel.prototype.goToFirstPage = function () {
                this.grid.selectPage(0);
            };

            KnockoutFooterViewModel.prototype.goToLastPage = function () {
                this.grid.selectPage(this.totalPages() - 1);
            };
            return KnockoutFooterViewModel;
        })();
        TGrid.KnockoutFooterViewModel = KnockoutFooterViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutFooterViewModel.js.map
