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


module TesserisPro.TGrid {

    export class AngularFooterViewModel implements IFooterViewModel  {
        private $scope: any;

        private totalCount: number = 0;
        private selectedItem: any = null;
        private currentPage: number = 1;
        private totalPages: number = 1;
        private grid: Grid;

        public angularModuleName: string;

        constructor(grid: Grid) {
            this.grid = grid;
        }

        public setScope(scope: any) {
            this.$scope = scope;
            this.$scope.totalCount = this.totalCount;
            this.$scope.selectedItem = this.selectedItem;
            this.$scope.currentPage = this.currentPage;
            this.$scope.totalPages = this.totalPages;
            this.$scope.grid = this.grid;
            this.$scope.changePage = (pageNumber) => this.changePage(pageNumber);
            this.$scope.goToPreviousPagesBlock = () => this.goToPreviousPagesBlock();
            this.$scope.goToNextPagesBlock = () => this.goToNextPagesBlock();
            this.$scope.goToFirstPage = () => this.goToFirstPage();
            this.$scope.goToLastPage = () => this.goToLastPage();
        }

        public setTotalCount(totalCount: number) { 
            this.totalCount = Math.floor(totalCount);
            if (this.$scope != null) {
                this.$scope.totalCount = Math.floor(totalCount);
                var self = this;
                setTimeout(() => this.$scope.$apply(), 1);
            }
        }

        public setSelectedItem(selectedItem: any) {             
            this.selectedItem = selectedItem;
            if (this.$scope != null) {
                this.$scope.selectedItem = selectedItem;
                setTimeout(() => this.$scope.$apply(), 1);
            }
        }

        public setCurrentPage(currentPage: number) {
            this.currentPage = Math.floor(currentPage);
            if (this.$scope != null) {
                this.$scope.currentPage = Math.floor(currentPage);
                var self = this;
                setTimeout(() => this.$scope.$apply(), 1);
            }
        }

        public setTotalPages(totalPages: number) {
            this.totalPages = Math.floor(totalPages);
            if (this.$scope != null) {
                this.$scope.totalPages = Math.floor(totalPages);
                var self = this;
                setTimeout(() => this.$scope.$apply(), 1);
            }
        }

        public changePage(viewPageNumber: string) {
            var pageNumber = parseInt(viewPageNumber);
            if (isNaN(pageNumber)) {
                return;
            }
            if (this.$scope.totalPages != undefined && this.$scope.totalPages != null && this.$scope.totalPages < viewPageNumber) {
                this.grid.selectPage(this.$scope.totalPages - 1);
                return;
            }
            if (pageNumber < 1) {
                this.grid.selectPage(0);
            } else {
                this.grid.selectPage(pageNumber- 1);
            }
        }

        public apply()
        {
            setTimeout(() => this.$scope.$apply(), 1);
        }

        public goToPreviousPagesBlock() {
            var previousBlockPage = this.$scope.currentPage - this.grid.options.pageSlide -1;
            if (previousBlockPage > 0 && previousBlockPage != null && previousBlockPage != undefined) {
                this.grid.selectPage(previousBlockPage);
            } else {
                this.grid.selectPage(0);
            }

        }

        public goToNextPagesBlock() {
            var nextBlockPage = this.$scope.currentPage + this.grid.options.pageSlide - 1;
            if (nextBlockPage < this.$scope.totalPages && nextBlockPage != null && nextBlockPage != undefined) {
                this.grid.selectPage(nextBlockPage);
            } else {
                this.grid.selectPage(this.$scope.totalPages - 1);
            }
        }

        public goToFirstPage() {
            this.grid.selectPage(0);
        }

        public goToLastPage() {
            this.grid.selectPage(this.$scope.totalPages - 1);
        }
    }
}